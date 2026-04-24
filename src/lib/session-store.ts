import { useEffect, useReducer, useRef, useCallback } from "react";
import { PRESETS, getPreset, type Preset } from "./presets";

export type Mode = "simulated" | "live";

export type Settings = {
  sampleSize: number;
  showExplanations: boolean;
};

export type SessionState = {
  presetId: string;
  mode: Mode;
  currentIndex: number;
  tagsByExample: Record<string, string[]>;
  customTags: string[];
  notes: string;
  settings: Settings;
};

const STORAGE_KEY = "eal:session:v1";

const initialFor = (presetId: string): SessionState => ({
  presetId,
  mode: "simulated",
  currentIndex: 0,
  tagsByExample: {},
  customTags: [],
  notes: "",
  settings: { sampleSize: 15, showExplanations: true },
});

export type Action =
  | { type: "SET_PRESET"; presetId: string }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "SET_INDEX"; index: number }
  | { type: "TOGGLE_TAG"; exampleId: string; tag: string }
  | { type: "ADD_CUSTOM_TAG"; tag: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SET_SETTINGS"; settings: Partial<Settings> }
  | { type: "RESET_SESSION" }
  | { type: "REPLACE"; state: SessionState };

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "SET_PRESET":
      return { ...initialFor(action.presetId), mode: state.mode, settings: state.settings };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_INDEX":
      return { ...state, currentIndex: action.index };
    case "TOGGLE_TAG": {
      const cur = state.tagsByExample[action.exampleId] ?? [];
      const next = cur.includes(action.tag) ? cur.filter((t) => t !== action.tag) : [...cur, action.tag];
      return { ...state, tagsByExample: { ...state.tagsByExample, [action.exampleId]: next } };
    }
    case "ADD_CUSTOM_TAG":
      if (!action.tag.trim() || state.customTags.includes(action.tag.trim())) return state;
      return { ...state, customTags: [...state.customTags, action.tag.trim()] };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case "RESET_SESSION":
      return initialFor(state.presetId);
    case "REPLACE":
      return action.state;
    default:
      return state;
  }
}

type HistoryState = {
  past: SessionState[];
  present: SessionState;
  future: SessionState[];
};

function loadInitial(): HistoryState {
  if (typeof window === "undefined") {
    return { past: [], present: initialFor(PRESETS[0].id), future: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionState;
      return { past: [], present: { ...initialFor(parsed.presetId), ...parsed }, future: [] };
    }
  } catch {
    // ignore
  }
  return { past: [], present: initialFor(PRESETS[0].id), future: [] };
}

type HistoryAction = Action | { type: "UNDO" } | { type: "REDO" } | { type: "_INIT"; state: HistoryState };

const TRACKED: Action["type"][] = [
  "SET_PRESET",
  "TOGGLE_TAG",
  "ADD_CUSTOM_TAG",
  "SET_NOTES",
  "SET_SETTINGS",
  "RESET_SESSION",
];

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  if (action.type === "_INIT") return action.state;
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }
  if (action.type === "REDO") {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    };
  }
  const next = reducer(state.present, action);
  if (next === state.present) return state;
  if (TRACKED.includes(action.type)) {
    return { past: [...state.past, state.present].slice(-50), present: next, future: [] };
  }
  return { ...state, present: next };
}

export function useSession(initialPresetId?: string) {
  const [state, dispatch] = useReducer(historyReducer, undefined, loadInitial);
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    if (initialPresetId && initialPresetId !== state.present.presetId) {
      dispatch({ type: "SET_PRESET", presetId: initialPresetId });
    }
  }, [initialPresetId, state.present.presetId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.present));
    } catch {
      // ignore
    }
  }, [state.present]);

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);

  return {
    state: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    dispatch: dispatch as React.Dispatch<Action>,
    undo,
    redo,
  };
}

export function getPresetFor(state: SessionState): Preset {
  return getPreset(state.presetId);
}

export function categoryCounts(state: SessionState, preset: Preset) {
  const counts: Record<string, number> = {};
  const allCats = [...preset.categories, ...state.customTags];
  allCats.forEach((c) => (counts[c] = 0));
  Object.values(state.tagsByExample).forEach((tags) => {
    tags.forEach((t) => {
      counts[t] = (counts[t] ?? 0) + 1;
    });
  });
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
}

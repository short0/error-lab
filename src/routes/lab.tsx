import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

type LabSearch = { preset?: string };
import {
  ChevronLeft,
  ChevronRight,
  Undo2,
  Redo2,
  RotateCcw,
  Lightbulb,
  Plus,
  Info,
} from "lucide-react";
import { Header } from "@/components/Header";
import { PRESETS, getPreset } from "@/lib/presets";
import {
  useSession,
  categoryCounts,
  type SessionState,
} from "@/lib/session-store";

export const Route = createFileRoute("/lab")({
  validateSearch: (s: Record<string, unknown>): LabSearch => ({
    preset: typeof s.preset === "string" ? s.preset : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Lab — Error Analysis Lab" },
      { name: "description", content: "Inspect, tag, and prioritize model errors in a 3-panel workspace." },
      { property: "og:title", content: "Error Analysis Lab — Workspace" },
      { property: "og:description", content: "Hands-on error analysis with mocked examples." },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  const { preset: presetParam } = Route.useSearch();
  const { state, dispatch, undo, redo, canUndo, canRedo } = useSession(presetParam);
  const preset = getPreset(state.presetId);
  const liveMode = state.mode === "live";

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (inField) return;
      if (e.key === "j") {
        e.preventDefault();
        dispatch({ type: "SET_INDEX", index: Math.min(state.currentIndex + 1, preset.examples.length - 1) });
      } else if (e.key === "k") {
        e.preventDefault();
        dispatch({ type: "SET_INDEX", index: Math.max(state.currentIndex - 1, 0) });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, state.currentIndex, preset.examples.length, undo, redo]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header liveMode={liveMode} />

      {/* Sticky mobile action bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between gap-2 border-b border-border bg-background/90 px-4 py-2 backdrop-blur lg:hidden">
        <div className="flex items-center gap-1">
          <IconBtn onClick={undo} disabled={!canUndo} label="Undo">
            <Undo2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={redo} disabled={!canRedo} label="Redo">
            <Redo2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={() => dispatch({ type: "RESET_SESSION" })} label="Reset">
            <RotateCcw className="h-4 w-4" />
          </IconBtn>
        </div>
        <ModePill mode={state.mode} onChange={(m) => dispatch({ type: "SET_MODE", mode: m })} />
      </div>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[280px_1fr_320px] lg:gap-6 lg:py-6">
        <LeftPanel state={state} dispatch={dispatch} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
        <CenterPanel state={state} dispatch={dispatch} />
        <RightPanel state={state} dispatch={dispatch} />
      </main>
    </div>
  );
}

function IconBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ModePill({ mode, onChange }: { mode: "simulated" | "live"; onChange: (m: "simulated" | "live") => void }) {
  return (
    <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-xs">
      {(["simulated", "live"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`rounded px-2.5 py-1 transition-colors ${
            mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {m === "simulated" ? "Simulated" : "Live"}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function LeftPanel({
  state,
  dispatch,
  undo,
  redo,
  canUndo,
  canRedo,
}: {
  state: SessionState;
  dispatch: React.Dispatch<any>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const preset = getPreset(state.presetId);
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
      <Section title="Preset">
        <select
          value={state.presetId}
          onChange={(e) => dispatch({ type: "SET_PRESET", presetId: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="mt-3 text-sm text-muted-foreground">{preset.description}</p>
        <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between"><dt>Dataset</dt><dd className="font-medium text-foreground">{preset.datasetSize}</dd></div>
          <div className="flex justify-between"><dt>Errors in queue</dt><dd className="font-medium text-foreground">{preset.examples.length}</dd></div>
          <div className="flex justify-between"><dt>Baseline accuracy</dt><dd className="font-medium text-foreground">{(preset.baselineAccuracy * 100).toFixed(0)}%</dd></div>
        </dl>
      </Section>

      <Section title="Mode">
        <ModePill mode={state.mode} onChange={(m) => dispatch({ type: "SET_MODE", mode: m })} />
        {state.mode === "live" ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Live mode would call an LLM to generate rationales for custom examples. This is a
            preview — the queue stays mocked.
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Simulated mode uses preloaded mistakes — the polished default.
          </p>
        )}
      </Section>

      <Section title="Settings">
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Show explanations</span>
          <input
            type="checkbox"
            checked={state.settings.showExplanations}
            onChange={(e) => dispatch({ type: "SET_SETTINGS", settings: { showExplanations: e.target.checked } })}
            className="h-4 w-4"
          />
        </label>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Shortcuts: <kbd className="rounded border border-border bg-background px-1">J</kbd> next ·{" "}
          <kbd className="rounded border border-border bg-background px-1">K</kbd> prev ·{" "}
          <kbd className="rounded border border-border bg-background px-1">⌘Z</kbd> undo
        </p>
      </Section>

      <div className="hidden gap-2 lg:flex">
        <IconBtn onClick={undo} disabled={!canUndo} label="Undo">
          <Undo2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn onClick={redo} disabled={!canRedo} label="Redo">
          <Redo2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn onClick={() => dispatch({ type: "RESET_SESSION" })} label="Reset session">
          <RotateCcw className="h-4 w-4" />
        </IconBtn>
      </div>
    </aside>
  );
}

function CenterPanel({ state, dispatch }: { state: SessionState; dispatch: React.Dispatch<any> }) {
  const preset = getPreset(state.presetId);
  const idx = Math.min(state.currentIndex, preset.examples.length - 1);
  const example = preset.examples[idx];
  const [showExplain, setShowExplain] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setShowExplain(false), [example.id]);

  const exampleTags = state.tagsByExample[example.id] ?? [];
  const allCategories = useMemo(
    () => Array.from(new Set([...preset.categories, ...state.customTags])),
    [preset.categories, state.customTags]
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Example <span className="font-medium text-foreground">{idx + 1}</span> /{" "}
          {preset.examples.length}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn
            onClick={() => dispatch({ type: "SET_INDEX", index: Math.max(idx - 1, 0) })}
            disabled={idx === 0}
            label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            onClick={() =>
              dispatch({ type: "SET_INDEX", index: Math.min(idx + 1, preset.examples.length - 1) })
            }
            disabled={idx === preset.examples.length - 1}
            label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-foreground transition-all"
          style={{ width: `${((idx + 1) / preset.examples.length) * 100}%` }}
        />
      </div>

      <article className="rounded-lg border border-border bg-card p-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Input</div>
        <p className="mt-1 text-base leading-relaxed">{example.input}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Field label="Prediction" value={example.prediction} tone="warn" />
          <Field label="True label" value={example.trueLabel} tone="ok" />
          <Field label="Confidence" value={`${(example.confidence * 100).toFixed(0)}%`} />
        </div>

        <div className="mt-5">
          <button
            onClick={() => setShowExplain((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="h-4 w-4" />
            {showExplain ? "Hide explanation" : "Explain this result"}
          </button>
          {showExplain && state.settings.showExplanations && (
            <div className="mt-3 rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
              <Info className="mr-1.5 inline h-3.5 w-3.5" />
              {example.rationale}
            </div>
          )}
        </div>
      </article>

      <Section title="Tag this error">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const active = exampleTags.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => dispatch({ type: "TOGGLE_TAG", exampleId: example.id, tag: cat })}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            ref={tagInputRef}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customInput.trim()) {
                dispatch({ type: "ADD_CUSTOM_TAG", tag: customInput.trim() });
                dispatch({ type: "TOGGLE_TAG", exampleId: example.id, tag: customInput.trim() });
                setCustomInput("");
              }
            }}
            placeholder="Add custom tag…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          />
          <button
            onClick={() => {
              if (customInput.trim()) {
                dispatch({ type: "ADD_CUSTOM_TAG", tag: customInput.trim() });
                dispatch({ type: "TOGGLE_TAG", exampleId: example.id, tag: customInput.trim() });
                setCustomInput("");
              }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </Section>

      <Section title="Quick actions">
        <div className="flex flex-wrap gap-2">
          {preset.quickActions.map((qa) => (
            <button
              key={qa}
              onClick={() => {
                // Map to creating a tag and applying it
                dispatch({ type: "ADD_CUSTOM_TAG", tag: qa });
                dispatch({ type: "TOGGLE_TAG", exampleId: example.id, tag: qa });
              }}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {qa}
            </button>
          ))}
        </div>
      </Section>
    </section>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  const dot =
    tone === "ok"
      ? "bg-emerald-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-muted-foreground/40";
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function RightPanel({ state, dispatch }: { state: SessionState; dispatch: React.Dispatch<any> }) {
  const preset = getPreset(state.presetId);
  const counts = categoryCounts(state, preset);
  const total = counts.reduce((s, [, n]) => s + n, 0);
  const top = counts[0];
  const projectedLift =
    top && total > 0 ? Math.min(0.15, (top[1] / preset.examples.length) * 0.6) : 0;

  return (
    <aside className="flex flex-col gap-4">
      <Section title="Categories">
        {counts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tag examples to see category counts.</p>
        ) : (
          <ul className="space-y-2.5">
            {counts.map(([cat, n]) => {
              const pct = (n / Math.max(total, 1)) * 100;
              return (
                <li key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-foreground">{cat}</span>
                    <span className="tabular-nums text-muted-foreground">{n}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Impact estimate">
        <div className="space-y-2 text-sm">
          <Row k="Errors tagged" v={`${total} / ${preset.examples.length}`} />
          <Row k="Baseline accuracy" v={`${(preset.baselineAccuracy * 100).toFixed(0)}%`} />
          <Row
            k="Projected lift"
            v={top ? `+${(projectedLift * 100).toFixed(1)}% if ${top[0]} fixed` : "—"}
          />
        </div>
      </Section>

      <Section title="Overall vs subgroup">
        <p className="text-xs text-muted-foreground">
          Overall: <span className="font-medium text-foreground">{(preset.baselineAccuracy * 100).toFixed(0)}%</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Worst subgroup:{" "}
          <span className="font-medium text-foreground">
            {top ? top[0] : "(no tags yet)"}
          </span>
          {top && (
            <>
              {" "}— ~
              <span className="font-medium text-foreground">
                {Math.max(0, Math.round((preset.baselineAccuracy - 0.2) * 100))}%
              </span>
            </>
          )}
        </p>
      </Section>

      <Section title="Notes">
        <NotesEditor value={state.notes} onCommit={(v) => dispatch({ type: "SET_NOTES", notes: v })} presetId={state.presetId} />
      </Section>

      <Section title="Recommended next">
        <ul className="space-y-2 text-sm">
          {(top
            ? [
                `Focus on "${top[0]}" — it accounts for ${((top[1] / Math.max(total, 1)) * 100).toFixed(0)}% of tagged errors.`,
                ...preset.recommendedActions.slice(0, 2),
              ]
            : preset.recommendedActions
          ).map((a) => (
            <li key={a} className="flex gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-foreground" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium tabular-nums">{v}</span>
    </div>
  );
}

// Notes editor with local state, commits to session on blur to avoid undo-spam
function NotesEditor({ value, onCommit, presetId }: { value: string; onCommit: (v: string) => void; presetId: string }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [presetId, value]);
  return (
    <textarea
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local !== value) onCommit(local);
      }}
      placeholder="Scratchpad — autosaved"
      rows={4}
      className="w-full resize-none rounded-md border border-input bg-background p-2 text-sm"
    />
  );
}

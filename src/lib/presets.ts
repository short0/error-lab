export type Example = {
  id: string;
  input: string;
  prediction: string;
  trueLabel: string;
  confidence: number;
  rationale: string;
  suggestedTags: string[];
};

export type Preset = {
  id: string;
  name: string;
  task: string;
  description: string;
  datasetSize: number;
  baselineAccuracy: number;
  categories: string[];
  quickActions: string[];
  recommendedActions: string[];
  examples: Example[];
};

const spam: Preset = {
  id: "spam",
  name: "Spam Classifier",
  task: "Binary classification: spam vs ham email",
  description:
    "A logistic regression model trained on 10k emails. Detects unsolicited bulk messages.",
  datasetSize: 1200,
  baselineAccuracy: 0.91,
  categories: [
    "Short message",
    "Promotional language",
    "Foreign language",
    "Label noise",
    "Ambiguous",
    "Personal context",
    "URL-heavy",
  ],
  quickActions: [
    "Tag as ambiguous",
    "Mark as label noise",
    "Flag for retraining",
    "Add to eval set",
  ],
  recommendedActions: [
    "Collect more short-message examples",
    "Add a multilingual subword tokenizer",
    "Re-label borderline promotional emails",
  ],
  examples: [
    { id: "s1", input: "URGENT: claim your prize now!!!", prediction: "ham", trueLabel: "spam", confidence: 0.62, rationale: "Few training examples with all-caps short subject lines.", suggestedTags: ["Short message", "Promotional language"] },
    { id: "s2", input: "Hey, are we still on for lunch?", prediction: "spam", trueLabel: "ham", confidence: 0.55, rationale: "Brief informal text mistaken as low-effort spam.", suggestedTags: ["Short message", "Personal context"] },
    { id: "s3", input: "Limited time offer — 90% off everything", prediction: "ham", trueLabel: "spam", confidence: 0.48, rationale: "Promotional pattern under-represented in training.", suggestedTags: ["Promotional language"] },
    { id: "s4", input: "Bonjour, votre commande est prête", prediction: "spam", trueLabel: "ham", confidence: 0.71, rationale: "Tokenizer underperforms on French.", suggestedTags: ["Foreign language"] },
    { id: "s5", input: "Click http://bit.ly/x http://bit.ly/y http://bit.ly/z", prediction: "ham", trueLabel: "spam", confidence: 0.58, rationale: "URL features only weakly weighted.", suggestedTags: ["URL-heavy"] },
    { id: "s6", input: "Re: project update attached", prediction: "spam", trueLabel: "ham", confidence: 0.51, rationale: "Generic subject lines confuse the model.", suggestedTags: ["Ambiguous"] },
    { id: "s7", input: "Win a free iPhone today!", prediction: "ham", trueLabel: "spam", confidence: 0.6, rationale: "Classic spam pattern, but example was mislabeled in training.", suggestedTags: ["Promotional language", "Label noise"] },
    { id: "s8", input: "thx", prediction: "spam", trueLabel: "ham", confidence: 0.52, rationale: "Single-word messages have low signal.", suggestedTags: ["Short message"] },
    { id: "s9", input: "Increase your sales by 200% — book a call", prediction: "ham", trueLabel: "spam", confidence: 0.49, rationale: "B2B promotional language under-sampled.", suggestedTags: ["Promotional language"] },
    { id: "s10", input: "Saludos, adjunto factura", prediction: "spam", trueLabel: "ham", confidence: 0.66, rationale: "Spanish business email misclassified.", suggestedTags: ["Foreign language"] },
    { id: "s11", input: "Meeting moved to 3pm", prediction: "spam", trueLabel: "ham", confidence: 0.53, rationale: "Short calendar-style messages under-represented.", suggestedTags: ["Short message"] },
    { id: "s12", input: "FREE FREE FREE click now click now", prediction: "ham", trueLabel: "spam", confidence: 0.45, rationale: "Repetitive token spam not in training distribution.", suggestedTags: ["Promotional language"] },
    { id: "s13", input: "Your invoice #2391 is attached", prediction: "spam", trueLabel: "ham", confidence: 0.57, rationale: "Numeric IDs flagged as spammy.", suggestedTags: ["Ambiguous"] },
    { id: "s14", input: "Hot singles in your area!", prediction: "ham", trueLabel: "spam", confidence: 0.5, rationale: "Adult spam pattern absent from training.", suggestedTags: ["Promotional language"] },
    { id: "s15", input: "lunch?", prediction: "spam", trueLabel: "ham", confidence: 0.47, rationale: "Single-word query.", suggestedTags: ["Short message"] },
    { id: "s16", input: "Verify your account: http://phish.example.com", prediction: "ham", trueLabel: "spam", confidence: 0.54, rationale: "Phishing URLs under-detected.", suggestedTags: ["URL-heavy"] },
    { id: "s17", input: "Quarterly results — see attached deck", prediction: "spam", trueLabel: "ham", confidence: 0.56, rationale: "Business jargon misread.", suggestedTags: ["Ambiguous"] },
    { id: "s18", input: "CONGRATULATIONS you have won $$$$", prediction: "ham", trueLabel: "spam", confidence: 0.59, rationale: "All-caps with currency symbols.", suggestedTags: ["Promotional language"] },
  ],
};

const tickets: Preset = {
  id: "tickets",
  name: "Support Ticket Routing",
  task: "Multiclass routing: billing, technical, account, other",
  description: "Classifies inbound tickets to the right support team.",
  datasetSize: 800,
  baselineAccuracy: 0.84,
  categories: [
    "Multi-intent",
    "Vague description",
    "Wrong vocabulary",
    "Label noise",
    "Edge case",
    "Ambiguous",
  ],
  quickActions: [
    "Tag as multi-intent",
    "Mark as ambiguous",
    "Flag for retraining",
    "Suggest taxonomy fix",
  ],
  recommendedActions: [
    "Split multi-intent tickets in pre-processing",
    "Expand training data for technical jargon",
    "Clarify the 'other' category boundary",
  ],
  examples: [
    { id: "t1", input: "I was charged twice and the app keeps crashing", prediction: "billing", trueLabel: "technical", confidence: 0.61, rationale: "Two intents in one message.", suggestedTags: ["Multi-intent"] },
    { id: "t2", input: "It doesn't work", prediction: "technical", trueLabel: "account", confidence: 0.42, rationale: "Description too vague.", suggestedTags: ["Vague description"] },
    { id: "t3", input: "Can't login after password reset", prediction: "technical", trueLabel: "account", confidence: 0.58, rationale: "Login issues belong to account team.", suggestedTags: ["Wrong vocabulary"] },
    { id: "t4", input: "Refund my last invoice please", prediction: "account", trueLabel: "billing", confidence: 0.5, rationale: "Refund vocabulary under-represented.", suggestedTags: ["Wrong vocabulary"] },
    { id: "t5", input: "?", prediction: "other", trueLabel: "other", confidence: 0.3, rationale: "Empty content — but actually correctly routed.", suggestedTags: ["Edge case", "Label noise"] },
    { id: "t6", input: "When will my subscription renew and can I downgrade?", prediction: "billing", trueLabel: "account", confidence: 0.55, rationale: "Subscription Q&A overlaps two teams.", suggestedTags: ["Multi-intent", "Ambiguous"] },
    { id: "t7", input: "API returns 500 on /v2/orders", prediction: "other", trueLabel: "technical", confidence: 0.46, rationale: "Developer terminology unseen.", suggestedTags: ["Wrong vocabulary"] },
    { id: "t8", input: "Update my billing address", prediction: "billing", trueLabel: "account", confidence: 0.52, rationale: "Address changes are account work.", suggestedTags: ["Ambiguous"] },
    { id: "t9", input: "I love your product!", prediction: "technical", trueLabel: "other", confidence: 0.4, rationale: "Praise routed incorrectly.", suggestedTags: ["Edge case"] },
    { id: "t10", input: "My card was declined and I can't checkout", prediction: "technical", trueLabel: "billing", confidence: 0.49, rationale: "Checkout flow conflated with technical.", suggestedTags: ["Multi-intent"] },
    { id: "t11", input: "Need to delete my account asap", prediction: "other", trueLabel: "account", confidence: 0.51, rationale: "Account deletion under-represented.", suggestedTags: ["Wrong vocabulary"] },
    { id: "t12", input: "Help", prediction: "technical", trueLabel: "other", confidence: 0.35, rationale: "Single-word ticket.", suggestedTags: ["Vague description"] },
    { id: "t13", input: "Webhook signature mismatch errors", prediction: "other", trueLabel: "technical", confidence: 0.48, rationale: "Niche technical terminology.", suggestedTags: ["Wrong vocabulary"] },
    { id: "t14", input: "Charged for plan I cancelled last month", prediction: "account", trueLabel: "billing", confidence: 0.53, rationale: "Crosses billing & account.", suggestedTags: ["Multi-intent"] },
    { id: "t15", input: "Page won't load on Safari", prediction: "other", trueLabel: "technical", confidence: 0.47, rationale: "Browser-specific bugs misrouted.", suggestedTags: ["Edge case"] },
    { id: "t16", input: "Change email on file", prediction: "billing", trueLabel: "account", confidence: 0.5, rationale: "Account update misread.", suggestedTags: ["Ambiguous"] },
  ],
};

const ocr: Preset = {
  id: "ocr",
  name: "OCR Extraction",
  task: "Extract text fields from receipt images",
  description: "Pulls vendor, total, and date from photographed receipts.",
  datasetSize: 600,
  baselineAccuracy: 0.78,
  categories: [
    "Low-light image",
    "Handwriting",
    "Skewed angle",
    "Faded print",
    "Foreign script",
    "Glare",
    "Crumpled receipt",
  ],
  quickActions: [
    "Mark as unreadable",
    "Flag for human review",
    "Tag preprocessing issue",
    "Add to eval set",
  ],
  recommendedActions: [
    "Add skew/rotation augmentation",
    "Expand handwriting training data",
    "Improve low-light pre-processing",
  ],
  examples: [
    { id: "o1", input: "[Receipt: dim cafe, total field]", prediction: "Total: $1.50", trueLabel: "Total: $15.00", confidence: 0.6, rationale: "Decimal misread in low light.", suggestedTags: ["Low-light image"] },
    { id: "o2", input: "[Receipt: handwritten note overlay]", prediction: "Vendor: ACME", trueLabel: "Vendor: ACNE", confidence: 0.55, rationale: "Handwritten correction missed.", suggestedTags: ["Handwriting"] },
    { id: "o3", input: "[Receipt: 30° tilt]", prediction: "Date: 12/03/2023", trueLabel: "Date: 13/03/2023", confidence: 0.62, rationale: "Skew distorted digit shape.", suggestedTags: ["Skewed angle"] },
    { id: "o4", input: "[Receipt: faded thermal print]", prediction: "Total: ---", trueLabel: "Total: $42.10", confidence: 0.3, rationale: "Faded ink unreadable.", suggestedTags: ["Faded print"] },
    { id: "o5", input: "[Receipt: Japanese characters]", prediction: "Vendor: ???", trueLabel: "Vendor: 山田屋", confidence: 0.25, rationale: "Model trained only on Latin script.", suggestedTags: ["Foreign script"] },
    { id: "o6", input: "[Receipt: heavy glare on total line]", prediction: "Total: $5.00", trueLabel: "Total: $50.00", confidence: 0.58, rationale: "Glare obscured a digit.", suggestedTags: ["Glare"] },
    { id: "o7", input: "[Receipt: crumpled]", prediction: "Date: 01/01/0001", trueLabel: "Date: 04/11/2024", confidence: 0.4, rationale: "Folds split the date region.", suggestedTags: ["Crumpled receipt"] },
    { id: "o8", input: "[Receipt: handwritten total]", prediction: "Total: $7.00", trueLabel: "Total: $1.00", confidence: 0.5, rationale: "Confused 7 vs 1 in cursive.", suggestedTags: ["Handwriting"] },
    { id: "o9", input: "[Receipt: dim parking stub]", prediction: "Vendor: Park", trueLabel: "Vendor: Park&Go", confidence: 0.61, rationale: "Stylized ampersand dropped.", suggestedTags: ["Low-light image"] },
    { id: "o10", input: "[Receipt: angled phone shot]", prediction: "Total: $22.40", trueLabel: "Total: $22.40", confidence: 0.7, rationale: "Correct, but originally flagged due to skew score.", suggestedTags: ["Label noise"] },
    { id: "o11", input: "[Receipt: faded bottom]", prediction: "Date: missing", trueLabel: "Date: 2024-02-19", confidence: 0.32, rationale: "Lower fields fade fastest.", suggestedTags: ["Faded print"] },
    { id: "o12", input: "[Receipt: Cyrillic shop name]", prediction: "Vendor: blank", trueLabel: "Vendor: Магазин", confidence: 0.28, rationale: "Non-Latin script.", suggestedTags: ["Foreign script"] },
    { id: "o13", input: "[Receipt: glare across vendor]", prediction: "Vendor: T_rget", trueLabel: "Vendor: Target", confidence: 0.55, rationale: "Glare blanked one letter.", suggestedTags: ["Glare"] },
    { id: "o14", input: "[Receipt: crumpled corner]", prediction: "Total: $3.99", trueLabel: "Total: $39.99", confidence: 0.5, rationale: "Folded digit dropped.", suggestedTags: ["Crumpled receipt"] },
    { id: "o15", input: "[Receipt: handwritten amount]", prediction: "Total: $0.00", trueLabel: "Total: $20.00", confidence: 0.42, rationale: "Cursive zero looped strangely.", suggestedTags: ["Handwriting"] },
  ],
};

const resume: Preset = {
  id: "resume",
  name: "Resume Screening",
  task: "Predict candidate fit (yes/no) for software engineer role",
  description: "Ranks resumes by predicted fit. Reviewed for fairness.",
  datasetSize: 500,
  baselineAccuracy: 0.82,
  categories: [
    "Non-traditional background",
    "Career gap",
    "Skill mismatch",
    "Format issue",
    "Bias risk",
    "Junior experience",
    "Label noise",
  ],
  quickActions: [
    "Flag bias risk",
    "Mark as ambiguous",
    "Send for human review",
    "Tag format issue",
  ],
  recommendedActions: [
    "Audit features correlated with protected attributes",
    "Add bootcamp graduates to training data",
    "Normalize resume format pre-processing",
  ],
  examples: [
    { id: "r1", input: "Bootcamp grad, 6mo internship", prediction: "no", trueLabel: "yes", confidence: 0.55, rationale: "Model favors 4-year CS degrees.", suggestedTags: ["Non-traditional background", "Junior experience"] },
    { id: "r2", input: "10 years SWE, 2-year career gap", prediction: "no", trueLabel: "yes", confidence: 0.6, rationale: "Gaps penalized regardless of cause.", suggestedTags: ["Career gap", "Bias risk"] },
    { id: "r3", input: "PhD physics, transitioning to ML", prediction: "no", trueLabel: "yes", confidence: 0.5, rationale: "Non-traditional path missed.", suggestedTags: ["Non-traditional background"] },
    { id: "r4", input: "Frontend React, applying for backend role", prediction: "yes", trueLabel: "no", confidence: 0.65, rationale: "Skill mismatch missed.", suggestedTags: ["Skill mismatch"] },
    { id: "r5", input: "Resume in PDF with image-only text", prediction: "no", trueLabel: "yes", confidence: 0.4, rationale: "Parser failed to extract content.", suggestedTags: ["Format issue"] },
    { id: "r6", input: "Self-taught, 5 years freelance", prediction: "no", trueLabel: "yes", confidence: 0.52, rationale: "Freelance experience under-weighted.", suggestedTags: ["Non-traditional background"] },
    { id: "r7", input: "Graduated 2023, no internships", prediction: "no", trueLabel: "no", confidence: 0.7, rationale: "Correct, but flagged for label review.", suggestedTags: ["Junior experience", "Label noise"] },
    { id: "r8", input: "Returning parent after 5y break", prediction: "no", trueLabel: "yes", confidence: 0.58, rationale: "Long gap heavily penalized.", suggestedTags: ["Career gap", "Bias risk"] },
    { id: "r9", input: "Strong DevOps, weak coding", prediction: "yes", trueLabel: "no", confidence: 0.6, rationale: "Role required strong coding.", suggestedTags: ["Skill mismatch"] },
    { id: "r10", input: "Resume in non-English layout", prediction: "no", trueLabel: "yes", confidence: 0.45, rationale: "Parser stumbled on layout.", suggestedTags: ["Format issue"] },
    { id: "r11", input: "Veteran, military signals background", prediction: "no", trueLabel: "yes", confidence: 0.5, rationale: "Domain transfer missed.", suggestedTags: ["Non-traditional background"] },
    { id: "r12", input: "10 years Java, no Python", prediction: "yes", trueLabel: "no", confidence: 0.6, rationale: "Required Python, model overweighted seniority.", suggestedTags: ["Skill mismatch"] },
    { id: "r13", input: "Junior with strong open-source", prediction: "no", trueLabel: "yes", confidence: 0.55, rationale: "OSS contributions ignored.", suggestedTags: ["Junior experience"] },
    { id: "r14", input: "Contract roles only, frequent moves", prediction: "no", trueLabel: "yes", confidence: 0.48, rationale: "Stability bias.", suggestedTags: ["Bias risk"] },
    { id: "r15", input: "ATS-unfriendly multi-column resume", prediction: "no", trueLabel: "yes", confidence: 0.42, rationale: "Multi-column parsing failed.", suggestedTags: ["Format issue"] },
  ],
};

export const PRESETS: Preset[] = [spam, tickets, ocr, resume];

export function getPreset(id: string | undefined | null): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}

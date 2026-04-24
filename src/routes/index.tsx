import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, Tag, BarChart3, Target } from "lucide-react";
import { Header } from "@/components/Header";
import { PRESETS } from "@/lib/presets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Error Analysis Lab — Learn to debug ML models" },
      {
        name: "description",
        content:
          "A calm, hands-on sandbox for Andrew Ng-style error analysis. Inspect mistakes, tag failure modes, and decide what to fix next.",
      },
      { property: "og:title", content: "Error Analysis Lab" },
      { property: "og:description", content: "Practice error analysis with realistic mocked examples." },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  { icon: Search, label: "Review errors" },
  { icon: Tag, label: "Tag patterns" },
  { icon: BarChart3, label: "Count categories" },
  { icon: Target, label: "Prioritize fixes" },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:pt-20">
        {/* Hero */}
        <section className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
            A learning sandbox for ML practitioners
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Find what your model gets wrong — and what to fix first.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Error analysis is the practice of inspecting individual model mistakes, grouping them
            into categories, and using those counts to prioritize the next improvement. It usually
            beats chasing overall accuracy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/lab"
              search={{ preset: PRESETS[0].id }}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start with a preset <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/lab"
              className="inline-flex h-10 items-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Open blank lab
            </Link>
          </div>
        </section>

        {/* Presets */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Try a preset</h2>
            <span className="text-xs text-muted-foreground">Loaded with realistic mocked examples</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {PRESETS.map((p) => (
              <Link
                key={p.id}
                to="/lab"
                search={{ preset: p.id }}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.task}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline">Dataset:</dt>{" "}
                    <dd className="inline font-medium text-foreground">{p.datasetSize}</dd>
                  </div>
                  <div>
                    <dt className="inline">Errors:</dt>{" "}
                    <dd className="inline font-medium text-foreground">{p.examples.length}</dd>
                  </div>
                  <div>
                    <dt className="inline">Baseline acc:</dt>{" "}
                    <dd className="inline font-medium text-foreground">
                      {(p.baselineAccuracy * 100).toFixed(0)}%
                    </dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium">{s.label}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Why it matters */}
        <section className="mt-16 rounded-lg border border-border bg-card p-6">
          <h2 className="text-base font-semibold tracking-tight">Why it matters</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Overall accuracy hides where a model fails. By tagging individual errors and counting
            categories, you can estimate the impact of fixing each pattern — and pick the work that
            actually moves the needle.{" "}
            <Link to="/about" className="text-foreground underline underline-offset-4">
              Read more
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Error Analysis Lab" },
      {
        name: "description",
        content: "Why error analysis beats chasing overall accuracy when improving ML models.",
      },
      { property: "og:title", content: "Why error analysis matters" },
      { property: "og:description", content: "A short explainer on prioritizing model fixes." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-12 sm:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight">Why error analysis matters</h1>
        <div className="prose prose-sm mt-6 max-w-none text-muted-foreground">
          <p>
            Most ML teams report a single number — overall accuracy — and chase it. But two models
            with the same accuracy can fail in completely different ways. One might miss every
            short message; another might fail on every non-English email.
          </p>
          <p>
            Error analysis is a deliberate, manual process: pick a sample of misclassified
            examples, look at them one by one, and group them into categories. The category counts
            tell you where the model fails most — and the projected impact tells you what to fix
            first.
          </p>
          <h2 className="mt-8 text-base font-semibold text-foreground">The loop</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Sample 50–100 mistakes.</li>
            <li>Tag each with one or more failure categories.</li>
            <li>Count categories and sort by frequency.</li>
            <li>Estimate the accuracy lift if you fixed each category.</li>
            <li>Pick the highest-impact category and ship a focused fix.</li>
          </ol>
          <p className="mt-6">
            That's it. No extra tooling required. This app gives you a place to practice the loop
            on realistic mocked examples.
          </p>
        </div>
        <div className="mt-10">
          <Link
            to="/lab"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open the lab
          </Link>
        </div>
      </main>
    </div>
  );
}

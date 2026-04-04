import Link from "next/link";

export const metadata = {
  title: "Docs — BugDrop",
  description: "BugDrop documentation.",
};

export default function DocsIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-4">Getting Started</h1>
      <p className="text-text-subtle mb-6 leading-relaxed">
        BugDrop is an open-source feedback widget that turns user bug reports into GitHub issues.
        Screenshots, annotations, and system info — all captured automatically.
      </p>
      <h2 className="text-xl font-semibold text-text-primary mt-8 mb-3">Quick Overview</h2>
      <ol className="list-decimal list-inside text-text-subtle space-y-2 mb-6">
        <li>
          <Link href="/docs/installation" className="text-accent-cyan hover:underline">
            Install the GitHub App
          </Link>{" "}
          on your repository
        </li>
        <li>Add a single script tag to your website</li>
        <li>Users can now submit feedback that becomes GitHub issues</li>
      </ol>
      <p className="text-text-subtle">
        Ready to go?{" "}
        <Link href="/docs/installation" className="text-accent-cyan hover:underline">
          Start with installation →
        </Link>
      </p>
    </div>
  );
}

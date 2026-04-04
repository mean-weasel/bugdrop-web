export function TryCallout() {
  return (
    <div className="bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 border border-accent-warm/20 rounded-2xl p-8 text-center mb-20">
      <h3 className="text-xl font-semibold text-text-primary mb-2">Try it now!</h3>
      <p className="text-text-subtle">
        Click the feedback button in the bottom-right corner to see BugDrop in action{" "}
        <span className="inline-block animate-bounce-x ml-2">→</span>
      </p>
    </div>
  );
}

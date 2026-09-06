const steps = [
  { number: 1, title: "Connect your site", description: "Install the GitHub App and add one script tag." },
  { number: 2, title: "Users report a problem", description: "They describe the issue and mark up a screenshot." },
  { number: 3, title: "Get a GitHub Issue", description: "See the report, screenshot, and browser details together." },
];

export function HowItWorks() {
  return (
    <div className="min-w-0">
      <h2 id="get-started-heading" className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-text-primary">
        Three steps. No new dashboard.
      </h2>
      <div className="mt-8 grid gap-5 max-sm:mt-6 max-sm:grid-cols-3 max-sm:gap-2">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-4 max-sm:flex-col max-sm:items-center max-sm:gap-2 max-sm:text-center">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-warm to-accent-rose text-sm font-bold text-bg-deep max-sm:size-8">
              {step.number}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary max-sm:text-xs max-sm:leading-4">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-text-subtle max-sm:hidden">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

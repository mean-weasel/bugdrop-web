import { SectionHeading } from "./section-heading";

const steps = [
  { number: 1, title: "Add One Script Tag", description: "Install our GitHub App and paste the widget script into your HTML. No build step required." },
  { number: 2, title: "Users Click the Bug Button", description: "A floating button appears on your site. Users can capture screenshots and annotate issues." },
  { number: 3, title: "Issues Created Automatically", description: "Feedback is sent to your GitHub repo as a fully-formatted issue with screenshots and system info." },
];

export function HowItWorks() {
  return (
    <section className="mb-20">
      <SectionHeading>How It Works</SectionHeading>
      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
        {steps.map((step) => (
          <div key={step.number} className="text-center p-8 animate-fade-up" style={{ animationDelay: `${step.number * 0.1}s` }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep font-bold text-xl flex items-center justify-center mx-auto mb-6">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold mb-3 text-text-primary">{step.title}</h3>
            <p className="text-sm text-text-subtle">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { SectionHeading } from "./section-heading";
import Link from "next/link";

const features = [
  {
    icon: "📸",
    title: "Screenshot Capture",
    description: "Full page or element-specific screenshots with automatic capture.",
    href: "/docs/configuration",
  },
  {
    icon: "🎨",
    title: "Annotation Tools",
    description: "Draw, arrows, and rectangles to highlight exactly what's wrong.",
    href: "/use-cases/visual-bug-reporting",
  },
  {
    icon: "⬛",
    title: "Screenshot Redaction",
    description:
      "Users can cover sensitive regions, and developers can mask private UI with data-bugdrop-mask.",
    href: "/docs/security#screenshot-masking",
  },
  {
    icon: "🏷️",
    title: "Feedback Categories",
    description: "Bug, Feature, or Question — automatically tagged with GitHub labels.",
    href: "/docs/configuration",
  },
  {
    icon: "💻",
    title: "System Info",
    description: "Browser, OS, viewport, and more captured automatically for debugging.",
    href: "/docs/faq#how-does-bugdrop-work",
  },
  {
    icon: "🎯",
    title: "Fully Stylable",
    description: "Fonts, colors, borders, shadows, radius — match any design system with data attributes.",
    href: "/docs/styling",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    description: "No tracking, no cookies. URLs, passwords, and credit-card fields are protected by default.",
    href: "/docs/security",
  },
];

export function Features() {
  return (
    <section className="mb-20">
      <SectionHeading>Features</SectionHeading>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {features.map((feature, i) => (
          <Link key={feature.title} href={feature.href} className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-400 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-fade-up no-underline" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
            <span className="text-[1.75rem] mb-4 block">{feature.icon}</span>
            <h3 className="text-base font-semibold mb-2 text-text-primary">{feature.title}</h3>
            <p className="text-sm text-text-subtle leading-relaxed">{feature.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

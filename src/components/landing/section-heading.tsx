export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-text-muted mb-8 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-border after:to-transparent">
      {children}
    </h2>
  );
}

interface LandingChapterProps {
  readonly id: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly labelledBy?: string;
}

export function LandingChapter({
  id,
  children,
  className = "",
  labelledBy,
}: LandingChapterProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-landing-chapter
      className={`landing-chapter ${className}`}
    >
      <div className="landing-chapter-content">{children}</div>
    </section>
  );
}

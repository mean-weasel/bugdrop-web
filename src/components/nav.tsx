import Link from "next/link";

export function Nav() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-[1100px] mx-auto max-md:flex-col max-md:gap-4">
      <Link href="/" className="text-xl font-semibold text-text-primary no-underline flex items-center gap-2">
        BugDrop
      </Link>
      <div className="flex gap-8 items-center">
        <Link href="/docs" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Docs
        </Link>
        <Link href="/use-cases" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Use Cases
        </Link>
        <Link href="/compare" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Compare
        </Link>
        <a
          href="https://github.com/mean-weasel/bugdrop"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-subtle hover:text-text-primary transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://mean-weasel.github.io/bugdrop-widget-test/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-subtle hover:text-text-primary transition-colors"
        >
          Demo
        </a>
      </div>
    </nav>
  );
}

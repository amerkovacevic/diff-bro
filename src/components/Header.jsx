export default function Header() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-tertiary-500/30 bg-secondary-700 p-8 mb-8">
      <div className="relative z-10 flex flex-col gap-3 text-center sm:text-left">
        <span className="text-sm uppercase tracking-[0.4em] text-tertiary-400">
          Text Comparison Tool
        </span>
        <h1 className="font-display text-4xl tracking-wide text-accent-50 drop-shadow sm:text-5xl">
          Diff Bro
        </h1>
        <p className="max-w-2xl text-sm text-quaternary-300 sm:text-base">
          Compare two pieces of text or code side-by-side with clear, intuitive highlighting.
          Perfect for reviewing changes, comparing versions, or checking differences between documents.
        </p>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-tertiary-500/20 blur-3xl" />
    </header>
  );
}


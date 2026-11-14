import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-enter mx-auto flex max-w-xl flex-col items-start justify-center space-y-5 px-4 py-24 sm:px-6 md:py-32">
      <p className="font-mono text-xs text-ink-soft">// 404 · Forbindelse brutt</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Fant ingenting på denne adressen.
      </h1>
      <p className="text-base leading-relaxed text-ink-soft">
        Enten skrev du inn feil URL, eller så rakk verken jeg eller modellen min å bygge denne siden ennå.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
      >
        Tilbake til forsiden
      </Link>
    </div>
  );
}

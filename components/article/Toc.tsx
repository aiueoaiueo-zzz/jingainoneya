import { headingId } from "./headingId";

/** 目次（本文の「##」見出しから自動で作る） */
export function Toc({ headings }: { headings: string[] }) {
  if (headings.length === 0) return null;
  return (
    <nav aria-label="目次" className="my-4.5 rounded-card border border-line bg-surface px-4.5 py-3.5">
      <b>目次</b>
      <ol className="mt-1.5 list-decimal pl-[1.4em]">
        {headings.map((h) => (
          <li key={h} className="mb-0">
            <a href={`#${headingId(h)}`} className="text-text-sub no-underline hover:text-accent">
              {h}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

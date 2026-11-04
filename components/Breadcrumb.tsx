import Link from "next/link";

type Crumb = { href?: string; label: string };

/** パンくず（先頭は常にトップ） */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ href: "/", label: "トップ" }, ...items];
  return (
    <nav aria-label="現在地" className="mb-4.5 text-[13px] text-text-muted">
      <ol className="flex flex-wrap gap-1.5">
        {all.map((item, i) => (
          <li key={item.label} className="flex gap-1.5">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href && i < all.length - 1 ? (
              <Link href={item.href} className="text-text-sub">
                {item.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

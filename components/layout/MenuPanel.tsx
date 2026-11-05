import Link from "next/link";
import { MENU } from "@/lib/site";

type Props = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

/** ハンバーガーから開くメニュー（系統ごとにカードで区切る） */
export function MenuPanel({ id, open, onNavigate }: Props) {
  return (
    <nav
      id={id}
      aria-label="サイトメニュー"
      hidden={!open}
      className="max-h-[75vh] overflow-y-auto border-t border-line-strong bg-surface shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
    >
      <div className="mx-auto grid max-w-[1040px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 px-4 pt-4 pb-5">
        {MENU.map((group) => (
          <div
            key={group.heading}
            className="rounded-card border border-line bg-surface-2 px-3 py-2.5"
          >
            <h3 className="mt-0.5 mb-1 font-body text-xs font-bold tracking-[0.1em] text-accent">
              {group.heading}
            </h3>
            {group.links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center justify-between border-t border-line px-1 text-sm font-medium no-underline after:text-text-muted after:content-['›'] hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}

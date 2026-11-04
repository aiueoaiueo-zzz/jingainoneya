import Link from "next/link";
import { MENU } from "@/lib/site";

type Props = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

/** ハンバーガーから開くサイトメニュー */
export function MenuPanel({ id, open, onNavigate }: Props) {
  return (
    <nav id={id} aria-label="サイトメニュー" hidden={!open} className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5 px-4 py-4.5">
        {MENU.map((group) => (
          <div key={group.heading}>
            <h3 className="font-body text-xs font-medium tracking-[0.08em] text-text-muted">
              {group.heading}
            </h3>
            {group.links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center border-b border-line font-medium no-underline"
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

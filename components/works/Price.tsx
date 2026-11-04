import { yen } from "@/lib/format";
import type { Work } from "@/lib/types";

export function Price({ work }: { work: Work }) {
  if (work.discountRate > 0) {
    return (
      <span className="text-sm font-bold tabular-nums">
        <s className="mr-1.5 text-xs font-normal text-text-muted">{yen(work.listPrice)}</s>
        <span className="text-accent">{yen(work.price)}</span>
      </span>
    );
  }
  return <span className="text-sm font-bold tabular-nums">{yen(work.price)}</span>;
}

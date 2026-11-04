import Link from "next/link";
import { genreName, typeName } from "@/lib/labels";
import type { Work } from "@/lib/types";
import { Cover } from "./Cover";
import { Price } from "./Price";
import { Tag } from "./Tag";

/** 作品カード（作品詳細ページへのリンク） */
export function WorkCard({ work }: { work: Work }) {
  const genre = genreName(work);
  const type = typeName(work);
  return (
    <Link href={`/works/${work.id}`} className="group flex flex-col gap-1 no-underline">
      <Cover work={work} className="group-hover:border-line-strong" />
      {(genre || type) && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {genre && <Tag>{genre}</Tag>}
          {type && <Tag>{type}</Tag>}
        </div>
      )}
      <span className="leading-normal font-medium">{work.title}</span>
      <span className="text-xs text-text-muted">{work.circle}</span>
      <Price work={work} />
    </Link>
  );
}

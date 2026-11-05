import { Avatar } from "@/components/home/Sidebar";
import { SITE } from "@/lib/site";

/** 記事の下の「書いている人」 */
export function AuthorBox() {
  return (
    <div className="mt-8 flex items-start gap-3.5 rounded-card border border-line bg-surface p-4.5">
      <Avatar />
      <div>
        <b>{SITE.authorName}</b>
        <p className="mt-1 text-sm text-text-sub">{SITE.authorIntro}</p>
      </div>
    </div>
  );
}

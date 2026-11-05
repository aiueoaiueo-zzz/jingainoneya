import { Sidebar } from "./Sidebar";

/** 本文と、その右のサイドバー（スマホでは下）を並べる */
export function WithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-10">
      <div className="min-w-0 flex-[999_1_560px]">{children}</div>
      <Sidebar />
    </div>
  );
}

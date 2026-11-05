import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "管理画面", template: "%s｜管理画面" },
  // 管理画面は検索エンジンに出さない
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-5 pb-20">{children}</main>
    </>
  );
}

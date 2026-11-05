import type { Metadata } from "next";
import { CommentsAdmin } from "@/components/admin/CommentsAdmin";

export const metadata: Metadata = { title: "コメント" };

export default function AdminCommentsPage() {
  return <CommentsAdmin />;
}

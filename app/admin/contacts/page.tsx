import type { Metadata } from "next";
import { ContactsAdmin } from "@/components/admin/ContactsAdmin";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function AdminContactsPage() {
  return <ContactsAdmin />;
}

import type { Metadata } from "next";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";

export const metadata: Metadata = { title: "サイト設定" };

export default function AdminSettingsPage() {
  return <SettingsAdmin />;
}

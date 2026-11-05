import type { Metadata } from "next";
import { DiagnosisListAdmin } from "@/components/admin/DiagnosisListAdmin";

export const metadata: Metadata = { title: "診断" };

export default function AdminDiagnosesPage() {
  return <DiagnosisListAdmin />;
}

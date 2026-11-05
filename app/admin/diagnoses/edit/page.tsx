import type { Metadata } from "next";
import { Suspense } from "react";
import { DiagnosisEditor } from "@/components/admin/DiagnosisEditor";
import { Loading } from "@/components/admin/ui";

export const metadata: Metadata = { title: "診断の編集" };

export default function AdminDiagnosisEditPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DiagnosisEditor />
    </Suspense>
  );
}

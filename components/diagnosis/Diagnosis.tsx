import { getDiagnosis } from "@/lib/diagnoses";
import { DiagnosisRunner } from "./DiagnosisRunner";

/** 記事の中で使う診断。<Diagnosis id="g_kaii" /> のように書く */
export async function Diagnosis({ id }: { id: string }) {
  const data = await getDiagnosis(id);
  return <DiagnosisRunner data={data} />;
}

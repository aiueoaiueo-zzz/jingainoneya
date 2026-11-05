"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "./api";
import { Loading, PageTitle } from "./ui";

type Row = { id: string; title: string; questions: number; options: number };

const groupOf = (id: string) =>
  id.startsWith("g_") ? "ジャンル別タイプ診断" : id.startsWith("grp_") ? "系統別診断" : "入門・特集の診断";

export function DiagnosisListAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    adminApi<{ diagnoses: Row[] }>("/api/admin/diagnoses").then((res) => {
      if (res.ok) setRows(res.data.diagnoses);
      else setError(res.data.message ?? "読み込めませんでした。");
    });
  }, []);
  const groups = ["入門・特集の診断", "系統別診断", "ジャンル別タイプ診断"];
  return (
    <div>
      <PageTitle>診断</PageTitle>
      {error && <p className="text-danger">{error}</p>}
      {!rows && !error && <Loading />}
      {rows &&
        groups.map((g) => (
          <section key={g} className="mb-6">
            <h2 className="mb-2 text-base text-text-muted">{g}</h2>
            <ul>
              {rows
                .filter((r) => groupOf(r.id) === g)
                .map((r) => (
                  <li key={r.id} className="border-b border-line">
                    <Link href={`/admin/diagnoses/edit?id=${r.id}`} className="flex flex-col py-3 no-underline hover:text-accent">
                      <b>{r.title}</b>
                      <span className="text-xs text-text-muted">
                        ID：{r.id}・設問{r.questions}問・結果{r.options}つ
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
    </div>
  );
}

import { connection } from "next/server";
import { endSession } from "@/lib/admin/auth";
import { ok } from "@/lib/admin/respond";

export async function POST() {
  await connection();
  await endSession();
  return ok({ ok: true });
}

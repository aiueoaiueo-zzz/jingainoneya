import { findGenre, findWorkType } from "@/lib/site";
import type { Work } from "@/lib/types";

export function genreName(work: Work): string | null {
  return work.genre ? (findGenre(work.genre)?.name ?? null) : null;
}

export function typeName(work: Work): string | null {
  return work.type ? (findWorkType(work.type)?.name ?? null) : null;
}

export function genreGlyph(work: Work): string {
  return work.genre ? (findGenre(work.genre)?.glyph ?? "人") : "人";
}

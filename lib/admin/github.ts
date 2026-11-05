import "server-only";

/**
 * GitHub への読み書き（管理画面から保存したファイルを、リポジトリに記録する）。
 * 記録されると、公開先（Netlify）が自動でサイトを作り直す。
 *
 * 環境変数：
 *   GITHUB_TOKEN  … このリポジトリの「Contents：Read and write」だけを許可した鍵（fine-grained token）
 *   GITHUB_REPO   … 「持ち主/リポジトリ名」（例：aiueoaiueo-zzz/jingainoneya）
 *   GITHUB_BRANCH … 公開に使うブランチ（例：main）
 */
const API = (process.env.GITHUB_API_URL || "https://api.github.com").replace(/\/$/, "");

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function isGitHubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO && process.env.GITHUB_BRANCH);
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;
  if (!token || !repo || !branch) {
    throw new GitHubError("GitHub の設定（GITHUB_TOKEN・GITHUB_REPO・GITHUB_BRANCH）が終わっていません。", 503);
  }
  return { token, repo, branch };
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const { token } = config();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  return res;
}

async function fail(res: Response, what: string): Promise<never> {
  const text = await res.text().catch(() => "");
  console.error(`GitHub ${what} に失敗（${res.status}）:`, text.slice(0, 300));
  if (res.status === 401 || res.status === 403) {
    throw new GitHubError("GitHub の鍵（GITHUB_TOKEN）が正しくないか、書き込みの許可がありません。", 502);
  }
  if (res.status === 409) {
    throw new GitHubError("ほかの場所で同じファイルが先に変更されました。ページを読み込み直してから、もう一度保存してください。", 409);
  }
  throw new GitHubError(`GitHub への${what}に失敗しました（${res.status}）。時間をおいてもう一度お試しください。`, 502);
}

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export type RepoFile = { path: string; sha: string; content: Buffer };

/** ファイルを1つ読む。なければ null */
export async function getFile(path: string): Promise<RepoFile | null> {
  const { repo, branch } = config();
  const res = await request(`/repos/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`);
  if (res.status === 404) return null;
  if (!res.ok) return fail(res, "読み込み");
  const json = (await res.json()) as { sha: string; content?: string; encoding?: string; download_url?: string };
  if (json.content && json.encoding === "base64") {
    return { path, sha: json.sha, content: Buffer.from(json.content, "base64") };
  }
  // 1MBを超えるファイルは中身が入っていないので、別の方法で取る
  const raw = await request(`/repos/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`, {
    headers: { Accept: "application/vnd.github.raw+json" },
  });
  if (!raw.ok) return fail(raw, "読み込み");
  return { path, sha: json.sha, content: Buffer.from(await raw.arrayBuffer()) };
}

export async function getText(path: string): Promise<{ sha: string; text: string } | null> {
  const file = await getFile(path);
  return file ? { sha: file.sha, text: file.content.toString("utf8") } : null;
}

export type DirEntry = { name: string; path: string; sha: string; size: number; type: "file" | "dir" };

/** フォルダの中身。フォルダがなければ空 */
export async function listDir(path: string): Promise<DirEntry[]> {
  const { repo, branch } = config();
  const res = await request(`/repos/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`);
  if (res.status === 404) return [];
  if (!res.ok) return fail(res, "一覧の読み込み");
  const json = (await res.json()) as DirEntry[];
  return Array.isArray(json) ? json : [];
}

/** ファイルを保存する（sha があれば上書き、なければ新規）。1回の保存が1回の記録（コミット）になる */
export async function putFile(path: string, content: Buffer | string, message: string, sha?: string): Promise<void> {
  const { repo, branch } = config();
  const body = {
    message,
    content: (typeof content === "string" ? Buffer.from(content, "utf8") : content).toString("base64"),
    branch,
    ...(sha ? { sha } : {}),
  };
  const res = await request(`/repos/${repo}/contents/${encodePath(path)}`, { method: "PUT", body: JSON.stringify(body) });
  if (!res.ok) return fail(res, "保存");
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  const { repo, branch } = config();
  const res = await request(`/repos/${repo}/contents/${encodePath(path)}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });
  if (!res.ok) return fail(res, "削除");
}

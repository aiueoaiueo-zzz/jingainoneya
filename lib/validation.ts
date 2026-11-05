/** フォームの入力チェック（ブラウザとサーバーの両方で同じ決まりを使う） */

export const CONTACT_TYPES = [
  "記事の内容について",
  "作品の掲載・紹介について",
  "掲載内容の削除・修正のご依頼",
  "その他",
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactInput = { name: string; email: string; type: string; body: string; agree: boolean };

export function validateContact(input: ContactInput): string | null {
  if (input.name.length > 40) return "お名前は40字までにしてください。";
  if (input.email && (input.email.length > 120 || !EMAIL.test(input.email))) {
    return "メールアドレスの形式が正しくありません。";
  }
  if (!(CONTACT_TYPES as readonly string[]).includes(input.type)) return "お問い合わせの種類を選んでください。";
  if (!input.body.trim()) return "内容を入力してください。";
  if (input.body.length > 2000) return "内容は2000字までにしてください。";
  if (!input.agree) return "プライバシーポリシーへの同意が必要です。";
  return null;
}

export const COMMENT_DEFAULT_NAME = "名無しの人外好き";

export type CommentInput = { name: string; body: string };

export function validateComment(input: CommentInput): string | null {
  if (input.name.trim().length > 20) return "名前は20字までにしてください。";
  const len = input.body.trim().length;
  if (len < 5) return "コメントは5字以上で書いてください。";
  if (len > 400) return "コメントは400字までにしてください。";
  return null;
}

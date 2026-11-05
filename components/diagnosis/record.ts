/**
 * 「みんなの結果」への記録。結果が出たときに1回だけ送る。
 * 同じ端末からは、同じ診断について1日1回まで（サーバー側でも同じ制限をかける）。
 */
const DEVICE_KEY = "jingai_neya_device";

function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function today(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}

export function recordResult(diagnosisId: string, resultKey: string) {
  const mark = `jingai_neya_diag_${diagnosisId}`;
  try {
    if (localStorage.getItem(mark) === today()) return;
    localStorage.setItem(mark, today());
  } catch {
    // 保存できない環境でも、サーバー側の制限があるので送ってよい
  }
  void fetch("/api/diagnosis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ diagnosisId, resultKey, device: deviceId() }),
    keepalive: true,
  }).catch(() => {});
}

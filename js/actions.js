// js/actions.js
window.App = window.App || {};
App.actions = App.actions || {};

const KEY_DATA = "mymemo:data:v1";

const safeParse = (s) => {
  try { return JSON.parse(s); } catch(e) { return null; }
};

const escapeCsv = (v) => {
  const t = (v ?? "").toString();
  if (/[",\n\r]/.test(t)) return `"${t.replaceAll('"','""')}"`;
  return t;
};

const downloadBlob = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const loadMemos = () => {
  const raw = localStorage.getItem(KEY_DATA);
  const data = safeParse(raw || "[]");
  return Array.isArray(data) ? data : [];
};

const saveMemos = (memos) => {
  localStorage.setItem(KEY_DATA, JSON.stringify(memos, null, 2));
};

const nowStr = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

App.actions.doSave = () => {
  const bodyEl = document.getElementById("bodyInput");
  const feelingEl = document.getElementById("feelingInput");

  if (!bodyEl) return alert("bodyInput が見つかりません");

  const text = bodyEl.value || "";
  if (!text.trim()) return alert("空です。何か書いてから保存してください。");

  const memos = loadMemos();
  const at = nowStr();

  memos.push({
    id: "m_" + Date.now().toString(36),
    body: text,
    feeling: feelingEl ? (feelingEl.value || "") : "",
    created: at,
    updated: at
  });

  saveMemos(memos);
  alert(`保存しました（${memos.length}件）`);

  // 保存できたら入力欄クリア
  bodyEl.value = "";
  if (feelingEl) feelingEl.value = "";
};

App.actions.exportCSV = () => {
  const memos = loadMemos(); // ★常にlocalStorageから読む（空になる事故を防ぐ）
  const header = ["id","body","feeling","created","updated"];
  const lines = [header.join(",")];

  for (const m of memos) {
    lines.push([
      escapeCsv(m.id),
      escapeCsv(m.body),
      escapeCsv(m.feeling),
      escapeCsv(m.created),
      escapeCsv(m.updated),
    ].join(","));
  }

  const d = new Date();
  const pad = (n) => String(n).padStart(2,"0");
  const fname = `mymemo_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.csv`;

  downloadBlob(lines.join("\n"), fname, "text/csv;charset=utf-8");
  alert(`CSVを書き出しました（${memos.length}件）`);
};

App.actions.clearExported = () => {
  const memos = loadMemos();
  if (memos.length === 0) return alert("削除するデータがありません（0件）");

  if (!confirm(`書き出し済みとして、スマホ側のメモを全削除します。\n（${memos.length}件）よろしいですか？`)) {
    return;
  }
  localStorage.removeItem(KEY_DATA);
  alert("削除しました（0件）");
  App.actions.clearExported = () => { localStorage.removeItem("mymemo:data:v1"); alert("削除しました（0件）"); };

};

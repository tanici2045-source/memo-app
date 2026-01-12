// js/actions.js
// actions.js
window.App = window.App || {};
App.actions = App.actions || {};

App.actions.doSave = () => {
  // DOM を自分で取りに行く（App.dom が無くても動く）
  const bodyEl = document.getElementById("bodyInput");
  const feelingEl = document.getElementById("feelingInput");

  if (!bodyEl) {
    alert("bodyInput が見つかりません");
    return;
  }

  const text = bodyEl.value || "";
  if (!text.trim()) {
    alert("空です。何か書いてから保存してください。");
    return;
  }

  // localStorage に保存（最小）
  const KEY_DATA = "mymemo:data:v1";
  let memos = [];
  try { memos = JSON.parse(localStorage.getItem(KEY_DATA) || "[]"); } catch(e) { memos = []; }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const nowStr =
    `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  memos.push({
    id: "m_" + Date.now().toString(36),
    body: text,
    feeling: feelingEl ? feelingEl.value : "",
    created: nowStr,
    updated: nowStr
    
  });

  localStorage.setItem(KEY_DATA, JSON.stringify(memos, null, 2));
  console.log("SAVED KEY_DATA:", KEY_DATA, "len:", memos.length); // ←この1行
  alert(`保存しました（${memos.length}件）`);
} 
  // 保存できたら入力欄クリア
document.getElementById("bodyInput").value = "";
document.getElementById("feelingInput").value = "";



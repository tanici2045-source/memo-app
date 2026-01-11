// js/actions.js

window.App = window.App || {};
const App = window.App;

App.actions = App.actions || {};

App.actions.doSave = () => {
  const memos = App.state.memos;

  const titleInput = App.dom?.titleInput;
  const bodyInput  = App.dom?.bodyInput;

  if (!titleInput || !bodyInput) {
    alert("DOM が準備できていません（App.dom が未設定）");
    return;
  }

  const t = titleInput.value.trim();
  const b = bodyInput.value;

  if (!t && !b.trim()) {
    alert("タイトルも本文も空です。何か入力してから保存してください。");
    return;
  }

  const at = App.util.nowStr();

  // currentId / status は state に寄せる
  const currentId = App.state.currentId || null;
  const currentStatus = App.state.currentStatus || "todo";

  const uid = App.util.uid;

  if (!currentId) {
    const m = {
      id: uid(),
      title: t,
      body: b,
      status: currentStatus,
      created: at,
      updated: at,
    };
    memos.push(m);
    App.state.currentId = m.id;
  } else {
    const m = memos.find(x => x.id === currentId);
    if (!m) {
      const nm = { id: uid(), title:t, body:b, status: currentStatus, created: at, updated: at };
      memos.push(nm);
      App.state.currentId = nm.id;
    } else {
      m.title = t;
      m.body = b;
      m.status = currentStatus;
      m.updated = at;
    }
  }

  // 永続化
  App.storage.saveAll(memos);
  localStorage.removeItem(App.storage.KEY_DRAFT);

  // 同期
  App.state.memos = memos;

  // 再描画（あれば）
  if (typeof window.render === "function") window.render();
};


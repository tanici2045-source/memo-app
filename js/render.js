// js/render.js
// ===== Render（画面描画）=====

const filteredMemos = () => {
  const q = searchInput.value.trim().toLowerCase();
  return memos
    .filter(m => {
      if (filterMode === "todo" && m.status !== "todo") return false;
      if (filterMode === "done" && m.status !== "done") return false;
      if (!q) return true;
      return (m.title.toLowerCase().includes(q) || m.body.toLowerCase().includes(q));
    })
    .sort((a,b) => (b.updated.localeCompare(a.updated)));
};

const render = () => {
  const list = filteredMemos();
  itemsEl.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "hint";
    empty.textContent = "メモがありません（保存するとここに出ます）";
    itemsEl.appendChild(empty);
    return;
  }

  for (const m of list) {
    const item = document.createElement("div");
    item.className = "item";

    const left = document.createElement("div");
    left.className = "itemLeft";

    const top = document.createElement("div");
    top.className = "itemTop";

    const badge = document.createElement("span");
    badge.className = "badge " + (m.status === "done" ? "done" : "todo");
    badge.textContent = (m.status === "done" ? "済" : "未");

    const t = document.createElement("div");
    t.className = "itemTitle";
    t.textContent = m.title || "（無題）";

    top.appendChild(badge);
    top.appendChild(t);

    const meta = document.createElement("div");
    meta.className = "itemMeta";
    const bodyOneLine = (m.body || "").replace(/\s+/g," ").trim();
    meta.textContent = `${m.updated} / ${bodyOneLine.slice(0, 60)}${bodyOneLine.length > 60 ? "…" : ""}`;

    left.appendChild(top);
    left.appendChild(meta);

    const btns = document.createElement("div");
    btns.className = "itemBtns";

    const openBtn = document.createElement("button");
    openBtn.className = "secondary tiny";
    openBtn.textContent = "開く";
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setEditor(m);
    });

    const statBtn = document.createElement("button");
    statBtn.className = "secondary tiny";
    statBtn.textContent = "未/済";
    statBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      m.status = (m.status === "done" ? "todo" : "done");
      m.updated = nowStr();
      saveAll();
      render();
      if (currentId === m.id) {
        currentStatus = m.status;
        currentInfo.textContent = `編集中: ${m.status === "done" ? "済" : "未"} / 更新: ${m.updated}`;
      }
    });

    const delBtn = document.createElement("button");
    delBtn.className = "danger tiny";
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm("このメモを削除しますか？")) return;
      memos = memos.filter(x => x.id !== m.id);
      saveAll();
      if (currentId === m.id) setEditor(null);
      render();
    });

    btns.appendChild(openBtn);
    btns.appendChild(statBtn);
    btns.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(btns);

    item.addEventListener("click", () => setEditor(m));
    itemsEl.appendChild(item);
  }
};
window.render = render;
window.filteredMemos = filteredMemos;


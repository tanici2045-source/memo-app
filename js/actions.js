// js/actions.js
window.App = window.App || {};

App.actions = (() => {
  const exportCSV = () => {
    const { escapeCsv, downloadBlob } = App.storage;
    //2026/1/9add
    const exportJSON = () => {
  const memos = App.state.memos;
  const { downloadBlob } = App.storage;

  const nowStr = App.util.nowStr; // util を作ってない場合は下の「2)」へ
  const payload = {
    app: "Myメモ",
    version: 1,
    exported: nowStr(),
    memos
  };

  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fname = `mymemo_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.json`;

  downloadBlob(JSON.stringify(payload, null, 2), fname, "application/json;charset=utf-8");
};
//end
     App.return { exportCSV, exportJSON };
    //
state.memos を使う
    const memos = App.state.memos;

    const header = ["id","title","body","status","created","updated"];
    const lines = [header.join(",")];

    const list = memos.slice().sort((a,b) => (b.updated.localeCompare(a.updated)));
    for (const m of list) {
      const row = [
        escapeCsv(m.id),
        escapeCsv(m.title),
        escapeCsv(m.body),
        escapeCsv(m.status),
        escapeCsv(m.created),
        escapeCsv(m.updated),
      ];
      lines.push(row.join(","));
    }

    const ymd = new Date();
    const pad = (n) => String(n).padStart(2,"0");
    const fname = `mymemo_${ymd.getFullYear()}${pad(ymd.getMonth()+1)}${pad(ymd.getDate())}.csv`;

    downloadBlob(lines.join("\n"), fname, "text/csv;charset=utf-8");
  };

  return { exportCSV };
})();

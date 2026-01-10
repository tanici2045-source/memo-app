// js/actions.js

const App = window.App;

App.actions = (() => {
  const exportCSV = () => {
    const { escapeCsv, downloadBlob } = App.storage;
    const memos = App.state.memos;

    const header = ["id","title","body","status","created","updated"];
    const lines = [header.join(",")];

    const list = memos.slice().sort((a,b) => (b.updated.localeCompare(a.updated)));
    for (const m of list) {
      lines.push([
        escapeCsv(m.id),
        escapeCsv(m.title),
        escapeCsv(m.body),
        escapeCsv(m.status),
        escapeCsv(m.created),
        escapeCsv(m.updated),
      ].join(","));
    }

    const d = new Date();
    const pad = (n) => String(n).padStart(2,"0");
    const fname = `mymemo_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.csv`;

    downloadBlob(lines.join("\n"), fname, "text/csv;charset=utf-8");
  };

  const exportJSON = () => {
    const { downloadBlob } = App.storage;
    const memos = App.state.memos;

    const nowStr = App.util?.nowStr || (() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2,"0");
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    });

    const payload = {
      app: "Myメモ",
      version: 1,
      exported: nowStr(),
      memos
    };

    const d = new Date();
    const pad = (n) => String(n).padStart(2,"0");
    const fname = `mymemo_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.json`;

    downloadBlob(JSON.stringify(payload, null, 2), fname, "application/json;charset=utf-8");
  };

  return { exportCSV, exportJSON };
  
})();
window.App.actions = App.actions;

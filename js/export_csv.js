//ＣＳＶ書き出し

window.App = window.App || {};
App.actions = App.actions || {};

  //
 App.actions.exportCSV = () => {
  const { escapeCsv, downloadBlob } = App.storage;

  const KEY_DATA = "mymemo:data:v1";
  const memos = JSON.parse(localStorage.getItem(KEY_DATA) || "[]"); 
  let memos = [];
  try { memos = JSON.parse(localStorage.getItem(KEY_DATA) || "[]"); } catch(e) { memos = []; }

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
 //
  }

  const d = new Date();
  const pad = (n) => String(n).padStart(2,"0");
  const fname = `mymemo_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.csv`;

  downloadBlob(lines.join("\n"), fname, "text/csv;charset=utf-8");
};

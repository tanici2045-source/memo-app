// js/storage.js
window.App = window.App || {};

App.storage = (() => {
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

  const escapeCsv = (s) => {
    const t = (s ?? "").toString();
    if (/[",\n\r]/.test(t)) return `"${t.replaceAll('"','""')}"`;
    return t;
  };

  return { downloadBlob, escapeCsv };
})();

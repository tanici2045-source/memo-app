// js/app.js
window.App = window.App || {};

App.state = App.state || { memos: [] };
App.util = App.util || {};
App.util.nowStr = App.util.nowStr || (() => {
  const pad = (n) => String(n).padStart(2,"0");
  return () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
})();

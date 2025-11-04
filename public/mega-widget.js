/* public/mega-widget.js
   Robust client for presale + wallet score with safe fallback to workers.dev
*/
(function () {
  const SAME_ORIGIN = `${location.origin}/api`;
  const WORKER_ORIGIN = `https://megaeth-score.petrantonft.workers.dev/api`;

  // Try same-origin first, then worker; only consider true JSON as success.
  async function fetchJSON(path, init) {
    // helper: fetch + validate JSON
    const tryFetch = async (base) => {
      const url = `${base}${path}`;
      const res = await fetch(url, { ...init, cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      // must look like JSON
      if (!ct.includes("application/json")) throw new Error(`Non-JSON @ ${url}`);
      return res.json();
    };

    try {
      return await tryFetch(SAME_ORIGIN);
    } catch (_) {
      // fall back to workers.dev
      try {
        return await tryFetch(WORKER_ORIGIN.replace(/\/api$/, "")); // ensure single /api
      } catch (e2) {
        throw e2;
      }
    }
  }

  // --------- DOM helpers ----------
  const $ = (id) => document.getElementById(id);
  const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const setPre = (id, v) => { const el = $(id); if (el) el.textContent = v; };

  // --------- Public API ----------
  async function loadParticipants() {
    try {
      setText("mega-participants", "—");
      setText("mega-updated", "");
      const data = await fetchJSON(`/presale/participants/count`);
      setText("mega-participants", (data.uniqueDepositors ?? 0).toLocaleString());
      const ts = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
      setText(
        "mega-updated",
        `Updated ${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}`
      );
    } catch (e) {
      // don’t bubble to window.onerror; show a small hint in the card only
      setText("mega-participants", "—");
      setText("mega-updated", "Unavailable (routing/CORS).");
      console.debug("[mega-widget] participants error:", e.message);
    }
  }

  async function score() {
    const input = $("mega-addr");
    const out = $("mega-result");
    if (!input || !out) return;
    const raw = (input.value || "").trim();
    // accept with or without 0x; normalize
    const addr = raw.startsWith("0x") ? raw : (raw ? "0x" + raw : "");
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setPre("mega-result", "Enter a valid EVM address (40 hex chars).");
      return;
    }

    setPre("mega-result", "Checking…");
    try {
      const data = await fetchJSON(`/score?address=${addr}`);
      setPre("mega-result", JSON.stringify(data, null, 2));
    } catch (e) {
      setPre("mega-result", `Error fetching score (routing/CORS). Try again.\n\n${e.message}`);
      console.debug("[mega-widget] score error:", e.message);
    }
  }

  // expose
  window.__megaWidget = { loadParticipants, score };
})();

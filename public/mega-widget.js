/* public/mega-widget.js
   Robust client for presale + wallet score with safe multi-origin fallback.
*/
(function () {
  // --- API bases (avec /api à la fin)
  const SAME_ORIGIN = `${location.origin}/api`;
  const CUSTOM_ORIGIN = `https://megascore.petranto.com/api`;
  const WORKERS_FALLBACK = `https://megaeth-score.petrantonft.workers.dev/api`;

  // --- util: fetch JSON avec timeout + vérif content-type
  async function fetchJsonWithTimeout(url, init = {}, ms = 12000) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const res = await fetch(url, {
        ...init,
        cache: "no-store",
        credentials: "omit",
        signal: ctl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/json")) throw new Error(`Non-JSON @ ${url}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // Essaye chaque base jusqu'à succès
  async function fetchJSON(path, init) {
    const bases = [SAME_ORIGIN, CUSTOM_ORIGIN, WORKERS_FALLBACK];
    let lastErr;
    for (const base of bases) {
      const baseClean = base.replace(/\/+$/, ""); // trim trailing /
      const pathClean = "/" + String(path || "").replace(/^\/+/, ""); // ensure single leading /
      const url = `${baseClean}${pathClean}`;
      try {
        return await fetchJsonWithTimeout(url, init);
      } catch (e) {
        lastErr = e;
        // essaie suivant
      }
    }
    throw lastErr || new Error("All endpoints failed");
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
      // Routes supportées par le Worker: /api/presale/participants/count (et /participants en compat)
      const data = await fetchJSON(`/presale/participants/count`);
      setText("mega-participants", (data.uniqueDepositors ?? 0).toLocaleString());
      const ts = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
      setText("mega-updated", `Updated ${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}`);
    } catch (e) {
      setText("mega-participants", "—");
      setText("mega-updated", "Unavailable (routing/CORS).");
      console.debug("[mega-widget] participants error:", e.message || e);
    }
  }

  async function score() {
    const input = $("mega-addr");
    const out = $("mega-result");
    if (!input || !out) return;

    const raw = (input.value || "").trim();
    // accepte avec ou sans 0x ; normalise
    const addr = raw
      ? (raw.startsWith("0x") ? raw : "0x" + raw)
      : "";

    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setPre("mega-result", "Enter a valid EVM address (40 hex chars).");
      return;
    }

    setPre("mega-result", "Checking…");
    try {
      // Routes supportées: /api/score?address=0x... (et /score en compat)
      const data = await fetchJSON(`/score?address=${encodeURIComponent(addr)}`);
      setPre("mega-result", JSON.stringify(data, null, 2));
    } catch (e) {
      setPre(
        "mega-result",
        `Error fetching score (routing/CORS). Try again.\n\n${(e && e.message) || e}`
      );
      console.debug("[mega-widget] score error:", e.message || e);
    }
  }

  // expose
  window.__megaWidget = { loadParticipants, score };
})();

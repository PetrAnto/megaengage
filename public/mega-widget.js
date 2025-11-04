// public/mega-widget.js
(function () {
  const $ = (id) => document.getElementById(id);

  // --- alert helper (uses your existing #alerts area) ---
  function alertBox(msg, type = "warning") {
    const el = $("alerts");
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  }

  // --- smart BASE: same-origin first, workers.dev fallback ---
  const FALLBACK_ORIGIN = "https://megaeth-score.petrantonft.workers.dev";
  let BASE = `${location.origin}/api`;
  let switchedToFallback = false;

  async function fetchApi(path, opts = {}) {
    const tryFetch = async (origin) => {
      const res = await fetch(`${origin}${path}`, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        ...opts,
        headers: {
          "Accept": "application/json",
          ...(opts.headers || {}),
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0, 120)}`);
      }
      return res.json();
    };

    try {
      return await tryFetch(BASE);
    } catch (e) {
      if (!switchedToFallback) {
        console.warn("API failed on same-origin, switching to workers.dev:", e.message);
        switchedToFallback = true;
        BASE = `${FALLBACK_ORIGIN}/api`;
        try {
          return await tryFetch(BASE);
        } catch (e2) {
          throw new Error(`API failed on both origins. Last error: ${e2.message}`);
        }
      }
      throw e;
    }
  }

  // --- participants widget ---
  async function loadParticipants() {
    const nEl = $("mega-participants");
    const tEl = $("mega-updated");
    if (nEl) nEl.textContent = "—";
    if (tEl) tEl.textContent = "";

    try {
      const data = await fetchApi("/presale/participants/count");
      if (nEl) nEl.textContent = (data.uniqueDepositors ?? 0).toLocaleString();
      if (tEl) tEl.textContent = data.lastUpdated
        ? `Updated ${new Date(data.lastUpdated).toLocaleString()}`
        : "";
    } catch (err) {
      alertBox(`Participants fetch error: ${err.message}`, "danger");
    }
  }

  // --- score widget ---
  function normalizeAddr(v) {
    let s = String(v || "").trim();
    if (!s) return null;
    s = s.startsWith("0x") ? s : `0x${s}`;
    if (!/^0x[0-9a-fA-F]{40}$/.test(s)) return null;
    return s;
  }

  async function score() {
    const input = $("mega-addr");
    const out = $("mega-result");
    if (out) out.textContent = "Checking…";

    const addr = normalizeAddr(input && input.value);
    if (!addr) {
      if (out) out.textContent = "Enter a valid wallet (0x + 40 hex).";
      return;
    }

    try {
      const data = await fetchApi(`/score?address=${encodeURIComponent(addr)}`);
      if (out) {
        out.textContent = JSON.stringify(data, null, 2);
      }
    } catch (err) {
      if (out) out.textContent = `Error: ${err.message}`;
      alertBox(`Score fetch error: ${err.message}`, "danger");
    }
  }

  // expose to inline onclick handlers
  window.__megaWidget = { loadParticipants, score };

  // auto-load participants on first paint (safe if called again)
  try { loadParticipants(); } catch {}
})();

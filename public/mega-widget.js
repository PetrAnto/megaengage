<script>
(function () {
  const apiBase = location.origin; // thanks to your /api/* route

  async function loadParticipants() {
    const elNum = document.getElementById('mega-participants');
    const elUpd = document.getElementById('mega-updated');
    try {
      elNum.textContent = '…';
      const r = await fetch(`${apiBase}/api/presale/participants/count`, { cache: 'no-store' });
      const j = await r.json();
      elNum.textContent = (j.uniqueDepositors ?? '—').toLocaleString?.() ?? j.uniqueDepositors ?? '—';
      elUpd.textContent = j.lastUpdated ? `Last updated: ${new Date(j.lastUpdated).toLocaleString()}` : '';
    } catch (e) {
      elNum.textContent = 'Error';
      elUpd.textContent = e?.message || String(e);
    }
  }

  async function score() {
    const input = document.getElementById('mega-addr');
    const out = document.getElementById('mega-result');
    let a = (input.value || '').trim();
    if (!a) { out.textContent = 'Enter a wallet address.'; return; }
    if (!a.startsWith('0x')) a = '0x' + a;
    out.textContent = 'Loading…';
    try {
      const r = await fetch(`${apiBase}/api/score?address=${encodeURIComponent(a)}`, { cache: 'no-store' });
      const j = await r.json();
      out.textContent = JSON.stringify(j, null, 2);
    } catch (e) {
      out.textContent = String(e);
    }
  }

  window.__megaWidget = { loadParticipants, score };
})();
</script>

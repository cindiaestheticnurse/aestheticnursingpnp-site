/* Free PDF downloads: ask for first name, last name and email, then show the download link.
   The server emails the PDF link to the visitor from info@aestheticnursingpnp.com and notifies info@. */
(function () {
  var API = window.__PDF_API__ || 'https://anps-manual-builder.onrender.com/api/checklist';
  var PREVIEW = window.__PDF_GATE_PREVIEW__ === true;
  var ROOT = window.__ROOT__ || '';
  var RES = {
    assessment: {
      re: /Med-Spa-Compliance-Readiness-Checklist\.pdf/i,
      file: 'assets/docs/Med-Spa-Compliance-Readiness-Checklist.pdf',
      eyebrow: 'Free Download',
      title: 'Practice Assessment',
      lead: 'Enter your name and email to download the Practice Assessment. We\u2019ll also email you the link.',
      button: 'Download the Practice Assessment'
    },
    research: {
      re: /The-Accusation-Review-2026-Summary\.pdf/i,
      file: 'assets/docs/The-Accusation-Review-2026-Summary.pdf',
      eyebrow: 'The Accusation Review',
      title: '2026 Summary (PDF)',
      lead: 'Enter your name and email to download the 2026 Summary. We\u2019ll also email you the link.',
      button: 'Download the 2026 Summary'
    }
  };
  var HASH = { 'practice-assessment': 'assessment', 'research-pdf': 'research' };

  var css = '' +
    '.pg-back{position:fixed;inset:0;background:rgba(20,18,17,.72);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}' +
    '.pg-card{background:#FFFFFF;color:#2B2926;width:100%;max-width:460px;max-height:calc(100vh - 32px);overflow:auto;border-top:3px solid #8A4F4F;padding:30px 28px 26px;font-family:Jost,Helvetica,Arial,sans-serif;position:relative;box-shadow:0 24px 60px rgba(0,0,0,.35)}' +
    '.pg-x{position:absolute;top:8px;right:8px;width:40px;height:40px;border:0;background:none;font-size:26px;line-height:1;color:#2B2926;cursor:pointer}' +
    '.pg-x:hover{color:#8A4F4F}' +
    '.pg-eb{margin:0 0 6px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#8A4F4F}' +
    '.pg-h{margin:0 0 10px;font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;font-size:30px;line-height:1.15}' +
    '.pg-lead{margin:0 0 18px;font-size:15px;line-height:1.6;color:#4A4640}' +
    '.pg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:420px){.pg-row{grid-template-columns:1fr}}' +
    '.pg-f{display:block;margin:0 0 14px}.pg-f span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 6px;color:#2B2926}' +
    '.pg-f input{width:100%;box-sizing:border-box;border:1px solid #8C8680;background:#FFFFFF;color:#2B2926;padding:11px 12px;font:inherit;font-size:16px}' +
    '.pg-f input:focus{outline:2px solid #8A4F4F;outline-offset:1px;border-color:#8A4F4F}' +
    '.pg-f input[aria-invalid=true]{border-color:#9B2C2C}' +
    '.pg-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.pg-btn{display:inline-block;width:100%;box-sizing:border-box;text-align:center;background:#8A4F4F;color:#FFFFFF;border:1px solid #8A4F4F;padding:14px 18px;font:inherit;font-size:12px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;text-decoration:none}' +
    '.pg-btn:hover{background:#2B2926;border-color:#2B2926;color:#FFFFFF}.pg-btn[disabled]{opacity:.7;cursor:wait}' +
    '.pg-btn:focus-visible,.pg-x:focus-visible{outline:2px solid #2B2926;outline-offset:2px}' +
    '.pg-err{margin:0 0 12px;color:#9B2C2C;font-size:14px;line-height:1.5}' +
    '.pg-note{margin:12px 0 0;font-size:12.5px;line-height:1.55;color:#5A554F}' +
    '.pg-note a{color:#8A4F4F;text-decoration:underline}' +
    '.pg-ok p{font-size:15px;line-height:1.6;margin:0 0 16px}';
  function addCss() {
    if (document.getElementById('pg-css')) return;
    var s = document.createElement('style'); s.id = 'pg-css'; s.textContent = css; document.head.appendChild(s);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(ev, p) { try { if (window.gtag) window.gtag('event', ev, p); } catch (e) {} }

  var openEl = null, lastFocus = null;
  function close() {
    if (!openEl) return;
    openEl.remove(); openEl = null;
    document.removeEventListener('keydown', onKey, true);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }
  function onKey(e) {
    if (!openEl) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = openEl.querySelectorAll('button, a[href], input:not([tabindex="-1"])');
      f = Array.prototype.filter.call(f, function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function open(kind, href) {
    var r = RES[kind]; if (!r) return;
    close(); addCss();
    lastFocus = document.activeElement;
    var url = href || (ROOT + r.file);
    var back = document.createElement('div');
    back.className = 'pg-back';
    back.innerHTML =
      '<div class="pg-card" role="dialog" aria-modal="true" aria-labelledby="pg-title" aria-describedby="pg-lead">' +
      '<button type="button" class="pg-x" aria-label="Close">&times;</button>' +
      '<p class="pg-eb">' + esc(r.eyebrow) + '</p>' +
      '<h2 class="pg-h" id="pg-title">' + esc(r.title) + '</h2>' +
      '<div class="pg-body">' +
      '<p class="pg-lead" id="pg-lead">' + esc(r.lead) + '</p>' +
      '<form novalidate>' +
      '<p class="pg-err" role="alert" hidden></p>' +
      '<div class="pg-row">' +
      '<label class="pg-f"><span>First Name *</span><input name="first_name" autocomplete="given-name" required maxlength="40"></label>' +
      '<label class="pg-f"><span>Last Name *</span><input name="last_name" autocomplete="family-name" required maxlength="40"></label>' +
      '</div>' +
      '<label class="pg-f"><span>Email *</span><input name="email" type="email" autocomplete="email" required maxlength="120"></label>' +
      '<label class="pg-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>' +
      '<button type="submit" class="pg-btn">Get the PDF</button>' +
      '<p class="pg-note">* Required. We use your email to send you this PDF. See our <a href="' + esc(window.__PRIVACY_URL__ || (ROOT + 'privacy/')) + '">Privacy Policy</a>.</p>' +
      '</form></div></div>';
    document.body.appendChild(back);
    openEl = back;
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    back.querySelector('.pg-x').addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);
    var form = back.querySelector('form'), err = back.querySelector('.pg-err'), btn = back.querySelector('.pg-btn');
    setTimeout(function () { form.querySelector('input').focus(); }, 30);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = {}; ['first_name', 'last_name', 'email', 'website'].forEach(function (n) { v[n] = (form.elements[n].value || '').trim(); });
      var bad = [];
      ['first_name', 'last_name'].forEach(function (n) { if (!v[n]) bad.push(n); });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad.push('email');
      ['first_name', 'last_name', 'email'].forEach(function (n) { form.elements[n].setAttribute('aria-invalid', bad.indexOf(n) > -1 ? 'true' : 'false'); });
      if (bad.length) {
        err.textContent = 'Please enter your first name, last name and a valid email.'; err.hidden = false;
        form.elements[bad[0]].focus(); return;
      }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Sending\u2026';
      var body = { first_name: v.first_name, last_name: v.last_name, email: v.email, website: v.website, resource: kind, page: location.pathname };
      var req = PREVIEW
        ? new Promise(function (res) { setTimeout(function () { res({ ok: true, emailed: true, preview: true }); }, 500); })
        : fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || 'send failed'); return d; }); });
      req.then(function (d) {
        track('generate_lead', { form_name: kind === 'research' ? 'accusation_review_pdf' : 'practice_assessment_pdf', emailed: d.emailed ? 'yes' : 'no' });
        var msg = d.emailed
          ? 'We\u2019ve also emailed the link to <strong>' + esc(v.email) + '</strong> from info@aestheticnursingpnp.com.'
          : 'We couldn\u2019t send the email just now, but your download is ready below.';
        if (d.preview) msg += ' <em>(Preview: no email is actually sent here.)</em>';
        back.querySelector('.pg-body').innerHTML =
          '<div class="pg-ok"><p>Thank you, ' + esc(v.first_name) + '. Your download is ready.</p><p>' + msg + '</p>' +
          '<a class="pg-btn" href="' + esc(url) + '" target="_blank" rel="noopener" download>' + esc(r.button) + '</a></div>';
        var dl = back.querySelector('.pg-ok a');
        dl.addEventListener('click', function () { track('file_download', { file_name: kind === 'research' ? 'accusation-review-2026-summary' : 'practice-assessment' }); });
        dl.focus();
      }).catch(function (x) {
        btn.disabled = false; btn.textContent = 'Get the PDF';
        err.textContent = (x && x.message && x.message !== 'send failed' && x.message !== 'Failed to fetch') ? x.message
          : 'Sorry, something went wrong. Please try again, or email info@aestheticnursingpnp.com.';
        err.hidden = false;
      });
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || (openEl && openEl.contains(a))) return;
    var h = a.getAttribute('href') || '';
    for (var k in RES) if (RES[k].re.test(h)) { e.preventDefault(); e.stopPropagation(); open(k, a.href); return; }
  }, true);
  function fromHash() { var k = HASH[(location.hash || '').slice(1)]; if (k) open(k); }
  window.addEventListener('hashchange', fromHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(fromHash, 300); });
  else setTimeout(fromHash, 300);
  window.__openPdfGate = open;
})();

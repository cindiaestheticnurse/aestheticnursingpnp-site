(function(){
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // Video: show a play button over the still frame; load the file only when clicked
  const v = $('#mbVideo'), play = $('#mbPlay');
  if (v && play) {
    v.controls = false;
    play.addEventListener('click', () => { play.hidden = true; v.controls = true; v.play().catch(()=>{}); });
    v.addEventListener('play', () => { play.hidden = true; v.controls = true; });
  }

  // State list and carried-over Binder Blueprint selections (?state=CA&menu=neuro,ha)
  const NAMES = window.STATE_NAMES || {};
  const sel = $('#w_state');
  sel.innerHTML = '<option value="">Select</option>' + Object.keys(NAMES).sort((a,b)=>NAMES[a].localeCompare(NAMES[b])).map(k=>`<option value="${esc(NAMES[k])}">${esc(NAMES[k])}</option>`).join('');
  const q = new URLSearchParams(location.search);
  const st = (q.get('state')||'').toUpperCase();
  if (NAMES[st]) sel.value = NAMES[st];
  const ids = (q.get('menu')||'').split(',').map(s=>s.trim()).filter(Boolean);
  const byId = {};
  (window.MENU||[]).forEach(g => (g.items||[]).forEach(i => { byId[i.id] = i.name; }));
  const menu = ids.map(id => byId[id]).filter(Boolean);
  if (menu.length || NAMES[st]) {
    const p = $('#w_picked');
    p.innerHTML = '<b>From Your Binder Blueprint:</b> ' + (NAMES[st] ? esc(NAMES[st]) + (menu.length ? ' · ' : '') : '') + menu.map(esc).join(', ');
    p.classList.add('show');
    if (location.hash !== '#waitlist' && ids.length) setTimeout(()=>{ const w=$('#waitlist'); w && w.scrollIntoView({behavior:'smooth'}); }, 400);
  }

  // Waitlist delivery uses the same EmailJS service and template as the consult form
  const EMAILJS = { service: 'service_lwkxats', template: 'template_igi8str', key: 'ocGHBFbCh69YjNwsU', to: 'cindiaestheticnurse@gmail.com' };
  const form = $('#waitForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form));
    const notes = [d.notes || '', menu.length ? 'Binder Blueprint menu: ' + menu.join(', ') : ''].filter(Boolean).join('\n');
    fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key,
        template_params: { to_email: EMAILJS.to, to_name: 'Cindi', from_name: d.name||'', from_email: d.email||'', phone: '', state: d.state||'', role: '', practice_name: d.practice_name||'', interest: 'Manual Builder Waitlist', notes: notes || 'Joined the Manual Builder waitlist.' } }) }).catch(()=>{});
    form.hidden = true; const done = $('#waitDone'); done.classList.add('show'); done.focus();
  });
})();

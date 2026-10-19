/* Aesthetic Nursing P&P · Site Scripts (V9 Redesign) */
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const ROOT = window.SITE_ROOT || '';

  // Old homepage anchors now live on their own pages
  const MOVED = { review:'research/', 'finding-1':'research/#finding-1', check:'research/#check', 'self-audit':'research/#check',
    services:'services/', compare:'services/#compare', education:'services/#education', accelerator:'services/#accelerator',
    about:'about/', contact:'contact/', faq:'contact/#faq' };
  const moveHash = () => { const h = decodeURIComponent(location.hash.slice(1)); if (!ROOT && h && MOVED[h] && !document.getElementById(h)) location.replace(MOVED[h]); };
  moveHash(); window.addEventListener('hashchange', moveHash);

  // Conversion tracking. Sends each event to Google Analytics (when analytics.js has a GA4 ID),
  // Cloudflare Zaraz (if enabled) and window.dataLayer. Does nothing if none are present.
  const track = (name, params) => { try {
    const p = Object.assign({ page_path: location.pathname }, params || {});
    if (typeof window.gtag === 'function') window.gtag('event', name, p);
    if (window.zaraz && typeof window.zaraz.track === 'function') window.zaraz.track(name, p);
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, p));
  } catch (e) {} };
  window.anpTrack = track;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    if (h.startsWith('tel:')) track('click_phone', { link_text: a.textContent.trim().slice(0, 60) });
    else if (h.startsWith('mailto:')) track('click_email', { link_text: a.textContent.trim().slice(0, 60) });
    else if (h.includes('scheduler.zoom.us')) track('click_calendar', { link_text: a.textContent.trim().slice(0, 60) });
    else if (h.includes('google.com/maps')) track(h.includes('!12e1') ? 'click_google_review' : 'click_google_reviews', {});
    else if (/Med-Spa-Compliance-Readiness-Checklist\.pdf/.test(h)) track('file_download', { file_name: 'compliance-readiness-checklist' });
    else if (/Findings-Brief\.pdf/.test(h)) track('file_download', { file_name: 'findings-brief' });
  });

  // EmailJS (same service and templates as the previous site)
  const EMAILJS = { service:'service_lwkxats', template:'template_igi8str', key:'ocGHBFbCh69YjNwsU', to:'cindiaestheticnurse@gmail.com', briefTemplate:'template_jhitevp' };
  function sendEmail(b){
    return fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id:EMAILJS.service, template_id:EMAILJS.template, user_id:EMAILJS.key,
        template_params:{ to_email:EMAILJS.to, to_name:'Cindi', from_name:b.name||'', from_email:b.email||'', reply_to:b.email||'', phone:b.phone||'', state:b.state||'', role:b.role||'', practice_name:b.practice_name||'', interest:b.interest||'', notes:(b.notes||'') + '\n\nSent From: ' + location.pathname } }) })
      .then(r => { if (!r.ok) throw new Error('send ' + r.status); return r; });
  }
  function sendBrief(b){
    const link = new URL(ROOT + 'assets/The-Accusation-Review-Findings-Brief.pdf', location.href).href;
    return fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id:EMAILJS.service, template_id:EMAILJS.briefTemplate, user_id:EMAILJS.key,
        template_params:{ to_email:b.email, to_name:String(b.name||'').trim().split(' ')[0], brief_link:link, reply_to:EMAILJS.to, from_name:'Cindi Vokey, BSN, RN' } }) });
  }
  const STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  const st = document.getElementById('state');
  if (st) { STATES.forEach(x => st.add(new Option(x, x))); if (st.closest('#consultForm')) st.add(new Option('Multiple States','Multiple States')); }
  $$('select[data-states]').forEach(sel => { STATES.forEach(x => sel.add(new Option(x, x))); sel.add(new Option('Multiple States','Multiple States')); });

  // Mobile menu
  const mb = $('.menu-btn'), nav = $('#primary-nav'), top = $('.top');
  if (mb && nav) {
    const set = open => { top.classList.toggle('nav-open', open); mb.setAttribute('aria-expanded', String(open)); mb.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu'); };
    mb.addEventListener('click', () => set(!top.classList.contains('nav-open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && top.classList.contains('nav-open')) { set(false); mb.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) set(false); });
  }

  // Service tiles: click to highlight
  $$('.svc3').forEach(g => { const cards = g.querySelectorAll('.s3');
    cards.forEach(c => { const act = () => cards.forEach(x => x.classList.toggle('is-active', x === c));
      c.addEventListener('click', e => { if (!e.target.closest('a')) act(); }); }); });

  // Small toast
  function toast(m){ const t=$('#toast'); if(!t) return; t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3200); }

  // Contact form
  const cf = $('#consultForm');
  if (cf) {
    const q = new URLSearchParams(location.search).get('interest');
    const sel = $('#c_interest');
    if (q && sel) { if (![...sel.options].some(o => o.value === q)) sel.add(new Option(q, q), sel.options[1]); sel.value = q; }
    cf.addEventListener('submit', e => {
      e.preventDefault();
      if (!cf.checkValidity()) { cf.reportValidity(); const bad = cf.querySelector(':invalid'); bad && bad.focus(); return; }
      const d = Object.fromEntries(new FormData(cf));
      const btn = cf.querySelector('button[type=submit]'), err = $('#consultErr');
      if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
      if (err) err.hidden = true;
      sendEmail(d).then(() => {
        track('generate_lead', { form_name: 'consult', interest: d.interest || '' });
        [...cf.children].forEach(c => { if (c.id !== 'consultDone') c.hidden = true; });
        const done = $('#consultDone'); done.hidden = false; done.focus();
      }).catch(() => {
        track('form_error', { form_name: 'consult' });
        if (err) { err.hidden = false; err.focus(); } else toast('Sorry, That Didn’t Send. Please Email info@aestheticnursingpnp.com.');
      }).finally(() => { if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); } });
    });
    const again = $('#consultAgain');
    again && again.addEventListener('click', () => { cf.reset(); [...cf.children].forEach(c => c.hidden = c.id === 'consultDone'); cf.querySelector('input').focus(); });
  }

  // FAQ accordion
  const faq = $('.faq');
  if (faq) faq.addEventListener('click', e => {
    const b = e.target.closest('button[aria-controls]'); if (!b) return;
    const open = b.getAttribute('aria-expanded') !== 'true';
    faq.querySelectorAll('button[aria-controls]').forEach(x => { x.setAttribute('aria-expanded','false'); x.querySelector('.i').textContent='+'; document.getElementById(x.getAttribute('aria-controls')).hidden = true; x.closest('.faq-item').classList.remove('open'); });
    if (open) { b.setAttribute('aria-expanded','true'); b.querySelector('.i').textContent='–'; document.getElementById(b.getAttribute('aria-controls')).hidden = false; b.closest('.faq-item').classList.add('open'); }
  });
  const findings = [["No or insufficient standardized procedures / P&Ps",22],["Inadequate physician oversight or supervision",19],["No good faith exam before treatment",17],["Undercover agent posed as a patient",12],["Improper corporate structure or permit",8],["Documentation failures: charts, consent, lot numbers",8],["Patient harm: burns, infection, occlusion, paralysis",7],["Arrest or conviction for unlicensed practice",6],["Non-FDA-approved or foreign-sourced product",5],["Tasks delegated without the license for them",4]];
  const cases = [
      { id:'A', topic:'Dermal Filler', tag:'Dermal filler · RN', quote:'The Board asked for her standardized procedures. There were none to send.', happened:'A patient complained about dermal filler she said she did not want. The Board requested the nurse’s standardized procedures, policies & protocols.', found:'None could be provided. The accusation charged incompetence.', outcome:'Pending final decision', fix:'Standardized procedures, policies & protocols for dermal filler treatment, including an adverse-event protocol and a signed treatment-specific informed consent.' },
      { id:'B', topic:'Kybella', tag:'Kybella · RN', quote:'She had policies. They weren’t standardized procedures.', happened:'A patient developed a serious infection after Kybella and reported it to the Board.', found:'Gross negligence and incompetence. A national association’s policy set did not meet standardized procedure criteria. Missing physician follow-up and an incorrect lot number were also cited.', outcome:'Revoked, stayed, 3 years’ probation · $14,728 cost recovery', fix:'State-specific standardized procedures approved by the medical director, an adverse-event and follow-up protocol, and a lot-tracking log reconciled to the chart.' },
      { id:'C', topic:'Laser Hair Removal', tag:'Laser hair removal · RN', quote:'One skipped test spot.', happened:'A good faith exam was completed. Three months later, laser hair removal at an incorrect setting burned the patient.', found:'Incompetence and unprofessional conduct for failing to perform a test spot.', outcome:'Revoked, stayed, 3 years’ probation · $10,000 cost recovery', fix:'A laser standardized procedure that requires and documents a good faith exam before the first treatment, a test spot, a device-settings log, and a signed device competency.' },
      { id:'D', topic:'Out-of-State Director', tag:'Laser · out-of-state medical director', quote:'A name on a contract is not oversight.', happened:'The medical director lived in another state and oversaw four medspas. Nurses performed laser treatments without orders, supervision or exams.', found:'Gross negligence, practicing medicine without a license, and aiding and abetting: the nurse managed staff knowing supervision wasn’t happening.', outcome:'Public reproval', fix:'A medical director agreement with defined supervision duties, a chart-review log, and good faith exam records for every patient.' },
      { id:'E', topic:'Toxin & Filler', tag:'Neurotoxin and filler · RN', quote:'It started with a package at customs.', happened:'The FDA intercepted overseas fillers and neurotoxin shipped to a nurse’s home. An undercover agent then booked an appointment; the exam was done remotely.', found:'Unprofessional conduct and incompetence: non-FDA-approved products, advertising medical treatments, no standardized procedures.', outcome:'Revoked, stayed, 3 years’ probation · $18,688 cost recovery', fix:'A product sourcing and purchasing policy requiring FDA-approved products from approved vendors, with vendor sourcing confirmed and the medical director involved in decisions; a good faith exam policy; and an advertising review policy.' },
      { id:'F', topic:'Two Nurses', tag:'Two nurses, one practice · RN', quote:'The update came too late.', happened:'After an oversight complaint, the Board sent an undercover agent. An RN assessed and confirmed the plan with no physician involved. Agents seized product.', found:'Not a medical corporation, no fictitious name permit, no P&Ps. A mid-investigation update failed to meet criteria. Both nurses were charged.', outcome:'Both revoked, stayed, 3 years’ probation · $5,571 and $6,726', fix:'A corporate structure review before opening, and standardized procedures that meet state criteria from day one.' }
    ];
  const Q = ["Written standardized procedures exist for every treatment we offer, meet our state's criteria, and are signed by the medical director.","Our P&Ps were written for our state and scope, not adapted from a generic or association template.","Every patient has a documented good faith exam by a physician, NP or PA before treatment begins.","Remote or telehealth exams include a documented plan and communication with the treating nurse.","Our medical director agreement defines supervision duties, and chart reviews are logged.","Our medical director is trained in, and available for, the treatments being supervised.","Every chart includes medical history, treatment-specific consent, product, dose and correct lot number.","Laser and energy device protocols require and document test spots and settings.","Every provider has signed competencies for each treatment they perform.","Adverse events trigger a written protocol, including physician follow-up and documentation.","All products are purchased through a legitimate U.S. supply chain, under our own license.","Our corporate structure and ownership meet our state's rules.","No task is delegated to anyone without the license to perform it.","Our website and social media claims have been reviewed for advertising compliance.","If the Board requested our P&Ps today, we could send them within 24 hours."];

  // Research: findings bars
  const bars = $('#bars');
  if (bars) bars.innerHTML = findings.map(([l,n]) => `<div class="bar-row"><span>${esc(l)}</span><b>${n}</b><div class="track" role="img" aria-label="${n} of 32 cases"><i style="width:${(n/32*100).toFixed(1)}%"></i></div></div>`).join('');

  // Research: case explorer (ARIA tabs)
  const tabsEl = $('#caseTabs'), panel = $('#casePanel');
  if (tabsEl && panel) {
    let ci = 0;
    const render = focus => {
      tabsEl.innerHTML = cases.map((c,i)=>`<button type="button" role="tab" id="case-tab-${c.id}" aria-controls="casePanel" aria-selected="${i===ci}" tabindex="${i===ci?0:-1}" data-i="${i}"><small>Case ${c.id}</small><span>${esc(c.topic)}</span></button>`).join('');
      const c = cases[ci];
      panel.setAttribute('aria-labelledby','case-tab-'+c.id);
      panel.innerHTML = `<div><span class="eyebrow">Case ${c.id} · ${esc(c.tag)}</span><p class="cq">“${esc(c.quote)}”</p><dl><div><dt>What Happened</dt><dd>${esc(c.happened)}</dd></div><div><dt>What the Board Found</dt><dd>${esc(c.found)}</dd></div><div><dt>Outcome</dt><dd>${esc(c.outcome)}</dd></div></dl></div><div class="case-fix"><span class="eyebrow">The Document That Would Have Helped</span><p>${esc(c.fix)}</p><a class="btn" href="${ROOT}blueprint/">Map Your Binder →</a></div>`;
      if (focus) document.getElementById('case-tab-'+c.id).focus();
    };
    tabsEl.addEventListener('click', e => { const b=e.target.closest('button[data-i]'); if(!b) return; ci=+b.dataset.i; render(false); });
    tabsEl.addEventListener('keydown', e => { const k=e.key, L=cases.length; if(!['ArrowRight','ArrowLeft','Home','End'].includes(k)) return; e.preventDefault(); ci = k==='ArrowRight'?(ci+1)%L : k==='ArrowLeft'?(ci-1+L)%L : k==='Home'?0:L-1; render(true); });
    render(false);
  }

  // Research: self-audit
  const list = $('#auditList');
  if (list) {
    const answers = {};
    list.innerHTML = Q.map((q,i)=>`<div class="audit-item" data-q="${i}"><span class="num" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><p id="q${i}"><span class="sr">Question ${i+1}: </span>${esc(q)}</p><div class="yn" role="group" aria-labelledby="q${i}"><button type="button" data-v="yes" aria-pressed="false">Yes</button><button type="button" data-v="no" aria-pressed="false">No</button></div></div>`).join('');
    const update = () => {
      const n = Object.keys(answers).length, score = Object.values(answers).filter(Boolean).length;
      $('#answered').textContent = `${n} of 15 Answered`;
      $('#progress').style.width = (n/15*100)+'%'; $('#progressWrap').setAttribute('aria-valuenow', n);
      $('#score').textContent = score;
      const done = n === 15; $('#auditResult').classList.toggle('show', done);
      if (done) {
        $('#verdict').textContent = score>=14?'Strong. Keep It Current.':score>=10?'Solid Base, With Gaps a Surveyor Would Find.':score>=6?'Real Exposure. Several Findings From the Review Apply to You.':'High Risk. These Are the Gaps Behind Most Accusations.';
        $('#rec').textContent = score>=14?'Compliance Partner':score>=10?'Compliance Readiness Assessment':'Custom State-Specific Manual';
      }
    };
    list.addEventListener('click', e => { const b=e.target.closest('button[data-v]'); if(!b) return; const item=b.closest('.audit-item');
      answers[+item.dataset.q] = b.dataset.v==='yes'; item.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed', String(x===b))); update(); });
    $('#resetAudit').addEventListener('click', () => { for (const k in answers) delete answers[k]; list.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); update(); list.querySelector('button').focus(); });
  }

  // Research: Findings Brief modal
  const modal = $('#briefModal');
  if (modal) {
    let last = null;
    const open = e => { if(e) e.preventDefault(); last=document.activeElement; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); setTimeout(()=>{ (modal.querySelector('#briefForm:not([hidden]) input')||modal.querySelector('#briefDone')).focus(); },0); };
    const close = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); last && last.focus && last.focus(); };
    $$('[data-open-brief]').forEach(el => el.addEventListener('click', open));
    if (location.hash === '#get-brief') open();
    modal.addEventListener('click', e => { if (e.target===modal || e.target.closest('[data-close-brief]')) close(); });
    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('show')) return;
      if (e.key==='Escape') { close(); return; }
      if (e.key!=='Tab') return;
      const f=[...modal.querySelectorAll('a[href],button,input')].filter(x=>x.offsetParent!==null); if(!f.length) return;
      const first=f[0], lastEl=f[f.length-1];
      if (e.shiftKey && document.activeElement===first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement===lastEl) { e.preventDefault(); first.focus(); }
    });
    const bf = $('#briefFormEl');
    bf.addEventListener('submit', e => {
      e.preventDefault();
      if (!bf.checkValidity()) { bf.reportValidity(); return; }
      const b = Object.fromEntries(new FormData(bf));
      track('generate_lead', { form_name: 'findings_brief' });
      sendEmail({ ...b, interest:'Findings Brief Download', notes:'Requested the Accusation Review findings brief.' }).catch(()=>{});
      $('#briefName').textContent = String(b.name).trim().split(' ')[0];
      const dl=$('#briefDl'), msg=$('#briefMsg');
      const showDl = () => { dl.href = ROOT + 'assets/The-Accusation-Review-Findings-Brief.pdf'; dl.setAttribute('download',''); dl.hidden=false; msg.textContent='Your Brief Is Ready to Download.'; };
      const finish = () => { $('#briefForm').hidden=true; const d=$('#briefDone'); d.hidden=false; (dl.hidden ? d : dl).focus(); };
      sendBrief(b).then(r => { if(!r.ok) throw 0; dl.hidden=true; msg.innerHTML='The Brief Is on Its Way to <b></b>. Check Your Inbox, and Your Spam Folder If It Doesn’t Arrive in a Few Minutes.'; msg.querySelector('b').textContent=b.email; finish(); })
        .catch(() => { showDl(); finish(); });
    });
  }

  // Manual Builder: five-step intake. When online ordering is open (or for a private ?build=1
  // test link) step 5 builds the real manual on the Manual Builder server, which saves it to the
  // provider's CE-site account. Otherwise, or if the builder can't be reached, the intake is emailed
  // to Cindi exactly as before.
  const form = $('#mbForm');
  if (form) {
    let cur = 1; const N = 5;
    const steps = [...form.querySelectorAll('.step')], rail = $$('#stepper li');
    const back = $('#mbBack'), next = $('#mbNext'), count = $('#mbCount');
    const val = n => (form.elements[n] && form.elements[n].value || '').trim();
    const boxes = n => [...form.querySelectorAll(`input[name="${n}"]:checked`)];
    const checked = n => boxes(n).map(i => i.dataset.label || i.value);
    const BUILDER = form.dataset.builder, qp = new URLSearchParams(location.search);
    let buildMode = false;
    const setMode = on => {
      buildMode = on;
      form.querySelectorAll('.mb-build-only').forEach(e => e.hidden = !on);
      form.querySelectorAll('.mb-intake-only').forEach(e => e.hidden = on);
      $('#mbSubmit').textContent = on ? 'Build My Manual' : 'Submit for Review & Join the Waitlist';
    };
    if (qp.get('build') === '1') { setMode(true); $('#mbTrial').hidden = false; }
    if (BUILDER) fetch(BUILDER + '/api/config', { cache:'no-store' }).then(r => r.json()).then(c => { if (c.ordering_open) setMode(true); }).catch(()=>{});
    // Carry over Binder Blueprint selections (?state=CA&menu=neuro,ha)
    const NAMES = window.STATE_NAMES || {};
    const stc = (qp.get('state')||'').toUpperCase(); let bpMenu = [];
    if (NAMES[stc]) { const s = form.elements.state; if (s) s.value = NAMES[stc]; }
    const ids = (qp.get('menu')||'').split(',').map(s=>s.trim()).filter(Boolean), byId = {};
    (window.MENU||[]).forEach(g => (g.items||[]).forEach(i => { byId[i.id] = i.name; }));
    bpMenu = ids.map(id => byId[id]).filter(Boolean);
    ids.forEach(id => form.querySelectorAll('input[name="svc"],input[name="docs"]').forEach(b => { if (b.value.split(',').includes(id)) b.checked = true; }));
    if (ids.some(id => id === 'anc' || id.startsWith('anc-'))) form.querySelectorAll('input[name="anc"]').forEach(b => { b.checked = true; });
    if (bpMenu.length || NAMES[stc]) { const p=$('#w_picked'); p.innerHTML='<b>From Your Binder Blueprint:</b> '+(NAMES[stc]?esc(NAMES[stc])+(bpMenu.length?' · ':''):'')+bpMenu.map(esc).join(', '); p.hidden=false;
      if (ids.length) setTimeout(()=>{ $('#intake') && $('#intake').scrollIntoView({behavior:'smooth'}); }, 400); }
    const abbr = () => { const n = val('state'); return Object.keys(NAMES).find(k => NAMES[k] === n) || ''; };
    form.elements.state && form.elements.state.addEventListener('change', () => { const r = form.elements.region; if (r && !r.dataset.touched) r.value = abbr(); });
    form.elements.region && form.elements.region.addEventListener('input', e => { e.target.dataset.touched = '1'; });
    rail.forEach(li => { const b = document.createElement('button'); b.type = 'button'; b.className = 'step-btn'; while (li.firstChild) b.appendChild(li.firstChild); li.appendChild(b); });
    function draft(){
      const svc = checked('svc'), docs = checked('docs'), prov = checked('prov'), s = val('state') || 'Your State';
      const out = ['Practice Information & Medical Oversight Structure', `${s} Scope, Delegation & Supervision Summary`,
        'Blood Borne Pathogens, Universal Precautions & HIPAA',
        ...svc.map(x => `${x}: Policy, Standardized Procedure & Treatment Protocol`), ...docs,
        ...(checked('anc').length ? [`Ancillary Treatment Guidelines (Add-On, Includes All Five)`] : []),
        ...checked('addon').map(x => `Add-On: ${x} (Editable Word)`),
        'Signatures, Dates & Annual Review Log'];
      $('#outline').innerHTML = out.map(x => `<li>${esc(x)}</li>`).join('');
      const f = [];
      if (!val('state')) f.push('Select Your State So State-Specific Requirements Can Be Applied.');
      if (!val('oversight')) f.push('Medical Oversight Structure Is Missing.');
      if (/Not Sure/.test(val('oversight'))) f.push('Medical Oversight Needs Clarification During Review.');
      if (!val('owner')) f.push('Ownership Structure Is Missing.');
      if (!prov.length) f.push('Add at Least One Provider Type.');
      if (!svc.length) f.push('Select the Services You Offer.');
      if (svc.some(x => /IV|GLP|Hormone|HRT|Pellet|Vitamin/.test(x))) f.push('IV, Weight Management and Hormone Therapies Have Added State Requirements; Cindi Will Review These Individually.');
      if (prov.some(p => /Esthetician|Vocational/.test(p))) f.push('Scope for Estheticians and LVN/LPNs Varies Widely by State; Flagged for Review.');
      $('#flags').innerHTML = f.length ? f.map(x => `<li>${esc(x)}</li>`).join('') : '<li class="good"><span>No Missing Items Detected. Ready for Cindi’s Review.</span></li>';
      return f;
    }
    function go(n, focus){
      cur = Math.max(1, Math.min(N, n));
      steps.forEach(s => s.hidden = +s.dataset.s !== cur);
      rail.forEach(li => { const s=+li.dataset.s; li.classList.toggle('on', s===cur); li.classList.toggle('done', s<cur); const bt = li.querySelector('button'); if (s===cur) bt.setAttribute('aria-current','step'); else bt.removeAttribute('aria-current'); });
      back.disabled = cur === 1; next.hidden = cur === N; count.textContent = `Step ${cur} of ${N}`;
      if (cur === 4) draft();
      if (cur === 5 && form.elements.region && !form.elements.region.value) form.elements.region.value = abbr();
      if (focus) { const lg = steps[cur-1].querySelector('legend'); lg.tabIndex = -1; lg.focus({preventScroll:true}); }
      if (window.innerWidth < 900) form.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    back.onclick = () => go(cur - 1, true); next.onclick = () => go(cur + 1, true);
    rail.forEach(li => { li.querySelector('button').onclick = () => go(+li.dataset.s, true); });
    const err = $('#mbErr'), submit = $('#mbSubmit');
    const showErr = (msg, field) => { err.textContent = msg; err.hidden = !msg; if (field) { field.setAttribute('aria-invalid','true'); field.focus(); } };
    const clearErr = e => { if (e.target.getAttribute('aria-invalid')) { e.target.removeAttribute('aria-invalid'); if (!form.querySelector('[aria-invalid=true]')) showErr(''); } };
    form.addEventListener('input', clearErr); form.addEventListener('change', clearErr);
    const intakeNotes = flags => ['Manual Builder Intake (5 Steps)',
      'Ownership: ' + (val('owner')||'—'), 'Medical Oversight: ' + (val('oversight')||'—'),
      'Provider Types: ' + (checked('prov').join(', ')||'—'), 'Services: ' + (checked('svc').join(', ')||'—'),
      'Documents: ' + (checked('docs').join(', ')||'Core Documents Only'),
      'Ancillary Treatments (Add-On, Includes All Five): ' + (checked('anc').length ? 'Yes' : 'None'),
      'Add-Ons: ' + (checked('addon').join(', ')||'None'),
      bpMenu.length ? 'Binder Blueprint Menu: ' + bpMenu.join(', ') : '',
      flags.length ? 'Missing Information Flagged: ' + flags.join(' | ') : 'No Missing Items Flagged.'].filter(Boolean).join('\n');
    const sendIntake = flags => {
      submit.disabled = true;
      sendEmail({ name:val('name'), email:val('email'), phone:val('phone'), state:val('state'), practice_name:val('practice'), interest:'Manual Builder Intake + Waitlist', notes:'Also Joined the Manual Builder Waitlist.\n' + intakeNotes(flags) })
        .then(() => { track('generate_lead', { form_name: 'manual_intake' }); submit.hidden = true; const w = $('#mbWait'); if (w) w.hidden = true; const ok = $('#mbOk'); ok.hidden = false; ok.focus(); })
        .catch(() => { track('form_error', { form_name: 'manual_intake' }); showErr('Sorry, That Didn’t Send. Please Try Again or Email info@aestheticnursingpnp.com.'); })
        .finally(() => { submit.disabled = false; });
    };
    const waitBtn = $('#mbWaitBtn');
    if (waitBtn) waitBtn.onclick = () => {
      showErr('');
      const need = ['name','email'].map(n => form.elements[n]).find(i => i && (!i.value.trim() || !i.checkValidity()));
      if (need) return showErr(need.name === 'email' ? 'Please Enter a Valid Email to Join the Waitlist.' : 'Please Enter Your Name to Join the Waitlist.', need);
      waitBtn.disabled = true;
      sendEmail({ name:val('name'), email:val('email'), phone:val('phone'), state:val('state'), practice_name:val('practice'), interest:'Manual Builder Waitlist',
        notes:'Joined the Manual Builder Waitlist.\n' + intakeNotes(draft()) })
        .then(() => { track('generate_lead', { form_name: 'manual_waitlist' }); $('#mbWait').hidden = true; const ok = $('#mbWaitOk'); ok.hidden = false; ok.focus(); })
        .catch(() => { track('form_error', { form_name: 'manual_waitlist' }); showErr('Sorry, That Didn’t Send. Please Try Again or Email info@aestheticnursingpnp.com.'); })
        .finally(() => { waitBtn.disabled = false; });
    };
    const FIELD = { practice_name:'practice', medical_director:'medical_director', address1:'address1', email:'email', logo:'logo', ack:'ack', state:'state' };
    submit.onclick = async () => {
      showErr('');
      const req = [...steps[4].querySelectorAll('input[required]' + (buildMode ? ',[data-build-required]' : ''))];
      const bad = req.find(i => i.type === 'checkbox' ? !i.checked : i.type === 'file' ? !i.files.length : !i.checkValidity() || !i.value.trim());
      if (bad) {
        const lbl = bad.name === 'ack' ? 'Please Confirm the Review Acknowledgment.' : bad.name === 'logo' ? 'Please Upload Your Practice Logo.' : 'Please Complete the Highlighted Field.';
        showErr(lbl, bad); return;
      }
      const flags = draft();
      if (!buildMode) return sendIntake(flags);
      if (!val('state')) { go(1, true); showErr(''); form.elements.state.setAttribute('aria-invalid','true'); form.elements.state.focus(); return; }
      const lg = form.elements.logo.files[0];
      if (lg && lg.size > 5 * 1024 * 1024) return showErr('Logo Must Be 5 MB or Smaller.', form.elements.logo);
      const menu = [...new Set(['bbp','up','hipaa', ...boxes('svc').map(b => b.value), ...boxes('docs').flatMap(b => b.value.split(',')), ...(boxes('anc').length ? ['anc'] : [])])];
      const fd = new FormData();
      Object.entries({ practice_name:val('practice'), buyer_name:val('name'), email:val('email'), phone:val('phone'), medical_director:val('medical_director'),
        provider_name:val('provider_name'), address1:val('address1'), address2:val('address2'), city:val('city'), region:val('region'), zip:val('zip'),
        state:val('state'), trial_code:val('trial_code'), ack:'1', cover:'classic', menu:menu.join(','), owner:val('owner'), oversight:val('oversight'),
        providers:checked('prov').join(', '), services:checked('svc').join(', '), documents:[...checked('docs'), ...checked('anc').map(x => 'Ancillary Add-On: ' + x), ...checked('addon').map(x => 'Add-On: ' + x)].join(', '), flags:flags.join(' | ') })
        .forEach(([k, v]) => fd.append(k, v));
      fd.append('logo', lg);
      submit.disabled = true; submit.setAttribute('aria-busy','true'); submit.textContent = 'Building Your Manual…';
      const reset = () => { submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = 'Build My Manual'; };
      let r, d = {};
      try { r = await fetch(BUILDER + '/api/order', { method:'POST', body:fd }); d = await r.json().catch(() => ({})); }
      catch (e) { reset(); return sendIntake(flags); }
      if (r.status === 400 && d.errors) {
        reset(); const [k, msg] = Object.entries(d.errors)[0];
        const f = form.elements[FIELD[k] || k]; if (k === 'state') go(1, false);
        return showErr(msg, f);
      }
      if (!r.ok || d.checkout_url) {
        if (!r.ok && val('trial_code')) { reset(); return showErr(d.error || 'Private Trial Was Not Authorized. Check the Email and Access Code.'); }
        if (d.checkout_url) { location.href = d.checkout_url; return; }
        reset(); return sendIntake(flags);
      }
      submit.hidden = true; track('purchase_manual_order', { status: d.status || '' });
      const done = $('#mbBuilt'), msg = $('#mbBuiltMsg');
      if (d.dashboard) $('#mbDash').href = d.dashboard;
      msg.textContent = d.status === 'fulfilled'
        ? `Serial #${d.serial || ''}. We Emailed ${val('email')} a Link to Sign In (or Set Your Password) at Aesthetic Nursing CEs, Where the Manual Is Saved Under My Manuals.`
        : 'Your Order Was Received. Cindi Has Been Notified and Will Email You When the Manual Is Ready.';
      done.hidden = false; done.focus();
    };
  }

  // Free Compliance Readiness Checklist: emailed from info@ by the Manual Builder server,
  // with an instant download either way.
  const CHECKLIST_PDF = ROOT + 'assets/Med-Spa-Compliance-Readiness-Checklist.pdf';
  const CHECKLIST_API = 'https://anps-manual-builder.onrender.com/api/checklist';
  const clModal = $('#checklistModal');
  if (clModal) {
    let last = null;
    const open = e => { if (e) e.preventDefault(); last = document.activeElement; clModal.classList.add('show'); clModal.setAttribute('aria-hidden','false'); setTimeout(() => { (clModal.querySelector('form:not([hidden]) input') || clModal.querySelector('[tabindex="-1"]:not([hidden])')).focus(); }, 0); track('checklist_open', {}); };
    const close = () => { clModal.classList.remove('show'); clModal.setAttribute('aria-hidden','true'); last && last.focus && last.focus(); };
    $$('[data-open-checklist]').forEach(el => el.addEventListener('click', open));
    clModal.addEventListener('click', e => { if (e.target === clModal || e.target.closest('[data-close-checklist]')) close(); });
    document.addEventListener('keydown', e => { if (clModal.classList.contains('show') && e.key === 'Escape') close(); });
    if (location.hash === '#get-checklist') open();
  }
  $$('form[data-checklist-form]').forEach(fm => {
    const box = fm.closest('[data-checklist-box]') || fm.parentElement;
    fm.addEventListener('submit', e => {
      e.preventDefault();
      if (!fm.checkValidity()) { fm.reportValidity(); const bad = fm.querySelector(':invalid'); bad && bad.focus(); return; }
      const b = Object.fromEntries(new FormData(fm));
      const btn = fm.querySelector('button[type=submit]'); btn.disabled = true; btn.setAttribute('aria-busy','true');
      const done = box.querySelector('[data-checklist-done]'), msg = done.querySelector('[data-checklist-msg]'), dl = done.querySelector('a[data-checklist-dl]');
      dl.href = CHECKLIST_PDF; dl.setAttribute('download', '');
      done.querySelector('[data-checklist-name]').textContent = String(b.name).trim().split(' ')[0];
      const finish = emailed => {
        track('generate_lead', { form_name: 'compliance_checklist', emailed: emailed ? 'yes' : 'no' });
        if (emailed) { msg.innerHTML = 'We Also Emailed a Copy to <b></b> From info@aestheticnursingpnp.com. Check Your Spam Folder If It Doesn’t Arrive in a Few Minutes.'; msg.querySelector('b').textContent = b.email; }
        else msg.textContent = 'Your Checklist Is Ready to Download.';
        fm.hidden = true; const intro = box.querySelector('[data-checklist-intro]'); if (intro) intro.hidden = true;
        done.hidden = false; dl.focus();
      };
      fetch(CHECKLIST_API, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name:b.name, email:b.email, state:b.state||'', role:b.role||'', website:b.website||'', page:location.pathname }) })
        .then(r => r.json().then(d => ({ r, d })))
        .then(({ r, d }) => { if (!r.ok) throw new Error(d.error || r.status); finish(!!d.emailed); })
        .catch(() => {
          // Server not reachable: still give the file, and tell Cindi by EmailJS.
          sendEmail({ name:b.name, email:b.email, state:b.state||'', role:b.role||'', interest:'Compliance Readiness Checklist', notes:'Downloaded the Compliance Readiness Checklist.' }).catch(()=>{});
          finish(false);
        })
        .finally(() => { btn.disabled = false; btn.removeAttribute('aria-busy'); });
    });
  });

  // Reviews page: website testimonial form
  const tf = $('#testimonialForm');
  if (tf) {
    tf.addEventListener('submit', e => {
      e.preventDefault();
      if (!tf.checkValidity()) { tf.reportValidity(); const bad = tf.querySelector(':invalid'); bad && bad.focus(); return; }
      const d = Object.fromEntries(new FormData(tf));
      if (d.website) return;
      const btn = tf.querySelector('button[type=submit]'), err = $('#tfErr'); btn.disabled = true; err.hidden = true;
      sendEmail({ name:d.name, email:d.email, state:d.state, role:d.credential, practice_name:d.practice||'', interest:'Website Testimonial',
        notes:['Testimonial:', d.testimonial, '', 'Display As: ' + d.display, 'Permission to Publish on the Website: Yes (checked)', 'Credential/Role: ' + (d.credential||'—'), 'Practice: ' + (d.practice||'—')].join('\n') })
        .then(() => { track('generate_lead', { form_name: 'testimonial' }); tf.hidden = true; const ok = $('#tfOk'); ok.hidden = false; ok.focus(); })
        .catch(() => { track('form_error', { form_name: 'testimonial' }); err.hidden = false; err.focus(); })
        .finally(() => { btn.disabled = false; });
    });
  }

})();

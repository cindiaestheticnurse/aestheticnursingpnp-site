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

  // EmailJS (same service and templates as the previous site)
  const EMAILJS = { service:'service_lwkxats', template:'template_igi8str', key:'ocGHBFbCh69YjNwsU', to:'cindiaestheticnurse@gmail.com', briefTemplate:'template_jhitevp' };
  function sendEmail(b){
    return fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id:EMAILJS.service, template_id:EMAILJS.template, user_id:EMAILJS.key,
        template_params:{ to_email:EMAILJS.to, to_name:'Cindi', from_name:b.name||'', from_email:b.email||'', phone:b.phone||'', state:b.state||'', role:b.role||'', practice_name:b.practice_name||'', interest:b.interest||'', notes:b.notes||'' } }) });
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
      sendEmail(d).catch(()=>{});
      [...cf.children].forEach(c => { if (c.id !== 'consultDone') c.hidden = true; });
      const done = $('#consultDone'); done.hidden = false; done.focus();
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
      sendEmail({ ...b, interest:'Findings Brief Download', notes:'Requested the Accusation Review findings brief.' }).catch(()=>{});
      $('#briefName').textContent = String(b.name).trim().split(' ')[0];
      const dl=$('#briefDl'), msg=$('#briefMsg');
      const showDl = () => { dl.href = ROOT + 'assets/The-Accusation-Review-Findings-Brief.pdf'; dl.setAttribute('download',''); dl.hidden=false; msg.textContent='Your Brief Is Ready to Download.'; };
      const finish = () => { $('#briefForm').hidden=true; const d=$('#briefDone'); d.hidden=false; (dl.hidden ? d : dl).focus(); };
      sendBrief(b).then(r => { if(!r.ok) throw 0; dl.hidden=true; msg.innerHTML='The Brief Is on Its Way to <b></b>. Check Your Inbox, and Your Spam Folder If It Doesn’t Arrive in a Few Minutes.'; msg.querySelector('b').textContent=b.email; finish(); })
        .catch(() => { showDl(); finish(); });
    });
  }

  // Manual Builder: five-step intake
  const form = $('#mbForm');
  if (form) {
    let cur = 1; const N = 5;
    const steps = [...form.querySelectorAll('.step')], rail = $$('#stepper li');
    const back = $('#mbBack'), next = $('#mbNext'), count = $('#mbCount');
    const val = n => (form.elements[n] && form.elements[n].value) || '';
    const checked = n => [...form.querySelectorAll(`input[name="${n}"]:checked`)].map(i => i.value);
    // Carry over Binder Blueprint selections (?state=CA&menu=neuro,ha)
    const NAMES = window.STATE_NAMES || {}, qp = new URLSearchParams(location.search);
    const stc = (qp.get('state')||'').toUpperCase(); let bpMenu = [];
    if (NAMES[stc]) { const s = form.elements.state; if (s) s.value = NAMES[stc]; }
    const ids = (qp.get('menu')||'').split(',').map(s=>s.trim()).filter(Boolean), byId = {};
    (window.MENU||[]).forEach(g => (g.items||[]).forEach(i => { byId[i.id] = i.name; }));
    bpMenu = ids.map(id => byId[id]).filter(Boolean);
    if (bpMenu.length || NAMES[stc]) { const p=$('#w_picked'); p.innerHTML='<b>From Your Binder Blueprint:</b> '+(NAMES[stc]?esc(NAMES[stc])+(bpMenu.length?' · ':''):'')+bpMenu.map(esc).join(', '); p.hidden=false;
      if (ids.length) setTimeout(()=>{ $('#intake') && $('#intake').scrollIntoView({behavior:'smooth'}); }, 400); }
    rail.forEach(li => { const b = document.createElement('button'); b.type = 'button'; b.className = 'step-btn'; while (li.firstChild) b.appendChild(li.firstChild); li.appendChild(b); });
    function draft(){
      const svc = checked('svc'), docs = checked('docs'), prov = checked('prov'), s = val('state') || 'Your State';
      const out = ['Practice Information & Medical Oversight Structure', `${s} Scope, Delegation & Supervision Summary`,
        ...docs.filter(d => !/Protocols|Consent|Competency/.test(d)),
        ...svc.map(x => `${x.replace(/&amp;/g,'&')}: ${docs.filter(d => /Protocols|Consent|Competency|Standardized/.test(d)).join(', ') || 'Select Documents'}`),
        'Signatures, Dates & Annual Review Log'];
      $('#outline').innerHTML = out.map(x => `<li>${esc(x)}</li>`).join('');
      const f = [];
      if (!val('state')) f.push('Select Your State So State-Specific Requirements Can Be Applied.');
      if (!val('oversight')) f.push('Medical Oversight Structure Is Missing.');
      if (/Not Sure/.test(val('oversight'))) f.push('Medical Oversight Needs Clarification During Review.');
      if (!val('owner')) f.push('Ownership Structure Is Missing.');
      if (!prov.length) f.push('Add at Least One Provider Type.');
      if (!svc.length) f.push('Select the Services You Offer.');
      if (svc.some(x => /IV|GLP|Weight/.test(x))) f.push('IV Therapy and Weight Management Have Added State Requirements; Cindi Will Review These Individually.');
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
      if (focus) { const lg = steps[cur-1].querySelector('legend'); lg.tabIndex = -1; lg.focus({preventScroll:true}); }
      if (window.innerWidth < 900) form.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    back.onclick = () => go(cur - 1, true); next.onclick = () => go(cur + 1, true);
    rail.forEach(li => { li.querySelector('button').onclick = () => go(+li.dataset.s, true); });
    $('#mbSubmit').onclick = () => {
      const req = [...steps[4].querySelectorAll('input[required]')];
      const bad = req.find(i => !i.checkValidity());
      if (bad) { bad.reportValidity(); bad.focus(); return; }
      const flags = draft();
      const notes = ['Manual Builder Intake (5 Steps)',
        'Ownership: ' + (val('owner')||'—'), 'Medical Oversight: ' + (val('oversight')||'—'),
        'Provider Types: ' + (checked('prov').join(', ')||'—'), 'Services: ' + (checked('svc').map(x=>x.replace(/&amp;/g,'&')).join(', ')||'—'),
        'Documents: ' + (checked('docs').map(x=>x.replace(/&amp;/g,'&')).join(', ')||'—'),
        bpMenu.length ? 'Binder Blueprint Menu: ' + bpMenu.join(', ') : '',
        flags.length ? 'Missing Information Flagged: ' + flags.join(' | ') : 'No Missing Items Flagged.'].filter(Boolean).join('\n');
      sendEmail({ name:val('name'), email:val('email'), phone:val('phone'), state:val('state'), practice_name:val('practice'), interest:'Manual Builder Intake', notes }).catch(()=>{});
      $('#mbSubmit').hidden = true; const ok = $('#mbOk'); ok.hidden = false; ok.focus();
    };
  }
})();

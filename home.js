(function(){
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // Form delivery (EmailJS). Recipient corrected to the real inbox.
  const EMAILJS = { service: 'service_lwkxats', template: 'template_igi8str', key: 'ocGHBFbCh69YjNwsU', to: 'cindiaestheticnurse@gmail.com',
    // Brief delivery template (sends the PDF link to the requester). Paste the new EmailJS template ID here.
    // While empty, the site falls back to an on-screen download after the form is completed.
    briefTemplate: 'template_jhitevp' };
  function sendBrief(b){
    const link = new URL('assets/The-Accusation-Review-Findings-Brief.pdf', location.href).href;
    return fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.briefTemplate, user_id: EMAILJS.key,
        template_params: { to_email: b.email, to_name: String(b.name||'').trim().split(' ')[0], brief_link: link, reply_to: EMAILJS.to, from_name: 'Cindi Vokey, BSN, RN' } }) });
  }
  function sendEmail(b){
    return fetch('https://api.emailjs.com/api/v1.0/email/send', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key,
        template_params: { to_email: EMAILJS.to, to_name: 'Cindi', from_name: b.name||'', from_email: b.email||'', phone: b.phone||'', state: b.state||'', role: b.role||'', practice_name: b.practice_name||'', interest: b.interest||'', notes: b.notes||'' } }) }).catch(()=>{});
  }
  function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }

  // Findings bars
  const findings = [["No or insufficient standardized procedures / P&Ps",22],["Inadequate physician oversight or supervision",19],["No good faith exam before treatment",17],["Undercover agent posed as a patient",12],["Improper corporate structure or permit",8],["Documentation failures: charts, consent, lot numbers",8],["Patient harm: burns, infection, occlusion, paralysis",7],["Arrest or conviction for unlicensed practice",6],["Non-FDA-approved or foreign-sourced product",5],["Tasks delegated without the license for them",4]];
  $('#bars').innerHTML = findings.map(([l,n]) => `<div class="bar-row"><span>${esc(l)}</span><b>${n}</b><div class="track" role="img" aria-label="${n} of 32 cases"><i style="width:${(n/32*100).toFixed(1)}%"></i></div></div>`).join('');

  // Cases
  const cases = [
    { id:'A', topic:'Dermal Filler', tag:'Dermal filler · RN', quote:'The Board asked for her standardized procedures. There were none to send.', happened:'A patient complained about dermal filler she said she did not want. The Board requested the nurse’s standardized procedures, policies & protocols.', found:'None could be provided. The accusation charged incompetence.', outcome:'Pending final decision', fix:'Standardized procedures, policies & protocols for dermal filler treatment, including an adverse-event protocol and a signed treatment-specific informed consent.' },
    { id:'B', topic:'Kybella', tag:'Kybella · RN', quote:'She had policies. They weren’t standardized procedures.', happened:'A patient developed a serious infection after Kybella and reported it to the Board.', found:'Gross negligence and incompetence. A national association’s policy set did not meet standardized procedure criteria. Missing physician follow-up and an incorrect lot number were also cited.', outcome:'Revoked, stayed, 3 years’ probation · $14,728 cost recovery', fix:'State-specific standardized procedures approved by the medical director, an adverse-event and follow-up protocol, and a lot-tracking log reconciled to the chart.' },
    { id:'C', topic:'Laser Hair Removal', tag:'Laser hair removal · RN', quote:'One skipped test spot.', happened:'A good faith exam was completed. Three months later, laser hair removal at an incorrect setting burned the patient.', found:'Incompetence and unprofessional conduct for failing to perform a test spot.', outcome:'Revoked, stayed, 3 years’ probation · $10,000 cost recovery', fix:'A laser standardized procedure that requires and documents a good faith exam before the first treatment, a test spot, a device-settings log, and a signed device competency.' },
    { id:'D', topic:'Out-of-State Director', tag:'Laser · out-of-state medical director', quote:'A name on a contract is not oversight.', happened:'The medical director lived in another state and oversaw four medspas. Nurses performed laser treatments without orders, supervision or exams.', found:'Gross negligence, practicing medicine without a license, and aiding and abetting: the nurse managed staff knowing supervision wasn’t happening.', outcome:'Public reproval', fix:'A medical director agreement with defined supervision duties, a chart-review log, and good faith exam records for every patient.' },
    { id:'E', topic:'Toxin & Filler', tag:'Neurotoxin and filler · RN', quote:'It started with a package at customs.', happened:'The FDA intercepted overseas fillers and neurotoxin shipped to a nurse’s home. An undercover agent then booked an appointment; the exam was done remotely.', found:'Unprofessional conduct and incompetence: non-FDA-approved products, advertising medical treatments, no standardized procedures.', outcome:'Revoked, stayed, 3 years’ probation · $18,688 cost recovery', fix:'A product sourcing and purchasing policy requiring FDA-approved products from approved vendors, with vendor sourcing confirmed and the medical director involved in decisions; a good faith exam policy; and an advertising review policy.' },
    { id:'F', topic:'Two Nurses', tag:'Two nurses, one practice · RN', quote:'The update came too late.', happened:'After an oversight complaint, the Board sent an undercover agent. An RN assessed and confirmed the plan with no physician involved. Agents seized product.', found:'Not a medical corporation, no fictitious name permit, no P&Ps. A mid-investigation update failed to meet criteria. Both nurses were charged.', outcome:'Both revoked, stayed, 3 years’ probation · $5,571 and $6,726', fix:'A corporate structure review before opening, and standardized procedures that meet state criteria from day one.' }
  ];
  let ci = 0;
  const tabsEl = $('#caseTabs'), panel = $('#casePanel');
  function renderCase(focus){
    tabsEl.innerHTML = cases.map((c,i)=>`<button role="tab" id="case-tab-${c.id}" aria-controls="casePanel" aria-selected="${i===ci}" tabindex="${i===ci?0:-1}" data-i="${i}"><small>Case ${c.id}</small><span>${esc(c.topic)}</span></button>`).join('');
    const c = cases[ci];
    panel.setAttribute('aria-labelledby','case-tab-'+c.id);
    panel.innerHTML = `<div><span class="eyebrow">Case ${c.id} · ${esc(c.tag)}</span><q>${esc(c.quote)}</q><dl><div><dt>What happened</dt><dd>${esc(c.happened)}</dd></div><div><dt>What the Board found</dt><dd>${esc(c.found)}</dd></div><div><dt>Outcome</dt><dd>${esc(c.outcome)}</dd></div></dl></div><div class="case-fix"><span class="eyebrow">The document that would have helped</span><p style="margin:0">${esc(c.fix)}</p><a class="btn" style="margin-top:1.1rem" href="blueprint/">Map your binder →</a></div>`;
    panel.style.animation='none'; panel.offsetHeight; panel.style.animation='';
    if(focus) document.getElementById('case-tab-'+c.id).focus();
  }
  tabsEl.addEventListener('click', e => { const b=e.target.closest('button[data-i]'); if(!b) return; ci=+b.dataset.i; renderCase(false); });
  tabsEl.addEventListener('keydown', e => { const k=e.key, L=cases.length; if(!['ArrowRight','ArrowLeft','Home','End'].includes(k)) return; e.preventDefault(); ci = k==='ArrowRight'?(ci+1)%L : k==='ArrowLeft'?(ci-1+L)%L : k==='Home'?0:L-1; renderCase(true); });
  renderCase(false);

  // Self-audit
  const Q = ["Written standardized procedures exist for every treatment we offer, meet our state's criteria, and are signed by the medical director.","Our P&Ps were written for our state and scope, not adapted from a generic or association template.","Every patient has a documented good faith exam by a physician, NP or PA before treatment begins.","Remote or telehealth exams include a documented plan and communication with the treating nurse.","Our medical director agreement defines supervision duties, and chart reviews are logged.","Our medical director is trained in, and available for, the treatments being supervised.","Every chart includes medical history, treatment-specific consent, product, dose and correct lot number.","Laser and energy device protocols require and document test spots and settings.","Every provider has signed competencies for each treatment they perform.","Adverse events trigger a written protocol, including physician follow-up and documentation.","All products are purchased through a legitimate U.S. supply chain, under our own license.","Our corporate structure and ownership meet our state's rules.","No task is delegated to anyone without the license to perform it.","Our website and social media claims have been reviewed for advertising compliance.","If the Board requested our P&Ps today, we could send them within 24 hours."];
  const answers = {};
  const list = $('#auditList');
  list.innerHTML = Q.map((q,i)=>`<div class="audit-item" data-q="${i}"><span class="num">${String(i+1).padStart(2,'0')}</span><p id="q${i}">${esc(q)}</p><div class="yn" role="group" aria-labelledby="q${i}"><button type="button" data-v="yes" aria-pressed="false">Yes</button><button type="button" data-v="no" aria-pressed="false">No</button></div></div>`).join('');
  function updateAudit(){
    const n = Object.keys(answers).length, score = Object.values(answers).filter(Boolean).length;
    $('#answered').textContent = `${n} of 15 answered`;
    $('#progress').style.width = (n/15*100)+'%';
    $('#score').textContent = score;
    const done = n===15;
    $('#auditResult').classList.toggle('show', done);
    if(done){
      $('#verdict').textContent = score>=14?'Strong. Keep it current.':score>=10?'Solid base, with gaps a surveyor would find.':score>=6?'Real exposure. Several findings from the Review apply to you.':'High risk. These are the gaps behind most accusations.';
      $('#rec').textContent = score>=14?'Compliance Partner':score>=10?'Compliance Readiness Audit':'Custom State-Specific Manual';
    }
  }
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-v]'); if(!b) return;
    const item = b.closest('.audit-item'), i = +item.dataset.q;
    answers[i] = b.dataset.v==='yes';
    item.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
    updateAudit();
  });
  $('#resetAudit').addEventListener('click', ()=>{ for(const k in answers) delete answers[k]; list.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); updateAudit(); });

  // FAQ
  const F = [["Is this legal advice?","No. This is clinical compliance consulting and education. For ownership structure, contracts and legal opinions, I work alongside your healthcare attorney."],["Do you work in my state?","Yes. Every manual is researched against your state's medical, nursing and pharmacy board rules."],["How long does a custom manual take?","Most single-location manuals are delivered in three to six weeks, depending on your treatment modules and how quickly documents come back."],["Will you work with my medical director?","Yes, and I strongly recommend it. Your medical director reviews and signs protocols, and the manual documents their oversight."],["I already bought a template. Is that enough?","A template is a starting point. In the Review, generic and association policy sets failed to meet standardized procedure criteria. The Readiness Audit shows what needs to change."]];
  const faq = $('#faq');
  faq.innerHTML = F.map(([q,a],i)=>`<div class="faq-item"><button type="button" aria-expanded="false" aria-controls="fa${i}"><span>${esc(q)}</span><span class="i" aria-hidden="true">+</span></button><div class="a" id="fa${i}">${esc(a)}</div></div>`).join('');
  faq.addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    const item = b.parentElement, open = !item.classList.contains('open');
    faq.querySelectorAll('.faq-item').forEach(x=>{ x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded','false'); x.querySelector('.i').textContent='+'; });
    if(open){ item.classList.add('open'); b.setAttribute('aria-expanded','true'); b.querySelector('.i').textContent='–'; }
  });

  // Contact form
  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Multiple states'];
  $('#c_state').insertAdjacentHTML('beforeend', states.map(s=>`<option>${s}</option>`).join(''));
  const interests = ['Not sure yet','Compliance Readiness Audit','Custom State-Specific Manual','Compliance Partner','Growth-Ready: Expansion & Acquisition','Licensing & Probation Support','RN-to-Owner Accelerator','Practice Team Pass (CE)','Self-audit follow-up'];
  $('#c_interest').innerHTML = interests.map(s=>`<option>${esc(s)}</option>`).join('');
  document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>{ $('#c_interest').value = a.dataset.interest; }));
  const form = $('#consultForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(form));
    sendEmail(d);
    form.hidden = true; const done=$('#consultDone'); done.classList.add('show'); done.focus();
  });
  $('#consultAgain').addEventListener('click', ()=>{ form.reset(); form.hidden=false; $('#consultDone').classList.remove('show'); });

  // Brief modal
  const modal = $('#briefModal'); let lastFocus = null;
  function openBrief(e){ if(e) e.preventDefault(); lastFocus=document.activeElement; modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); setTimeout(()=>{ (modal.querySelector('#briefForm:not([hidden]) input')||modal.querySelector('#briefDone a')).focus(); },0); }
  function closeBrief(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); lastFocus && lastFocus.focus && lastFocus.focus(); }
  document.querySelectorAll('[data-open-brief]').forEach(el=>el.addEventListener('click', openBrief));
  modal.addEventListener('click', e=>{ if(e.target===modal || e.target.closest('[data-close-brief]')) closeBrief(); });
  document.addEventListener('keydown', e=>{
    if(!modal.classList.contains('show')) return;
    if(e.key==='Escape'){ closeBrief(); return; }
    if(e.key!=='Tab') return;
    const f=[...modal.querySelectorAll('a[href],button,input')].filter(x=>x.offsetParent!==null); if(!f.length) return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  });
  const bf = $('#briefFormEl');
  bf.addEventListener('submit', e=>{
    e.preventDefault();
    if(!bf.checkValidity()){ bf.reportValidity(); return; }
    const b = Object.fromEntries(new FormData(bf));
    sendEmail({ ...b, interest:'Findings brief download', notes:'Requested the Accusation Review findings brief.' });
    $('#briefName').textContent = String(b.name).trim().split(' ')[0];
    const dl=$('#briefDl'), msg=$('#briefMsg');
    const showDownload = ()=>{ dl.href='assets/The-Accusation-Review-Findings-Brief.pdf'; dl.setAttribute('download',''); dl.hidden=false; msg.textContent='Your Brief Is Ready to Download.'; };
    const finish = ()=>{ $('#briefForm').hidden = true; const d=$('#briefDone'); d.hidden=false; (dl.hidden ? d : dl).focus(); };
    if(EMAILJS.briefTemplate){
      sendBrief(b).then(r=>{ if(!r.ok) throw 0;
        dl.hidden=true; msg.innerHTML='The Brief Is on Its Way to <b></b>. Check Your Inbox, and Your Spam Folder If It Doesn\'t Arrive in a Few Minutes.';
        msg.querySelector('b').textContent=b.email; finish();
      }).catch(()=>{ showDownload(); finish(); });
    } else { showDownload(); finish(); }
  });
})();

/* CE intro paragraph begins on the heading's second line */
(function(){
  const head=document.querySelector('#education .section-head'); if(!head) return;
  const em=head.querySelector('h2 em'), p=head.querySelector(':scope > p');
  function align(){
    p.style.marginTop='0';
    if(window.innerWidth<=900) return;
    const off=em.getClientRects()[0].top - p.getBoundingClientRect().top;
    p.style.marginTop=Math.max(0,Math.round(off+6))+'px';
  }
  (document.fonts?document.fonts.ready:Promise.resolve()).then(align);
  window.addEventListener('resize',align);
})();

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const INJ_IDS = MENU.find(g => g.group === "Aesthetic injectables").items.map(i => i.id);
  const GENERAL = MENU.find(g => g.locked).items;
  const EMERG = MENU.find(g => g.auto).items;

  /* ---------------- state ---------------- */
  const S = {
    step: 0, state: "", role: "", lic: [], loc: "", menu: new Set(), audit: {}, goal: "", timing: "",
    kw: "", utm: {}, contact: { name: "", email: "", note: "" }, sent: false
  };

  /* ---------------- prefill from DM links: #kw=BINDER&state=TX&utm_source=instagram ---------------- */
  (function prefill() {
    const raw = (location.hash.includes("=") ? location.hash.slice(1) : "") || location.search.slice(1);
    if (!raw) return;
    const p = new URLSearchParams(raw);
    const st = (p.get("state") || "").toUpperCase();
    if (STATE_NAMES[st]) S.state = st;
    ["utm_source", "utm_medium", "utm_campaign"].forEach(k => p.get(k) && (S.utm[k] = p.get(k)));
    const kw = (p.get("kw") || "").toUpperCase();
    if (KEYWORDS[kw]) {
      S.kw = kw;
      const pf = KEYWORDS[kw].prefill;
      if (pf.goal) S.goal = pf.goal;
      if (pf.loc) S.loc = pf.loc;
      (pf.menu || []).forEach(m => S.menu.add(m));
      const b = $("#kwBanner");
      b.innerHTML = `You came in from the <b>${kw}</b> keyword. Your free asset, "${esc(KEYWORDS[kw].asset)}", is on its way in the DM. This blueprint picks up where it leaves off${S.state ? `, already set to ${esc(STATE_NAMES[S.state])}` : ""}.`;
      b.classList.add("show");
    }
  })();

  /* ---------------- derived ---------------- */
  const hasInj = () => INJ_IDS.some(id => S.menu.has(id));
  // shared with the State manuals tab and the Manual Builder: the picked state + menu ids
  window.BLUEPRINT = () => ({ state: S.state, menu: [...S.menu] });
  const builderLink = () => "https://builder.aestheticnursingpnp.com/?" + new URLSearchParams(Object.assign(S.state && S.state !== "MULTI" ? { state: S.state } : {}, { menu: [...S.menu].join(",") })).toString();
  const tabCount = () => GENERAL.length + S.menu.size + (hasInj() ? EMERG.filter(e => !S.menu.has(e.id)).length : 0);
  const itemById = (id) => { for (const g of MENU) { const f = g.items.find(i => i.id === id); if (f) return f; } };
  const modules = () => [...new Set([...S.menu].map(id => itemById(id)?.module).filter(Boolean))];

  function ceStatus(code) {
    if (code === "MULTI") return { status: "Multiple boards", cls: "warn", hours: "Varies by state", line: "Each state's board applies to the nurses licensed there." };
    const n = STATE_NAMES[code];
    const h = CE.NOREQ.includes(code) ? "No required CE" : (CE.HRS[code] || "See board");
    if (CE.NO.includes(code)) return { status: "CA BRN CE not accepted", cls: "warn", hours: h, line: `${n} lists specific national or in-state approvers. California BRN approval alone doesn't count there. ANCC-accredited courses are the safer route.` };
    if (CE.CHECK.includes(code)) return { status: "Check first", cls: "warn", hours: h, line: `${n} is conditional. The rule is unclear or the sources conflict. Confirm with the board before you count a course.` };
    if (code === "CA") return { status: "Home board", cls: "accent", hours: h, line: "California: 30 contact hours every two years, from a BRN provider or a nationally accredited one. Every course on aestheticnursingces.com is from CA BRN Provider #18009." };
    if (CE.NOREQ.includes(code)) return { status: "CE not required", cls: "", hours: h, line: `${n} doesn't require CE for routine RN renewal. If you hold another license, that state's rule applies.` };
    return { status: "Accepts CA BRN CE", cls: "ok", hours: h, line: `${n} accepts CE from California BRN providers. Renewal: ${h}. Some mandated topics may need an in-state course.` };
  }

  const auditAns = (id) => S.audit[id]; // "yes" | "no" | "unsure"
  const gaps = () => AUDIT.filter(q => auditAns(q.id) && auditAns(q.id) !== "yes");
  const readiness = () => {
    const tot = AUDIT.reduce((a, q) => a + q.weight, 0);
    const got = AUDIT.filter(q => auditAns(q.id) === "yes").reduce((a, q) => a + q.weight, 0);
    return { pct: Math.round(got / tot * 100), yes: AUDIT.filter(q => auditAns(q.id) === "yes").length };
  };

  /* ---------------- flags: only facts that exist in data.js ---------------- */
  function flags() {
    const F = []; const st = S.state; const lic = S.lic; const d = DEEP[st];
    const add = (level, title, text, src) => F.push({ level, title, text, src });
    if (st === "MULTI") add("warn", "More than one board", "Each state reads your binder against its own rules. Multi-state practices need one harmonized manual with state-specific pages.", "Growth-Ready scope, redesign");
    else if (!d && st) add("", `${STATE_NAMES[st]} isn't in the 23-state deep review yet`, "The CE line below is from the 51-jurisdiction board-site review. Scope, supervision and ownership for your state are confirmed against your board during the audit, not guessed here.", "Keyword Map · TVGA Method");
    if (st === "CA") add("alert", "Good faith exam comes first", "An RN may inject only under physician-signed standardized procedures, after a good faith exam by a physician, NP or PA. The RN cannot perform the exam or issue the order.", "Keyword Map, Sept 2026 · CA BRN NPR-B-20");
    if (st === "TX" && S.menu.has("iv")) add("alert", "Jenifer's Law applies to your IV menu", "Elective IV therapy outside a licensed facility must be ordered by a physician, APRN or PA and given by an RN or above (HB 3749, effective Sept 1, 2025). TMB Rule 169.28 requires all delegation in writing.", "Keyword Map · Polsinelli");
    if (st === "TX" && S.menu.has("iv") && lic.includes("LVN / LPN")) add("alert", "LVNs on an elective IV schedule", "Under Jenifer's Law, LVNs can't give elective IV therapy outside a licensed facility. Check who is on the IV schedule.", "Keyword Map · Polsinelli");
    if (st === "NJ" && lic.includes("NP") && hasInj()) add("alert", "Aesthetic APNs keep the joint protocol", "S2996 (signed March 30, 2026) removed the joint protocol for many experienced APNs but kept it for APNs providing elective aesthetic or cosmetic services.", "Keyword Map, Sept 2026");
    if (st === "IL" && (S.role === "planning" || S.role === "owner") && !lic.includes("MD / DO")) add("alert", "Ownership in Illinois", "Under an October 2025 IDFPR/IDPH memo, med spa ownership sits with physicians or full-practice APRNs, not RNs.", "Keyword Map, Sept 2026");
    if ((st === "MO" || st === "UT") && (S.role === "planning" || S.role === "owner")) add("ok", "One of the more relaxed ownership states", "Non-physicians may own the business, with a physician medical director overseeing clinical work.", "Keyword Map, Sept 2026");
    if (st === "NY") add("warn", "New York is inspecting", "The Department of State inspected 223 businesses statewide and cited 87 for possible violations, including unlawful practice of medicine (Jan 8, 2026).", "NY Department of State");
    if (st === "AZ" && hasInj()) add("warn", "Level III in Arizona", "Neuromodulators and fillers are Level III: RN or APRN only, a licensed practitioner's order, written consent, and supervision by a practitioner trained in aesthetics.", "Keyword Map, Sept 2026");
    if (st === "NV" && hasInj()) add("warn", "Competency on paper, per procedure", "Nevada's Aesthetic Practice Decision (Jan 2025) requires an instructional program, proven proficiency for each procedure, ongoing competency checks and written protocols.", "Keyword Map, Sept 2026");
    if (st === "MA" && hasInj()) add("warn", "Written orders under AR 13-01", "RNs may assess and must follow written orders from a licensed provider, but can't order medication. Policies, procedures and documented competency are required.", "Keyword Map, Sept 2026");
    if (st === "GA") add("warn", "Medical director scrutiny", "A May 2026 medical board statement on \"matchmaker\" medical directors was clarified in June as creating no new law.", "Keyword Map, Sept 2026");
    if (st === "WA") add("warn", "Rules under review", "Washington's health department is reviewing rules for injectables, microneedling, IV hydration and energy devices. Nothing is final yet.", "Keyword Map, Sept 2026");
    if (S.menu.has("neuro") || S.menu.has("hyper")) add("warn", "Your toxin log has to match your invoices", "On April 1, 2026 the FDA warned a Texas med spa that dispensed more Botox than it purchased through legitimate channels, the first such letter to a med spa. Lot numbers and purchase records belong in the binder.", "AmSpa · Holland & Knight");
    if (S.menu.has("ha") || S.menu.has("prpha") || S.menu.has("hylen")) add("warn", "Filler means an occlusion plan on the wall", "In Case A of the accusation review, the Board asked for the nurse's dermal filler standardized procedures. There were none to send. The document that would have helped included an adverse event protocol and signed treatment-specific consent.", "Accusation Review, redesign");
    if (S.loc === "2-3" || S.loc === "4+") add("warn", "One director, several doors", "The review found an out-of-state director covering four medspas, with charts never signed. Supervision has to be documented per location.", "Accusation Review, redesign");
    const g = gaps();
    if (g.find(q => q.id === "q02")) add("alert", "A template isn't a standardized procedure", "In the review, a national association's policy set did not meet standardized procedure criteria, and a mid-investigation update still fell short.", "Accusation Review, redesign");
    return F;
  }

  /* ---------------- routing: first match wins ---------------- */
  const ROUTES = [
    { key: "probation", when: "Role is \"Facing a Board Complaint\"", test: () => S.role === "complaint", owner: "Cindi, personally", why: "A Board letter needs a nurse who has read one, alongside your attorney." },
    { key: "accel", when: "Role is \"RN / NP / PA Planning to Open\"", test: () => S.role === "planning", owner: "Cindi", why: "You're building the binder before the first patient. The Accelerator builds it with you, for your state." },
    { key: "growth", when: "4+ locations, multiple states, or goal is expand / sell", test: () => S.loc === "4+" || S.state === "MULTI" || S.goal === "expand", owner: "Cindi + your healthcare attorney", why: "More doors means more binders that have to match. Growth-Ready harmonizes them and builds the diligence file." },
    { key: "ce_team", when: "Goal is CE, and you're an owner or manager", test: () => S.goal === "ce" && (S.role === "owner" || S.role === "manager"), owner: "Automated · LMS", why: "One pass for the clinical team, plus a completion log for the binder." },
    { key: "ce_all", when: "Goal is CE", test: () => S.goal === "ce", owner: "Automated · LMS", why: "Every current and future course, with instant certificates." },
    { key: "manual", when: "Goal is add a service line, or Q01/Q02 is not a yes, or 3+ gaps", test: () => S.goal === "add" || ["q01", "q02"].some(id => auditAns(id) && auditAns(id) !== "yes") || gaps().length >= 3, owner: "Cindi", why: "Your answers point to the documents themselves, not just a review of them. A manual written for your state and your menu closes that." },
    { key: "audit", when: "1–2 gaps, or goal is marketing & privacy", test: () => gaps().length >= 1 || S.goal === "marketing", owner: "Cindi", why: "You're close. The audit finds the last gaps and gives you a 30-day plan, and the fee is credited toward a manual within 60 days." },
    { key: "partner", when: "No gaps", test: () => true, owner: "Cindi + team", why: "Your binder holds up today. The Partner keeps it that way when your state's rules change." }
  ];
  const route = () => ROUTES.find(r => r.test());

  function secondary() {
    const out = []; const add = (k) => CE_COURSES[k] && !out.find(o => o.k === k) && out.push({ k, ...CE_COURSES[k] });
    gaps().forEach(q => q.ce && add(q.ce));
    if (S.menu.has("ha") || S.menu.has("prpha")) add("vo");
    if (S.menu.has("hylen")) add("hyal");
    if (S.menu.has("neuro")) add("neuro");
    return out.slice(0, 4);
  }
  const wantsDigital = () => S.goal === "marketing" || S.menu.has("glp");
  const heat = () => {
    const t = (TIMING.find(t => t.id === S.timing) || {}).heat || 0;
    if (S.role === "complaint" || t === 3) return { label: "Hot", cls: "hot" };
    if (t === 2 || ["manual", "growth", "accel"].includes(route().key)) return { label: "Warm", cls: "warm" };
    return { label: "Nurture", cls: "ok" };
  };

  /* ---------------- steps ---------------- */
  const STEPS = [
    { n: "01", label: "State", val: () => S.state ? (S.state === "MULTI" ? "Multiple states" : STATE_NAMES[S.state]) : "", ok: () => !!S.state },
    { n: "02", label: "The room", val: () => S.role ? ROLES.find(r => r.id === S.role).label : "", ok: () => S.role && S.lic.length && S.loc },
    { n: "03", label: "Your menu", val: () => S.menu.size ? `${S.menu.size} treatments` : "", ok: () => S.menu.size > 0 },
    { n: "04", label: "The walk-through", val: () => Object.keys(S.audit).length ? `${Object.keys(S.audit).length} of ${AUDIT.length}` : "", ok: () => AUDIT.every(q => S.audit[q.id]) },
    { n: "05", label: "Goal", val: () => S.goal ? GOALS.find(g => g.id === S.goal).label : "", ok: () => S.goal && S.timing },
    { n: "06", label: "Your blueprint", val: () => "", ok: () => true }
  ];

  function renderSteps() {
    $("#steps").innerHTML = STEPS.map((s, i) => {
      const reachable = i <= S.step || STEPS.slice(0, i).every(x => x.ok());
      const cls = i === S.step ? "current" : (s.ok() && i < 5 && s.val() ? "done" : "");
      return `<li class="${cls}"><button ${reachable ? "" : "disabled"} data-step="${i}"><span class="n">${s.n}</span><span class="l">${s.label}</span><span class="v">${esc(s.val())}</span></button></li>`;
    }).join("");
    const c = $("#tabCount"); const nv = String(tabCount());
    if (c.textContent !== nv) { c.textContent = nv; c.classList.add("bump"); setTimeout(() => c.classList.remove("bump"), 250); }
  }

  function signalCard(code) {
    if (!code) return "";
    const ce = ceStatus(code); const d = DEEP[code];
    const name = code === "MULTI" ? "Multiple states" : STATE_NAMES[code];
    return `<div class="signal">
      <div class="row"><span class="tag accent">${esc(name)}</span><span class="tag ${ce.cls}">${esc(ce.status)}</span><span class="tag">${esc(ce.hours)}</span>${d ? `<span class="tag">Aesthetic guidance · ${esc(d[0])}</span>` : ""}</div>
      ${d ? `<q>${esc(d[3])}</q><p>${esc(d[4])}</p><p class="small muted"><b>Why now:</b> ${esc(d[2])}</p>` : `<p>${esc(ce.line)}</p>`}
      ${d ? `<p class="small muted">${esc(ce.line)}</p>` : ""}
      <p class="tiny">${d ? "Board-site review, Sept 2026. A draft answer, checked against the board source before you rely on it." : "51-jurisdiction CE review, Sept 2026."} Education, not legal advice.</p>
    </div>`;
  }

  const views = [
    // 0 — STATE (Signal voice)
    () => `<span class="voice">Signal · the rule, translated</span>
      <h2>Where do you practice?</h2>
      <p class="intro">Every rule starts with the board that licenses you. Pick the state, and see what that board actually says.</p>
      <div class="field" style="max-width:420px"><label for="stateSel">State</label>
        <select id="stateSel"><option value="">Select your state</option>
        ${Object.entries(STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1])).map(([c, n]) => `<option value="${c}" ${S.state === c ? "selected" : ""}>${n}${DEEP[c] ? "  — full board answer" : ""}</option>`).join("")}
        <option value="MULTI" ${S.state === "MULTI" ? "selected" : ""}>Multiple states</option></select>
        <span class="tiny">23 states have a full board answer from the Sept 2026 review. Every state shows its CE line.</span></div>
      <div id="signalSlot">${signalCard(S.state)}</div>`,
    // 1 — THE ROOM (Walk-Through voice)
    () => `<span class="voice">Walk-Through · the room</span>
      <h2>Who's in the room?</h2>
      <p class="intro">The title on the badge decides who can do what. Tell us who you are, who treats, and how many doors you run.</p>
      <div class="label" style="margin-bottom:.5rem">You are</div>
      <div class="choice-grid" data-group="role">${ROLES.map(r => `<button class="choice" data-val="${r.id}" aria-pressed="${S.role === r.id}"><b>${r.label}</b><small>${r.sub}</small></button>`).join("")}</div>
      <div class="label" style="margin:1.4rem 0 .5rem">Licenses treating patients</div>
      <div class="chips" data-group="lic">${LICENSES.map(l => `<button class="chip" data-val="${l}" aria-pressed="${S.lic.includes(l)}">${l}</button>`).join("")}</div>
      <div class="label" style="margin:1.4rem 0 .5rem">Locations</div>
      <div class="chips" data-group="loc">${LOCATIONS.map(l => `<button class="chip" data-val="${l.id}" aria-pressed="${S.loc === l.id}">${l.label}</button>`).join("")}</div>`,
    // 2 — MENU (fields from the customized P&P list)
    () => `<span class="voice">Walk-Through · the menu</span>
      <h2>Walk me through your menu.</h2>
      <p class="intro">Tap everything you offer, or plan to this year. Each one becomes a tab. Emergency protocols join the moment you inject. Yes, the fridge counts.</p>
      ${MENU.map((g, gi) => `<div class="menu-group"><header><h3>${g.group}</h3>${g.locked ? `<span class="tiny">${g.note}</span>` : g.auto ? `<span class="tiny">${g.note}</span>` : `<button class="linkish" data-all="${gi}">Select all</button>`}</header>
        <div class="chips">${g.items.map(it => {
          if (g.locked) return `<span class="chip locked">${it.name}</span>`;
          const auto = g.auto && hasInj() && !S.menu.has(it.id);
          return auto ? `<button class="chip auto" data-menu="${it.id}" aria-pressed="false" title="Added because you inject">${it.name} · auto</button>`
                      : `<button class="chip" data-menu="${it.id}" aria-pressed="${S.menu.has(it.id)}">${it.name}</button>`;
        }).join("")}</div></div>`).join("")}`,
    // 3 — AUDIT
    () => `<span class="voice">Walk-Through · the finding</span>
      <h2>If the Board asked today…</h2>
      <p class="intro">Seven questions from the 15-question self-audit, each tied to what the 32 accusations found. "Not sure" counts as a gap here. If you can't find it, you can't send it.</p>
      ${AUDIT.map(q => `<div class="audit-item ${S.audit[q.id] && S.audit[q.id] !== "yes" ? "no" : ""}" data-q="${q.id}">
        <span class="num">${q.n}</span>
        <div><p>${esc(q.text)}</p><p class="finding">${esc(q.finding)}</p></div>
        <div class="yn">${["yes", "no", "unsure"].map(v => `<button data-v="${v === "unsure" ? "no" : v}" data-a="${v}" aria-pressed="${S.audit[q.id] === v}">${v === "unsure" ? "Not sure" : v[0].toUpperCase() + v.slice(1)}</button>`).join("")}</div>
      </div>`).join("")}`,
    // 4 — GOAL (Scar-Tissue Mentor voice)
    () => `<span class="voice">Scar-Tissue Mentor · the nurse</span>
      <h2>What's the goal, and how soon?</h2>
      <p class="intro">No wrong answer. The honest timeline is the one that gets you the right next step.</p>
      <div class="choice-grid" data-group="goal">${GOALS.map(g => `<button class="choice" data-val="${g.id}" aria-pressed="${S.goal === g.id}"><b>${g.label}</b><small>${g.sub}</small></button>`).join("")}</div>
      <div class="label" style="margin:1.4rem 0 .5rem">Timing</div>
      <div class="chips" data-group="timing">${TIMING.map(t => `<button class="chip" data-val="${t.id}" aria-pressed="${S.timing === t.id}">${t.label}</button>`).join("")}</div>`,
    // 5 — RESULT
    () => renderResult()
  ];

  function kudos() {
    return ({
      owner: "You just walked your own binder, tab by tab. That's clinical work, even when nobody bills for it. It deserves the credit.",
      manager: "You're the one who knows where the binder lives. That's invisible labor, and it's the first thing an inspector tests.",
      md: "Your signature is the one they check. Reading the binder before you sign it is the part of the job that protects everyone.",
      planning: "You're writing the binder before the first patient. Most owners start after the first letter.",
      complaint: "You looked at the binder instead of the letter again. Good. The records are what remain, and they can still be put in order."
    })[S.role] || "";
  }

  function renderResult() {
    const r = route(); const o = OFFERS[r.key]; const F = flags(); const rd = readiness(); const g = gaps();
    const name = S.state === "MULTI" ? "multi-state" : STATE_NAMES[S.state];
    const mods = modules(); const sec = secondary(); const h = heat();
    const toc = [];
    toc.push(`<li class="sec">General requirements</li>`); GENERAL.forEach(i => toc.push(`<li>${esc(i.name)}</li>`));
    MENU.filter(gr => !gr.locked).forEach(gr => {
      const items = gr.items.filter(i => S.menu.has(i.id) || (gr.auto && hasInj()));
      if (items.length) { toc.push(`<li class="sec">${esc(gr.group)}</li>`); items.forEach(i => toc.push(`<li>${esc(i.name)}</li>`)); }
    });
    const modLine = (r.key === "manual" || r.key === "growth") && mods.length ? `<div class="why"><b>Modules for your menu:</b> ${mods.map(esc).join(", ")} · +$750 each.</div>` : "";
    return `<span class="voice">Your blueprint</span>
      <div class="result-head">
        <div><h2>Your ${esc(name)} binder: <em>${tabCount()} tabs.</em></h2>
        <p class="intro" style="margin:.5rem 0 0">Here's what an inspector would open first, and the one next step that fits where you stand.</p></div>
        <div class="meter"><span class="label" style="display:block">Readiness</span><b>${rd.yes} of ${AUDIT.length}</b><div class="bar"><i style="width:${rd.pct}%"></i></div><span class="tiny">${g.length ? `${g.length} gap${g.length > 1 ? "s" : ""} to close` : "No gaps on these seven"}</span></div>
      </div>
      ${signalCard(S.state)}
      <div class="res-grid" style="margin-top:1.5rem">
        <div class="panel"><h3>What an inspector checks first</h3><div class="flags">
          ${F.length ? F.map(f => `<div class="flag ${f.level}"><b>${esc(f.title)}</b><span>${esc(f.text)}</span><span class="src">${esc(f.src)}</span></div>`).join("") : `<div class="flag ok"><b>No state-specific flags for this menu</b><span>The general requirements and your treatment tabs still apply.</span></div>`}
          ${g.map(q => `<div class="flag alert"><b>Gap · Question ${q.n}</b><span>${esc(q.finding)}</span><span class="src">Accusation Review, redesign</span></div>`).join("")}
        </div></div>
        <div>
          <div class="offer">
            <span class="eyebrow">Your next step</span>
            <h3>${esc(o.name)}</h3>
            <div class="price">${esc(o.price)}</div>
            <div class="why">${esc(r.why)}</div>
            ${modLine}
            ${o.includes.length ? `<ul>${o.includes.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
            <p class="tiny">${esc(o.note)}</p>
            <a class="btn primary" href="#sendForm" style="margin-top:.6rem">Book the free 30-minute call</a>
            ${sec.length || wantsDigital() ? `<div class="also"><span class="label">Also worth a look</span>
              ${sec.map(c => `<div><span>${esc(c.name)}</span><span class="muted">${esc(c.meta)}</span></div>`).join("")}
              ${wantsDigital() ? `<div><span>${esc(OFFERS.digital.name)}</span><span class="muted">${esc(OFFERS.digital.price)}</span></div>` : ""}</div>` : ""}
          </div>
        </div>
      </div>
      <div class="panel" style="margin-top:1.5rem"><h3>Your binder, tab by tab</h3><ol class="toc">${toc.join("")}</ol>
        <p class="tiny" style="margin-top:.8rem">Every P&amp;P includes: ${ALWAYS_INCLUDED.map(esc).join(" · ")}.</p>
        <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-top:1rem"><a class="btn primary" id="buildManual" href="${esc(builderLink())}">Build this manual</a><span class="tiny">Opens the Manual Builder with ${S.state && S.state !== "MULTI" ? esc(STATE_NAMES[S.state]) + " and " : ""}only these tabs selected.</span></div></div>
      <p class="kudos">${esc(kudos())}</p>
      <form id="sendForm" class="send" novalidate>
        <div class="full"><h3>Send me this blueprint</h3><p class="small muted" style="margin:.3rem 0 0">Cindi replies within two business days to schedule the free 30-minute call. Free, no pitch. You get a written next step: a course, an audit, or nothing at all.</p></div>
        <div class="field"><label for="fName">Name</label><input id="fName" type="text" autocomplete="name" value="${esc(S.contact.name)}" required></div>
        <div class="field"><label for="fEmail">Email</label><input id="fEmail" type="email" autocomplete="email" value="${esc(S.contact.email)}" required></div>
        <div class="field full"><label for="fNote">Anything I should know? (No patient details, please.)</label><textarea id="fNote" rows="3">${esc(S.contact.note)}</textarea></div>
        <div class="full" style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><button class="btn primary" type="submit">Send my blueprint</button><span class="tiny">Priority: <span class="pill ${h.cls}">${h.label}</span> · Route: ${esc(o.name)}</span></div>
        <div class="confirm full ${S.sent ? "show" : ""}" id="confirm">
          <b>Blueprint ready to send.</b> <span class="small">Preview mode: nothing left this page. In the live build, this step writes your row to the Leads Sheet, emails your blueprint and alerts Cindi.</span>
          <div class="next-steps"><div><b>Seconds</b>Your blueprint lands in your inbox.</div><div><b>Two business days</b>Cindi replies to book the free 30-minute call.</div><div><b>After the call</b>A written next step: a course, an audit, or nothing at all.</div></div>
        </div>
      </form>
      <p class="tiny" style="margin-top:1.5rem">${esc(BRAND.disclaimer)} Rules vary by state; confirm with your board.</p>`;
  }

  /* ---------------- render + events ---------------- */
  function render() {
    renderSteps();
    $("#stageBody").innerHTML = views[S.step]();
    $("#stageBody").style.animation = "none"; void $("#stageBody").offsetWidth; $("#stageBody").style.animation = "";
    const last = S.step === STEPS.length - 1;
    $("#backBtn").style.visibility = S.step === 0 ? "hidden" : "visible";
    $("#nextBtn").style.display = last ? "none" : "";
    $("#nextBtn").disabled = !STEPS[S.step].ok();
    $("#nextBtn").textContent = S.step === 4 ? "See my blueprint →" : "Continue →";
    $("#stepHint").textContent = last ? "Edit any step from the tabs." : `Step ${S.step + 1} of ${STEPS.length}`;
    bind(); renderPayload();
  }
  function refreshFoot() { $("#nextBtn").disabled = !STEPS[S.step].ok(); renderSteps(); renderPayload(); }

  function bind() {
    const sel = $("#stateSel");
    if (sel) sel.onchange = () => { S.state = sel.value; ($("#signalSlot")||{}).innerHTML = signalCard(S.state); refreshFoot(); };
    $$("[data-group]").forEach(grp => {
      const key = grp.dataset.group;
      $$("[data-val]", grp).forEach(b => b.onclick = () => {
        const v = b.dataset.val;
        if (key === "lic") { S.lic = S.lic.includes(v) ? S.lic.filter(x => x !== v) : [...S.lic, v]; b.setAttribute("aria-pressed", S.lic.includes(v)); }
        else { S[key] = v; $$("[data-val]", grp).forEach(x => x.setAttribute("aria-pressed", x.dataset.val === v)); }
        refreshFoot();
      });
    });
    $$("[data-menu]").forEach(b => b.onclick = () => {
      const id = b.dataset.menu; S.menu.has(id) ? S.menu.delete(id) : S.menu.add(id);
      const y = window.scrollY; $("#stageBody").innerHTML = views[2](); bind(); window.scrollTo(0, y); refreshFoot();
    });
    $$("[data-all]").forEach(b => b.onclick = () => {
      const g = MENU[+b.dataset.all]; const allOn = g.items.every(i => S.menu.has(i.id));
      g.items.forEach(i => allOn ? S.menu.delete(i.id) : S.menu.add(i.id));
      const y = window.scrollY; $("#stageBody").innerHTML = views[2](); bind(); window.scrollTo(0, y); refreshFoot();
    });
    $$(".audit-item").forEach(row => $$("button", row).forEach(b => b.onclick = () => {
      S.audit[row.dataset.q] = b.dataset.a;
      $$("button", row).forEach(x => x.setAttribute("aria-pressed", x === b));
      row.classList.toggle("no", b.dataset.a !== "yes");
      refreshFoot();
    }));
    const form = $("#sendForm");
    if (form) {
      ["fName", "fEmail", "fNote"].forEach(id => $("#" + id).oninput = e => { S.contact[{ fName: "name", fEmail: "email", fNote: "note" }[id]] = e.target.value; renderPayload(); });
      form.onsubmit = (e) => {
        e.preventDefault();
        if (!S.contact.name.trim() || !/^\S+@\S+\.\S+$/.test(S.contact.email)) { toast("Add your name and a valid email."); return; }
        S.sent = true; $("#confirm").classList.add("show"); renderPayload(); toast("Blueprint ready. Preview mode: nothing was sent.");
      };
    }
  }

  $("#nextBtn").onclick = () => { if (STEPS[S.step].ok() && S.step < STEPS.length - 1) { S.step++; render(); scrollWizard(); } };
  $("#backBtn").onclick = () => { if (S.step > 0) { S.step--; render(); scrollWizard(); } };
  $("#steps").onclick = (e) => { const b = e.target.closest("button[data-step]"); if (b && !b.disabled) { S.step = +b.dataset.step; render(); scrollWizard(); } };
  function scrollWizard() { const w = $("#wizard"); if (w.getBoundingClientRect().top < 0) w.scrollIntoView({ behavior: "smooth", block: "start" }); }
  $("#startBtn").onclick = (e) => { e.preventDefault(); $("#wizard").scrollIntoView({ behavior: "smooth" }); };

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2600); }

  /* ---------------- views / tabs ---------------- */
  function go(v) {
    $$(".view").forEach(x => x.classList.toggle("active", x.id === "view-" + v));
    $$(".tab").forEach(t => { if (t.dataset.go === v) t.setAttribute("aria-current","page"); else t.removeAttribute("aria-current"); });
    window.scrollTo({ top: 0 });
  }
  $$("[data-go]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); go(el.dataset.go); }));

  /* ---------------- payload ---------------- */
  function payload() {
    const r = route(); const ready = STEPS.slice(0, 5).every(s => s.ok());
    return {
      lead_id: "bp_" + Date.now().toString(36), created_at: new Date().toISOString(),
      source_keyword: S.kw || null, utm: S.utm,
      state: S.state || null, state_depth: S.state === "MULTI" ? "multi" : DEEP[S.state] ? "deep_review_23" : S.state ? "ce_only_51" : null,
      ce_status: S.state ? ceStatus(S.state).status : null,
      role: S.role || null, licenses: S.lic, locations: S.loc || null,
      menu: [...S.menu], tab_count: tabCount(), modules: modules(),
      audit: S.audit, readiness: `${readiness().yes}/${AUDIT.length}`, gaps: gaps().map(q => "Q" + q.n),
      goal: S.goal || null, timing: S.timing || null,
      priority: ready ? heat().label : null, route: ready ? OFFERS[r.key].name : null, route_owner: ready ? r.owner : null,
      secondary: ready ? secondary().map(c => c.name).concat(wantsDigital() ? [OFFERS.digital.name] : []) : [],
      flags: ready ? flags().map(f => f.title) : [],
      contact: { name: S.contact.name || null, email: S.contact.email || null, note_present: !!S.contact.note },
      submitted: S.sent
    };
  }
  function renderPayload() { const p = $("#payload"); if (p) p.textContent = JSON.stringify(payload(), null, 2); }

  /* ---------------- automation tables ---------------- */
  const FLOW = [
    { n: "01", name: "Attract", job: "Get found", tools: [["Signal · Walk-Through · Scar-Tissue posts", "The three TVGA archetypes, posted daily"], ["State pages + blog", "23 states, answer-first, crawlable"], ["Google Business Profile", "Local search and reviews"]] },
    { n: "02", name: "Capture", job: "Start a conversation", tools: [["Keyword DM", "MAP, STATE, BINDER, REVIEW, KIT, LOCATIONS, HOURS"], ["Binder Blueprint", "This page. Prefilled from the DM link"], ["Leads Sheet row", "With keyword, UTM, route and priority"]] },
    { n: "03", name: "Convert", job: "Book and pay", tools: [["Gmail", "Blueprint email + alert to Cindi"], ["Google Calendar", "Free 30-minute readiness call"], ["Stripe", "Invoice for the routed offer"]] },
    { n: "04", name: "Deliver", job: "Do the work", tools: [["Drive client folder", "Created from a template per engagement"], ["Claude", "First drafts of P&P sections for Cindi to edit"], ["LMS", "CE, certificates, completion records"]] },
    { n: "05", name: "Measure", job: "Decide what's next", tools: [["Plausible", "Blueprint starts, finishes and sends as goals"], ["Command Center Sheet", "New qualified leads · consults booked, every Monday"], ["Search Console", "State-page clicks"]] }
  ];
  ($("#flow")||{}).innerHTML = FLOW.map(f => `<div><span class="n">STAGE ${f.n}</span><h3>${f.name}</h3><span class="job">${f.job}</span><ul>${f.tools.map(t => `<li>${esc(t[0])}<small>${esc(t[1])}</small></li>`).join("")}</ul></div>`).join("");

  ($("#routeTable")||{}).innerHTML = `<thead><tr><th>#</th><th>If</th><th>Route to</th><th>Price</th><th>Owner</th><th>Automation</th></tr></thead><tbody>${ROUTES.map((r, i) => {
    const o = OFFERS[r.key];
    const auto = r.key === "probation" ? "Gmail flag to Cindi · no auto-reply beyond receipt" : r.key.startsWith("ce") ? "Blueprint email with course link · LMS purchase event to Plausible" : "Blueprint email · booking link · Stripe invoice after the call";
    return `<tr><td>${i + 1}</td><td>${esc(r.when)}</td><td><b>${esc(o.name)}</b></td><td>${esc(o.price)}</td><td>${esc(r.owner)}</td><td class="small">${auto}</td></tr>`;
  }).join("")}</tbody>`;

  ($("#kwTable")||{}).innerHTML = `<thead><tr><th>Keyword</th><th>What the DM sends</th><th>Blueprint link</th><th>Prefills</th></tr></thead><tbody>${Object.entries(KEYWORDS).map(([k, v]) => {
    const pf = [v.prefill.goal && `goal: ${GOALS.find(g => g.id === v.prefill.goal).label}`, v.prefill.loc && `locations: ${v.prefill.loc}`, v.prefill.menu && `menu: ${v.prefill.menu.map(m => itemById(m).name).join(", ")}`, "state from the setter"].filter(Boolean).join(" · ");
    return `<tr><td><b>${k}</b></td><td>${esc(v.asset)}</td><td><code>#kw=${k}&amp;state=TX&amp;utm_source=instagram</code></td><td class="small">${esc(pf)}</td></tr>`;
  }).join("")}</tbody>`;

  const SCHEMA = [
    ["source_keyword", "enum", Object.keys(KEYWORDS).join(" / ") + " / null", "Which archetype post earned the lead"],
    ["utm.*", "text", "utm_source, utm_medium, utm_campaign", "Channel attribution in Plausible and the Sheet"],
    ["state", "enum", "50 states + DC + MULTI", "State card, flags, CE line, routing"],
    ["state_depth", "derived", "deep_review_23 / ce_only_51 / multi", "Tells Cindi how much is pre-checked"],
    ["role", "enum", ROLES.map(r => r.label).join(" / "), "Routing rules 1–2, kudos line"],
    ["licenses", "multi", LICENSES.join(" / "), "Scope flags (e.g. LVN + IV in Texas)"],
    ["locations", "enum", "1 / 2–3 / 4+", "Supervision flag, Growth-Ready route"],
    ["menu", "multi", "44 fields from the Customized Policies list", "Tab list, modules, CE suggestions"],
    ["tab_count", "derived", "General 4 + menu + emergency (auto with injectables)", "The number on the binder spine"],
    ["modules", "derived", "IV therapy / GLP-1 / Hormone", "+$750 each on Manual or Growth-Ready"],
    ["audit.q01…q15", "yes / no / unsure", "7 of the 15 self-audit items", "Readiness score, gaps, Manual vs Audit"],
    ["goal", "enum", GOALS.map(g => g.label).join(" / "), "Routing rules 3–7"],
    ["timing", "enum", TIMING.map(t => t.label).join(" / "), "Priority: Hot / Warm / Nurture"],
    ["route · route_owner", "derived", "First matching rule", "Which email template and who follows up"],
    ["contact.name · contact.email", "text", "Required to send", "Blueprint email, booking link"],
    ["contact.note", "text", "Optional. Never patient details.", "Context for the 30-minute call"]
  ];
  ($("#schemaTable")||{}).innerHTML = `<thead><tr><th>Field</th><th>Type</th><th>Values</th><th>Powers</th></tr></thead><tbody>${SCHEMA.map(r => `<tr><td><code>${esc(r[0])}</code></td><td>${esc(r[1])}</td><td class="small">${esc(r[2])}</td><td class="small">${esc(r[3])}</td></tr>`).join("")}</tbody>`;

  ($("#srcTable")||{}).innerHTML = `<thead><tr><th>Source</th><th>Used for</th><th>Checked</th></tr></thead><tbody>${Object.entries(SOURCES).map(([k, s]) => {
    const used = { redesign: "Offers, prices, self-audit items, accusation numbers, credentials", pnp_pdf: "All 44 menu fields and the 'every P&P includes' list", kwmap: "23-state answers, why-now lines, state flags", tvga: "CE status for 51 jurisdictions, keyword assets, setter rules, archetypes and voice", plan90: "SLAs and proof-number conflict", command: "Five-stage framework, tools, PHI wall, address conflict", nydos: "New York inspection counts", cmf: "NYC 15 of 15", fda: "DSCSA warning-letter flag", hk: "Enforcement context", tx3749: "Jenifer's Law", cabrn: "California standardized procedures", amspa24: "Buyer segments: locations, ownership, new openings" }[k] || "Competitor comparison";
    return `<tr><td>${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>` : esc(s.label)}</td><td class="small">${esc(used)}</td><td class="small">${esc(s.checked)}</td></tr>`;
  }).join("")}</tbody>`;

  render();
})();

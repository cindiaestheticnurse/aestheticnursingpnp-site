/* State Blueprint · Board Readiness Check (3 steps). Figures: The Accusation Review · 2026 Summary (35 accusations). */
(function () {
  "use strict";
  var ROOT = window.__ROOT__ || "../";
  var IXP = function (p) { return /index\.html$/.test(location.pathname) || window.__PDF_GATE_PREVIEW__ ? p + "index.html" : p; };
  var CE = "https://aestheticnursingces.com/course/";
  var Q = [
    { id: "q1", n: "01", text: "Written Standardized Procedures exist for every treatment we offer, meet our state's criteria and are signed by the Medical Director.",
      finding: "24 of 35 Accusations cited missing or insufficient Standardized Procedures / P&Ps.",
      fix: "Treatment-specific Standardized Procedures for every service on your menu, written to your state's criteria and signed by your Medical Director.",
      ce: ["Standardized Procedures: An Overview", "1 CE", CE + "standardized-procedures-overview"], manual: true },
    { id: "q2", n: "02", text: "Our P&Ps were written for our state and scope, not adapted from a generic or association template.",
      finding: "One nurse submitted a national association's policy set; the Board found it did not meet Standardized-Procedure Criteria. Another practice updated its P&Ps mid-investigation and still fell short.",
      fix: "Policies and Procedures written for your state and your scope, not an adapted generic or association template.",
      ce: ["Standardized Procedures: An Overview", "1 CE", CE + "standardized-procedures-overview"], manual: true },
    { id: "q3", n: "03", text: "Every patient has a documented Good Faith Exam by a physician, NP or PA before treatment.",
      finding: "16 of 35 cited no Good Faith Exam or authorized assessment before treatment.",
      fix: "A Good Faith Exam protocol, and a documented exam by a physician, NP or PA in every chart before treatment.",
      ce: ["The Good Faith Exam", "1 CE", CE + "good-faith-exam"] },
    { id: "q4", n: "04", text: "Our Medical Director Agreement defines supervision duties, and Chart Reviews are logged.",
      finding: "24 of 35 cited inadequate Physician Oversight, Direction or Supervision.",
      fix: "A Medical Director Agreement that defines supervision duties, with a Chart Review log you can produce on request." },
    { id: "q5", n: "05", text: "Every chart has history, treatment-specific consent, product, dose and Lot Number.",
      finding: "10 of 35 cited documentation or medical-record failures.",
      fix: "Charting templates and treatment-specific consent forms that capture history, product, dose and Lot Number.",
      ce: ["Informed Consent: A Comprehensive Overview", "1 CE", CE + "informed-consent"] },
    { id: "q6", n: "06", text: "No task is delegated to anyone without the license to perform it.",
      finding: "Physicians and PAs faced Accusations for unlicensed staff injecting or lasering.",
      fix: "A delegation and scope-of-practice policy, with provider competencies for each treatment." },
    { id: "q7", n: "07", text: "Our Corporate Structure and Fictitious Name Permit meet our state's rules.",
      finding: "12 of 35 involved Corporate Structure, Ownership or Fictitious Name Permit issues.",
      fix: "A review of your Corporate Structure and Fictitious Name Permit against your state's rules, coordinated with your healthcare attorney." },
    { id: "q8", n: "08", text: "If the Board requested our P&Ps today, we could send them within 24 hours.",
      finding: "\u201CThe Board Asked for Her Policies. There Were None to Send.\u201D The Accusation charged incompetence.",
      fix: "Standardized Procedures, a Complaint-Response Protocol and signed, treatment-specific Informed Consent, organized so you can send them within 24 hours.",
      ce: ["From Complaint to Accusation", "2 CE", CE + "complaint-accusation"], manual: true }
  ];
  var ROLES = [
    { id: "owner", label: "Practice Owner" },
    { id: "planning", label: "RN / NP / PA Planning to Open" },
    { id: "md", label: "Medical Director" },
    { id: "manager", label: "Practice Manager" },
    { id: "complaint", label: "Facing a Board Complaint" }
  ];
  var BOOK = IXP(ROOT + "book/"), SERV = IXP(ROOT + "services/"), RES = IXP(ROOT + "research/");
  var PATHS = {
    probation: { tag: "Investigation & Probation Support", name: "Investigation & Probation Support", price: "By Consult",
      line: "For providers facing a Board complaint, investigation or Accusation, or on probation. Coordinated with your attorney.",
      cta: ["Book a Free Consult", BOOK] },
    complete: { tag: "Path 3 · Complete Practice", name: "Practice Review + Manuals + Implementation", price: "Introductory Price From $3,995",
      line: "The full document set, a mock audit, team training, and rollout support until it\u2019s running.",
      cta: ["Build My Manual", "https://theaestheticmanual.com/", true] },
    manual: { tag: "Path 2 · Essential Practice", name: "Manual Set", price: "Introductory Price From $1,950",
      line: "Your state-specific policy and procedure manual set, branded and implementation-ready for you and your Medical Director to review and approve.",
      cta: ["Build My Manual", "https://theaestheticmanual.com/", true] },
    audit: { tag: "Path 1 · Compliance Audit", name: "Practice Review", price: "$950",
      line: "Practice review including business setup, workflows, Medical Director information, oversight, current staff, policies & procedures, and documentation.",
      cta: ["Request an Audit", BOOK] },
    keep: { tag: "Path 4 · Practice Consulting", name: "Consulting Retainer", price: "$350/Month for 12 Months",
      line: "Standing access for clinical and compliance questions, annual reviews, and document updates.",
      cta: ["Schedule a Consult", BOOK] }
  };
  var S = { step: 0, state: "", role: "", a: {}, sent: false };
  try { var qs = new URLSearchParams(location.search); var st = (qs.get("state") || "").toUpperCase(); if (window.STATE_NAMES && (window.STATE_NAMES[st] || st === "MULTI")) S.state = st; } catch (e) {}

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function stateName(c) { return c === "MULTI" ? "Multiple States" : ((window.STATE_NAMES || {})[c] || ""); }
  function gaps() { return Q.filter(function (q) { return S.a[q.id] && S.a[q.id] !== "yes"; }); }
  function answered() { return Q.filter(function (q) { return S.a[q.id]; }).length; }
  function route() {
    var g = gaps();
    if (S.role === "complaint") return "probation";
    if (g.length >= 4) return "complete";
    if (g.some(function (q) { return q.manual; })) return "manual";
    if (g.length) return "audit";
    return "keep";
  }
  function ok(i) { return i === 0 ? !!(S.state && S.role) : i === 1 ? answered() === Q.length : true; }

  var CSS = ".rc{max-width:1000px;margin:0 auto;padding:clamp(36px,5vw,64px) 24px clamp(48px,6vw,80px);font-family:'Jost',sans-serif;color:#3A3632}" +
    ".rc h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(28px,3vw,38px);line-height:1.15;color:#2B2926;margin:0 0 10px}" +
    ".rc h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:22px;color:#2B2926;margin:0 0 8px}" +
    ".rc-steps{display:flex;gap:0;margin:0 0 32px;padding:0;list-style:none;border-bottom:1px solid #DCCFC7}" +
    ".rc-steps li{flex:1}.rc-steps button{width:100%;background:none;border:0;border-bottom:3px solid transparent;padding:12px 6px 14px;text-align:left;font:inherit;font-size:12px;letter-spacing:.16em;color:#6B655E;cursor:pointer}" +
    ".rc-steps button[aria-current=step]{border-bottom-color:#8A4F4F;color:#2B2926}.rc-steps button:disabled{cursor:default;opacity:.55}" +
    ".rc-steps b{display:block;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;letter-spacing:0;font-weight:500;color:#8A4F4F}" +
    ".rc-intro{font-size:16px;line-height:1.7;margin:0 0 24px;max-width:62ch}" +
    ".rc-lbl{display:block;font-size:11px;letter-spacing:.2em;color:#2B2926;margin:0 0 10px;font-weight:500}" +
    ".rc select{width:100%;max-width:420px;padding:13px 12px;border:1px solid #8C847C;background:#fff;font:inherit;font-size:16px;color:#2B2926}" +
    ".rc fieldset{border:0;padding:0;margin:0 0 28px}.rc legend{padding:0}" +
    ".rc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px}" +
    ".rc-choice{background:#fff;border:1px solid #CFC5BC;padding:16px;text-align:left;font:inherit;font-size:15px;color:#2B2926;cursor:pointer;line-height:1.4}" +
    ".rc-choice[aria-pressed=true]{border-color:#8A4F4F;box-shadow:inset 0 0 0 1px #8A4F4F;background:#FBF6F3}" +
    ".rc-note{font-size:13.5px;color:#55504A;margin:10px 0 0;line-height:1.6;max-width:62ch}" +
    ".rc-q{display:grid;grid-template-columns:44px 1fr;gap:6px 14px;background:#fff;border:1px solid #DCCFC7;padding:18px 20px;margin:0 0 12px}" +
    ".rc-q.gap{border-left:4px solid #8A4F4F}.rc-q .n{font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;color:#8A4F4F;line-height:1}" +
    ".rc-q p{margin:0;font-size:15.5px;line-height:1.6;color:#2B2926}.rc-q .f{font-size:13.5px;color:#55504A;margin-top:6px}" +
    ".rc-yn{grid-column:2;display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.rc-yn button{min-width:88px;padding:9px 14px;border:1px solid #8C847C;background:#fff;font:inherit;font-size:13px;letter-spacing:.08em;color:#2B2926;cursor:pointer}" +
    ".rc-yn button[aria-pressed=true]{background:#2B2926;color:#F2EAE4;border-color:#2B2926}" +
    ".rc-callout{background:#2B2926;color:rgba(242,234,228,.88);padding:16px 20px;margin:0 0 20px;font-size:14.5px;line-height:1.6}.rc-callout b{color:#D9A9A9;font-weight:500}" +
    ".rc-nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:28px;padding-top:22px;border-top:1px solid #DCCFC7}" +
    ".rc-btn{display:inline-block;background:#8A4F4F;color:#F2EAE4;border:0;padding:15px 24px;font:inherit;font-size:11.5px;letter-spacing:.18em;text-decoration:none;cursor:pointer;text-transform:uppercase}" +
    ".rc-btn:hover{background:#6F3E3E}.rc-btn:disabled{background:#A9A29B;cursor:not-allowed}" +
    ".rc-btn.sec{background:transparent;color:#2B2926;border:1px solid #2B2926}.rc-btn.sec:hover{background:#2B2926;color:#F2EAE4}" +
    ".rc-hint{font-size:13px;color:#55504A;margin-left:auto}" +
    ".rc-score{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;margin:0 0 26px}.rc-score b{white-space:nowrap;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(46px,6vw,64px);font-weight:400;color:#2B2926;line-height:1}" +
    ".rc-score span{font-size:12px;letter-spacing:.18em;color:#55504A}" +
    ".rc-res{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:28px}@media(max-width:820px){.rc-res{grid-template-columns:1fr}}" +
    ".rc-gap{background:#fff;border:1px solid #DCCFC7;border-left:4px solid #8A4F4F;padding:18px 20px;margin:0 0 12px}" +
    ".rc-gap .t{font-size:11px;letter-spacing:.18em;color:#8A4F4F;margin:0 0 6px}.rc-gap p{margin:0 0 8px;font-size:15px;line-height:1.6}.rc-gap p:last-child{margin:0}" +
    ".rc-gap .k{font-size:11px;letter-spacing:.16em;color:#2B2926;display:block;margin-bottom:2px}.rc a.rc-ln{color:#8A4F4F;text-decoration:underline;text-underline-offset:3px}" +
    ".rc-ready{background:#fff;border:1px solid #DCCFC7;padding:16px 20px;font-size:14.5px;line-height:1.6;margin:0 0 12px}.rc-ready ul{margin:6px 0 0;padding-left:20px}" +
    ".rc-next{background:#2B2926;color:rgba(242,234,228,.88);padding:24px;margin:0 0 16px}.rc-next .t{font-size:11px;letter-spacing:.2em;color:#D9A9A9;margin:0 0 10px}" +
    ".rc-next h3{color:#F2EAE4;font-size:26px;line-height:1.2;margin:0 0 8px}.rc-next .p{color:#F2EAE4;font-size:15px;margin:0 0 12px}.rc-next p{font-size:14.5px;line-height:1.6;margin:0 0 18px}" +
    ".rc-next .rc-btn{background:#D9A9A9;color:#221F1D}.rc-next .rc-btn:hover{background:#F2EAE4}.rc-next .more{display:block;margin-top:14px;font-size:13px;color:#D9A9A9;text-decoration:underline;text-underline-offset:3px}" +
    ".rc-side{background:#fff;border:1px solid #DCCFC7;padding:18px 20px;margin:0 0 16px;font-size:14px;line-height:1.6}.rc-side q{display:block;font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;line-height:1.4;color:#2B2926;margin:6px 0 8px;quotes:'\\201C' '\\201D'}" +
    ".rc-form{background:#fff;border:1px solid #DCCFC7;padding:22px;margin-top:28px}.rc-form .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px;margin:12px 0}" +
    ".rc-form label{display:block;font-size:11px;letter-spacing:.16em;color:#2B2926;margin-bottom:6px}.rc-form input,.rc-form textarea{width:100%;box-sizing:border-box;padding:12px;border:1px solid #8C847C;font:inherit;font-size:16px;color:#2B2926;background:#fff}" +
    ".rc-err{color:#8A2E2E;font-size:14px;margin:8px 0 0}.rc-ok{background:#F2EAE4;border-left:4px solid #8A4F4F;padding:16px 20px;margin-top:14px;font-size:15px;line-height:1.6}" +
    ".rc-push{background:#2B2926;color:rgba(242,234,228,.88);padding:24px;margin:16px 0 0}.rc-push .t{font-size:11px;letter-spacing:.2em;color:#D9A9A9;margin:0 0 8px}.rc-push h3{color:#F2EAE4;font-size:26px;line-height:1.2;margin:0 0 8px}.rc-push p{font-size:15px;line-height:1.6;margin:0 0 18px}" +
    ".rc-push .rc-btn{background:#D9A9A9;color:#221F1D}.rc-push .rc-btn:hover{background:#F2EAE4}.rc-push .more{display:inline-block;margin-left:18px;font-size:13px;color:#D9A9A9;text-decoration:underline;text-underline-offset:3px}" +
    ".rc-disc{font-size:12.5px;color:#55504A;line-height:1.6;margin-top:26px}.rc-disc a{color:#8A4F4F;text-decoration:underline;text-underline-offset:3px}" +
    ".rc :focus-visible{outline:2px solid #8A4F4F;outline-offset:2px}.rc-hp{position:absolute;left:-9999px}" +
    "@media print{header,footer,.rc-steps,.rc-nav,.rc-form,.rc-hero-cta{display:none!important}}";

  function stepper() {
    var L = ["Your Practice", "The 8 Questions", "Your Blueprint"];
    return '<ol class="rc-steps">' + L.map(function (l, i) {
      var reach = i <= S.step || (i === 1 && ok(0)) || (i === 2 && ok(0) && ok(1));
      return '<li><button type="button" data-go="' + i + '"' + (i === S.step ? ' aria-current="step"' : "") + (reach ? "" : " disabled") + '><b>0' + (i + 1) + "</b>" + l.toUpperCase() + "</button></li>";
    }).join("") + "</ol>";
  }
  function v0() {
    var names = window.STATE_NAMES || {};
    var opts = Object.keys(names).sort(function (a, b) { return names[a].localeCompare(names[b]); }).map(function (c) {
      return '<option value="' + c + '"' + (S.state === c ? " selected" : "") + ">" + esc(names[c]) + "</option>"; }).join("");
    return '<h2 id="rc-h" tabindex="-1">Your Practice</h2><p class="rc-intro">Two quick answers so your Blueprint fits your state and your role.</p>' +
      '<div style="margin:0 0 28px"><label class="rc-lbl" for="rc-state">WHERE DO YOU PRACTICE?</label><select id="rc-state"><option value="">Select Your State</option>' + opts +
      '<option value="MULTI"' + (S.state === "MULTI" ? " selected" : "") + ">Multiple States</option></select>" +
      '<p class="rc-note">The 35 Accusations in the review were filed in California. Your state\u2019s Board sets its own rules, so your Blueprint includes your state\u2019s guidance where we have it.</p></div>' +
      '<fieldset><legend class="rc-lbl">WHICH BEST DESCRIBES YOU?</legend><div class="rc-grid">' + ROLES.map(function (r) {
        return '<button type="button" class="rc-choice" data-role="' + r.id + '" aria-pressed="' + (S.role === r.id) + '">' + esc(r.label) + "</button>"; }).join("") + "</div></fieldset>";
  }
  function v1() {
    return '<h2 id="rc-h" tabindex="-1">Could You Answer the Board Today?</h2><p class="rc-intro">Eight questions, each tied to what the 35 Accusations found. Answer honestly. \u201CNot Sure\u201D counts as a gap: if you can\u2019t find it, you can\u2019t send it.</p>' +
      '<p class="rc-callout"><b>12 of 35</b> Accusations involved an undercover agent who posed as a patient. Any appointment can become the Board\u2019s first look at your practice.</p>' +
      Q.map(function (q) {
        var v = S.a[q.id];
        return '<div class="rc-q' + (v && v !== "yes" ? " gap" : "") + '" role="group" aria-labelledby="' + q.id + '-t"><span class="n" aria-hidden="true">' + q.n + '</span><div><p id="' + q.id + '-t"><span class="rc-hp">Question ' + q.n + ": </span>" + esc(q.text) + '</p><p class="f">' + esc(q.finding) + "</p></div>" +
          '<div class="rc-yn">' + [["yes", "Yes"], ["no", "No"], ["unsure", "Not Sure"]].map(function (o) {
            return '<button type="button" data-q="' + q.id + '" data-v="' + o[0] + '" aria-pressed="' + (v === o[0]) + '">' + o[1] + "</button>"; }).join("") + "</div></div>";
      }).join("");
  }
  function v2() {
    var g = gaps(), ready = Q.filter(function (q) { return S.a[q.id] === "yes"; }), p = PATHS[route()];
    var d = (window.DEEP || {})[S.state];
    var side = d ? '<div class="rc-side"><span class="rc-lbl">WHAT YOUR STATE SAYS \u00B7 ' + esc(stateName(S.state).toUpperCase()) + "</span><q>" + esc(d[3]) + "</q><p style=\"margin:0 0 6px\">" + esc(d[4]) + '</p><p class="rc-note" style="margin:0">Board-site review, September 2026. Check the Board source before you rely on it. Education, not legal advice.</p></div>'
      : (S.state ? '<div class="rc-side"><span class="rc-lbl">YOUR STATE \u00B7 ' + esc(stateName(S.state).toUpperCase()) + '</span><p style="margin:6px 0 0">' + (S.state === "MULTI" ? "Each state\u2019s Board sets its own rules. Bring your list of states to the consult and we\u2019ll map each one." : "We\u2019ll review your state\u2019s Board guidance with you during the consult.") + "</p></div>" : "");
    var gapHtml = g.length ? g.map(function (q) {
      return '<div class="rc-gap"><p class="t">GAP \u00B7 QUESTION ' + q.n + "</p><p>" + esc(q.text) + '</p><p><span class="k">WHAT THE REVIEW FOUND</span>' + esc(q.finding) + '</p><p><span class="k">WHAT CLOSES IT</span>' + esc(q.fix) + "</p>" +
        (q.ce ? '<p><span class="k">RELATED CE</span><a class="rc-ln" href="' + q.ce[2] + '" target="_blank" rel="noopener">' + esc(q.ce[0]) + " (" + q.ce[1] + ')<span class="rc-hp"> (Opens in a New Tab)</span></a></p>' : "") + "</div>";
    }).join("") : '<div class="rc-ready"><b>No gaps flagged.</b> You answered Yes to all 8 questions. Keep the binder current as your menu, staff and state rules change.</div>';
    var readyHtml = ready.length && g.length ? '<div class="rc-ready"><span class="rc-lbl">ALREADY IN PLACE</span><ul>' + ready.map(function (q) { return "<li>" + esc(q.text) + "</li>"; }).join("") + "</ul></div>" : "";
    return '<h2 id="rc-h" tabindex="-1">Your State Blueprint</h2>' +
      '<div class="rc-score"><div><b>' + ready.length + ' of 8</b><br><span>READY TODAY</span></div><div><b>' + g.length + '</b><br><span>' + (g.length === 1 ? "GAP" : "GAPS") + " TO CLOSE</span></div></div>" +
      '<div class="rc-res"><div>' + gapHtml + readyHtml + '</div><div>' +
      '<div class="rc-next"><p class="t">YOUR NEXT STEP \u00B7 ' + esc(p.tag.toUpperCase()) + "</p><h3>" + esc(p.name) + '</h3><p class="p">' + esc(p.price) + "</p><p>" + esc(p.line) + "</p>" +
      '<a class="rc-btn" href="' + p.cta[1] + '"' + (p.cta[2] ? ' target="_blank" rel="noopener"' : "") + ">" + esc(p.cta[0]) + (p.cta[2] ? '<span class="rc-hp"> (Opens in a New Tab)</span>' : "") + "</a>" +
      '<a class="more" href="' + SERV + '">See All Solutions & Pricing</a></div>' + side +
      '<div class="rc-side"><span class="rc-lbl">WHAT IT COSTS</span><p style="margin:6px 0 0"><b>21 of 35</b> ended in 3 years\u2019 license probation. Median Cost Recovery owed to the Board was <b>$10,000</b> (21 cases); the highest was <b>$74,297</b>.</p><p class="rc-note" style="margin:6px 0 0">Cost Recovery excludes attorney fees, probation monitoring and lost income.</p></div>' +
      "</div></div>" +
      '<form class="rc-form" id="rc-form" novalidate><h3>Send Me My Blueprint</h3><p class="rc-note" style="margin:0">We\u2019ll email your Blueprint from info@aestheticnursingpnp.com.</p>' +
      '<div class="row"><div><label for="rc-fn">FIRST NAME</label><input id="rc-fn" name="first_name" autocomplete="given-name" required></div><div><label for="rc-ln">LAST NAME</label><input id="rc-ln" name="last_name" autocomplete="family-name" required></div><div><label for="rc-em">EMAIL</label><input id="rc-em" name="email" type="email" autocomplete="email" required></div></div>' +
      '<div><label for="rc-nt">ANYTHING ELSE? (OPTIONAL)</label><textarea id="rc-nt" name="note" rows="3"></textarea></div><div class="rc-hp" aria-hidden="true"><label for="rc-web">Website</label><input id="rc-web" name="website" tabindex="-1" autocomplete="off"></div>' +
      '<p class="rc-err" id="rc-err" role="alert" hidden></p><div class="rc-nav" style="border:0;padding-top:6px;margin-top:10px"><button class="rc-btn" type="submit" id="rc-send">Send My Blueprint</button><button class="rc-btn sec" type="button" id="rc-print">Print</button></div>' +
      '<div class="rc-ok" id="rc-ok" tabindex="-1" hidden></div></form>' +
      '<p class="rc-disc">From <a href="' + RES + '">The Accusation Review \u00B7 2026</a>, drawn from 35 publicly filed California licensing Board Accusations, anonymized and simplified. Each case turns on its own facts. Education only, not legal advice; a customized manual does not guarantee a licensing outcome. Consult a healthcare attorney about your situation.</p>';
  }
  function summary() {
    var g = gaps(), p = PATHS[route()];
    var L = ["State Blueprint \u00B7 Board Readiness Check", "State: " + stateName(S.state), "Role: " + ((ROLES.filter(function (r) { return r.id === S.role; })[0] || {}).label || ""), "Ready: " + (8 - g.length) + " of 8", ""];
    Q.forEach(function (q) { L.push(q.n + " [" + ({ yes: "Yes", no: "No", unsure: "Not Sure" }[S.a[q.id]] || "") + "] " + q.text); });
    L.push("", "Suggested Next Step: " + p.tag + " \u2013 " + p.name + " (" + p.price + ")");
    return L.join("\n");
  }
  function render(focus) {
    var app = document.getElementById("rc-app"); if (!app) return;
    var body = [v0, v1, v2][S.step]();
    var last = S.step === 2;
    var hint = S.step === 1 ? answered() + " of 8 answered" : S.step === 0 ? "Step 1 of 3" : "";
    app.innerHTML = stepper() + '<div id="rc-body">' + body + "</div>" + (last ? '<div class="rc-nav"><button type="button" class="rc-btn sec" data-nav="-1">Back</button><button type="button" class="rc-btn sec" data-restart>Start Over</button></div>'
      : '<div class="rc-nav">' + (S.step ? '<button type="button" class="rc-btn sec" data-nav="-1">Back</button>' : "") + '<button type="button" class="rc-btn" data-nav="1"' + (ok(S.step) ? "" : " disabled") + ">" + (S.step === 1 ? "See My Blueprint" : "Continue") + '</button><span class="rc-hint" aria-live="polite">' + hint + "</span></div>");
    bind();
    if (focus) { var h = document.getElementById("rc-h"); if (h) { h.focus({ preventScroll: true }); var top = app.getBoundingClientRect().top + window.scrollY - 90; window.scrollTo({ top: top, behavior: "smooth" }); } }
  }
  function refreshNav() {
    var n = document.querySelector('#rc-app [data-nav="1"]'); if (n) n.disabled = !ok(S.step);
    var h = document.querySelector("#rc-app .rc-hint"); if (h && S.step === 1) h.textContent = answered() + " of 8 answered";
    var st = document.querySelector("#rc-app .rc-steps"); if (st) st.outerHTML = stepper();
    document.querySelectorAll("#rc-app [data-go]").forEach(function (b) { b.onclick = go; });
  }
  function go(e) { var i = +e.currentTarget.dataset.go; if (!e.currentTarget.disabled) { S.step = i; render(true); } }
  function bind() {
    var app = document.getElementById("rc-app");
    app.querySelectorAll("[data-go]").forEach(function (b) { b.onclick = go; });
    app.querySelectorAll("[data-nav]").forEach(function (b) { b.onclick = function () { var d = +b.dataset.nav; if (d > 0 && !ok(S.step)) return; S.step = Math.max(0, Math.min(2, S.step + d)); render(true);
      if (S.step === 2) try { window.gtag && window.gtag("event", "blueprint_complete", { gaps: gaps().length, page_path: location.pathname }); } catch (x) {} }; });
    var rs = app.querySelector("[data-restart]"); if (rs) rs.onclick = function () { S.a = {}; S.step = 0; S.sent = false; render(true); };
    var sel = app.querySelector("#rc-state"); if (sel) sel.onchange = function () { S.state = sel.value; refreshNav(); };
    app.querySelectorAll("[data-role]").forEach(function (b) { b.onclick = function () { S.role = b.dataset.role; app.querySelectorAll("[data-role]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); refreshNav(); }; });
    app.querySelectorAll("[data-q]").forEach(function (b) { b.onclick = function () { S.a[b.dataset.q] = b.dataset.v;
      var row = b.closest(".rc-q"); row.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); row.classList.toggle("gap", b.dataset.v !== "yes"); refreshNav(); }; });
    var pr = app.querySelector("#rc-print"); if (pr) pr.onclick = function () { window.print(); };
    var f = app.querySelector("#rc-form");
    if (f) f.onsubmit = function (e) {
      e.preventDefault();
      var fn = f.first_name.value.trim(), ln = f.last_name.value.trim(), em = f.email.value.trim(), err = app.querySelector("#rc-err");
      if (f.website.value) return;
      if (!fn || !ln || !/^\S+@\S+\.\S+$/.test(em)) { err.hidden = false; err.textContent = "Please enter your first name, last name and a valid email."; (fn ? ln ? f.email : f.last_name : f.first_name).focus(); return; }
      err.hidden = true; var btn = app.querySelector("#rc-send"); if (btn.disabled) return; btn.disabled = true; btn.textContent = "Sending\u2026";
      var done = function (emailed) {
        var okb = app.querySelector("#rc-ok"); okb.hidden = false;
        okb.innerHTML = "<p style=\"margin:0 0 4px\"><b>Thank you, " + esc(fn) + ".</b> " + (emailed === false ? "Cindi has your Blueprint and will email it to " + esc(em) + " within two business days." : "Your Blueprint is on its way to " + esc(em) + " from info@aestheticnursingpnp.com. Cindi will reply within two business days to schedule your free consult.") + (window.__PDF_GATE_PREVIEW__ ? " (Preview: nothing is actually sent here.)" : "") + "</p>" +
          '<div class="rc-push"><p class="t">BUILD YOUR MANUAL</p><h3>Your Next Move: The Manual Builder</h3><p>Your Blueprint shows where your binder has gaps. The Manual Builder creates your state-specific Policy and Procedure manual set, branded for your practice and ready for you and your Medical Director to review and approve.</p>' +
          '<a class="rc-btn" href="https://theaestheticmanual.com/" target="_blank" rel="noopener">Start Your Manual<span class="rc-hp"> (Opens in a New Tab)</span></a><a class="more" href="' + IXP(ROOT + "manual-builder/") + '">See How It Works</a></div>';
        okb.focus(); btn.textContent = "Sent";
        try { window.gtag && window.gtag("event", "generate_lead", { form_name: "binder_blueprint", page_path: location.pathname }); } catch (x) {}
      };
      if (window.__PDF_GATE_PREVIEW__) { setTimeout(done, 300); return; }
      var fail = function (msg) { btn.disabled = false; btn.textContent = "Send My Blueprint"; err.hidden = false; err.textContent = msg || "Sorry, that didn\u2019t send. Please try again or email info@aestheticnursingpnp.com."; };
      fetch(window.__BLUEPRINT_API__ || "https://anps-manual-builder.onrender.com/api/blueprint", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: fn, last_name: ln, email: em, state: stateName(S.state), role: S.role, answers: S.a, note: f.note.value.trim(), website: f.website.value, page: location.pathname }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || ""); done(j.emailed); }); })
        .catch(function (x) { fail(x && x.message); });
    };
  }
  var MOUNTED = typeof WeakSet === "function" ? new WeakSet() : null;
  function live(el) { return el && el.isConnected && !el.closest("x-dc,template"); }
  function mount() {
    var app = document.getElementById("rc-app");
    if (!live(app)) return false;
    if (MOUNTED ? MOUNTED.has(app) : app.__rc) return true;
    if (MOUNTED) MOUNTED.add(app); else app.__rc = 1;
    if (!document.getElementById("rc-css")) { var s = document.createElement("style"); s.id = "rc-css"; s.textContent = CSS; document.head.appendChild(s); }
    app.classList.add("rc"); render(false);
    document.querySelectorAll('a[href="#rc-app"]').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var h = document.getElementById("rc-h"); var top = app.getBoundingClientRect().top + window.scrollY - 90; window.scrollTo({ top: top, behavior: "smooth" }); if (h) h.focus({ preventScroll: true }); }; });
    return true;
  }
  var pend = false;
  new MutationObserver(function () { if (pend) return; pend = true; setTimeout(function () { pend = false; mount(); }, 30); }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "complete") setTimeout(mount, 50); else window.addEventListener("load", function () { setTimeout(mount, 50); });
})();

/* ============================================================
   SINGLE SOURCE OF TRUTH — every fact, price and rule used by the
   Binder Blueprint lives here, tagged to a source id in SOURCES.
   Change a fact here and it changes everywhere (zero drift).
   ============================================================ */

window.SOURCES = {
  redesign:  { label: "Aesthetic Nursing P&P site redesign (Claude artifact)", url: "https://claude.ai/artifact/4DcY42Bfv8rQeRtACnNFE5", checked: "Sep 28, 2026" },
  pnp_pdf:   { label: "Aesthetic Nursing P&P — Customized Policies list (PDF)", url: "", checked: "Sep 28, 2026" },
  kwmap:     { label: "Cindi Keyword Map — board-site review, Sept 2026 (internal)", url: "", checked: "Sep 2026" },
  tvga:      { label: "The TVGA Method, built for Cindi (internal)", url: "", checked: "Sep 2026" },
  plan90:    { label: "Cindi 90-Day Plan (internal)", url: "", checked: "Sep 2026" },
  command:   { label: "Cindi Command Center (internal)", url: "", checked: "Sep 28, 2026" },
  mss_inj:   { label: "MedSpa Standards — Injectables page", url: "https://medspastandards.com/injectables-protocols", checked: "Sep 28, 2026" },
  mss_home:  { label: "MedSpa Standards — Home", url: "https://medspastandards.com/", checked: "Sep 28, 2026" },
  mss_suite: { label: "MedSpa Standards — Complete Suite", url: "https://medspastandards.com/complete-suite", checked: "Sep 28, 2026" },
  mss_state: { label: "MedSpa Standards — Regulations by State", url: "https://medspastandards.com/med-spa-regulations-by-state", checked: "Sep 28, 2026" },
  mss_emerg: { label: "MedSpa Standards — Emergency Protocols", url: "https://medspastandards.com/emergency-protocols", checked: "Sep 28, 2026" },
  mss_ops:   { label: "MedSpa Standards — Operations & Compliance", url: "https://medspastandards.com/operations-compliance", checked: "Sep 28, 2026" },
  amspa24:   { label: "AmSpa — 2024 State of the Industry recap", url: "https://www.americanmedspa.org/news/2024-medical-spa-state-of-the-industry-executive-report-recap/", checked: "Sep 28, 2026" },
  nydos:     { label: "New York Department of State — Jan 8, 2026", url: "https://dos.ny.gov/news/new-york-department-state-issues-warning-consumers-after-investigations-med-spa-service", checked: "Sep 28, 2026" },
  cmf:       { label: "CMF Group — NYC Council OID findings", url: "https://www.cmfgroup.com/blog/medical-spa/medical-spa-regulations-are-tightening-what-increased-scrutiny-means-for-med-spa-owners/", checked: "Sep 28, 2026" },
  fda:       { label: "AmSpa — FDA warning letter to a Texas medical spa", url: "https://www.americanmedspa.org/news/fda-warning-letter-to-texas-medical-spa-signals-increased-compliance-enforcement/", checked: "Sep 28, 2026" },
  hk:        { label: "Holland & Knight — Medical Spa Compliance Under the Microscope (Aug 5, 2026)", url: "https://www.hklaw.com/en/insights/publications/2026/08/medical-spa-compliance-under-the-microscope", checked: "Sep 28, 2026" },
  tx3749:    { label: "Polsinelli — What Texas's New IV Therapy Law Really Says", url: "https://www.polsinelli.com/publications/new-texas-iv-therapy-law", checked: "Sep 28, 2026" },
  cabrn:     { label: "CA BRN — Standardized Procedure Requirements (NPR-B-20)", url: "https://www.rn.ca.gov/pdfs/regulations/npr-b-20.pdf", checked: "Sep 28, 2026" }
};

/* ---------- Brand + offer config (prices from the redesign) ---------- */
window.BRAND = {
  company: "Aesthetic Nursing Policy & Procedures, Inc.",
  founder: "Cindi Vokey, BSN, RN",
  provider: "CA BRN CE Provider #18009",
  years: "18+ years in aesthetic nursing",
  city: "San Diego, CA",
  disclaimer: "Consulting and education services. Not a law firm and not legal advice.",
  src: "redesign"
};

window.OFFERS = {
  audit:     { name: "Compliance Readiness Audit", price: "$1,500 one-time", note: "Credited toward a Custom Manual booked within 60 days.", includes: ["Pre-audit document review","90-minute walkthrough with owner & medical director","Scored gap report across 10 risk areas","Prioritized 30-day correction plan"], src: "redesign" },
  manual:    { name: "Custom State-Specific Manual", price: "From $4,500 single location", note: "IV therapy, GLP-1/weight management and hormone modules +$750 each.", includes: ["Standardized procedures that meet your state's criteria","Treatment protocols, drug & device formulary","Delegation, supervision & provider competencies","Consent, charting, adverse-event & inspection-response protocols","Two team trainings with competency sign-offs","Staff CE plan mapped to your manual"], src: "redesign" },
  partner:   { name: "Compliance Partner", price: "$495 / month", note: "$4,950 billed annually (two months free).", includes: ["State regulatory alerts with plain-language action steps","Annual manual update","Quarterly self-audit & review call","Monthly office hours for owners and leads","New-hire competency onboarding kit","Owner Annual All-Access CE pass"], src: "redesign" },
  growth:    { name: "Growth-Ready: Expansion & Acquisition", price: "From $7,500 / location", note: "Coordinated with your healthcare attorney.", includes: ["Multi-state gap analysis","Harmonized documents across locations","A due-diligence evidence file"], src: "redesign" },
  probation: { name: "Investigation & Probation Support", price: "By consult", note: "For nurses and providers facing a Board complaint, investigation or accusation, or on probation. Coordinated with your attorney.", includes: ["Cindi reviews your situation personally","Coordinated with your attorney"], src: "redesign" },
  accel:     { name: "RN-to-Owner Accelerator", price: "Cohort $3,997 · Private $8,500", note: "12 weeks. Cohort limited to 12 nurses. Private includes a Custom Practice Specific Manual.", includes: ["An Owner's Compliance Roadmap for your state","A Starter Policy & Consent Set","A Medical Director Agreement Checklist","An Inspection-Response Protocol","A 90-Day Launch Plan, reviewed one-on-one","A year of Annual All-Access CE"], src: "redesign" },
  ce_all:    { name: "Annual All-Access CE", price: "$599 / year", note: "Every current and future course, instant certificates, and the Employment Compliance bundle.", includes: ["CE from a CA BRN-Approved Provider (CEP #18009)","Self-paced, 24/7, instant certificates"], src: "redesign" },
  ce_team:   { name: "Practice Team Pass", price: "$1,495 / year, up to 5 staff", note: "All-Access for your clinical team, a completion log for your binder, and a quarterly live Q&A.", includes: ["All-Access for up to 5 staff","Completion log for your binder","Quarterly live Q&A"], src: "redesign" },
  ce_bundle: { name: "Practice Compliance CE bundle", price: "$360", note: "One of four bundles: Compliance Essentials $150 · Regulatory Guidelines $210 · Practice Compliance $360 · Employment $109.", includes: [], src: "redesign" },
  digital:   { name: "Digital, Marketing & Privacy Review", price: "$1,250 add-on", note: "E-consent and intake, EMR workflows, telehealth and GLP-1 claims, before-and-afters, AI consult tools and HIPAA vendor agreements.", includes: [], src: "redesign" }
};

window.CE_COURSES = {
  vo:   { name: "Management of Vascular Occlusions", meta: "2 CE · $80" },
  gfe:  { name: "The Good Faith Exam", meta: "1 CE · $40" },
  sp:   { name: "Standardized Procedures: An Overview", meta: "1 CE · $40" },
  neuro:{ name: "Neuromodulator Treatments of the Face & Neck", meta: "1 CE · $40" },
  hyal: { name: "A Review of Hyaluronidase", meta: "1 CE · $40" },
  ha:   { name: "HA Dermal Fillers: History, Rheology & Regulations", meta: "1 CE · $40" },
  consent:{ name: "Informed Consent: A Comprehensive Overview", meta: "1 CE · $40" },
  c2a:  { name: "From Complaint to Accusation", meta: "2 CE · $80" }
};

/* ---------- Treatment fields, verbatim from the customized P&P list ---------- */
window.MENU = [
  { group: "General requirements", locked: true, note: "Every binder starts here.", items: [
    { id: "bbp", name: "Blood Borne Pathogens & Exposure Control Plan with Sharps Injury Log" },
    { id: "up",  name: "Universal Precautions" },
    { id: "hipaa", name: "HIPAA Privacy & Security" },
    { id: "gfe", name: "General Aesthetic Medical & GFE Guidelines", optional: true },
    { id: "form",name: "Drug & Device Formulary" } ] },
  { group: "Aesthetic injectables", items: [
    { id: "neuro", name: "Neuromodulator Treatments", tag: "neuro" },
    { id: "hyper", name: "Neuromodulator Treatments for Hyperhidrosis", tag: "neuro" },
    { id: "ha",    name: "Hyaluronic Acid (HA) Dermal Fillers", tag: "filler" },
    { id: "hylen", name: "Hylenex / Hyaluronidase Treatments", tag: "filler" },
    { id: "sculp", name: "Sculptra Aesthetic Treatments", tag: "bio" },
    { id: "hsculp",name: "Hyperdilute Sculptra Treatments", tag: "bio" },
    { id: "rad",   name: "Radiesse Treatments", tag: "bio" },
    { id: "hrad",  name: "Hyperdilute Radiesse Treatments", tag: "bio" },
    { id: "prpha", name: "PRP/PRF with HA Filler", tag: "filler" },
    { id: "prp",   name: "PRP/PRF Aesthetic Injections" },
    { id: "ezgel", name: "EZ Gel Treatments" },
    { id: "kyb",   name: "Kybella Treatments" } ] },
  { group: "Emergency & adverse events", auto: "injectables", note: "Added automatically when you inject.", items: [
    { id: "vo",  name: "Vascular Occlusion Protocol" },
    { id: "ae",  name: "Adverse Event Protocols (granulomas, nodules & biofilm, infection, syncope, reactions)" } ] },
  { group: "Non-invasive aesthetic", items: [
    { id: "mn",   name: "Microneedling Treatments" },
    { id: "mnprp",name: "Microneedling with PRP/PRF Treatments" },
    { id: "peel", name: "Chemical Peels" },
    { id: "derm", name: "Dermaplaning" } ] },
  { group: "Laser, light & energy devices", items: [
    { id: "llbd", name: "General Laser Light Energy Based Therapy (LLBD)" },
    { id: "body", name: "BodySculpt & Body Tone Treatments" },
    { id: "m8",   name: "Morpheus8 / Microneedling with RF" },
    { id: "cryo", name: "Cryolipolysis Treatments" },
    { id: "hifem",name: "HIFEM Emsculpt / Emtone" },
    { id: "hifu", name: "HIFU Treatments" },
    { id: "sof",  name: "Sofwave Treatments" },
    { id: "thermi",name: "ThermiVa" } ] },
  { group: "Wellness", items: [
    { id: "fprp", name: "Female PRP/PRF Shot Procedure" },
    { id: "mprp", name: "Male PRP/PRF Shot Procedure" },
    { id: "iv",   name: "IV Therapy with Additives & Injections (includes NAD)", module: "IV therapy" },
    { id: "trt",  name: "HRT Testosterone Injections", module: "Hormone" },
    { id: "pel",  name: "HRT Pellet Procedure", module: "Hormone" },
    { id: "glp",  name: "GLP-1 Compounds", module: "GLP-1 / weight management" } ] },
  { group: "Patient self-administered", items: [
    { id: "nox",  name: "Pro-Nox Delivery System" },
    { id: "lat",  name: "Latisse" },
    { id: "upn",  name: "Upneeq" } ] },
  { group: "Other", items: [
    { id: "pdo",  name: "PDO Thread Procedure" },
    { id: "scl",  name: "Sclerotherapy Treatments" },
    { id: "addf", name: "Additional Drug & Device Formulary" },
    { id: "anc",  name: "Ancillary Treatment Orders" },
    { id: "addp", name: "Additional Authorized Providers" } ] }
];

window.ALWAYS_INCLUDED = [
  "Standardized procedure requirements when an RN, NP or PA performs aesthetic medical treatments",
  "Standing orders (when applicable)",
  "Updates & revision section",
  "Annual review section"
];

/* ---------- CE acceptance, 51 jurisdictions (TVGA / board-site review, Sept 2026) ---------- */
window.CE = {
  ACC: ["AL","AZ","AR","CA","CO","CT","DC","GA","ID","IL","IN","IA","KS","KY","LA","ME","MA","MI","MN","MS","MO","MT","NE","NV","NH","NM","NY","NC","ND","OH","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
  CHECK: ["AK","FL","HI","NJ","OK"],
  NO: ["DE","MD"],
  NOREQ: ["AZ","CO","ID","IN","ME","MS","MO","MT","NY","SD","VT","WI","WY"],
  HRS: {AL:"24 hrs / 2 yrs",AR:"15 hrs / 2 yrs",CA:"30 hrs / 2 yrs",DC:"24 hrs / 2 yrs",GA:"30 hrs / 2 yrs",IL:"20 hrs / 2 yrs",KS:"30 hrs / 2 yrs",KY:"14 hrs / yr",LA:"30 hrs / 2 yrs",MA:"15 hrs / 2 yrs",MI:"25 hrs / 2 yrs",MN:"24 hrs / 2 yrs",NE:"20 hrs / 2 yrs + practice",NV:"30 hrs / 2 yrs",NH:"30 hrs / 2 yrs",NM:"30 hrs / 2 yrs",NC:"Options, e.g. 30 hrs / 2 yrs",OH:"24 hrs / 2 yrs",OR:"Practice hours",PA:"30 hrs / 2 yrs",RI:"10 hrs / 2 yrs",SC:"30 hrs / 2 yrs",TN:"2 of 14 options / 2 yrs",TX:"20 hrs / 2 yrs",UT:"30 hrs / 2 yrs",VA:"Options, e.g. 30 hrs / 2 yrs",WA:"45 hrs / 3 yrs + practice",WV:"12 hrs / 2 yrs",CT:"See CT DPH page",IA:"Sources conflict",ND:"Sources conflict"}
};

window.STATE_NAMES = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"};

/* ---------- 23-state deep review (Keyword Map, Sept 2026). [aesType, wave, whyNow, question, answer] ---------- */
window.DEEP = {
  AZ:["Specific",2,"The Board's aesthetic advisory opinion was revised in Nov 2025: neuromodulators, fillers, PRP and threads are Level III.","Can an RN inject Botox in Arizona?","Yes, under the Arizona Board of Nursing's advisory opinion (revised November 2025). Neuromodulators and fillers are Level III: RN or APRN only, a licensed practitioner's order, written consent, and supervision by a practitioner trained in aesthetics. An initial exam by a qualified practitioner is required; telemedicine is allowed."],
  CA:["Specific",1,"SB 351 took effect Jan 1, 2026 and limits MSO interference with clinical judgment. RNs inject under standardized procedures after a good faith exam.","Does an RN need a good faith exam before Botox in California?","Yes. In California an RN may inject only under physician-signed standardized procedures, after a good faith exam by a physician, NP or PA. The RN cannot perform the exam or issue the order. CE: 30 contact hours every two years from a BRN or nationally accredited provider."],
  CO:["General",3,"No aesthetic-specific statement. The Board requires a written plan, protocol or orders.","Can an RN do Botox in Colorado without a doctor?","Colorado has no aesthetic-specific nursing guidance. General rules require a written plan, protocol or orders. Colorado doesn't require CE for RN renewal."],
  GA:["General",1,"In May 2026 the Composite Medical Board issued a statement on \"matchmaker\" medical directors, clarified in June as creating no new law.","What are the medical director requirements for a med spa in Georgia?","As of 2026, Georgia nurses may give treatments authorized by protocol (O.C.G.A. 43-26). A May 2026 medical board statement on \"matchmaker\" medical directors was clarified in June as creating no new law. Georgia accepts CE from any state board of nursing's approved providers."],
  IL:["General",1,"The IDFPR/IDPH memo (Oct 30, 2025) says physicians or full-practice APRNs own the med spa.","Can a nurse own a med spa in Illinois?","Under an October 2025 IDFPR/IDPH memo, med spa ownership in Illinois sits with physicians or full-practice APRNs, not RNs. RNs deliver medications under written policies in a qualified facility. CE: 20 hours every two years; other states' board-approved providers count."],
  MD:["None found",3,"Maryland limits CE approvers to listed national and nursing-association bodies (COMAR 10.27.01.13H).","Does California-approved CE count in Maryland?","Not on its own. Maryland accepts CE only from listed national or nursing-association approvers, not other state boards. ANCC-accredited courses are the safer route."],
  MA:["Specific",1,"A med spa owner was sentenced to 46 months in a counterfeit Botox case (Sept 2026). Advisory ruling AR 13-01 governs RN injections.","Can RNs do cosmetic injections in Massachusetts?","Yes, under advisory ruling AR 13-01: RNs may assess and must follow written orders from a licensed provider, but can't order medication. Policies, procedures and documented competency are required. CE: 15 hours every two years."],
  MI:["General",3,"Approved protocols are required. Prescriptions are issued in the supervising physician's name.","Can a nurse inject Botox in Michigan?","In Michigan, approved protocols must be in place, and prescriptions go out in the supervising physician's name under that physician's protocols. CE: 25 hours every two years, including pain management and implicit bias."],
  MN:["None found",3,"No aesthetic-specific guidance, so lead with the CE angle.","Does California CE count for Minnesota RN renewal?","Minnesota accepts CE \"approved by a health licensing board or association.\" RNs need 24 hours every two years. There's no aesthetic-specific board guidance."],
  MS:["General",3,"A written order and facility policies are required.","Can an RN do Botox in Mississippi?","Mississippi requires a written order and current facility policies and procedures supporting the task. No CE is required for routine renewal."],
  MO:["None found",2,"Relaxed ownership: non-physicians may own the business with a physician director.","Can a nurse own a med spa in Missouri?","Missouri is one of the more relaxed ownership states: non-physicians may own the business, but a physician medical director must oversee clinical work. No CE is required for RN renewal."],
  MT:["Specific",2,"The Board's med spa FAQ lets trained RNs inject prescribed medications; laser hair removal is a medical procedure.","Can RNs inject in a Montana med spa?","Yes. Montana's med spa FAQ lets RNs and LPNs with training, education and supervision inject prescribed medications as part of a treatment plan, but not diagnose or prescribe. No CE is required for renewal."],
  NE:["Specific",2,"The Board has an advisory opinion on cosmetic and dermatologic procedures.","What does the Nebraska Board of Nursing say about cosmetic procedures?","Nebraska publishes an advisory opinion on cosmetic and dermatologic procedures by nurses. CE: 20 hours plus 500 practice hours every two years, from approved or nationally approved providers."],
  NV:["Specific",2,"The Aesthetic Practice Decision (Jan 2025) requires training, competency validation, protocols and a practitioner's order.","What training does an RN need to inject in Nevada?","Nevada's Aesthetic Practice Decision (January 2025) requires an instructional program, proven proficiency for each procedure, ongoing competency checks, written protocols approved by a qualified practitioner, and an order after that practitioner's assessment. CE: 30 hours every two years."],
  NJ:["None found",1,"S2996 (Mar 30, 2026) freed most APNs from joint protocols but kept them for aesthetic APNs.","Do nurse practitioners need a collaborating physician for Botox in New Jersey?","Yes. S2996, signed March 30, 2026, removed the joint protocol for many experienced APNs but explicitly kept it for APNs providing elective aesthetic or cosmetic services. Check with the board before counting California CE; the sources conflict."],
  NY:["General",1,"State inspections: 200+ med spas inspected and 87 cited; 15 of 15 had violations in 2024.","What do New York med spa inspections check?","New York inspected 200+ med spas and cited 87 (NY DOS, Jan 2026); in a 2024 sweep, 15 of 15 had violations. Nurse practice protocols must reflect current accepted practice. There's no general CE hour requirement, but infection control is due every 4 years."],
  NC:["Specific",2,"The Board's position statement (Feb 2024) puts cosmetic procedures within RN and LPN scope when ordered.","Can RNs do cosmetic injections in North Carolina?","Yes. The North Carolina Board of Nursing's February 2024 position statement puts cosmetic procedures within RN and LPN scope when a physician, NP, PA or other prescriber orders them and all criteria are met, including employer policies. CE from any state board of nursing counts."],
  OH:["Specific",2,"Interpretive guideline 07 covers RN cosmetic injections.","Can an RN inject Botox in Ohio?","Yes, with orders and demonstrated competency, per Ohio Board of Nursing interpretive guideline 07. CE: 24 hours every two years, including 1 hour of Ohio law and rules."],
  PA:["None found",3,"No aesthetic-specific guidance. The CE angle leads: 30 hours, including child abuse recognition.","Does California CE count in Pennsylvania?","Yes. Pennsylvania accepts CE approved by a board in another jurisdiction. RNs need 30 hours every two years, including 2 hours of child abuse recognition."],
  UT:["None found",3,"Relaxed ownership; the rule definitions accept CE approved by any state board.","Can a nurse own a med spa in Utah?","Utah is one of the more relaxed ownership states: non-physicians may own the business with a physician director overseeing clinical work. Utah's rule definitions include CE approved by any state board of nursing."],
  TX:["Specific",1,"Jenifer's Law (HB 3749, effective Sept 1, 2025): only RNs or above may give elective IV therapy. TMB Rule 169.28 requires written delegation.","Can LVNs do IV therapy in a Texas med spa?","No. Under Jenifer's Law (HB 3749, effective September 1, 2025), elective IV therapy outside a licensed facility must be ordered by a physician, APRN or PA and given by an RN or above. TMB Rule 169.28 requires all delegation in writing. Texas human trafficking CE must be BON-approved."],
  VA:["None found",3,"No aesthetic-specific guidance. The CE angle leads.","Does California CE count in Virginia?","Yes. Virginia accepts CE from \"a state or federal government agency,\" and the CA BRN is one. RN options include 30 hours, or 15 hours plus 640 practice hours, every two years."],
  WA:["General",1,"The health department is reviewing rules for injectables, microneedling, IV hydration and energy devices.","What are Washington's new med spa rules for injectables?","As of 2026, Washington's health department is reviewing rules for injectables, microneedling, IV hydration and energy devices; nothing is final yet. Today, the scope decision tree asks whether practice-setting policies support the activity. CE: 45 hours plus 531 practice hours every three years."]
};

/* ---------- Self-audit (verbatim items from the redesign's 15-question audit), mapped to the 32-accusation review ---------- */
window.AUDIT = [
  { id: "q01", n: "01", text: "Written standardized procedures exist for every treatment we offer, meet our state's criteria, and are signed by the medical director.", finding: "22 of 32 accusations cited missing or insufficient standardized procedures.", weight: 3, ce: "sp" },
  { id: "q02", n: "02", text: "Our P&Ps were written for our state and scope, not adapted from a generic or association template.", finding: "In the review, a national association's policy set did not meet standardized procedure criteria.", weight: 3, ce: "sp" },
  { id: "q03", n: "03", text: "Every patient has a documented good faith exam by a physician, NP or PA before treatment begins.", finding: "17 of 32 cited no good faith exam before treatment.", weight: 2, ce: "gfe" },
  { id: "q05", n: "05", text: "Our medical director agreement defines supervision duties, and chart reviews are logged.", finding: "19 of 32 cited inadequate physician oversight or supervision.", weight: 2, ce: "c2a" },
  { id: "q07", n: "07", text: "Every chart includes medical history, treatment-specific consent, product, dose and correct lot number.", finding: "8 of 32 cited documentation failures: charts, consent, lot numbers.", weight: 1, ce: "consent" },
  { id: "q11", n: "11", text: "All products are purchased through a legitimate U.S. supply chain, under our own license.", finding: "5 of 32 involved non-FDA-approved or foreign-sourced product.", weight: 1 },
  { id: "q15", n: "15", text: "If the Board requested our P&Ps today, we could send them within 24 hours.", finding: "Case A: \"The Board asked for her Standardized Procedures. There were none to send.\"", weight: 2 }
];

window.ACCUSATION = { total: 32, harm: 7, sp: 22, probation: 20, median: "$7,592", avg: "$13,078", high: "$74,297", sum: "$261,567", gapYears: "about three years", src: "redesign" };

/* ---------- Roles, goals, timing ---------- */
window.ROLES = [
  { id: "owner",    label: "Practice Owner", sub: "I run the practice and sign the checks." },
  { id: "planning", label: "RN / NP / PA Planning to Open", sub: "The name's picked. The binder isn't." },
  { id: "md",       label: "Medical Director", sub: "My signature is on their standing orders." },
  { id: "manager",  label: "Practice Manager", sub: "I'm the one who finds the binder." },
  { id: "complaint",label: "Facing a Board Complaint", sub: "A letter came. I need someone who's read one." }
];
window.LICENSES = ["RN","NP","PA","MD / DO","LVN / LPN","Esthetician"];
window.LOCATIONS = [ {id:"1",label:"1 location"}, {id:"2-3",label:"2–3 locations"}, {id:"4+",label:"4+ locations"} ];
window.GOALS = [
  { id: "inspect", label: "Be inspection-ready", sub: "Hand a surveyor the binder without flinching." },
  { id: "add",     label: "Add a service line", sub: "IV, GLP-1, hormones, a new device." },
  { id: "expand",  label: "Expand, add investors or sell", sub: "Due diligence reads the binder first." },
  { id: "ce",      label: "Just my CE / my team's CE", sub: "Renewal is coming up." },
  { id: "marketing",label:"Check my marketing & privacy", sub: "Before-and-afters, GLP-1 claims, e-consent." }
];
window.TIMING = [
  { id: "now",     label: "A letter or an inspection is already here", heat: 3 },
  { id: "30",      label: "In the next 30 days", heat: 2 },
  { id: "quarter", label: "This quarter", heat: 1 },
  { id: "ready",   label: "Just getting ready", heat: 0 }
];

/* ---------- Keyword entry points (TVGA Signals) — prefill the blueprint from a DM link ---------- */
window.KEYWORDS = {
  MAP:       { asset: "The 51-state CE acceptance map: 44 accept CA BRN, 5 check first, 2 don't", next: "ce_all", prefill: { goal: "ce" } },
  STATE:     { asset: "That state's board line, hours and mandated topics", next: "ce_all", prefill: {} },
  BINDER:    { asset: "Quarterly self-audit categories, one page", next: "audit", prefill: { goal: "inspect" } },
  REVIEW:    { asset: "Intake form for a nurse to read your binder the way an inspector would", next: "audit", prefill: { goal: "inspect" } },
  KIT:       { asset: "A 60-second vascular occlusion readiness drill for the team", next: "manual", prefill: { menu: ["ha","vo"] } },
  LOCATIONS: { asset: "A diff sheet: one protocol page checked across every site", next: "growth", prefill: { loc: "4+", goal: "expand" } },
  HOURS:     { asset: "A plan for spending 30 contact hours on what you actually inject", next: "ce_bundle", prefill: { goal: "ce" } }
};

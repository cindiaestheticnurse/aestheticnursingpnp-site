/* Brand text rules:
   1) Titles (h1–h3, legends, FAQ questions, card titles) use Title Case: every word capitalized
      except short connecting words (a, an, the, and, or, of, to, in…) unless first or last.
   2) Subtitles / captions always begin with a capital letter.
   Existing capitals (P&Ps, CE, RN, FDA, GLP-1) are never lowered. */
(function(){
  const MINOR = new Set(['a','an','the','and','but','or','nor','for','so','yet','as','at','by','in','of','off','on','per','to','up','via','vs','vs.','with','from','into','than']);
  const TITLE_SEL = 'h1,h2,h3,legend,.tabs .tab,.steps .l,.back,.faq-item button > span:first-child,.case-tabs button span,.tablist b,.way h3,.offer h3,.cmp tbody th b,.audit-side h3,.dcard b,.choice b,.qf-quote figcaption,.section-head > p:not(.keep-case)';
  const CAP_SEL = [
    '.section-head p','p.lead','.lede','.intro','.hint','.stat-row span','.bigstats span','.money span','.outcome-list span',
    '.spine-head .tiny','.way p','.card p','.flow p','.flow .job','.process p','.dcard p','.cred span','.cred-list dt','.cred-list dd','.steps3 span',
    '.steps .l','.steps .v','.choice b','.choice small','.flag b','.flag span','.offer li','.dcard li','.creds li','.note',
    '.case-body dd','.case-fix p','.bar-row > span','.why','.also div span:first-child','.tiny','.cite','label','.label',
    'p.small','.panel p','.audit-item p','th','td:first-child'
  ].join(',');
  // Homepage: most words in every section begin with a capital letter (owner's brand rule).
  // Kept in sentence case: the About bio, FAQ answers, direct quotations and form inputs.
  const HOME_SEL = 'section p,section li,section td,section th,section label,section dt,section dd,section figcaption,section small,section .tiny,section .cite,section .bar-row > span,section .eyebrow,section .case-tabs button span,section .audit-item p,section .money span,section .outcome-list span,section .label,section .tag,section .price,section q,section .audit-item span,section .stat-row span,.modal p,.modal label,footer p,footer small,footer span';
  const HOME_SKIP = '.about p,.faq-item .a,blockquote,.keep-case,.no-tc,.cover,.doc,[contenteditable],form .confirm button';
  const upFirst = w => w.replace(/^([^A-Za-z0-9]*)([a-z])/, (m,p,c)=>p+c.toUpperCase());
  function capWord(word, isEdge, afterColon){
    // word may include punctuation and hyphens
    const core = word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.]+$/g,'').toLowerCase();
    if(!isEdge && !afterColon && MINOR.has(core)) return word; // keep as written (usually lowercase)
    if(/^(https?:|www\.|\S+@\S+)/i.test(word)) return word;
    return word.split('-').map((part,i)=>{
      const pc = part.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g,'').toLowerCase();
      if(i>0 && MINOR.has(pc)) return part;
      return upFirst(part);
    }).join('-');
  }
  function textNodes(el){
    const out=[]; const w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let n; while((n=w.nextNode())) if(n.nodeValue.trim()) out.push(n);
    return out;
  }
  function titleCase(el){
    const nodes = textNodes(el); if(!nodes.length) return;
    const total = nodes.reduce((s,n)=>s+(n.nodeValue.match(/\S+/g)||[]).length,0);
    let idx=0, prevColon=false;
    nodes.forEach(n=>{
      n.nodeValue = n.nodeValue.replace(/\S+/g, w=>{
        const edge = idx===0 || idx===total-1;
        const r = capWord(w, edge, prevColon);
        prevColon = /[:—–]$/.test(w) || w==='—' || w==='–' || w==='·';
        idx++; return r;
      });
    });
  }
  function capFirst(el){
    const nodes = textNodes(el); if(!nodes.length) return;
    const n = nodes[0]; const v = n.nodeValue;
    const nv = v.replace(/^(\s*[^A-Za-z0-9]*)([a-z])/, (m,p,c)=>p+c.toUpperCase());
    if(nv!==v) n.nodeValue = nv;
  }
  let busy=false;
  function run(){
    if(busy) return; busy=true;
    try{
      document.querySelectorAll(TITLE_SEL).forEach(el=>{ if(el.closest('.cover,.doc,.no-tc,[contenteditable]')) return; titleCase(el); });
      document.querySelectorAll(CAP_SEL).forEach(el=>{ if(el.closest('.cover,.doc,.no-tc,[contenteditable]')) return; capFirst(el); });
      if(document.getElementById('faq')) document.querySelectorAll(HOME_SEL).forEach(el=>{ if(el.closest(HOME_SKIP)) return; titleCase(el); });
    } finally { busy=false; }
  }
  let t=null;
  const mo = new MutationObserver(()=>{ if(busy) return; clearTimeout(t); t=setTimeout(run,30); });
  function start(){ run(); mo.observe(document.body,{childList:true,subtree:true,characterData:true}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();

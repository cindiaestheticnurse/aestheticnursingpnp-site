(function(){
  const top = document.querySelector('.sbt'), btn = top && top.querySelector('.sbt-menu'), nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;
  const set = open => { top.classList.toggle('sbt-open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu'); };
  btn.addEventListener('click', () => set(!top.classList.contains('sbt-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && top.classList.contains('sbt-open')) { set(false); btn.focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) set(false); });
})();

// Tools menu
(function(){
  document.querySelectorAll('.nav-tools').forEach(function(t){
    var b=t.querySelector('.nav-tools-btn'); if(!b) return;
    function set(o){t.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));}
    var hv=0;
    b.addEventListener('click',function(e){e.stopPropagation();if(Date.now()-hv<400){set(true);return;}set(!t.classList.contains('open'));});
    if(window.matchMedia('(hover:hover) and (min-width:901px)').matches){
      var tm; t.addEventListener('mouseenter',function(){clearTimeout(tm);if(!t.classList.contains('open'))hv=Date.now();set(true)}); t.addEventListener('mouseleave',function(){tm=setTimeout(function(){set(false)},180)});
    }
    document.addEventListener('click',function(e){if(!t.contains(e.target))set(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&t.classList.contains('open')){set(false);b.focus();}});
    t.addEventListener('focusout',function(e){if(!t.contains(e.relatedTarget))set(false);});
  });
})();

(function(){
  const top = document.querySelector('.sbt'), btn = top && top.querySelector('.sbt-menu'), nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;
  const set = open => { top.classList.toggle('sbt-open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu'); };
  btn.addEventListener('click', () => set(!top.classList.contains('sbt-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && top.classList.contains('sbt-open')) { set(false); btn.focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) set(false); });
})();

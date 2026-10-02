(function(){
  const btn = document.querySelector('.menu-btn'), nav = document.getElementById('primary-nav');
  if(!btn || !nav) return;
  const top = btn.closest('.top');
  function set(open){
    top.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', () => set(!top.classList.contains('nav-open')));
  nav.addEventListener('click', e => { if(e.target.closest('a,button')) set(false); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && top.classList.contains('nav-open')){ set(false); btn.focus(); } });
  window.addEventListener('resize', () => { if(window.innerWidth > 1200) set(false); });
})();

/* Fabio Ecosystem v49 — progressive enhancement only; navbar is already in HTML */
(()=>{
  'use strict';
  const init=()=>{
    const nav=document.querySelector('[data-eco49-nav]');
    if(!nav) return;
    const btn=nav.querySelector('.eco47-nav__toggle');
    const menu=nav.querySelector('.eco47-nav__menu');
    const backdrop=document.querySelector('.eco47-nav__backdrop');
    if(!btn||!menu) return;
    let open=false;
    const setOpen=(next,restore=false)=>{
      open=!!next;
      menu.classList.toggle('is-open',open);
      backdrop?.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      document.body.classList.toggle('eco47-menu-open',open);
      if(!open&&restore) btn.focus({preventScroll:true});
    };
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setOpen(!open)});
    backdrop?.addEventListener('click',()=>setOpen(false));
    menu.addEventListener('click',e=>{if(e.target.closest('a')) setOpen(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)setOpen(false,true)});
    window.addEventListener('resize',()=>{if(innerWidth>1080&&open)setOpen(false)},{passive:true});
    window.addEventListener('pageshow',()=>setOpen(false));
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();

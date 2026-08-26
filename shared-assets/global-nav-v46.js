/* Fabio Ecosystem v46 — isolated, conflict-free global navbar */
(()=>{
  'use strict';
  const init=()=>{
    const nav=document.querySelector('.eco-nav');
    if(!nav) return;
    const btn=nav.querySelector('.eco-nav__toggle');
    const menu=nav.querySelector('.eco-nav__links');
    const backdrop=document.querySelector('.eco-nav__backdrop');
    if(!btn||!menu) return;

    const setOpen=(open, restoreFocus=false)=>{
      menu.classList.toggle('is-open',open);
      backdrop?.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      document.body.classList.toggle('eco-menu-open',open);
      if(!open && restoreFocus) btn.focus({preventScroll:true});
    };

    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      setOpen(btn.getAttribute('aria-expanded')!=='true');
    });
    backdrop?.addEventListener('click',()=>setOpen(false));
    menu.addEventListener('click',(e)=>{ if(e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && btn.getAttribute('aria-expanded')==='true') setOpen(false,true); });
    window.addEventListener('resize',()=>{ if(window.innerWidth>1040) setOpen(false); },{passive:true});
    window.addEventListener('pageshow',()=>setOpen(false));
    setOpen(false);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();

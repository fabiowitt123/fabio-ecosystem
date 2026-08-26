/* Fabio Ecosystem v44: one robust mobile-nav controller for every site area. */
(()=>{
  'use strict';
  const BUTTON_SELECTOR='.nav-toggle,.v38-toggle,.v41-menu-button,.menu-toggle,.blog-menu-btn';
  const MENU_SELECTOR='.main-nav,.v38-menu,.v41-menu,.primary-nav,.blog-main-nav';
  let backdrop=null;

  const ensureBackdrop=()=>{
    if(backdrop && backdrop.isConnected) return backdrop;
    backdrop=document.createElement('div');
    backdrop.className='v44-nav-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click',closeAll);
    return backdrop;
  };

  function resolveMenu(btn){
    const controls=btn.getAttribute('aria-controls');
    if(controls){
      const controlled=document.getElementById(controls);
      if(controlled) return controlled;
    }
    const scope=btn.closest('header,.site-header,.v38-header,.v41-header,.blog-header-clean,.nav-wrap,.v38-navwrap,.v41-nav') || document;
    if(btn.matches('.nav-toggle')) return scope.querySelector('.main-nav') || document.querySelector('.main-nav');
    if(btn.matches('.v38-toggle')) return scope.querySelector('.v38-menu') || document.querySelector('.v38-menu');
    if(btn.matches('.v41-menu-button')) return scope.querySelector('.v41-menu') || document.querySelector('.v41-menu');
    if(btn.matches('.menu-toggle')) return scope.querySelector('.primary-nav') || document.querySelector('.primary-nav');
    if(btn.matches('.blog-menu-btn')) return scope.querySelector('.blog-main-nav') || document.querySelector('.blog-main-nav');
    return null;
  }

  function setOpen(btn,menu,open){
    if(!btn||!menu) return;
    menu.classList.toggle('is-open',open);
    menu.classList.toggle('open',open);
    btn.classList.toggle('is-active',open);
    btn.setAttribute('aria-expanded',String(open));
    const label=open?'Navigation schließen':'Navigation öffnen';
    if(btn.hasAttribute('aria-label')) btn.setAttribute('aria-label',label);
    const sr=btn.querySelector('.sr-only');
    if(sr) sr.textContent=label;
    document.body.classList.toggle('v44-mobile-nav-open',open);
    ensureBackdrop().classList.toggle('is-visible',open);
  }

  function closeAll(exceptBtn=null){
    document.querySelectorAll(BUTTON_SELECTOR).forEach(btn=>{
      if(btn===exceptBtn) return;
      const menu=resolveMenu(btn);
      if(menu) setOpen(btn,menu,false);
    });
    if(!exceptBtn){
      document.body.classList.remove('v44-mobile-nav-open');
      if(backdrop) backdrop.classList.remove('is-visible');
    }
  }

  document.addEventListener('click',event=>{
    const btn=event.target.closest(BUTTON_SELECTOR);
    if(!btn) return;
    const menu=resolveMenu(btn);
    if(!menu) return;

    /* Capture phase intentionally wins over legacy duplicate click handlers. */
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const isOpen=menu.classList.contains('is-open') || menu.classList.contains('open') || btn.getAttribute('aria-expanded')==='true';
    closeAll(btn);
    setOpen(btn,menu,!isOpen);
  },true);

  document.addEventListener('click',event=>{
    const link=event.target.closest(`${MENU_SELECTOR} a`);
    if(link) closeAll();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      const active=document.querySelector(`${BUTTON_SELECTOR}[aria-expanded="true"]`);
      closeAll();
      active?.focus();
    }
  });

  window.addEventListener('resize',()=>{
    if(window.innerWidth>980) closeAll();
  },{passive:true});

  window.addEventListener('pageshow',()=>closeAll());
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') closeAll(); });

  document.addEventListener('DOMContentLoaded',()=>{
    ensureBackdrop();
    document.querySelectorAll(BUTTON_SELECTOR).forEach(btn=>{
      const menu=resolveMenu(btn);
      if(!menu) return;
      btn.setAttribute('aria-expanded','false');
      if(!btn.getAttribute('aria-controls') && menu.id) btn.setAttribute('aria-controls',menu.id);
      menu.classList.remove('open','is-open');
    });
  });
})();

/* Fabio Ecosystem v47 — single source of truth for the navbar */
(()=>{
  'use strict';

  const getContext=()=>{
    const p=(location.pathname||'/').toLowerCase();
    if(p.startsWith('/sprachlernapp/')) return {section:'lernwerk',cta:'Kurs kaufen',href:'/sprachlernapp/#kurs-kaufen'};
    if(p.startsWith('/sprachschule/')) return {section:'sprachwerk',cta:'Kursanfrage',href:'/sprachschule/#kursanfrage'};
    if(p.startsWith('/dachwerk/')) return {section:'dachwerk',cta:'Projektanfrage',href:'/dachwerk/#kontakt'};
    return {section:'fabio',cta:'Projektanfrage',href:'/#fabio-anfrage'};
  };

  const currentFor=(href,section)=>{
    if(href==='/dachwerk/') return section==='dachwerk' && !/\/dachwerk\/blog(?:\.html)?\/?$/i.test(location.pathname);
    if(href==='/sprachschule/') return section==='sprachwerk';
    if(href==='/sprachlernapp/') return section==='lernwerk';
    if(href==='/') return section==='fabio';
    if(href==='/dachwerk/blog') return /\/dachwerk\/blog(?:\.html)?\/?$/i.test(location.pathname)||/\/blog(?:\.html)?\/?$/i.test(location.pathname);
    return false;
  };

  const navHTML=(ctx)=>{
    const items=[
      ['/dachwerk/','DACHWERK'],
      ['/sprachschule/','SPRACHWERK'],
      ['/sprachlernapp/','LERNWERK'],
      ['/','Fabio Witt'],
      ['/downloads/Fabio-Witt-CV.pdf','CV'],
      ['/dachwerk/blog','Blog']
    ];
    return `<header class="eco47-nav" data-eco47-nav>
      <div class="eco47-nav__inner">
        <a class="eco47-nav__brand" href="/" aria-label="Fabio Witt Startseite"><img src="/assets/logo.svg" alt="Fabio Witt"></a>
        <button class="eco47-nav__toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="eco47-global-menu"><span></span><span></span><span></span></button>
        <nav class="eco47-nav__menu" id="eco47-global-menu" aria-label="Hauptnavigation">
          ${items.map(([href,label])=>`<a href="${href}"${currentFor(href,ctx.section)?' aria-current="page"':''}>${label}</a>`).join('')}
          <a class="eco47-nav__cta" href="${ctx.href}">${ctx.cta}</a>
        </nav>
      </div>
    </header><div class="eco47-nav__backdrop" aria-hidden="true"></div>`;
  };

  const init=()=>{
    const slot=document.querySelector('[data-eco47-nav-slot]');
    if(!slot) return;
    const ctx=getContext();
    slot.outerHTML=navHTML(ctx);

    const nav=document.querySelector('[data-eco47-nav]');
    const btn=nav?.querySelector('.eco47-nav__toggle');
    const menu=nav?.querySelector('.eco47-nav__menu');
    const backdrop=document.querySelector('.eco47-nav__backdrop');
    if(!nav||!btn||!menu) return;

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

    btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();setOpen(!open)};
    backdrop?.addEventListener('click',()=>setOpen(false));
    menu.addEventListener('click',(e)=>{if(e.target.closest('a'))setOpen(false)});
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&open)setOpen(false,true)});
    window.addEventListener('resize',()=>{if(innerWidth>1080&&open)setOpen(false)},{passive:true});
    window.addEventListener('pageshow',()=>setOpen(false));
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

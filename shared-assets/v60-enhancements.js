(function(){
  const cfg=window.FW_SITE_CONFIG||{};
  const fire=(name,props={})=>{
    try{window.dispatchEvent(new CustomEvent('fw:analytics',{detail:{name,props}}));}catch(e){}
    if(typeof window.plausible==='function') try{window.plausible(name,{props});}catch(e){}
    if(typeof window.gtag==='function') try{window.gtag('event',name,props);}catch(e){}
  };
  window.FW_TRACK=fire;
  document.addEventListener('click',e=>{
    const a=e.target.closest('a,button'); if(!a)return;
    const href=a.getAttribute('href')||'';
    if(a.matches('[data-track]')) fire(a.dataset.track,{label:(a.textContent||'').trim().slice(0,80)});
    if(href.includes('wa.me')) fire('whatsapp_click');
    if(href.includes('pricing')) fire('pricing_click');
    if(href.includes('language-')) fire('course_click',{href});
  });

  document.querySelectorAll('[data-fw-booking]').forEach(a=>{
    const url=(cfg.bookingUrl||'').trim();
    if(url && /^https?:\/\//i.test(url)){a.href=url;a.classList.remove('v60-hidden');a.target='_blank';a.rel='noopener';}
    else a.classList.add('v60-hidden');
  });
  document.querySelectorAll('[data-fw-whatsapp]').forEach(a=>{
    const raw=(cfg.whatsappNumber||'').replace(/[^0-9]/g,'');
    if(raw){a.href='https://wa.me/'+raw+'?text='+encodeURIComponent(a.dataset.message||'Hallo Fabio, ich interessiere mich für Sprachunterricht.');a.classList.remove('v60-hidden');a.target='_blank';a.rel='noopener';}
    else a.classList.add('v60-hidden');
  });

  let deferredPrompt=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.querySelectorAll('[data-pwa-install]').forEach(b=>b.classList.remove('v60-hidden'));});
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-pwa-install]');if(!b||!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;b.classList.add('v60-hidden');fire('pwa_install_prompt');});

  document.querySelectorAll('form[data-email-form="true"]').forEach(f=>f.addEventListener('submit',()=>fire('contact_form_submit',{form:f.getAttribute('name')||f.id||'form'})));
})();

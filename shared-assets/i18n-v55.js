/* Fabio Ecosystem v55 - German / English / Russian language routing */
(function(){
  'use strict';
  var SUPPORTED=['de','en','ru'];
  var LABELS={de:'Deutsch',en:'English',ru:'Русский'};
  var FLAG_FILE={de:'de.svg',en:'gb.svg',ru:'ru.svg'};
  var script=document.currentScript;
  var scriptUrl=script && script.src ? new URL(script.src,location.href) : new URL('shared-assets/i18n-v55.js',location.href);
  var sharedBase=new URL('./',scriptUrl);
  var flagBase=new URL('flags/',sharedBase);
  function getParam(){
    try{var l=new URL(location.href).searchParams.get('lang');return SUPPORTED.indexOf(l)>=0?l:null;}catch(e){return null;}
  }
  function getStored(){try{var l=localStorage.getItem('fabio-lang');return SUPPORTED.indexOf(l)>=0?l:null;}catch(e){return null;}}
  function getCookieLang(){
    var m=document.cookie.match(/(?:^|;\s*)googtrans=\/de\/([^;]+)/);
    return m && SUPPORTED.indexOf(m[1])>=0?m[1]:null;
  }
  var active=getParam()||getStored()||getCookieLang()||'de';
  document.documentElement.setAttribute('lang',active);
  try{localStorage.setItem('fabio-lang',active);}catch(e){}
  function setCookie(name,value,days){
    var max=days?'max-age='+(days*86400):'max-age=0';
    document.cookie=name+'='+value+';path=/;'+max+';SameSite=Lax';
    var host=location.hostname;
    if(host && host.indexOf('.')>0 && host!=='localhost'){
      document.cookie=name+'='+value+';path=/;domain=.'+host.replace(/^www\./,'')+';'+max+';SameSite=Lax';
    }
  }
  function setLang(lang){
    if(SUPPORTED.indexOf(lang)<0)return;
    try{localStorage.setItem('fabio-lang',lang);}catch(e){}
    var url=new URL(location.href);
    url.searchParams.set('lang',lang);
    if(lang==='de'){
      setCookie('googtrans','',0);
      document.cookie='googtrans=/de/de;path=/;max-age=0';
    }else{
      setCookie('googtrans','/de/'+lang,365);
    }
    location.href=url.toString();
  }
  function makeSwitcher(extraClass){
    var wrap=document.createElement('div');
    wrap.className='fw-lang-switcher'+(extraClass?' '+extraClass:'');
    wrap.setAttribute('role','group');wrap.setAttribute('aria-label','Sprache / Language / Язык');
    SUPPORTED.forEach(function(lang){
      var b=document.createElement('button');b.type='button';b.className='fw-lang-btn'+(active===lang?' is-active':'');
      b.setAttribute('aria-label',LABELS[lang]);b.setAttribute('title',LABELS[lang]);b.dataset.lang=lang;
      var img=document.createElement('img');img.src=new URL(FLAG_FILE[lang],flagBase).href;img.alt='';img.setAttribute('aria-hidden','true');
      var s=document.createElement('span');s.className='fw-lang-label';s.textContent=LABELS[lang];
      b.appendChild(img);b.appendChild(s);b.addEventListener('click',function(){setLang(lang);});wrap.appendChild(b);
    });
    return wrap;
  }
  function insertSwitchers(){
    var desktop=document.querySelector('.fw50-menu');
    if(desktop && !desktop.querySelector('.fw-lang-switcher')){
      var cta=desktop.querySelector('.fw50-cta');
      var sw=makeSwitcher('fw-lang-switcher--desktop');
      if(cta)desktop.insertBefore(sw,cta);else desktop.appendChild(sw);
    }
    var mobile=document.querySelector('.fw50-mobile__panel');
    if(mobile && !mobile.querySelector('.fw-lang-switcher')){
      var meta=mobile.querySelector('.fw50-mobile__meta');
      var swm=makeSwitcher('fw-lang-switcher--mobile');
      if(meta)mobile.insertBefore(swm,meta);else mobile.appendChild(swm);
    }
    var main=document.querySelector('.main-nav');
    if(main && !main.querySelector('.fw-lang-switcher')){
      var cta2=main.querySelector('.nav-cta');
      var sw2=makeSwitcher();
      if(cta2)main.insertBefore(sw2,cta2);else main.appendChild(sw2);
    }
    if(!desktop && !main){
      var header=document.querySelector('header');
      if(header && !header.querySelector('.fw-lang-switcher'))header.appendChild(makeSwitcher());
    }
  }
  function addTranslateHost(){
    if(document.getElementById('google_translate_element'))return;
    var el=document.createElement('div');el.id='google_translate_element';el.setAttribute('aria-hidden','true');document.body.appendChild(el);
  }
  window.googleTranslateElementInit=function(){
    try{
      new google.translate.TranslateElement({pageLanguage:'de',includedLanguages:'de,en,ru',autoDisplay:false},'google_translate_element');
      if(active!=='de'){
        var n=0,t=setInterval(function(){
          var sel=document.querySelector('.goog-te-combo');
          if(sel){sel.value=active;sel.dispatchEvent(new Event('change'));clearInterval(t);}
          if(++n>30)clearInterval(t);
        },150);
      }
    }catch(e){}
  };
  function loadTranslator(){
    addTranslateHost();
    if(document.querySelector('script[data-fw-google-translate]'))return;
    var s=document.createElement('script');s.async=true;s.defer=true;s.dataset.fwGoogleTranslate='1';
    s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';document.head.appendChild(s);
  }
  function init(){insertSwitchers();loadTranslator();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

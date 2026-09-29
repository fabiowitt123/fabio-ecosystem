(function(){
  'use strict';
  document.querySelectorAll('form[data-email-form="true"]').forEach(function(form){
    var next=form.querySelector('input[name="_next"]');
    if(next){
      var path=form.getAttribute('data-success-path') || '/danke.html';
      next.value=window.location.origin + path;
    }
    if(!form.querySelector('input[name="_url"]')){
      var url=document.createElement('input');
      url.type='hidden'; url.name='_url'; url.value=window.location.href;
      form.appendChild(url);
    }
    form.addEventListener('submit',function(){
      if(!form.checkValidity()) return;
      var btn=form.querySelector('button[type="submit"],input[type="submit"]');
      if(btn){
        btn.dataset.originalText=btn.textContent || btn.value || '';
        if(btn.tagName==='INPUT') btn.value='Wird gesendet…'; else btn.textContent='Wird gesendet…';
        btn.disabled=true;
        setTimeout(function(){ btn.disabled=false; },10000);
      }
    });
  });
})();


(()=>{document.addEventListener('DOMContentLoaded',()=>{
 const box=document.querySelector('[data-v51-continue]'); if(!box)return;
 const langNames={de:'Deutsch',en:'Englisch',fr:'Französisch',es:'Spanisch',it:'Italienisch',pt:'Portugiesisch',ru:'Russisch'};
 let profile={},courses={}; try{profile=JSON.parse(localStorage.getItem('sprachwerkQuest')||'{}')}catch(e){} try{courses=JSON.parse(localStorage.getItem('lernwerkCourseV48')||'{}')}catch(e){}
 const lang=(['de','en','fr','es','it','pt','ru'].includes(profile.lastLanguage)?profile.lastLanguage:(['de','en','fr','es','it','pt','ru'].includes(profile.language)?profile.language:'en'));
 const cs=courses[lang]||{}; const completed=Object.keys(cs.completed||{}).length; const total=10; const pct=Math.min(100,Math.round(completed/total*100)); const xp=(profile.xp||0); const streak=profile.streak||0; const next=Math.min(total,Number(cs.last)||Math.max(1,completed+1));
 const set=(q,v)=>{const e=box.querySelector(q);if(e)e.textContent=v}; set('[data-v51-lang]',langNames[lang]);set('[data-v51-xp]',xp);set('[data-v51-streak]',streak);set('[data-v51-lessons]',completed+'/'+total);set('[data-v51-next]','Lektion '+next); const bar=box.querySelector('[data-v51-bar]');if(bar)bar.style.width=pct+'%';const pctEl=box.querySelector('[data-v51-pct]');if(pctEl)pctEl.textContent=pct+' %';
 const resume=box.querySelector('[data-v51-resume]');if(resume)resume.href='course.html?lang='+lang;const practice=box.querySelector('[data-v51-practice]');if(practice)practice.href='language-'+lang+'.html?tab=training';
});})();

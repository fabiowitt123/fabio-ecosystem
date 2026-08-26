
const LANG_CODE=document.body.dataset.lang;
const meta=VERB_META[LANG_CODE];
const G=GRAMMAR_EXPANDED[LANG_CODE]||[];
const V=VERB_DATA[LANG_CODE]||[];

function swSpeak(text, slow=false){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  const langMap={de:"de-DE",en:"en-GB",fr:"fr-FR",es:"es-ES",it:"it-IT",ru:"ru-RU",pt:"pt-PT"};
  u.lang=langMap[LANG_CODE]||"en-US"; u.rate=slow?.72:.95;
  speechSynthesis.speak(u);
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-speak]");
  if(b){e.preventDefault();swSpeak(b.dataset.speak,b.dataset.slow==="1")}
});

document.getElementById("lang-name").textContent=meta[0];
document.title=meta[0]+" lernen | Sprachwerk";

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active")
});

function profileState(){
  try{return JSON.parse(localStorage.getItem("sprachwerkQuest")||"{}")}catch{return{}}
}
function saveProfile(s){localStorage.setItem("sprachwerkQuest",JSON.stringify(s));window.SprachwerkCloud?.queueSave?.()}
function addXP(n){let s=profileState();s.xp=(s.xp||0)+n;s.dailyXP=(s.dailyXP||0)+n;s.activity=s.activity||{};let d=new Date().toISOString().slice(0,10);s.activity[d]=(s.activity[d]||0)+n;saveProfile(s)}

const lg=document.getElementById("lesson-grid");
lg.innerHTML=G.map(x=>`<article class="card"><span class="badge">LEKTION ${x.id} / 20</span><h3>${x.title}</h3><p>${x.intro}</p><div class="card-actions"><button class="open-btn" data-lesson="${x.id}">Lektion öffnen</button><button class="audio-mini" data-speak="${x.title}">🔊</button></div></article>`).join("");

const dlg=document.getElementById("content-dialog"),out=document.getElementById("dialog-content");
document.getElementById("dialog-close").onclick=()=>dlg.close();

function buildPractice(x){
 const ex=x.examples||[];
 const cloze=ex[0]?ex[0].split(" "):[];
 const hiddenIndex=Math.min(1,Math.max(0,cloze.length-1));
 const answer=cloze[hiddenIndex]||"";
 const sentence=cloze.map((w,i)=>i===hiddenIndex?"_____":w).join(" ");
 const shuffled=[answer,"nicht","anders"].sort(()=>Math.random()-.5);
 return `
 <div class="practice-types">
   <h3>Aktive Übungen</h3>
   <div class="practice-card">
     <span class="practice-type">Lückentext</span><strong>${sentence}</strong>
     <div class="choice-row">${shuffled.map(a=>`<button data-practice-answer="${a===answer?1:0}">${a}</button>`).join("")}</div>
   </div>
   <div class="practice-card">
     <span class="practice-type">Satzbausteine</span>
     <p>Bringe den Satz gedanklich in die richtige Reihenfolge:</p>
     <div class="word-chips">${(ex[1]||ex[0]||"").split(" ").sort(()=>Math.random()-.5).map(w=>`<span>${w}</span>`).join("")}</div>
   </div>
   <div class="practice-card">
     <span class="practice-type">Hören</span>
     <p>Höre den Satz und sprich ihn danach nach.</p>
     <button class="open-btn" data-speak="${ex[2]||ex[0]||x.title}">🔊 Normal</button>
     <button class="open-btn secondary" data-speak="${ex[2]||ex[0]||x.title}" data-slow="1">🐢 Langsam</button>
   </div>
   <div class="practice-card">
     <span class="practice-type">Freie Produktion</span>
     <p>Bilde einen eigenen Satz mit der Struktur dieser Lektion.</p>
     <textarea class="free-answer" placeholder="Dein eigener Satz …"></textarea>
   </div>
 </div>`
}

function openLesson(id){
 let x=G.find(a=>a.id==id);
 out.innerHTML=`<div class="lesson-body">
   <span class="badge">LEKTION ${x.id}</span><h2>${x.title}</h2>
   <button class="audio-title" data-speak="${x.title}">🔊 Titel anhören</button>
   <p>${x.intro}</p>
   <div class="rulebox"><strong>Grundregel</strong><br>${x.rule}</div>
   <h3>Schritt für Schritt</h3><ul>${x.details.map(d=>`<li>${d}</li>`).join("")}</ul>
   <h3>Beispiele</h3>${x.examples.map(e=>`<div class="example"><span>${e}</span><button data-speak="${e}">🔊</button></div>`).join("")}
   ${buildPractice(x)}
   <div class="quiz"><h3>Abschlusstest · ${x.quiz.length} Multiple-Choice-Fragen</h3>
   ${x.quiz.map((q,i)=>`<div class="question" data-correct="${q.correct}"><strong>${i+1}. ${q.q}</strong>${q.a.map((a,j)=>`<button class="option" data-i="${j}">${a}</button>`).join("")}</div>`).join("")}
   <button class="open-btn" id="finish-quiz">Test auswerten</button><div class="quiz-result" id="quiz-result"></div></div>
 </div>`;
 dlg.showModal();
 let chosen={};
 out.querySelectorAll(".option").forEach(btn=>btn.onclick=()=>{
   let q=btn.closest(".question"),idx=[...out.querySelectorAll(".question")].indexOf(q);
   q.querySelectorAll(".option").forEach(o=>o.classList.remove("correct","wrong"));
   chosen[idx]=+btn.dataset.i;btn.classList.add(+btn.dataset.i===+q.dataset.correct?"correct":"wrong");
 });
 out.querySelectorAll("[data-practice-answer]").forEach(btn=>btn.onclick=()=>{
   btn.classList.add(btn.dataset.practiceAnswer==="1"?"correct":"wrong");
 });
 document.getElementById("finish-quiz").onclick=()=>{
   let score=x.quiz.reduce((s,q,i)=>s+(chosen[i]===q.correct),0);
   let pct=Math.round(score/x.quiz.length*100);
   document.getElementById("quiz-result").textContent=`${score} / ${x.quiz.length} richtig · ${pct}% ${pct>=80?"· bestanden! +25 XP":"· bitte wiederholen"}`;
   let s=profileState();s.completed=s.completed||{};s.errors=s.errors||[];
   x.quiz.forEach((q,i)=>{if(chosen[i]!==q.correct)s.errors.push({lang:LANG_CODE,lesson:x.id,title:x.title,q:q.q,ts:Date.now()})});
   if(pct>=80 && !s.completed[LANG_CODE+"-"+x.id]){s.completed[LANG_CODE+"-"+x.id]=true;saveProfile(s);addXP(25)}else saveProfile(s);
 }
}
lg.onclick=e=>{let b=e.target.closest("[data-lesson]");if(b)openLesson(+b.dataset.lesson)};

const vg=document.getElementById("verb-grid");
vg.innerHTML=V.map(v=>`<button class="card" data-verb="${v.rank}"><span class="badge">#${v.rank}</span><h3>${v.verb}</h3><p>${v.translation}</p><div class="card-actions"><span>Konjugation öffnen</span><button class="audio-mini" data-speak="${v.verb}">🔊</button></div></button>`).join("");
vg.onclick=e=>{let b=e.target.closest("[data-verb]");if(!b)return;let v=V[+b.dataset.verb-1],p=meta[1],tab=(t,a)=>`<div class="tense"><h4>${t}</h4>${p.map((x,i)=>`<div class="row"><span>${x}</span><b>${a[i]}</b><button data-speak="${p[i]} ${a[i]}">🔊</button></div>`).join("")}</div>`;out.innerHTML=`<div class="lesson-body"><span class="badge">VERB #${v.rank}</span><h2>${v.verb}</h2><button class="audio-title" data-speak="${v.verb}">🔊 Verb anhören</button><div class="tense-grid">${tab("Präsens",v.present)}${tab("Vergangenheit",v.past)}${tab("Zukunft",v.future)}</div></div>`;dlg.showModal()};

const vocab=document.getElementById("vocab-grid");
let words=[];
try{
 const all=window.LANGUAGE_DATA||window.APP_DATA||window.VOCAB_DATA||{};
 const d=all[LANG_CODE]||{};
 const cats=d.vocabulary||d.vocab||d.categories||[];
 cats.forEach((cat,ci)=>(cat.words||cat.items||[]).forEach((w,wi)=>words.push({
   id:`${ci}-${wi}`,cat:cat.name||cat.title||`Kategorie ${ci+1}`,word:w.word||w.term||w.foreign||String(w),
   translation:w.translation||w.de||"",example:w.example||""
 })));
}catch(e){}
if(!words.length){words=Array.from({length:1000},(_,i)=>({id:String(i),cat:`Kategorie ${Math.floor(i/50)+1}`,word:`Vokabel ${i+1}`,translation:"Übersetzung",example:"Beispielsatz."}))}

function srsButton(label,days,id){
 return `<button data-srs="${days}" data-word="${id}">${label}</button>`
}
function renderVocab(q=""){
 let a=words.filter(w=>(w.word+" "+w.translation+" "+w.cat).toLowerCase().includes(q.toLowerCase())).slice(0,300);
 vocab.innerHTML=a.map(w=>`<article class="card vocab-card">
   <span class="badge">${w.cat}</span><strong>${w.word}</strong><span>${w.translation}</span>
   <small>${w.example}</small><div class="vocab-actions"><button data-speak="${w.word}">🔊 Wort</button>${w.example?`<button data-speak="${w.example}">🔊 Satz</button>`:""}</div>
   <div class="srs-row">${srsButton("Nochmal",0,w.id)}${srsButton("Schwer",1,w.id)}${srsButton("Gut",3,w.id)}${srsButton("Einfach",7,w.id)}</div>
 </article>`).join("")
}
document.getElementById("vocab-search").oninput=e=>renderVocab(e.target.value);
vocab.onclick=e=>{
 const b=e.target.closest("[data-srs]");if(!b)return;
 let s=profileState();s.srs=s.srs||{};let key=LANG_CODE+"-"+b.dataset.word;
 s.srs[key]={due:Date.now()+Number(b.dataset.srs)*86400000,last:Date.now()};saveProfile(s);addXP(2);b.textContent="✓";
};
renderVocab();

document.querySelectorAll(".speak-hero").forEach(b=>b.onclick=()=>swSpeak(meta[0]));



// ===== v25: Verbquiz, Stories, Mastery =====
function swMasteryState(){try{return JSON.parse(localStorage.getItem("sprachwerkQuest")||"{}")}catch{return{}}}
function updateMastery(lessonId,percent){
  let s=swMasteryState();s.mastery=s.mastery||{};let key=LANG_CODE+"-"+lessonId;
  let old=s.mastery[key]||0;s.mastery[key]=Math.round(old*.55+percent*.45);
  localStorage.setItem("sprachwerkQuest",JSON.stringify(s));window.SprachwerkCloud?.queueSave?.();
}

document.addEventListener("click",e=>{
  const finish=e.target.closest("#finish-quiz");
  if(!finish)return;
  setTimeout(()=>{
    const result=document.getElementById("quiz-result")?.textContent||"";
    const m=result.match(/(\d+)%/); const dlgLesson=document.querySelector(".lesson-body .badge")?.textContent||"";
    const lm=dlgLesson.match(/(\d+)/);
    if(m&&lm)updateMastery(Number(lm[1]),Number(m[1]));
  },50)
});

function openVerbQuiz(){
  let sample=[...V].sort(()=>Math.random()-.5).slice(0,10),idx=0,score=0;
  const pron=meta[1];
  function render(){
    if(idx>=sample.length){
      out.innerHTML=`<div class="lesson-body"><span class="badge">VERBQUIZ</span><h2>${score}/10 richtig</h2><p>${score>=8?"Sehr stark. +20 XP":"Wiederhole besonders die falschen Formen."}</p></div>`;
      if(score>=8)addXP(20);return
    }
    const v=sample[idx],person=Math.floor(Math.random()*6),tenseIndex=Math.floor(Math.random()*3);
    const tense=["Präsens","Vergangenheit","Zukunft"][tenseIndex],answer=[v.present,v.past,v.future][tenseIndex][person];
    out.innerHTML=`<div class="lesson-body"><span class="badge">VERBQUIZ ${idx+1}/10</span><h2>${v.verb}</h2><p>${tense} · ${pron[person]}</p><input class="verb-input" id="verb-answer" autocomplete="off" placeholder="Konjugierte Form eingeben"><button class="open-btn" id="check-verb">Prüfen</button><div id="verb-feedback"></div></div>`;
    document.getElementById("check-verb").onclick=()=>{
      const val=document.getElementById("verb-answer").value.trim().toLowerCase();
      const ok=val===String(answer).trim().toLowerCase();if(ok)score++;
      document.getElementById("verb-feedback").innerHTML=ok?`<p class="feedback-ok">Richtig ✓</p>`:`<p class="feedback-bad">Richtig wäre: <strong>${answer}</strong></p>`;
      setTimeout(()=>{idx++;render()},850)
    }
  }
  render();dlg.showModal()
}
// Insert quiz button above verbs grid
const verbPanel=document.getElementById("verbs-panel");
if(verbPanel){
 const head=verbPanel.querySelector(".section-head");
 const b=document.createElement("button");b.className="open-btn verb-quiz-launch";b.textContent="10-Verben-Test starten";b.onclick=openVerbQuiz;head?.appendChild(b)
}

// Stories
const storyGrid=document.getElementById("story-grid"),storyFilter=document.getElementById("story-level-filter");
if(storyGrid&&window.STORIES_DATA){
 let level="A1";
 storyFilter.innerHTML=["A1","A2","B1","B2","C1"].map(l=>`<button class="story-level ${l==="A1"?"active":""}" data-story-level="${l}">${l}</button>`).join("");
 function renderStories(){
   let items=(STORIES_DATA[LANG_CODE]||[]).filter(s=>s.level===level);
   storyGrid.innerHTML=items.map(s=>`<article class="story-card"><span class="badge">${s.level}</span><h3>${s.title}</h3><p>${s.text.slice(0,120)}…</p><div><button class="open-btn" data-story="${s.id}">Öffnen</button><button class="audio-mini" data-speak="${s.text}">🔊 Anhören</button></div></article>`).join("")
 }
 storyFilter.onclick=e=>{let b=e.target.closest("[data-story-level]");if(!b)return;level=b.dataset.storyLevel;storyFilter.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderStories()};
 storyGrid.onclick=e=>{let b=e.target.closest("[data-story]");if(!b)return;let s=(STORIES_DATA[LANG_CODE]||[]).find(x=>x.id==b.dataset.story);
   out.innerHTML=`<div class="lesson-body"><span class="badge">${s.level} STORY</span><h2>${s.title}</h2><div class="story-actions"><button class="open-btn" data-speak="${s.text}">🔊 Normal</button><button class="open-btn secondary" data-speak="${s.text}" data-slow="1">🐢 Langsam</button></div><p class="story-text">${s.text}</p><h3>Verständnisfragen</h3>${s.questions.map((q,i)=>`<div class="question" data-correct="${q.correct}"><strong>${i+1}. ${q.q}</strong>${q.a.map((a,j)=>`<button class="option" data-i="${j}">${a}</button>`).join("")}</div>`).join("")}</div>`;
   dlg.showModal();
   out.querySelectorAll(".option").forEach(btn=>btn.onclick=()=>{let q=btn.closest(".question");q.querySelectorAll(".option").forEach(o=>o.classList.remove("correct","wrong"));btn.classList.add(+btn.dataset.i===+q.dataset.correct?"correct":"wrong")})
 };
 renderStories()
}

// ===== v27 Free/Pro content gates on language pages =====
document.addEventListener("DOMContentLoaded",async()=>{
 const plan=await (window.SprachwerkPlan?.get?.()||Promise.resolve("free"));
 if(plan!=="free")return;
 // Grammar: first 4 free.
 document.querySelectorAll("[data-lesson]").forEach(b=>{
  const n=Number(b.dataset.lesson);if(n>4){b.textContent="🔒 Pro";b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();window.showSprachwerkUpgrade?.("Die vollständigen A1–C1-Grammatikpfade sind in Sprachwerk Pro enthalten.")}}
 });
 // Verb quiz is Pro; lookup remains available.
 document.querySelectorAll(".verb-quiz-launch").forEach(b=>b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();window.showSprachwerkUpgrade?.("Der unbegrenzte Verb-Konjugationstest ist Teil von Pro.")});
 // Limit visible vocab to first 100 after initial render.
 setTimeout(()=>{document.querySelectorAll("#vocab-grid .vocab-card").forEach((x,i)=>{if(i>=100)x.style.display="none"});if(document.querySelectorAll("#vocab-grid .vocab-card").length>100){let n=document.createElement("div");n.className="free-limit-note";n.innerHTML='<strong>100 kostenlose Vokabeln</strong><p>Mit Pro stehen alle 1.000 Vokabeln dieser Sprache zur Verfügung.</p><a href="pricing.html">Pro freischalten →</a>';document.getElementById("vocab-grid")?.after(n)}},250);
});

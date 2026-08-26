(() => {
  const LANG = document.body.dataset.lang;
  if (!LANG || typeof APP_DATA === 'undefined' || typeof VERB_DATA === 'undefined') return;
  const KEY = 'sprachwerkQuest';
  const DATA = APP_DATA.languages?.[LANG];
  const VERBS = VERB_DATA?.[LANG] || [];
  const voiceLang = {de:'de-DE',en:'en-US',fr:'fr-FR',es:'es-ES',it:'it-IT',ru:'ru-RU',pt:'pt-PT'}[LANG] || 'de-DE';
  const copy = {
    de:{phrases:['Guten Morgen, wie geht es dir?','Ich hätte gern einen Kaffee, bitte.','Wo befindet sich der Bahnhof?','Ich lerne jeden Tag Deutsch.','Können Sie das bitte wiederholen?'],sentences:[['Heute lerne ich Deutsch.','Heute|lerne|ich|Deutsch.'],['Wir fahren morgen mit dem Zug.','Wir|fahren|morgen|mit|dem|Zug.'],['Ich möchte einen Kaffee bestellen.','Ich|möchte|einen|Kaffee|bestellen.'],['Am Wochenende treffe ich meine Freunde.','Am|Wochenende|treffe|ich|meine|Freunde.']]},
    en:{phrases:['Good morning, how are you?','I would like a coffee, please.','Where is the train station?','I study English every day.','Could you repeat that, please?'],sentences:[['I study English every day.','I|study|English|every|day.'],['We are taking the train tomorrow.','We|are|taking|the|train|tomorrow.'],['I would like to order a coffee.','I|would|like|to|order|a|coffee.'],['I am meeting my friends this weekend.','I|am|meeting|my|friends|this|weekend.']]},
    fr:{phrases:['Bonjour, comment allez-vous ?','Je voudrais un café, s’il vous plaît.','Où se trouve la gare ?','J’apprends le français tous les jours.','Pouvez-vous répéter, s’il vous plaît ?'],sentences:[['J’apprends le français tous les jours.','J’apprends|le|français|tous|les|jours.'],['Nous prenons le train demain.','Nous|prenons|le|train|demain.'],['Je voudrais commander un café.','Je|voudrais|commander|un|café.'],['Je retrouve mes amis ce week-end.','Je|retrouve|mes|amis|ce|week-end.']]},
    es:{phrases:['Buenos días, ¿cómo estás?','Quisiera un café, por favor.','¿Dónde está la estación de tren?','Estudio español todos los días.','¿Puede repetirlo, por favor?'],sentences:[['Estudio español todos los días.','Estudio|español|todos|los|días.'],['Mañana viajamos en tren.','Mañana|viajamos|en|tren.'],['Quisiera pedir un café.','Quisiera|pedir|un|café.'],['Este fin de semana veo a mis amigos.','Este|fin|de|semana|veo|a|mis|amigos.']]},
    it:{phrases:['Buongiorno, come stai?','Vorrei un caffè, per favore.','Dov’è la stazione ferroviaria?','Studio italiano ogni giorno.','Può ripetere, per favore?'],sentences:[['Studio italiano ogni giorno.','Studio|italiano|ogni|giorno.'],['Domani prendiamo il treno.','Domani|prendiamo|il|treno.'],['Vorrei ordinare un caffè.','Vorrei|ordinare|un|caffè.'],['Nel fine settimana vedo i miei amici.','Nel|fine|settimana|vedo|i|miei|amici.']]},
    ru:{phrases:['Доброе утро, как дела?','Я хотел бы кофе, пожалуйста.','Где находится вокзал?','Я учу русский каждый день.','Повторите, пожалуйста.'],sentences:[['Я учу русский каждый день.','Я|учу|русский|каждый|день.'],['Завтра мы едем на поезде.','Завтра|мы|едем|на|поезде.'],['Я хотел бы заказать кофе.','Я|хотел|бы|заказать|кофе.'],['На выходных я встречаюсь с друзьями.','На|выходных|я|встречаюсь|с|друзьями.']]},
    pt:{phrases:['Bom dia, como estás?','Gostaria de um café, por favor.','Onde fica a estação de comboios?','Estudo português todos os dias.','Pode repetir, por favor?'],sentences:[['Estudo português todos os dias.','Estudo|português|todos|os|dias.'],['Amanhã vamos de comboio.','Amanhã|vamos|de|comboio.'],['Gostaria de pedir um café.','Gostaria|de|pedir|um|café.'],['No fim de semana encontro os meus amigos.','No|fim|de|semana|encontro|os|meus|amigos.']]}
  }[LANG];

  function state(){ try { return JSON.parse(localStorage.getItem(KEY)||'{}'); } catch { return {}; } }
  function save(s){ localStorage.setItem(KEY,JSON.stringify(s)); window.SprachwerkCloud?.queueSave?.(); }
  function addXP(n, reason='Training'){
    const s=state(), today=new Date().toISOString().slice(0,10);
    s.xp=(s.xp||0)+n; s.dailyXP=(s.dailyXP||0)+n; s.lastDay=today; s.dailyTasks=s.dailyTasks||{}; s.dailyTasks[today]=(s.dailyTasks[today]||0)+1;
    s.trainingLog=s.trainingLog||[]; s.trainingLog.unshift({lang:LANG,reason,xp:n,ts:Date.now()}); s.trainingLog=s.trainingLog.slice(0,80); save(s);
    document.getElementById('daily-xp')?.replaceChildren(document.createTextNode(`${s.dailyXP} / 50 XP`));
  }
  function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
  function esc(s=''){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
  function speak(text, slow=false){ if(!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=voiceLang; u.rate=slow?.72:.92; speechSynthesis.speak(u); }
  function normalize(s=''){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
  function similarity(a,b){const aa=normalize(a).split(' ').filter(Boolean),bb=normalize(b).split(' ').filter(Boolean); if(!aa.length||!bb.length)return 0; const same=aa.filter(x=>bb.includes(x)).length; return Math.round(100*same/Math.max(aa.length,bb.length))}

  const tabs=document.querySelector('.tabs .wrap');
  if(tabs && !tabs.querySelector('[data-tab="training-panel"]')){
    const training=document.createElement('button'); training.className='tab'; training.dataset.tab='training-panel'; training.textContent='Training';
    const stories=document.createElement('button'); stories.className='tab'; stories.dataset.tab='stories-panel'; stories.textContent='Geschichten';
    tabs.insertBefore(training,tabs.children[3]||null); tabs.insertBefore(stories,tabs.children[4]||null);
    [training,stories].forEach(b=>b.onclick=()=>window.LW43_openPanel?.(b.dataset.tab));
  }
  // Expose a safe panel opener independent of the original closure.
  window.LW43_openPanel = id => {
    document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${id}"]`)?.classList.add('active');
    document.getElementById(id)?.classList.add('active');
    const top=document.querySelector('.tabs')?.offsetTop||0; window.scrollTo({top:Math.max(0,top-70),behavior:'smooth'});
  };
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>window.LW43_openPanel(b.dataset.tab)));

  const main=document.querySelector('main');
  if(main && !document.getElementById('training-panel')){
    const section=document.createElement('section'); section.className='panel lw43-training-panel'; section.id='training-panel';
    section.innerHTML=`<div class="wrap"><div class="section-head"><span class="badge">LERNWERK TRAINING LAB</span><h2>Trainiere aktiv statt nur zu lesen.</h2><p>Ein gemischtes Tagestraining, Aussprache mit Mikrofon-Feedback und Satzbau-Puzzles für deine aktuelle Sprache.</p></div>
      <div class="lw43-training-grid">
       <article class="lw43-module lw43-module--mix"><div class="lw43-icon">⚡</div><span>10-MINUTEN-MIX</span><h3>Deine tägliche Lernmission</h3><p>Vokabeln und Verben werden in einer kurzen Session gemischt. Jede Runde ist neu.</p><button class="open-btn" id="lw43-start-mix">Training starten</button></article>
       <article class="lw43-module"><div class="lw43-icon">🎙️</div><span>AUSSPRACHE-LAB</span><h3>Hören, sprechen, vergleichen</h3><p>Sprich echte Alltagssätze nach. Unterstützte Browser geben dir direktes Spracherkennungs-Feedback.</p><button class="open-btn" id="lw43-open-pronunciation">Aussprache trainieren</button></article>
       <article class="lw43-module"><div class="lw43-icon">🧩</div><span>SATZBAU</span><h3>Baue den Satz richtig auf</h3><p>Ordne Wörter aktiv zu vollständigen Sätzen. Ideal, um Wortstellung wirklich zu automatisieren.</p><button class="open-btn" id="lw43-open-builder">Satz-Puzzle starten</button></article>
      </div>
      <div class="lw43-stats"><div><strong id="lw43-mix-best">0/10</strong><span>Bester Tagesmix</span></div><div><strong id="lw43-speaking-count">0</strong><span>gesprochene Sätze</span></div><div><strong id="lw43-builder-count">0</strong><span>Satz-Puzzles gelöst</span></div><div><strong id="lw43-badges">0</strong><span>Badges verdient</span></div></div>
      <div class="lw43-badges" id="lw43-badge-list"></div>
    </div>`;
    const stories=document.getElementById('stories-panel'); if(stories) stories.before(section); else main.appendChild(section);
  }

  const modal=document.getElementById('content-dialog'), output=document.getElementById('dialog-content');
  function openModal(html){if(!modal||!output)return;output.innerHTML=html;modal.showModal()}

  let flatWords=[];(DATA?.vocab||[]).forEach((cat,ci)=>(cat.items||[]).forEach((w,wi)=>flatWords.push({id:`${ci}:${wi}`,word:w[0],translation:w[1],cat:cat.name})));
  function distractors(correct){return shuffle(flatWords.filter(w=>w.translation!==correct).map(w=>w.translation)).slice(0,3)}
  function makeMix(){
    const qs=[];
    shuffle(flatWords).slice(0,6).forEach(w=>{const options=shuffle([w.translation,...distractors(w.translation)]);qs.push({type:'Vokabel',prompt:w.word,options,correct:options.indexOf(w.translation)});});
    shuffle(VERBS).slice(0,4).forEach(v=>{const person=Math.floor(Math.random()*Math.min(6,v.present.length)); const answer=v.present[person]; const candidates=shuffle(v.present.filter((x,i)=>i!==person)).slice(0,3); const options=shuffle([answer,...candidates]); const pron=(typeof VERB_META!=='undefined'&&VERB_META[LANG]?.[1]?.[person])||`Person ${person+1}`;qs.push({type:'Verb · Präsens',prompt:`${pron} · ${v.verb}`,options,correct:options.indexOf(answer)});});
    return shuffle(qs).slice(0,10);
  }
  function startMix(){
    const qs=makeMix(); let idx=0,score=0;
    function render(){
      if(idx>=qs.length){const s=state();s.mixBest=s.mixBest||{};s.mixBest[LANG]=Math.max(s.mixBest[LANG]||0,score);save(s);if(score>=8)addXP(30,'Tagesmix');else if(score>=5)addXP(15,'Tagesmix');openModal(`<div class="lesson-body lw43-finish"><span class="badge">TAGESMIX</span><h2>${score} / 10 richtig</h2><div class="lw43-score-ring">${score*10}%</div><p>${score>=8?'Starke Runde. Deine Mischung sitzt bereits sehr gut.':'Gute Basis. Wiederhole die Runde später noch einmal.'}</p><button class="open-btn" id="lw43-repeat-mix">Neue Runde starten</button></div>`);document.getElementById('lw43-repeat-mix').onclick=startMix;refreshTrainingStats();return;}
      const q=qs[idx]; openModal(`<div class="lesson-body lw43-challenge"><span class="badge">${q.type} · ${idx+1}/10</span><h2>${esc(q.prompt)}</h2><p>Wähle die richtige Antwort.</p><div class="lw43-options">${q.options.map((o,i)=>`<button data-answer="${i}">${esc(o)}</button>`).join('')}</div><div id="lw43-feedback"></div></div>`);
      output.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.answer===q.correct;output.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');if(!ok)output.querySelector(`[data-answer="${q.correct}"]`)?.classList.add('correct');document.getElementById('lw43-feedback').innerHTML=`<p class="${ok?'feedback-ok':'feedback-bad'}">${ok?'Richtig ✓':'Noch nicht. Die richtige Lösung ist markiert.'}</p>`;if(ok)score++;setTimeout(()=>{idx++;render()},850)});
    } render();
  }

  let phraseIndex=0;
  function openPronunciation(){
    const phrase=copy.phrases[phraseIndex%copy.phrases.length];
    openModal(`<div class="lesson-body lw43-pron"><span class="badge">AUSSPRACHE-LAB · ${phraseIndex%copy.phrases.length+1}/${copy.phrases.length}</span><h2>${esc(phrase)}</h2><p>Höre zuerst zu und sprich den Satz danach möglichst natürlich nach.</p><div class="lw43-pron-actions"><button class="open-btn" id="lw43-listen">🔊 Anhören</button><button class="open-btn" id="lw43-listen-slow">🐢 Langsam</button><button class="open-btn lw43-record" id="lw43-record">🎙️ Sprechen</button></div><div class="lw43-speech-result" id="lw43-speech-result"><span>Bereit für deine Aufnahme.</span></div><button class="open-btn secondary" id="lw43-next-phrase">Nächster Satz →</button></div>`);
    document.getElementById('lw43-listen').onclick=()=>speak(phrase,false);document.getElementById('lw43-listen-slow').onclick=()=>speak(phrase,true);document.getElementById('lw43-next-phrase').onclick=()=>{phraseIndex++;openPronunciation()};
    document.getElementById('lw43-record').onclick=()=>{
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition, res=document.getElementById('lw43-speech-result');
      if(!SR){res.innerHTML='<strong>Spracherkennung ist in diesem Browser nicht verfügbar.</strong><span>Du kannst den Satz trotzdem anhören und laut nachsprechen.</span>';return;}
      const rec=new SR();rec.lang=voiceLang;rec.interimResults=false;rec.maxAlternatives=1;res.innerHTML='<strong>Ich höre zu …</strong><span>Sprich jetzt.</span>';
      rec.onresult=e=>{const heard=e.results[0][0].transcript,score=similarity(phrase,heard),s=state();s.speakingCount=s.speakingCount||{};s.speakingCount[LANG]=(s.speakingCount[LANG]||0)+1;save(s);if(score>=75)addXP(8,'Aussprache');res.innerHTML=`<strong>${score}% Übereinstimmung</strong><span>Erkannt: ${esc(heard)}</span><div class="lw43-meter"><i style="width:${score}%"></i></div>`;refreshTrainingStats()};rec.onerror=()=>{res.innerHTML='<strong>Aufnahme nicht erkannt.</strong><span>Versuche es noch einmal oder prüfe die Mikrofonfreigabe.</span>'};rec.start();
    };
  }

  let sentenceIndex=0, built=[];
  function openBuilder(){
    const item=copy.sentences[sentenceIndex%copy.sentences.length],answer=item[0],tokens=item[1].split('|');built=[];
    openModal(`<div class="lesson-body lw43-builder"><span class="badge">SATZBAU · ${sentenceIndex%copy.sentences.length+1}/${copy.sentences.length}</span><h2>Satz-Puzzle</h2><p>Tippe die Wörter in der richtigen Reihenfolge an.</p><div class="lw43-built" id="lw43-built"><span>Dein Satz erscheint hier …</span></div><div class="lw43-token-bank">${shuffle(tokens).map((t,i)=>`<button data-token="${esc(t)}" data-token-id="${i}">${esc(t)}</button>`).join('')}</div><div class="lw43-builder-actions"><button class="open-btn secondary" id="lw43-reset-builder">Zurücksetzen</button><button class="open-btn" id="lw43-check-builder">Prüfen</button></div><div id="lw43-builder-feedback"></div></div>`);
    output.querySelectorAll('[data-token]').forEach(btn=>btn.onclick=()=>{if(btn.disabled)return;btn.disabled=true;built.push(btn.dataset.token);document.getElementById('lw43-built').textContent=built.join(' ')});
    document.getElementById('lw43-reset-builder').onclick=openBuilder;document.getElementById('lw43-check-builder').onclick=()=>{const candidate=built.join(' ').replace(/\s+([.,!?])/g,'$1'),ok=normalize(candidate)===normalize(answer),fb=document.getElementById('lw43-builder-feedback');fb.innerHTML=ok?`<p class="feedback-ok">Richtig ✓ ${esc(answer)}</p>`:`<p class="feedback-bad">Fast. Lösung: <strong>${esc(answer)}</strong></p>`;if(ok){const s=state();s.builderCount=s.builderCount||{};s.builderCount[LANG]=(s.builderCount[LANG]||0)+1;save(s);addXP(10,'Satzbau');sentenceIndex++;setTimeout(openBuilder,900);refreshTrainingStats()}};
  }

  function badgesFor(s){
    const completed=Object.keys(s.completed||{}).filter(k=>k.startsWith(`${LANG}:g:`)&&s.completed[k]).length;
    const vocab=Object.keys(s.words||{}).filter(k=>k.startsWith(`${LANG}:`)&&(s.words[k]||0)>=3).length;
    const speaking=s.speakingCount?.[LANG]||0,builder=s.builderCount?.[LANG]||0,best=s.mixBest?.[LANG]||0;
    return [
      {icon:'⚓',name:'Erste Mission',done:completed>=1,copy:'1 Grammatiklektion bestanden'},
      {icon:'📚',name:'Wortschatz 100',done:vocab>=100,copy:'100 Vokabeln gefestigt'},
      {icon:'⚡',name:'Mix-Meister',done:best>=8,copy:'Mindestens 8/10 im Tagesmix'},
      {icon:'🎙️',name:'Stimme an Deck',done:speaking>=10,copy:'10 Sätze gesprochen'},
      {icon:'🧩',name:'Satzbauer',done:builder>=10,copy:'10 Satz-Puzzles gelöst'},
      {icon:'🏆',name:'Kurskapitän',done:completed>=20,copy:'Alle 20 Grammatiklektionen gemeistert'}
    ];
  }
  function refreshTrainingStats(){
    const s=state(),badges=badgesFor(s),earned=badges.filter(x=>x.done).length;
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
    set('lw43-mix-best',`${s.mixBest?.[LANG]||0}/10`);set('lw43-speaking-count',s.speakingCount?.[LANG]||0);set('lw43-builder-count',s.builderCount?.[LANG]||0);set('lw43-badges',earned);
    const root=document.getElementById('lw43-badge-list');if(root)root.innerHTML=badges.map(b=>`<article class="lw43-badge ${b.done?'earned':''}"><i>${b.icon}</i><div><strong>${b.name}</strong><span>${b.copy}</span></div>${b.done?'<b>✓</b>':'<b>○</b>'}</article>`).join('');
  }

  document.getElementById('lw43-start-mix')?.addEventListener('click',startMix);
  document.getElementById('lw43-open-pronunciation')?.addEventListener('click',openPronunciation);
  document.getElementById('lw43-open-builder')?.addEventListener('click',openBuilder);
  // Add a dashboard shortcut.
  const dash=document.querySelector('.dash-grid'); if(dash && !document.getElementById('lw43-dash-training')){const c=document.createElement('article');c.className='dash-card';c.id='lw43-dash-training';c.innerHTML='<span class="dash-label">Training Lab</span><strong>⚡ 10 Min</strong><p>Mix · Aussprache · Satzbau</p><button class="mini-btn">Training öffnen</button>';c.querySelector('button').onclick=()=>window.LW43_openPanel('training-panel');dash.appendChild(c)}
  const params=new URLSearchParams(location.search); if(params.get('tab')==='training') setTimeout(()=>window.LW43_openPanel('training-panel'),120);
  refreshTrainingStats();
})();

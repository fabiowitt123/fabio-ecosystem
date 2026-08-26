'use strict';

document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

const updateMobileNavOffset = () => {
  if (!header) return;
  if (window.innerWidth <= 900) {
    const bottom = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty('--mobile-nav-top', `${bottom}px`);
  } else {
    document.documentElement.style.removeProperty('--mobile-nav-top');
  }
};

const setMenuState = (isOpen) => {
  if (!menuToggle || !nav) return;
  updateMobileNavOffset();
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  nav.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  const label = menuToggle.querySelector('.sr-only');
  if (label) label.textContent = isOpen ? 'Navigation schließen' : 'Navigation öffnen';
};

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    updateMobileNavOffset();
    if (window.innerWidth > 900) setMenuState(false);
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
  updateMobileNavOffset();
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = [...document.querySelectorAll('[data-reveal]')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

revealItems.forEach((item) => {
  const delay = Number(item.dataset.revealDelay || 0);
  item.style.setProperty('--reveal-delay', `${delay}ms`);
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: '-22% 0px -58%' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton && contactForm.checkValidity()) {
      submitButton.disabled = true;
      submitButton.textContent = 'Anfrage wird gesendet …';
    }
  });
}


const closeOtherBlogArticles = (target) => {
  document.querySelectorAll('details.blog-article[open]').forEach((article) => {
    if (article !== target) article.open = false;
  });
};

const openBlogArticleFromHash = (shouldScroll = false) => {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!(target instanceof HTMLDetailsElement)) return;
  closeOtherBlogArticles(target);
  target.open = true;
  if (shouldScroll) {
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
};

document.querySelectorAll('[data-blog-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (!(target instanceof HTMLDetailsElement)) return;
    event.preventDefault();
    closeOtherBlogArticles(target);
    target.open = true;
    history.replaceState(null, '', href);
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

openBlogArticleFromHash(false);
window.addEventListener('hashchange', () => openBlogArticleFromHash(true));



// DACHWERK v16 - conversion, knowledge hub and interactive project tools.

const requestParams = new URLSearchParams(window.location.search);
const contactFocus = document.querySelector('#focus');
const contactMessage = document.querySelector('#message');
if (requestParams.get('anfrage') === 'erstgespraech') {
  if (contactFocus) contactFocus.value = '30-Minuten-Projektgespräch';
  if (contactMessage && !contactMessage.value) {
    contactMessage.placeholder = 'Kurzbeschreibung: Ausgangslage, Ziel, betroffene Werke, gewünschter Zeitrahmen und relevante SAP-Themen ...';
  }
}

// Carry the interactive project-check result into the contact form during the same browser session.
try {
  const storedProjectResult = sessionStorage.getItem('dachwerkProjectCheck');
  if (storedProjectResult && contactMessage && !contactMessage.value) {
    contactMessage.value = `${storedProjectResult}\n\nBitte kontaktieren Sie mich für eine erste Einordnung.`;
  }
} catch (_) {
  // Session storage can be unavailable in locked-down browsers.
}

// Homepage workstream matcher.
const homepageTeamInputs = [...document.querySelectorAll('[data-team-match-input]')];
const homepageTeamResult = document.querySelector('[data-team-match-result]');
if (homepageTeamInputs.length && homepageTeamResult) {
  const roleByValue = {
    ppds: 'Senior SAP PP / PP/DS Consultant',
    peo: 'Senior SAP PEO / PLM Consultant',
    mm: 'Senior SAP MM / SCM Consultant',
    tools: 'SAP Signavio / Cloud ALM Consultant',
    testing: 'Test- und Cutover Lead',
    data: 'Data & Integration Consultant'
  };

  const renderHomepageTeam = () => {
    const selected = homepageTeamInputs.filter((input) => input.checked).map((input) => input.value);
    const title = homepageTeamResult.querySelector('h3');
    const copy = homepageTeamResult.querySelector('p');
    const list = homepageTeamResult.querySelector('ul');
    if (!title || !copy || !list) return;

    if (!selected.length) {
      title.textContent = '1 DACH-Projektleiter:in + passendes Senior Delivery Team';
      copy.textContent = 'Wählen Sie links mindestens einen Workstream. Anschließend zeigen wir eine mögliche Rollenstruktur.';
      list.replaceChildren(
        ...['Persönliche Kunden- und Qualitätsverantwortung', 'Transparente Rollen und Arbeitspakete', 'Projektkommunikation auf Deutsch und Englisch'].map((text) => {
          const item = document.createElement('li'); item.textContent = text; return item;
        })
      );
      return;
    }

    const expertCount = Math.min(selected.length, 4);
    title.textContent = `1 DACH-Projektleiter:in + ${expertCount} passende Senior-Rolle${expertCount > 1 ? 'n' : ''}`;
    copy.textContent = selected.length > 3
      ? 'Für mehrere Workstreams empfehlen wir zusätzlich ein gemeinsames Integration- und Quality-Review.'
      : 'Ein schlankes Setup mit klarer DACH-Verantwortung und gezielter Senior Delivery.';
    const items = [
      'DACH-Projektleitung: Scope, Kundendialog, Reviews und Abnahme',
      ...selected.map((value) => roleByValue[value]).filter(Boolean),
      'Transparente Teamfreigabe vor Projektstart'
    ];
    if (selected.length > 3) items.push('Integration und Quality Review über alle Workstreams');
    list.replaceChildren(...items.map((text) => { const item = document.createElement('li'); item.textContent = text; return item; }));
  };

  homepageTeamInputs.forEach((input) => input.addEventListener('change', renderHomepageTeam));
  renderHomepageTeam();
}

// Filterable SAP knowledge hub.
const knowledgeCards = [...document.querySelectorAll('[data-blog-card]')];
const knowledgeArticles = [...document.querySelectorAll('[data-blog-article]')];
const knowledgeSearch = document.querySelector('[data-blog-search]');
const knowledgeFilterButtons = [...document.querySelectorAll('[data-blog-filter]')];
const knowledgeCount = document.querySelector('[data-blog-count]');
const knowledgeEmpty = document.querySelector('[data-blog-empty]');
let activeKnowledgeFilter = 'all';

const updateKnowledgeHub = () => {
  if (!knowledgeCards.length) return;
  const query = (knowledgeSearch?.value || '').trim().toLocaleLowerCase('de');
  let visible = 0;
  knowledgeCards.forEach((card) => {
    const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
    const categoryMatches = activeKnowledgeFilter === 'all' || categories.includes(activeKnowledgeFilter);
    const searchText = (card.dataset.search || card.textContent || '').toLocaleLowerCase('de');
    const searchMatches = !query || searchText.includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });
  knowledgeArticles.forEach((article) => {
    const categories = (article.dataset.category || '').split(/\s+/).filter(Boolean);
    const categoryMatches = activeKnowledgeFilter === 'all' || categories.includes(activeKnowledgeFilter);
    const searchText = (article.dataset.search || article.textContent || '').toLocaleLowerCase('de');
    const searchMatches = !query || searchText.includes(query);
    article.hidden = !(categoryMatches && searchMatches);
  });
  if (knowledgeCount) knowledgeCount.textContent = String(visible);
  if (knowledgeEmpty) knowledgeEmpty.hidden = visible !== 0;
};

knowledgeFilterButtons.forEach((button) => button.addEventListener('click', () => {
  activeKnowledgeFilter = button.dataset.blogFilter || 'all';
  knowledgeFilterButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  updateKnowledgeHub();
}));
knowledgeSearch?.addEventListener('input', updateKnowledgeHub);
updateKnowledgeHub();

// SAP glossary search and A-Z filtering.
const glossaryItems = [...document.querySelectorAll('[data-glossary-entry]')];
const glossaryInput = document.querySelector('[data-glossary-search]');
const glossaryButtons = [...document.querySelectorAll('[data-glossary-letter]')];
const glossaryVisibleCount = document.querySelector('[data-glossary-count]');
const glossaryNoResults = document.querySelector('[data-glossary-empty]');
let activeGlossaryLetter = 'all';

const updateGlossaryView = () => {
  if (!glossaryItems.length) return;
  const query = (glossaryInput?.value || '').trim().toLocaleLowerCase('de');
  let visible = 0;
  glossaryItems.forEach((entry) => {
    const letterMatches = activeGlossaryLetter === 'all' || entry.dataset.letter === activeGlossaryLetter;
    const searchText = (entry.dataset.search || entry.textContent || '').toLocaleLowerCase('de');
    const searchMatches = !query || searchText.includes(query);
    const show = letterMatches && searchMatches;
    entry.hidden = !show;
    if (show) visible += 1;
  });
  if (glossaryVisibleCount) glossaryVisibleCount.textContent = String(visible);
  if (glossaryNoResults) glossaryNoResults.hidden = visible !== 0;
};

glossaryButtons.forEach((button) => button.addEventListener('click', () => {
  activeGlossaryLetter = button.dataset.glossaryLetter || 'all';
  glossaryButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  updateGlossaryView();
}));
glossaryInput?.addEventListener('input', updateGlossaryView);
updateGlossaryView();

// Eight-question project check with an immediate browser-side assessment.
const projectCheck = document.querySelector('[data-project-check]');
if (projectCheck) {
  const steps = [...projectCheck.querySelectorAll('[data-check-step]')];
  const currentLabel = document.querySelector('[data-check-current]');
  const progressBar = document.querySelector('[data-check-progress]');
  const backButton = projectCheck.querySelector('[data-check-back]');
  const nextButton = projectCheck.querySelector('[data-check-next]');
  const submitButton = projectCheck.querySelector('[data-check-submit]');
  const validationMessage = projectCheck.querySelector('[data-check-error]');
  const result = document.querySelector('[data-project-result]');
  let currentStep = 0;

  const renderStep = () => {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === currentStep));
    if (currentLabel) currentLabel.textContent = String(currentStep + 1);
    if (progressBar) progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    if (backButton) backButton.hidden = currentStep === 0;
    if (nextButton) nextButton.hidden = currentStep === steps.length - 1;
    if (submitButton) submitButton.hidden = currentStep !== steps.length - 1;
    if (validationMessage) validationMessage.hidden = true;
  };

  const currentStepIsValid = () => {
    const step = steps[currentStep];
    if (!step) return true;
    const minimumSelected = Number(step.dataset.minSelected || 0);
    if (minimumSelected > 0) {
      return step.querySelectorAll('input[type="checkbox"]:checked').length >= minimumSelected;
    }
    const required = [...step.querySelectorAll('input[required], select[required], textarea[required]')];
    const radioNames = [...new Set(required.filter((input) => input.type === 'radio').map((input) => input.name))];
    if (radioNames.some((name) => !step.querySelector(`input[name="${CSS.escape(name)}"]:checked`))) return false;
    return required.filter((input) => input.type !== 'radio').every((input) => input.checkValidity());
  };

  nextButton?.addEventListener('click', () => {
    if (!currentStepIsValid()) {
      if (validationMessage) validationMessage.hidden = false;
      return;
    }
    currentStep = Math.min(steps.length - 1, currentStep + 1);
    renderStep();
  });

  backButton?.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    renderStep();
  });

  projectCheck.addEventListener('change', () => {
    if (validationMessage) validationMessage.hidden = true;
  });

  projectCheck.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentStepIsValid() || !result) {
      if (validationMessage) validationMessage.hidden = false;
      return;
    }

    const selectedScoredInputs = [...projectCheck.querySelectorAll('input[data-score]:checked')];
    const score = selectedScoredInputs.reduce((sum, input) => sum + Number(input.dataset.score || 0), 0);
    const data = new FormData(projectCheck);
    const modules = data.getAll('module').map(String);
    const projectType = String(data.get('projectType') || 'SAP-Vorhaben');
    const plants = String(data.get('plants') || 'nicht angegeben');
    const maturity = String(data.get('maturity') || 'nicht angegeben');
    const capacity = String(data.get('capacity') || 'nicht angegeben');
    const timeline = String(data.get('timeline') || 'nicht angegeben');
    const english = String(data.get('english') || 'nicht angegeben');

    let title;
    let intro;
    let recommendedStart;
    if (score <= 4) {
      title = 'Fundament vor Umsetzung stärken';
      intro = 'Mehrere Grundlagen sind noch offen. Ein großer Implementierungsstart wäre derzeit unnötig riskant.';
      recommendedStart = `Discover- und Scoping-Sprint für ${projectType}: Zielbild, Scope, Prozess- und Datenreife sowie Governance klären.`;
    } else if (score <= 8) {
      title = 'Gute Basis mit gezieltem Klärungsbedarf';
      intro = 'Das Vorhaben ist greifbar, benötigt aber vor Realize noch belastbare Entscheidungen und Artefakte.';
      recommendedStart = `Prepare/Explore für ${projectType}: Fit-to-Standard, Toolchain, Teamkapazität und Teststrategie konkretisieren.`;
    } else {
      title = 'Gute Ausgangslage für einen strukturierten Projektstart';
      intro = 'Die wesentlichen Voraussetzungen wirken tragfähig. Annahmen sollten nun in Workshops validiert werden.';
      recommendedStart = `${projectType} mit klaren Quality Gates, priorisiertem Backlog und früh vorbereitetem Testing starten.`;
    }

    const roleMap = {
      'SAP PP': 'Senior SAP PP Consultant',
      'SAP PP/DS': 'Senior SAP PP/DS Consultant',
      'SAP PEO': 'Senior SAP PEO / PLM Consultant',
      'SAP MM / SCM': 'Senior SAP MM / SCM Consultant',
      'Signavio / Cloud ALM': 'Process & ALM Lead',
      'Business One': 'SAP Business One Consultant'
    };
    const roles = ['DACH-Projektleitung', 'Solution & Quality Lead', ...modules.map((module) => roleMap[module]).filter(Boolean)];
    if (modules.length >= 3 || plants.startsWith('4')) roles.push('Test / Integration Lead');
    const uniqueRoles = [...new Set(roles)];

    const risks = [];
    if (maturity === 'Noch kaum dokumentiert') risks.push('Prozess- und Stammdatenreife vor Konfiguration sichtbar machen.');
    if (capacity === 'Sehr begrenzt') risks.push('Key-User- und Business-Kapazität verbindlich absichern.');
    if (timeline === 'Unter 6 Monate') risks.push('Scope stark begrenzen oder den Zieltermin realistisch neu bewerten.');
    if (english === 'Nein, ausschließlich Deutsch') risks.push('Teammodell und Kostenwirkung eines rein deutschsprachigen Setups prüfen.');
    if (plants.startsWith('4')) risks.push('Template-, Varianten- und Rollout-Governance früh festlegen.');
    if (!risks.length) risks.push('Quality Gates, Datenmigration und Cutover auch bei guter Ausgangslage früh detaillieren.');

    const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
    setText('[data-result-score]', String(score));
    setText('[data-result-title]', title);
    setText('[data-result-intro]', intro);
    setText('[data-result-start]', recommendedStart);
    setText('[data-result-team]', `${uniqueRoles.join(', ')}. Betroffener Scope: ${modules.join(', ')}; ${plants}.`);
    const riskList = document.querySelector('[data-result-risks]');
    if (riskList) riskList.replaceChildren(...risks.map((risk) => { const item = document.createElement('li'); item.textContent = risk; return item; }));

    const summary = `SAP-Projekt-Check: ${title}. Vorhaben: ${projectType}. Scope: ${modules.join(', ')}. Standorte: ${plants}. Empfohlener Start: ${recommendedStart}`;
    try { sessionStorage.setItem('dachwerkProjectCheck', summary); } catch (_) { /* optional */ }

    projectCheck.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  });

  document.querySelector('[data-check-restart]')?.addEventListener('click', () => {
    projectCheck.reset();
    projectCheck.hidden = false;
    if (result) result.hidden = true;
    currentStep = 0;
    renderStep();
  });

  renderStep();
}

// Full team-matching tool.
const teamMatcher = document.querySelector('[data-team-matcher]');
if (teamMatcher) {
  const tier = document.querySelector('[data-team-tier]');
  const summary = document.querySelector('[data-team-summary]');
  const rolesContainer = document.querySelector('[data-team-roles]');

  const updateTeamMatcher = () => {
    const selected = [...teamMatcher.querySelectorAll('input[name="workstream"]:checked')];
    const phase = teamMatcher.querySelector('[data-team-phase]')?.value || 'Projekt';
    const delivery = teamMatcher.querySelector('input[name="delivery"]:checked')?.value || '';
    const roles = [
      'DACH-Projektleitung',
      'Solution & Quality Lead',
      ...selected.map((input) => input.dataset.role).filter(Boolean)
    ];
    if (['Realize', 'Deploy'].includes(phase)) roles.push('Test / Cutover Lead');
    const uniqueRoles = [...new Set(roles)];

    let label = 'Lean Advisory Setup';
    if (selected.length >= 2) label = 'Core Implementation Team';
    if (selected.length >= 5) label = 'Scale-up Delivery Pod';
    if (tier) tier.textContent = label;
    if (summary) {
      summary.textContent = selected.length
        ? `${selected.length} Fachworkstream(s) in der Phase ${phase}. Delivery-Präferenz: ${delivery}.`
        : 'Wählen Sie mindestens einen Workstream, um einen Teamvorschlag zu erhalten.';
    }
    if (rolesContainer) {
      rolesContainer.replaceChildren(...uniqueRoles.map((role) => { const item = document.createElement('span'); item.textContent = role; return item; }));
    }
  };

  teamMatcher.addEventListener('change', updateTeamMatcher);
  updateTeamMatcher();
}

// Netlify forms submit normally online; local previews jump to the download page.
const isLocalPreview = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
if (isLocalPreview) {
  document.querySelectorAll('form[name^="readiness-check"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      window.location.href = form.getAttribute('action') || 'readiness-download.html';
    });
  });
}



// Local preview fallback for the Netlify-gated Readiness PDF.
document.querySelectorAll('[data-lead-magnet-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const localPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (localPreview && form.checkValidity()) {
      event.preventDefault();
      location.href = 'readiness-download.html';
    }
  });
});


// v17 Integrated Toolchain interaction.
const toolchainStages = {
  discover: {kicker:'01 · Discover',title:'Zielbild, Business Case und Scope belastbar machen.',text:'Wir strukturieren Ausgangslage, Transformationsroute, Stakeholder, Kernprozesse und Entscheidungsbedarf. Das Ergebnis ist ein arbeitsfähiger Scope statt einer reinen Vision.',items:['Projektziele und Business Outcomes','System- und Prozesslandschaft','Workstreams, Governance und Quality Gates']},
  explore: {kicker:'02 · Explore',title:'Fit-to-Standard und Prozessentscheidungen in Signavio sichtbar machen.',text:'Workshops werden in nachvollziehbare Prozessmodelle, Gaps und Entscheidungen übersetzt. So bleibt fachlicher Kontext erhalten und Requirements entstehen nicht losgelöst vom Prozess.',items:['Signavio Prozessmodelle','Fit / Gap / Decision Log','Requirements mit Owner & Akzeptanzkriterien']},
  realize: {kicker:'03 · Realize',title:'Backlog, Umsetzung und Status in Cloud ALM verbinden.',text:'Requirements, Aufgaben und User Stories werden in umsetzbare Arbeitspakete gegliedert. DACH-Projektleitung und Delivery-Experten arbeiten auf denselben Abnahmekriterien.',items:['Requirements & User Stories','Konfiguration / Integration','Review und Definition of Done']},
  test: {kicker:'04 · Validate',title:'SIT, UAT und Defects als Quality Gate steuern.',text:'Testfälle referenzieren die relevanten Prozesse und Anforderungen. Defects erhalten Business Impact, Owner, Retest und Closure-Kriterien.',items:['E2E SIT','Business UAT','Defect Triage & Retest']},
  deploy: {kicker:'05 · Deploy',title:'Cutover, Go/No-Go und Hypercare nachvollziehbar vorbereiten.',text:'Offene Punkte, Cutover-Aktivitäten und Readiness-Kriterien werden in einen gemeinsamen Entscheidungsrahmen überführt.',items:['Cutover Runbook','Go/No-Go Kriterien','Hypercare & Run Handover']}
};
const tcPanel=document.querySelector('[data-toolchain-panel]');
document.querySelectorAll('[data-toolchain-stage]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-toolchain-stage]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');const d=toolchainStages[btn.dataset.toolchainStage];if(!d||!tcPanel)return;tcPanel.innerHTML=`<p class="toolchain-panel-v17__kicker">${d.kicker}</p><h3>${d.title}</h3><p>${d.text}</p><ul>${d.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;}));

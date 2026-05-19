const PDF_BASE = 'assets/';
const PDF_FILES = {
  'Advanced Echocardiography':                  'Rise IMMAST Calendar 26-27 1 (Advanced Echocardiography).pdf',
  'Cardiac CT':                                 'Rise IMMAST Calendar 26-27 2 (Cardiac CT).pdf',
  'Extra Corporeal Membrane Oxygenation':       'Rise IMMAST Calendar 26-27 3 (Extra Corporeal Membrane Oxygenation).pdf',
  'Trans Esophageal Echocardiography':          'Rise IMMAST Calendar 26-27 4 (Trans Esophageal Echocardiography).pdf',
  'Cardiac Magnetic Resonance Imaging':         'Rise IMMAST Calendar 26-27 5 (Cardiac Magnetic Resonance Imaging).pdf',
  'Intravascular Ultrasound (IVUS)':            'Rise IMMAST Calendar 26-27 6 (Intravascular Ultrasound).pdf'
};

function pdfPathFor(courseName) {
  const key = courseName.replace(/^Certificate Course in /, '').trim();
  const file = PDF_FILES[key];
  if (!file) return null;
  return PDF_BASE + encodeURIComponent(file);
}

const DATA = {
  quarters: [
    {
      id: 'q1',
      num: 1,
      title: 'Apr — Jun',
      range: 'April 1, 2026 — June 30, 2026',
      color: 'var(--accent)',
      colorSoft: 'var(--accent-soft)',
      colorBg: 'var(--accent-bg)',
      courses: [
        { name: 'Certificate Course in Advanced Echocardiography',            dates: '16-17 May 2026',         batch: 28 },
        { name: 'Certificate Course in Cardiac CT',                           dates: '13-14 June 2026',        batch: 30 },
        { name: 'Certificate Course in Extra Corporeal Membrane Oxygenation', dates: '07 May 2026',            batch: 20 },
        { name: 'Certificate Course in Trans Esophageal Echocardiography',    dates: '23-24 May 2026',         batch: 30 }
      ]
    },
    {
      id: 'q2',
      num: 2,
      title: 'Jul — Sep',
      range: 'July 1, 2026 — September 30, 2026',
      color: 'var(--immast)',
      colorSoft: 'var(--immast-soft)',
      colorBg: 'var(--immast-bg)',
      courses: [
        { name: 'Certificate Course in Cardiac Magnetic Resonance Imaging',   dates: '31 July - 2 August 2026', batch: 30 },
        { name: 'Certificate Course in Cardiac CT',                           dates: '22-23 August 2026',       batch: 30 }
      ]
    },
    {
      id: 'q3',
      num: 3,
      title: 'Oct — Dec',
      range: 'October 1, 2026 — December 31, 2026',
      color: 'var(--rise)',
      colorSoft: 'var(--rise-soft)',
      colorBg: 'var(--rise-bg)',
      courses: [
        { name: 'Certificate Course in Advanced Echocardiography',            dates: '21-22 November 2026',    batch: 28 },
        { name: 'Certificate Course in Cardiac CT',                           dates: '19-20 December 2026',    batch: 30 },
        { name: 'Certificate Course in Intravascular Ultrasound (IVUS)',     dates: '12-13 December 2026',    batch: 20 },
        { name: 'Certificate Course in Trans Esophageal Echocardiography',    dates: '28-29 November 2026',    batch: 30 }
      ]
    }
  ]
};

const state = {
  screen: 'landing',
  quarterId: null
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const screens = {
  landing: $('#screen-landing'),
  quarters: $('#screen-quarters'),
  courses: $('#screen-courses')
};

function getQuarter(id) { return DATA.quarters.find(q => q.id === id); }

function setBodyScreenClass(name) {
  document.body.classList.remove('screen-landing', 'screen-quarters', 'screen-courses');
  document.body.classList.add('screen-' + name);
}

function go(name, opts = {}) {
  if (state.screen === name) return;
  const from = screens[state.screen];
  const to = screens[name];
  from.classList.add(opts.back ? 'exit-right' : 'exit-left');
  from.classList.remove('active');
  setTimeout(() => { from.classList.remove('exit-left', 'exit-right'); }, 420);
  to.classList.add('active');
  state.screen = name;
  setBodyScreenClass(name);
  renderBackButtons();
  updateNavLinks();
  closeDrawer();
  try { localStorage.setItem('immast-screen', JSON.stringify({ screen: name, quarterId: state.quarterId })); } catch (e) {}
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function updateNavLinks() {
  $$('.nav-link').forEach(btn => {
    const target = btn.dataset.nav;
    const isActive = state.screen === target;
    btn.classList.toggle('active', isActive);
    btn.disabled = false;
  });
}
$$('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.nav;
    if (btn.disabled) return;
    if (target === 'courses') {
      const qid = state.quarterId || DATA.quarters[0].id;
      state.quarterId = qid;
      renderCourses(getQuarter(qid));
      go('courses');
    } else if (target === 'quarters') {
      go(target, { back: state.screen === 'courses' });
    } else {
      go(target, { back: true });
    }
  });
});

function goHome() { go('landing', { back: true }); }
$$('.brand-group img, .landing-logo').forEach(img => {
  img.addEventListener('click', goHome);
  img.setAttribute('role', 'link');
  img.setAttribute('tabindex', '0');
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
  });
});

const burger = $('#burger');
const drawer = $('#mobile-drawer');
function openDrawer() {
  drawer.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  drawer.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
document.addEventListener('click', (e) => {
  if (!drawer.classList.contains('open')) return;
  if (e.target.closest('#mobile-drawer') || e.target.closest('#burger')) return;
  closeDrawer();
});

function renderBackButtons() {
  ['quarters', 'courses'].forEach(sc => {
    const slot = $('#backslot-' + sc);
    if (!slot) return;
    slot.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'back-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      <span>Back</span>`;
    btn.addEventListener('click', () => {
      if (sc === 'courses') go('quarters', { back: true });
      else go('landing', { back: true });
    });
    slot.appendChild(btn);
  });
}

function renderQuarters() {
  const grid = $('#quarter-grid');
  grid.innerHTML = '';
  DATA.quarters.forEach(q => {
    const card = document.createElement('button');
    card.className = `q-card q-${q.num}`;
    card.setAttribute('aria-label', `Quarter ${q.num} — ${q.title}`);
    card.innerHTML = `
      <span class="q-card__label">Quarter</span>
      <span class="q-card__hex" aria-hidden="true">${q.num}</span>
    `;
    card.addEventListener('click', () => {
      state.quarterId = q.id;
      renderCourses(q);
      go('courses');
    });
    grid.appendChild(card);
  });
}

function renderQuarterSwitch(q) {
  const idx = DATA.quarters.findIndex(x => x.id === q.id);
  const prev = DATA.quarters[idx - 1] || null;
  const next = DATA.quarters[idx + 1] || null;
  const el = $('#quarter-switch');

  const prevHtml = prev
    ? `<button class="qs-btn prev" data-q="${prev.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        <span class="qs-meta">
          <span class="qs-label">Previous quarter</span>
          <span class="qs-title">Q${prev.num} · ${prev.title}</span>
        </span>
      </button>`
    : `<span class="qs-spacer" aria-hidden="true"></span>`;

  const nextHtml = next
    ? `<button class="qs-btn next" data-q="${next.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        <span class="qs-meta">
          <span class="qs-label">Next quarter</span>
          <span class="qs-title">Q${next.num} · ${next.title}</span>
        </span>
      </button>`
    : `<span class="qs-spacer" aria-hidden="true"></span>`;

  el.innerHTML = `
    ${prevHtml}
    <div class="qs-current">Quarter <strong>${q.num}</strong></div>
    ${nextHtml}
  `;

  el.querySelectorAll('.qs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.q;
      if (!id) return;
      const nq = getQuarter(id);
      state.quarterId = nq.id;
      renderCourses(nq);
    });
  });
}

function renderCourses(q) {
  renderQuarterSwitch(q);

  const header = $('#course-header');
  header.innerHTML = `
    <div class="course-header-left">
      <h2>Quarter <span class="accent">${q.num}</span> · ${q.title}</h2>
      <div class="sub">${q.range} · ${q.courses.length} certificate course${q.courses.length === 1 ? '' : 's'}</div>
    </div>
    <div class="course-header-right">
      <div class="specialty-chip"><span class="tick"></span> Cardiology</div>
    </div>
  `;

  const list = $('#course-list');
  list.innerHTML = '';
  ['course-list', 'course-header', 'quarter-switch'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('q-1', 'q-2', 'q-3');
    el.classList.add(`q-${q.num}`);
  });

  q.courses.forEach((c, idx) => {
    const row = document.createElement('button');
    row.className = `course-row q-${q.num}`;
    row.innerHTML = `
      <div class="course-idx">${String(idx + 1).padStart(2, '0')}</div>
      <div>
        <div class="course-name"><small>Certificate Course</small>${c.name.replace(/^Certificate Course in /, '')}</div>
      </div>
      <div class="course-dates">
        <span class="label">Indicative dates</span>
        <span>${c.dates}</span>
      </div>
      <div class="course-batch">
        <span class="label">Batch</span>
        <span class="val">${c.batch}</span>
      </div>
      <div class="course-open" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
      </div>
    `;
    row.addEventListener('click', () => openPdf(q, c));
    list.appendChild(row);
  });
}

function openPdf(q, c) {
  const src = pdfPathFor(c.name);
  if (!src) return;
  window.open(src, '_blank', 'noopener,noreferrer');
}

$('#go-quarters').addEventListener('click', () => go('quarters'));

renderQuarters();
renderBackButtons();
updateNavLinks();
setBodyScreenClass('landing');

try {
  const saved = JSON.parse(localStorage.getItem('immast-screen') || 'null');
  if (saved && saved.screen) {
    if (saved.screen === 'courses' && saved.quarterId) {
      const q = getQuarter(saved.quarterId);
      if (q) {
        state.quarterId = q.id;
        renderCourses(q);
        screens.landing.classList.remove('active');
        screens.courses.classList.add('active');
        state.screen = 'courses';
        setBodyScreenClass('courses');
        updateNavLinks();
      }
    } else if (saved.screen === 'quarters') {
      screens.landing.classList.remove('active');
      screens.quarters.classList.add('active');
      state.screen = 'quarters';
      setBodyScreenClass('quarters');
      updateNavLinks();
    }
  }
} catch (e) {}

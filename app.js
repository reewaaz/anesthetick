(function () {
  'use strict';

  const LS_KEY = 'anestheticks';
  const SAVE_DELAY = 300;

  /* ── state ─────────────────────────────────────────────── */
  let state = loadState();
  let viewStack = [];
  let searchResults = [];

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return { progress: {}, bookmarks: [], installDismissed: false, theme: 'dark' };
  }

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
  }

  const saveStateDebounced = (function () {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(saveState, SAVE_DELAY);
    };
  })();

  /* ── theme ──────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'light' ? '#ffffff' : '#0f172a';
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(state.theme);
    saveStateDebounced();
  }

  // Apply theme on load
  applyTheme(state.theme);

  /* ── helpers ───────────────────────────────────────────── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const html = (s, ...v) => {
    let r = s[0];
    for (let i = 1; i < s.length; i++) r += String(v[i - 1] ?? '') + s[i];
    return r;
  };

  function uid(catId, secId, topicId, subIdx) {
    return `${catId}/${secId}/${topicId}/${subIdx}`;
  }

  function isDone(uidStr) {
    return !!state.progress[uidStr];
  }

  function toggleDone(uidStr) {
    if (state.progress[uidStr]) {
      delete state.progress[uidStr];
    } else {
      state.progress[uidStr] = true;
    }
    saveStateDebounced();
  }

  function isBookmarked(topicId) {
    return state.bookmarks.includes(topicId);
  }

  function toggleBookmark(topicId) {
    const idx = state.bookmarks.indexOf(topicId);
    if (idx >= 0) state.bookmarks.splice(idx, 1);
    else state.bookmarks.push(topicId);
    saveStateDebounced();
  }

  function flattenTopics() {
    const out = [];
    for (const cat of CURRICULUM) {
      for (const sec of cat.sections) {
        for (const t of sec.topics) {
          out.push({ ...t, catId: cat.id, catName: cat.name, secId: sec.id, secName: sec.name, catColor: cat.color });
        }
      }
    }
    return out;
  }

  const ALL_TOPICS = flattenTopics();

  function topicProgress(topic) {
    if (!topic.sub || !topic.sub.length) return 0;
    let done = 0;
    for (let i = 0; i < topic.sub.length; i++) {
      if (isDone(uid(topic.catId, topic.secId, topic.id, i))) done++;
    }
    return done / topic.sub.length;
  }

  function catProgress(catId) {
    let total = 0, done = 0;
    const cat = CURRICULUM.find(c => c.id === catId);
    if (!cat) return 0;
    for (const sec of cat.sections) {
      for (const t of sec.topics) {
        for (let i = 0; i < (t.sub || []).length; i++) {
          total++;
          if (isDone(uid(cat.id, sec.id, t.id, i))) done++;
        }
      }
    }
    return total ? done / total : 0;
  }

  function overallProgress() {
    let total = 0, done = 0;
    for (const cat of CURRICULUM) {
      for (const sec of cat.sections) {
        for (const t of sec.topics) {
          for (let i = 0; i < (t.sub || []).length; i++) {
            total++;
            if (isDone(uid(cat.id, sec.id, t.id, i))) done++;
          }
        }
      }
    }
    return total ? { done, total, pct: done / total } : { done: 0, total: 0, pct: 0 };
  }

  /* ── SVG icons ──────────────────────────────────────────── */
  const ICONS = {
    bookmark: '<svg viewBox="0 0 24 24" class="ic"><path d="M6 3h12v18l-6-4-6 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    'bookmark-filled': '<svg viewBox="0 0 24 24" class="ic"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" class="ic" style="width:16px;height:16px"><path d="M5 13l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" class="ic chev" style="width:18px;height:18px"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    blank: '<svg viewBox="0 0 24 24" class="ic"></svg>',
    external: '<svg viewBox="0 0 24 24" class="ic" style="width:14px;height:14px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" class="ic" style="width:16px;height:16px"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor"/></svg>',
    sun: '<svg viewBox="0 0 24 24" class="ic" style="width:16px;height:16px"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" class="ic link-icon"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download: '<svg viewBox="0 0 24 24" class="ic" style="width:18px;height:18px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gauge: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-11.5V14a1 1 0 0 0 2 0V8.5a3.5 3.5 0 1 0-2 0z" fill="currentColor"/></svg>',
    flask: '<svg viewBox="0 0 24 24"><path d="M8 2h8M9 2v6.4a4 4 0 0 1-.6 2.2L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-4.4-7.4a4 4 0 0 1-.6-2.2V2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activity: '<svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    layers: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'heart-pulse': '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="4 12 8 12 10 8 14 16 16 12 20 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24"><path d="M10.3 3.9a2 2 0 0 1 3.4 0l8 13.9a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4M12 17h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    calculator: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 6h8M8 10h8M8 14h0M12 14h0M16 14h0M8 18h0M12 18h0M16 18h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'shield-check': '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* ── render helpers ────────────────────────────────────── */
  function renderCategoryCard(cat) {
    const pct = catProgress(cat.id);
    return html`
      <div class="cat" style="--catc:${cat.color}" data-cat="${cat.id}">
        <div class="cat-ic">${ICONS[cat.icon] || ICONS.blank}</div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-meta">${cat.sections.length} sections</div>
        <div class="cat-bar"><i style="width:${pct * 100}%"></i></div>
      </div>
    `;
  }

  function renderTopicItem(topic) {
    const pct = topicProgress(topic);
    const bm = isBookmarked(topic.id);
    const allDone = pct === 1 && (topic.sub?.length > 0);
    return html`
      <div class="topic ${allDone ? 'done' : ''}" data-topic-id="${topic.id}">
        <div class="check" data-action="check">${ICONS.check}</div>
        <div class="body">
          <div class="t-name">${topic.name}</div>
          ${topic.desc ? html`<div class="t-desc">${topic.desc}</div>` : ''}
          <div class="t-meta">
            <span>${topic.sub ? topic.sub.length : 0} items</span>
            ${pct > 0 ? html`<span class="t-pct">${Math.round(pct * 100)}%</span>` : ''}
          </div>
        </div>
        <button class="bookmark-btn ${bm ? 'active' : ''}" data-action="bookmark">${bm ? ICONS['bookmark-filled'] : ICONS.bookmark}</button>
        ${ICONS.chevron}
      </div>
    `;
  }

  function renderSubItem(sub, idx, topic, catId, secId) {
    const u = uid(catId, secId, topic.id, idx);
    const done = isDone(u);
    const subLinks = topic.subLinks && topic.subLinks[idx] ? topic.subLinks[idx] : null;
    return html`
      <div class="sub-item ${done ? 'done' : ''}" data-uid="${u}">
        <div class="check">${ICONS.check}</div>
        <div class="sub-context">
          <span class="s-name">${sub}</span>
          ${subLinks ? html`<div class="sub-links">${subLinks.split(',').slice(0,2).map(sl => html`<a href="${sl.trim()}" target="_blank" rel="noopener">${ICONS.external} ${linkLabel(sl.trim())}</a>`).join('')}</div>` : ''}
        </div>
      </div>
    `;
  }

  function linkLabel(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      return host + (u.pathname.length > 1 ? u.pathname.substring(0, 30) + (u.pathname.length > 30 ? '…' : '') : '');
    } catch (_) {
      return url;
    }
  }

  function renderTopicLinks(topic) {
    if (!topic.links || !topic.links.length) return '';
    const mainLinks = topic.links.filter(l => typeof l === 'string');
    if (!mainLinks.length) return '';
    return html`
      <div class="links-section">
        <div class="links-title">${ICONS.link} Resources & References</div>
        ${mainLinks.map(l => html`
          <a href="${l}" target="_blank" rel="noopener" class="link-item">
            ${ICONS.external} ${linkLabel(l)}
          </a>
        `).join('')}
      </div>
    `;
  }

  /* ── views ──────────────────────────────────────────────── */

  function viewHome() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    inner.innerHTML = html`
      <div class="grid stagger" style="margin-top:8px">${CURRICULUM.map(renderCategoryCard).join('')}</div>
    `;
    return inner;
  }

  function viewCategory(catId) {
    const cat = CURRICULUM.find(c => c.id === catId);
    if (!cat) return viewHome();
    viewStack = [{ view: 'home', data: null }];
    const inner = document.createElement('div');
    inner.className = 'inner';
    inner.innerHTML = html`
      <div class="crumbs">
        <button data-nav="home">Home</button><span class="sep">/</span>
        <span>${cat.name}</span>
      </div>
      ${cat.sections.map(sec => html`
        <div class="secg" data-sec="${sec.id}">
          <div class="sec-name">${sec.name}</div>
          ${sec.desc ? html`<div class="sec-desc">${sec.desc}</div>` : ''}
          ${sec.topics.map(t => renderTopicItem({ ...t, catId: cat.id, catName: cat.name, secId: sec.id, secName: sec.name, catColor: cat.color })).join('')}
        </div>
      `).join('')}
    `;
    return inner;
  }

  function viewTopic(topicId) {
    const all = ALL_TOPICS.find(t => t.id === topicId);
    if (!all) return viewHome();
    const { catId, secId, catName, secName } = all;
    viewStack = [
      { view: 'home', data: null },
      { view: 'category', data: catId },
    ];

    const cat = CURRICULUM.find(c => c.id === catId);
    const sec = cat?.sections.find(s => s.id === secId);
    const topic = sec?.topics.find(t => t.id === topicId);
    if (!topic) return viewHome();

    const pct = topicProgress({ ...topic, catId, secId });
    const bm = isBookmarked(topicId);

    const inner = document.createElement('div');
    inner.className = 'inner';
    inner.innerHTML = html`
      <div class="crumbs">
        <button data-nav="home">Home</button><span class="sep">/</span>
        <button data-nav="category" data-cat="${catId}">${catName}</button><span class="sep">/</span>
        <span>${topic.name}</span>
      </div>
      <div class="sheet-head" style="margin-bottom:4px">
        <div>
          <h2>${topic.name}</h2>
          ${topic.desc ? html`<div style="font-size:13px;color:var(--muted);margin-top:4px;font-weight:400;line-height:1.5">${topic.desc}</div>` : ''}
        </div>
        <button class="bookmark-btn ${bm ? 'active' : ''}" data-action="bookmark" style="width:36px;height:36px">${bm ? ICONS['bookmark-filled'] : ICONS.bookmark}</button>
      </div>
      ${topic.refs ? html`
        <div class="refs">${topic.refs.map(r => html`<span class="ref">${r}</span>`).join('')}</div>
      ` : ''}
      ${renderTopicLinks(topic)}
      ${topic.sub?.length ? html`
        <div class="list-title" style="font-size:16px;font-weight:650;margin:16px 0 8px">Learning Objectives</div>
        <div class="sub-list" data-check-all>
          ${topic.sub.map((s, i) => renderSubItem(s, i, topic, catId, secId)).join('')}
        </div>
        <div class="sheet-actions">
          <button class="btn-ghost" data-action="check-all">Check all</button>
          <button class="btn-ghost" data-action="uncheck-all">Uncheck all</button>
        </div>
      ` : html`<p class="muted" style="margin:30px 0;font-weight:400">No learning objectives listed.</p>`}
    `;
    return inner;
  }

  function viewSearch(query) {
    const q = query.toLowerCase().trim();
    searchResults = q ? ALL_TOPICS.filter(t => {
      const nameMatch = t.name.toLowerCase().includes(q);
      const subMatches = (t.sub || []).filter(s => s.toLowerCase().includes(q));
      const refMatches = (t.refs || []).some(r => r.toLowerCase().includes(q));
      if (nameMatch || refMatches) return true;
      if (subMatches.length > 0) {
        t._subMatches = subMatches;
        return true;
      }
      return false;
    }).map(t => {
      // Find the best matching subtopic for display
      const matchSub = (t.sub || []).find(s => s.toLowerCase().includes(q));
      return { ...t, _matchSub: matchSub || null };
    }) : [];

    const inner = document.createElement('div');
    inner.className = 'inner';
    if (!q) {
      inner.innerHTML = '<p class="empty">Type to search topics, subtopics, and references…</p>';
    } else if (!searchResults.length) {
      inner.innerHTML = '<p class="empty">No results found. Try a different term.</p>';
    } else {
      inner.innerHTML = html`
        <div class="list-title" style="font-size:16px;font-weight:600">${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${q}"</div>
        ${searchResults.map(r => html`
          <div class="result" data-topic-id="${r.id}">
            <div class="r-cat">${r.catName} &middot; ${r.secName}</div>
            <div class="r-name">${highlightMatch(r.name, q)}</div>
            <div class="r-sub">${r.sub?.length ?? 0} items ${r.refs ? '&middot; ' + r.refs.join(', ') : ''}</div>
            ${r._matchSub ? html`<div class="r-match">${highlightMatch(r._matchSub, q)}</div>` : ''}
          </div>
        `).join('')}
      `;
    }
    return inner;
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) +
      '<mark>' + text.substring(idx, idx + query.length) + '</mark>' +
      text.substring(idx + query.length);
  }

  function viewProgress() {
    const ov = overallProgress();
    const inner = document.createElement('div');
    inner.className = 'inner';

    const pct = ov.pct;
    const circ = 2 * Math.PI * 36;
    const offset = circ * (1 - pct);

    inner.innerHTML = html`
      <div class="ring-wrap">
        <svg viewBox="0 0 100 100" class="ring">
          <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--accent)"/><stop offset="100%" stop-color="var(--accent2)"/></linearGradient></defs>
          <circle class="bg" cx="50" cy="50" r="36"/>
          <circle class="fg" cx="50" cy="50" r="36" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" transform="rotate(-90 50 50)"/>
          <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="800" fill="var(--text)">${Math.round(pct * 100)}%</text>
        </svg>
        <div>
          <div style="font-size:14px;font-weight:600">Overall Progress</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${ov.done} / ${ov.total} items</div>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat"><div class="n">${CURRICULUM.length}</div><div class="l">Categories</div></div>
        <div class="stat"><div class="n">${ALL_TOPICS.length}</div><div class="l">Topics</div></div>
        <div class="stat"><div class="n">${ov.total}</div><div class="l">Subtopics</div></div>
        <div class="stat"><div class="n">${Math.round(pct * 100)}%</div><div class="l">Completed</div></div>
      </div>
      <div class="list-title" style="font-size:15px;margin:4px 0 12px;font-weight:650">By Category</div>
      ${CURRICULUM.map(cat => {
        const p = catProgress(cat.id);
        return html`
          <div class="cat-prog">
            <div class="cp-head">
              <span class="nm">${cat.name}</span><span class="pct">${Math.round(p * 100)}%</span>
            </div>
            <div class="cp-bar"><i style="width:${p * 100}%;background:${cat.color}"></i></div>
          </div>
        `;
      }).join('')}
    `;
    return inner;
  }

  function viewBookmarks() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    const bmTopics = ALL_TOPICS.filter(t => isBookmarked(t.id));
    if (!bmTopics.length) {
      inner.innerHTML = '<div class="empty"><p>No saved topics yet.</p><p style="font-size:12px;margin-top:8px;font-weight:400">Tap the bookmark icon on any topic to save it here.</p></div>';
    } else {
      inner.innerHTML = html`
        <div class="list-title">Saved Topics</div>
        <div>${bmTopics.map(t => renderTopicItem(t)).join('')}</div>
      `;
    }
    return inner;
  }

  const REFS = [
    { name: "Morgan & Mikhail's Clinical Anesthesiology (6th ed)", desc: 'Core textbook for EDAIC/FRCA. Referenced as <strong>MM</strong> throughout.', url: '' },
    { name: "Miller's Anesthesia (10th ed)", desc: 'Comprehensive reference. Referenced as <strong>MIL</strong>.', url: '' },
    { name: "Dorsch & Dorsch — Understanding Anesthesia Equipment (5th ed)", desc: 'Equipment reference. Referenced as <strong>DD</strong>.', url: '' },
    { name: "British Journal of Anaesthesia (BJA)", desc: 'Leading anaesthesia journal. Free CME and review articles.', url: 'https://www.bjaed.org' },
    { name: "Anesthesia & Analgesia", desc: 'International journal of anesthesia research.', url: 'https://journals.lww.com/anesthesia-analgesia' },
    { name: "OpenAnesthesia", desc: 'Free online anesthesia education resource.', url: 'https://openanesthesia.org' },
    { name: "Anaesthesia Tutorial of the Week (ATOTW)", desc: 'WFSA / AnaesthesiaUK tutorials.', url: 'https://www.wfsahq.org/resources/anaesthesia-tutorial-of-the-week' },
    { name: "NYSORA — Regional Anesthesia", desc: 'Free regional anesthesia education.', url: 'https://www.nysora.com' },
    { name: "Life in the Fast Lane (LITFL)", desc: 'Medical education blog and FOAMed resource.', url: 'https://litfl.com' },
    { name: "Deranged Physiology", desc: 'Free physiology and critical care notes for anaesthesia trainees.', url: 'https://derangedphysiology.com' },
    { name: "PhysiologyWeb", desc: 'Free open physiology texts.', url: 'https://www.physiologyweb.com' },
    { name: "Anaesthesia UK", desc: 'FRCA revision resources.', url: 'https://www.anaesthesiauk.com' },
    { name: "MHAUS — Malignant Hyperthermia Association", desc: 'MH hotline, protocols, and patient resources.', url: 'https://www.mhaus.org' },
    { name: "ASRA — American Society of Regional Anesthesia", desc: 'Regional anesthesia and pain medicine guidelines.', url: 'https://www.asra.com' },
    { name: "APSF — Anesthesia Patient Safety Foundation", desc: 'Patient safety resources and incident reporting.', url: 'https://www.apsf.org' },
    { name: "Difficult Airway Society (DAS)", desc: 'UK airway management guidelines and algorithms.', url: 'https://www.das.uk.com' },
    { name: "Resuscitation Council (UK)", desc: 'CPR and resuscitation guidelines.', url: 'https://www.resus.org.uk' },
    { name: "EBA/ESAIC", desc: 'European Society of Anaesthesiology and Intensive Care — EDAIC exam info.', url: 'https://www.esaic.org' },
    { name: "RCoA — Royal College of Anaesthetists", desc: 'FRCA exam curriculum and resources.', url: 'https://www.rcoa.ac.uk' },
    { name: "PubMed / MEDLINE", desc: 'Primary biomedical literature database for anesthesia research.', url: 'https://pubmed.ncbi.nlm.nih.gov' },
    { name: "Cochrane Library", desc: 'Systematic reviews and meta-analyses in perioperative medicine.', url: 'https://www.cochranelibrary.com' },
  ];

  function viewReferences() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    inner.innerHTML = html`
      <div class="list-title">References &amp; Resources</div>
      <div class="ref-grid">${REFS.map((r, i) => html`
        <div class="ref-card${r.url ? ' clickable' : ''}" data-url="${r.url || ''}">
          <h3>${r.name}</h3>
          <p>${r.desc}</p>
          ${r.url ? html`<div class="ref-link"><svg viewBox="0 0 24 24" class="ic" style="width:14px;height:14px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Open resource</div>` : ''}
        </div>
      `).join('')}</div>
    `;
    // Attach click handlers for ref cards
    requestAnimationFrame(() => {
      inner.querySelectorAll('.ref-card.clickable').forEach(card => {
        card.addEventListener('click', () => {
          const url = card.dataset.url;
          if (url) window.open(url, '_blank', 'noopener');
        });
      });
    });
    return inner;
  }

  function viewSettings() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    const isLight = state.theme === 'light';
    inner.innerHTML = html`
      <div class="list-title">Settings</div>

      <div class="set-group">
        <div class="set-group-title">Appearance</div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Dark Mode</div>
            <div class="desc">Switch between dark and light theme</div>
          </div>
          <div class="theme-toggle ${isLight ? 'on' : ''}" data-action="toggle-theme">
            <span class="toggle-icon sun">${ICONS.sun}</span>
            <span class="toggle-icon moon">${ICONS.moon}</span>
          </div>
        </div>
      </div>

      <div class="set-group">
        <div class="set-group-title">Install</div>
        <div class="set-row" id="installSettingsRow">
          <div class="set-info">
            <div class="lbl">Install App</div>
            <div class="desc">Add Anesthetick to your home screen for offline study</div>
          </div>
          <button class="btn-primary" data-action="install-app" style="padding:8px 14px;font-size:12px">${ICONS.download} Install</button>
        </div>
      </div>

      <div class="set-group">
        <div class="set-group-title">Data</div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Reset All Progress</div>
            <div class="desc">Clear all checkmarks and start fresh</div>
          </div>
          <button class="btn-ghost" data-action="reset-progress" style="font-size:12px">Reset</button>
        </div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Clear All Bookmarks</div>
            <div class="desc">Remove all saved topics</div>
          </div>
          <button class="btn-ghost" data-action="reset-bookmarks" style="font-size:12px">Clear</button>
        </div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Reset Everything</div>
            <div class="desc">Wipe all local data including theme preferences</div>
          </div>
          <button class="btn-ghost" data-action="reset-all" style="font-size:12px;color:var(--danger)">Wipe</button>
        </div>
      </div>

      <div style="text-align:center;margin:30px 0;color:var(--muted);font-size:12px;font-weight:400">
        Anesthetick &mdash; EDAIC / FRCA Study Planner<br>
        <span style="font-size:11px">v1.1 &middot; Data saved locally on this device</span>
      </div>
    `;
    return inner;
  }

  /* ── show view ──────────────────────────────────────────── */
  const $view = $('#view');

  function showView(viewFn, ...args) {
    const content = viewFn(...args);
    $view.innerHTML = '';
    content.classList.add('fade-in-lg');
    $view.appendChild(content);
    $view.scrollTop = 0;
  }

  /* ── Ripple effect ────────────────────────────────────── */
  function createRipple(e) {
    const el = e.currentTarget;
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = el.getBoundingClientRect();
    const s = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = s + 'px';
    r.style.left = (e.clientX - rect.left - s / 2) + 'px';
    r.style.top = (e.clientY - rect.top - s / 2) + 'px';
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }

  /* ── Celebration ──────────────────────────────────────── */
  function celebrate() {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'confetti';
      p.textContent = ['✓','●','✦','★','♦','♥'][Math.floor(Math.random() * 6)];
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.color = ['#e88d5a','#5bc0be','#4ade80','#fb923c','#f87171','#a78bfa'][Math.floor(Math.random() * 6)];
      p.style.fontSize = (14 + Math.random() * 16) + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }
  }

  function navigate(view, data) {
    switch (view) {
      case 'home': showView(viewHome); break;
      case 'progress': showView(viewProgress); break;
      case 'bookmarks': showView(viewBookmarks); break;
      case 'references': showView(viewReferences); break;
      case 'settings': showView(viewSettings); break;
      case 'category': showView(viewCategory, data); break;
      case 'topic': showView(viewTopic, data); break;
      case 'search': showView(viewSearch, data); break;
      default: showView(viewHome);
    }
    const navView = ['home', 'progress', 'bookmarks', 'references', 'settings'].includes(view) ? view : 'home';
    updateNav(navView);
  }

  function updateNav(activeView) {
    $$('.navbtn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === activeView);
    });
  }

  /* ── bottom sheet ───────────────────────────────────────── */
  const $sheet = $('#sheet');
  const $sheetBackdrop = $('#sheetBackdrop');
  const $sheetContent = $('#sheetContent');

  function openSheet(htmlContent) {
    $sheetContent.innerHTML = htmlContent;
    $sheetBackdrop.hidden = false;
    $sheet.hidden = false;
    requestAnimationFrame(() => {
      $sheetBackdrop.classList.add('show');
      $sheet.classList.add('show');
    });
  }

  function closeSheet() {
    $sheetBackdrop.classList.remove('show');
    $sheet.classList.remove('show');
    setTimeout(() => {
      $sheetBackdrop.hidden = true;
      $sheet.hidden = true;
    }, 400);
  }

  /* ── toast ──────────────────────────────────────────────── */
  const $toast = $('#toast');
  let toastTimer;

  function toast(msg) {
    clearTimeout(toastTimer);
    $toast.textContent = msg;
    $toast.hidden = false;
    requestAnimationFrame(() => $toast.classList.add('show'));
    toastTimer = setTimeout(() => {
      $toast.classList.remove('show');
      setTimeout(() => { $toast.hidden = true; }, 350);
    }, 2200);
  }

  /* ── event delegation ───────────────────────────────────── */

  // Main view events
  $view.addEventListener('click', e => {
    const target = e.target.closest('[data-nav], [data-cat], [data-action], [data-topic-id], [data-sec]');

    if (!target) return;

    // Navigation
    if (target.dataset.nav) {
      const nav = target.dataset.nav;
      if (nav === 'home') navigate('home');
      else if (nav === 'category') navigate('category', target.dataset.cat);
      return;
    }

    // Category card
    if (target.dataset.cat) {
      navigate('category', target.dataset.cat);
      return;
    }

    // Topic click (click on topic row)
    if (target.dataset.topicId && !target.dataset.action) {
      navigate('topic', target.dataset.topicId);
      return;
    }

    const action = target.dataset.action;
    if (!action) return;

    // Check toggle on topic
    if (action === 'check') {
      e.stopPropagation();
      const topicEl = target.closest('.topic');
      if (topicEl?.dataset.topicId) {
        const all = ALL_TOPICS.find(t => t.id === topicEl.dataset.topicId);
        if (all && all.sub?.length) {
          const currentPct = topicProgress(all);
          const checkAll = currentPct < 1;
          for (let i = 0; i < all.sub.length; i++) {
            const u = uid(all.catId, all.secId, all.id, i);
            state.progress[u] = checkAll;
          }
          topicEl.classList.toggle('done', checkAll);
          const newPct = topicProgress(all);
          let pctEl = topicEl.querySelector('.t-pct');
          if (newPct > 0) {
            if (!pctEl) {
              pctEl = document.createElement('span');
              pctEl.className = 't-pct';
              topicEl.querySelector('.t-meta')?.appendChild(pctEl);
            }
            pctEl.textContent = Math.round(newPct * 100) + '%';
          } else if (pctEl) {
            pctEl.remove();
          }
          saveState();
        }
      }
      return;
    }

    // Bookmark toggle
    if (action === 'bookmark') {
      e.stopPropagation();
      const topicEl = target.closest('[data-topic-id]');
      if (!topicEl) return;
      const tid = topicEl.dataset.topicId;
      toggleBookmark(tid);
      const btns = topicEl.querySelectorAll('.bookmark-btn');
      btns.forEach(btn => {
        btn.classList.toggle('active');
        btn.innerHTML = isBookmarked(tid) ? ICONS['bookmark-filled'] : ICONS.bookmark;
      });
      toast(isBookmarked(tid) ? 'Topic saved' : 'Bookmark removed');
      return;
    }

    // Check all / uncheck all subtopics
    if (action === 'check-all' || action === 'uncheck-all') {
      const items = $$('.sub-item');
      const checkVal = action === 'check-all';
      items.forEach(item => {
        const u = item.dataset.uid;
        if (u) {
          state.progress[u] = checkVal;
          item.classList.toggle('done', checkVal);
        }
      });
      saveState();
      toast(checkVal ? 'All checked' : 'All unchecked');
      if (checkVal && items.length > 0) celebrate();
      return;
    }

    // Install from settings
    if (action === 'install-app') {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(result => {
          if (result.outcome === 'accepted') {
            state.installDismissed = true;
            saveState();
          }
          deferredPrompt = null;
        });
      } else {
        toast('App already installed or not available on this browser');
      }
      return;
    }

    // Theme toggle
    if (action === 'toggle-theme') {
      toggleTheme();
      const toggleEl = target.closest('.theme-toggle');
      if (toggleEl) toggleEl.classList.toggle('on');
      toast(state.theme === 'light' ? 'Light theme' : 'Dark theme');
      return;
    }

    // Reset actions in settings
    if (action === 'reset-progress') {
      state.progress = {};
      saveState();
      toast('Progress reset');
      return;
    }
    if (action === 'reset-bookmarks') {
      state.bookmarks = [];
      saveState();
      toast('Bookmarks cleared');
      return;
    }
    if (action === 'reset-all') {
      state = { progress: {}, bookmarks: [], installDismissed: false, theme: 'dark' };
      applyTheme('dark');
      saveState();
      toast('All data wiped');
      navigate('home');
      return;
    }
  });

  // Sub-item clicks (inside topic view)
  $view.addEventListener('click', e => {
    const subItem = e.target.closest('.sub-item');
    if (!subItem || subItem.dataset.uid === undefined) return;
    const u = subItem.dataset.uid;
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
    // Update parent topic progress if visible
    const topicEl = subItem.closest('[data-topic-id]');
    if (topicEl) {
      const all = ALL_TOPICS.find(t => t.id === topicEl.dataset.topicId);
      if (all) {
        const pct = topicProgress(all);
        const pctEl = topicEl.querySelector('.t-pct');
        if (pctEl) pctEl.textContent = Math.round(pct * 100) + '%';
        if (!pctEl && pct > 0) {
          const meta = topicEl.querySelector('.t-meta');
          if (meta) {
            const span = document.createElement('span');
            span.className = 't-pct';
            span.textContent = Math.round(pct * 100) + '%';
            meta.appendChild(span);
          }
        }
      }
    }
  });

  // Sheet sub-item and bookmark clicks
  $sheetContent.addEventListener('click', e => {
    // Bookmark in sheet
    const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
    if (bookmarkBtn) {
      e.stopPropagation();
      const topicEl = $sheetContent.querySelector('[data-topic-id]');
      if (topicEl) {
        const tid = topicEl.dataset.topicId;
        toggleBookmark(tid);
        const btns = $sheetContent.querySelectorAll('.bookmark-btn');
        btns.forEach(btn => {
          btn.classList.toggle('active');
          btn.innerHTML = isBookmarked(tid) ? ICONS['bookmark-filled'] : ICONS.bookmark;
        });
        toast(isBookmarked(tid) ? 'Topic saved' : 'Bookmark removed');
      }
      return;
    }
    // Sub-item check
    const subItem = e.target.closest('.sub-item');
    if (!subItem || subItem.dataset.uid === undefined) return;
    const u = subItem.dataset.uid;
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
  });

  // Search input
  const $searchInput = $('#searchInput');
  const $clearSearch = $('#clearSearch');

  let searchTimeout;
  $searchInput.addEventListener('input', () => {
    const v = $searchInput.value;
    $clearSearch.hidden = !v;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (v) {
        showView(viewSearch, v);
      } else {
        navigate('home');
      }
    }, 150);
  });

  $clearSearch.addEventListener('click', () => {
    $searchInput.value = '';
    $searchInput.focus();
    $clearSearch.hidden = true;
    navigate('home');
  });

  // Bottom navigation
  $$('.navbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      $searchInput.value = '';
      $clearSearch.hidden = true;
      navigate(view);
    });
  });

  // Sheet backdrop
  $sheetBackdrop.addEventListener('click', closeSheet);

  // Home button
  $('#homeBtn').addEventListener('click', () => {
    $searchInput.value = '';
    $clearSearch.hidden = true;
    navigate('home');
  });

  // Stats button
  $('#statsBtn').addEventListener('click', () => {
    $searchInput.value = '';
    $clearSearch.hidden = true;
    navigate('progress');
  });

  /* ── PWA install ────────────────────────────────────────── */
  const $installBanner = $('#installBanner');
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    // Only show banner if not previously dismissed
    if (!state.installDismissed) {
      $installBanner.hidden = false;
    }
  });

  $('#installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        state.installDismissed = true;
        saveState();
        $installBanner.hidden = true;
      }
      deferredPrompt = null;
    }
  });

  $('#installDismiss').addEventListener('click', () => {
    $installBanner.hidden = true;
    state.installDismissed = true;
    saveState();
    toast('Install option available in Settings');
  });

  /* ── Ripple + global interaction ──────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .navbtn, .cat, .sub-item, .result, .link-item, .set-row');
    if (btn) btn.style.position === 'relative' || btn.classList.add('ripple-host');
  });

  /* ── init ───────────────────────────────────────────────── */
  navigate('home');
})();

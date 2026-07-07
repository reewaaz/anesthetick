(function () {
  'use strict';

  const LS_KEY = 'anestheticks';
  const SAVE_DELAY = 300;

  /* ── state ─────────────────────────────────────────────── */
  let state = loadState();
  let searchResults = [];

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.notes && !parsed.topicNotes) {
          parsed.topicNotes = parsed.notes;
        }
        delete parsed.notes;
        if (!parsed.subBookmarks) parsed.subBookmarks = [];
        if (!parsed.customSubs) parsed.customSubs = {};
        if (!parsed.topicNotes) parsed.topicNotes = {};
        if (!parsed.githubUser) parsed.githubUser = '';
        if (!parsed.githubPin) parsed.githubPin = '';
        return parsed;
      }
    } catch (_) {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { progress: {}, bookmarks: [], subBookmarks: [], customSubs: {}, topicNotes: {}, githubUser: '', githubPin: '', installDismissed: false, theme: prefersDark ? 'dark' : 'light' };
  }

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
    triggerAutoSync();
  }

  const saveStateDebounced = (function () {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(saveState, SAVE_DELAY);
      triggerAutoSync();
    };
  })();

  /* ── theme ──────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'light' ? '#f5f6fa' : '#0f1117';
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(state.theme);
    saveStateDebounced();
  }

  // Apply theme on load
  applyTheme(state.theme);

  /* ── Sound effects ─────────────────────────────────────── */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, duration, type, vol) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  function sfxCheck() { playTone(880, 0.15, 'sine', 0.12); }
  function sfxUncheck() { playTone(440, 0.12, 'triangle', 0.08); }
  function sfxNav() { playTone(660, 0.08, 'sine', 0.06); }
  function sfxCelebrate() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.1), i * 80);
    });
  }
  function sfxBookmark() { playTone(1200, 0.1, 'sine', 0.06); }

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

  function isSubBookmarked(uidStr) {
    return state.subBookmarks.includes(uidStr);
  }

  function toggleSubBookmark(uidStr) {
    const idx = state.subBookmarks.indexOf(uidStr);
    if (idx >= 0) state.subBookmarks.splice(idx, 1);
    else state.subBookmarks.push(uidStr);
    saveStateDebounced();
  }

  function getCustomSubs(topicId) {
    return state.customSubs[topicId] || [];
  }

  function addCustomSub(topicId, text) {
    if (!state.customSubs[topicId]) state.customSubs[topicId] = [];
    state.customSubs[topicId].push(text);
    saveStateDebounced();
  }

  function removeCustomSub(topicId, idx) {
    if (state.customSubs[topicId]) {
      state.customSubs[topicId].splice(idx, 1);
      saveStateDebounced();
    }
  }

  function getTopicNotes(topicId) {
    return state.topicNotes[topicId] || '';
  }

  function setTopicNotes(topicId, text) {
    if (text.trim()) {
      state.topicNotes[topicId] = text;
    } else {
      delete state.topicNotes[topicId];
    }
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
    upload: '<svg viewBox="0 0 24 24" class="ic" style="width:18px;height:18px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gauge: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-11.5V14a1 1 0 0 0 2 0V8.5a3.5 3.5 0 1 0-2 0z" fill="currentColor"/></svg>',
    flask: '<svg viewBox="0 0 24 24"><path d="M8 2h8M9 2v6.4a4 4 0 0 1-.6 2.2L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-4.4-7.4a4 4 0 0 1-.6-2.2V2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activity: '<svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    layers: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'heart-pulse': '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="4 12 8 12 10 8 14 16 16 12 20 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24"><path d="M10.3 3.9a2 2 0 0 1 3.4 0l8 13.9a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4M12 17h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    calculator: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 6h8M8 10h8M8 14h0M12 14h0M16 14h0M8 18h0M12 18h0M16 18h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'shield-check': '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    atom: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2a10 10 0 0 1 10 10M12 22a10 10 0 0 0 10-10M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 1-10-10" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"/></svg>',
    'flask-conical': '<svg viewBox="0 0 24 24"><path d="M8 2h8M9 2v6.4a4 4 0 0 1-.6 2.2L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-4.4-7.4a4 4 0 0 1-.6-2.2V2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bone: '<svg viewBox="0 0 24 24"><path d="M17 10a3 3 0 0 1 0-6 3 3 0 0 1 0 6zM7 14a3 3 0 0 0 0 6 3 3 0 0 0 0-6zM7 10l3-3M14 14l3-3M10 7l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    pill: '<svg viewBox="0 0 24 24"><path d="M18 6l-6 6M6 18l6-6M10 3l4 4a6 6 0 0 1 0 8.5l-4.5 4.5a6 6 0 0 1-8.5-8.5L10 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    syringe: '<svg viewBox="0 0 24 24"><path d="M14 2l-6 6M18 6l-4 4M5 19l4-4M9 9l6 6M21 3l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 19l-3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    droplets: '<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 4.4 3.6 8 8 8s8-3.6 8-8a8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    baby: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><path d="M12 13a3 3 0 0 1 2.8 1.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    monitor: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8M12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    child: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10v8M8 14h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    needle: '<svg viewBox="0 0 24 24"><path d="M18 4l-8 8M14 2l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 10l-4 4 4 4M10 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'graduation-cap': '<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    ambulance: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12h6M12 9v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 6V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    scale: '<svg viewBox="0 0 24 24"><path d="M12 2v20M4 6l8-4 8 4M4 18l8 4 8-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6v12M20 6v12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 4"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lungs: '<svg viewBox="0 0 24 24"><path d="M12 12V4M8 4a4 4 0 0 0-4 4v4c0 4 4 6 8 8 4-2 8-4 8-8V8a4 4 0 0 0-4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 4v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    brain: '<svg viewBox="0 0 24 24"><path d="M12 4a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V14a2 2 0 0 1-4 0v-2.5A4 4 0 0 1 8 8a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4 8H2M22 8h-2M4 16H2M22 16h-2M6 6L4 4M18 6l2-2M6 18l-2 2M18 18l2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    kidney: '<svg viewBox="0 0 24 24"><path d="M12 4c-2 0-4 1.5-5 4-.5 1.5-.5 4 0 6 .5 2 2 3.5 3 4.5s2.5 2 4 2c2 0 3-.5 4-2s1.5-3 1.5-5c0-2-.5-4-1.5-5.5S14 4 12 4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8c2-1 4-1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    liver: '<svg viewBox="0 0 24 24"><path d="M12 2c-3 0-5 2-6 4s-2 4-2 6c0 3 1 5 3 6s4 2 6 2 4-1 5-3 2-4 2-6-1-4-2-6-2-3-6-3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8c2 0 4 1 5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    dumbbell: '<svg viewBox="0 0 24 24"><path d="M6 16V8M4 14v-4M20 14v-4M18 16V8M8 6h8M8 18h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="2" y="10" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><rect x="18" y="10" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    'triangle-alert': '<svg viewBox="0 0 24 24"><path d="M10.3 3.9a2 2 0 0 1 3.4 0l8 13.9a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4M12 17h0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    zap: '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    thermometer: '<svg viewBox="0 0 24 24"><path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="18" r="2" fill="currentColor"/></svg>',
    radio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'clipboard-check': '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 13l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    move: '<svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M5 5l14 14M19 5l-14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'book-open': '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'bar-chart': '<svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sigma: '<svg viewBox="0 0 24 24"><path d="M18 4H6l6 8-6 8h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    running: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4" r="2" fill="currentColor"/><path d="M5 21l3-6 3 2 1-5 3 3v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11l3-3 4 1 3-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    'utensils-crossed': '<svg viewBox="0 0 24 24"><path d="M16 2v8l4 4M4 2v20M8 2v4a4 4 0 0 0 0 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    dna: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="1.5" fill="currentColor"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/><path d="M8 6c0 2 2 3.5 4 5s4 3 4 5M8 18c0-2 2-3.5 4-5s4-3 4-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    protein: '<svg viewBox="0 0 24 24"><path d="M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM6 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM18 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM9 9l-2 3M15 9l2 3M9 14l2 1M15 14l-2 1" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scan: '<svg viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    spine: '<svg viewBox="0 0 24 24"><path d="M12 2v20M8 4c2 0 4 1.5 4 4M8 8c2 0 4 1.5 4 4M8 12c2 0 4 1.5 4 4M8 16c2 0 4 1.5 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    larynx: '<svg viewBox="0 0 24 24"><path d="M8 6h8M4 10h16M6 14h12M8 18h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 6v12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    nerve: '<svg viewBox="0 0 24 24"><path d="M4 4c4 2 6 6 8 8s4 6 8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 20c4-2 6-6 8-8s4-6 8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4v13M15 7v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
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

  function renderSubItem(sub, idx, topic, catId, secId, isCustom) {
    const u = uid(catId, secId, topic.id, idx + (isCustom ? 1000 : 0));
    const done = isDone(u);
    const subLinks = topic.subLinks && topic.subLinks[idx] ? topic.subLinks[idx] : null;
    const sb = isSubBookmarked(u);
    const customAttr = isCustom ? ' data-custom="1"' : '';
    return html`
      <div class="sub-item ${done ? 'done' : ''}" data-uid="${u}"${customAttr}>
        <div class="check">${ICONS.check}</div>
        <div class="sub-context">
          <span class="s-name">${sub}</span>
          ${subLinks ? html`<div class="sub-links">${subLinks.split(',').slice(0,2).map(sl => html`<a href="${sl.trim()}" target="_blank" rel="noopener">${ICONS.external} ${linkLabel(sl.trim())}</a>`).join('')}</div>` : ''}
        </div>
        <div class="sub-actions">
          ${isCustom ? html`<button class="sub-del" data-action="del-custom-sub" data-topic-id="${topic.id}" data-custom-idx="${idx}">✕</button>` : ''}
          <button class="sub-bookmark ${sb ? 'active' : ''}" data-action="sub-bookmark" data-sub-uid="${u}">${sb ? ICONS['bookmark-filled'] : ICONS.bookmark}</button>
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
    const cat = CURRICULUM.find(c => c.id === catId);
    const sec = cat?.sections.find(s => s.id === secId);
    const topic = sec?.topics.find(t => t.id === topicId);
    if (!topic) return viewHome();

    const pct = topicProgress({ ...topic, catId, secId });
    const bm = isBookmarked(topicId);
    const customSubs = getCustomSubs(topicId);
    const allSubs = [...(topic.sub || []), ...customSubs];
    const topicNote = getTopicNotes(topicId);

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
      ${allSubs.length ? html`
        <div class="list-title" style="font-size:16px;font-weight:650;margin:16px 0 8px">Learning Objectives</div>
        <div class="sub-list" data-check-all>
          ${topic.sub.map((s, i) => renderSubItem(s, i, topic, catId, secId)).join('')}
          ${customSubs.map((s, i) => renderSubItem(s, i, topic, catId, secId, true)).join('')}
        </div>
        <div class="custom-sub-add">
          <input type="text" id="customSubInput" placeholder="Add custom objective…" />
          <button data-action="add-custom-sub" data-topic-id="${topicId}">Add</button>
        </div>
        <div class="sheet-actions">
          <button class="btn-ghost" data-action="check-all">Check all</button>
          <button class="btn-ghost" data-action="uncheck-all">Uncheck all</button>
        </div>
      ` : html`<p class="muted" style="margin:30px 0;font-weight:400">No learning objectives listed.</p>`}
      <div class="topic-notes">
        <label class="topic-notes-label">Notes</label>
        <textarea placeholder="Write notes for this topic…" data-topic-note="${topicId}" spellcheck="false">${topicNote}</textarea>
      </div>
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

    // Topic-level bookmarks
    const bmTopics = ALL_TOPICS.filter(t => isBookmarked(t.id));

    // Sub-item bookmarks grouped by parent topic
    const subBmMap = {};
    for (const uidStr of state.subBookmarks) {
      const parts = uidStr.split('/');
      if (parts.length === 4) {
        const [catId, secId, topicId, subIdx] = parts;
        const key = `${catId}|${secId}|${topicId}`;
        if (!subBmMap[key]) subBmMap[key] = [];
        subBmMap[key].push(uidStr);
      }
    }

    const hasBm = bmTopics.length > 0 || Object.keys(subBmMap).length > 0;
    if (!hasBm) {
      inner.innerHTML = '<div class="empty"><p>No saved topics yet.</p><p style="font-size:12px;margin-top:8px;font-weight:400">Tap the bookmark icon on any topic to save it here.</p></div>';
      return inner;
    }

    let htmlStr = '';

    // Topic bookmarks
    if (bmTopics.length) {
      htmlStr += '<div class="list-title">Saved Topics</div>';
      htmlStr += '<div>' + bmTopics.map(t => renderTopicItem(t)).join('') + '</div>';
    }

    // Sub-item bookmarks
    if (Object.keys(subBmMap).length) {
      htmlStr += '<div class="list-title" style="margin-top:20px">Saved Sub-items</div>';
      for (const key of Object.keys(subBmMap)) {
        const [catId, secId, topicId] = key.split('|');
        const topic = ALL_TOPICS.find(t => t.id === topicId);
        if (!topic) continue;
        htmlStr += '<div class="saved-sub-group" data-topic-id="' + topicId + '">';
        htmlStr += '<div class="saved-sub-cat">' + topic.catName + ' &middot; ' + topic.secName + '</div>';
        htmlStr += '<div class="saved-sub-topic">' + topic.name + '</div>';
        for (const uidStr of subBmMap[key]) {
          const parts = uidStr.split('/');
          const subIdx = parseInt(parts[3]);
          const customOffset = subIdx >= 1000;
          const actualIdx = customOffset ? subIdx - 1000 : subIdx;
          const customSubs = getCustomSubs(topicId);
          const subText = customOffset
            ? (customSubs[actualIdx] || '(deleted)')
            : ((topic.sub && topic.sub[actualIdx]) || '(deleted)');
          const doneClass = isDone(uidStr) ? ' done' : '';
          const sb = isSubBookmarked(uidStr);
          htmlStr += '<div class="sub-item' + doneClass + '" data-uid="' + uidStr + '">';
          htmlStr += '<div class="check">' + ICONS.check + '</div>';
          htmlStr += '<div class="sub-context"><span class="s-name">' + subText + '</span></div>';
          htmlStr += '<button class="sub-bookmark active" data-action="sub-bookmark" data-sub-uid="' + uidStr + '">' + ICONS['bookmark-filled'] + '</button>';
          htmlStr += '</div>';
        }
        htmlStr += '</div>';
      }
    }

    inner.innerHTML = htmlStr;
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

  function viewCombinedSettings() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    const isLight = state.theme === 'light';

    inner.innerHTML = html`
      <div class="list-title">Settings</div>

      <div class="set-group">
        <div class="set-group-title">Appearance</div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Light Mode</div>
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
        <div class="set-group-title">Cloud Account</div>
        ${isCloudConnected() ? html`
          <div class="set-row">
            <div class="set-info">
              <div class="lbl" style="color:var(--ok)">${ICONS.check} Connected</div>
              <div class="desc">${state.githubUser} &middot; data syncs via GitHub</div>
            </div>
            <span class="gh-status connected"></span>
          </div>
          <div class="set-row" style="border-color:transparent">
            <div class="set-info">
              <div class="lbl">Sync Now</div>
              <div class="desc">Upload current data to cloud</div>
            </div>
            <button class="btn-ghost" data-action="cloud-sync" style="font-size:12px">${ICONS.upload} Save</button>
          </div>
          <div class="set-row" style="border-color:transparent">
            <div class="set-info">
              <div class="lbl">Logout</div>
              <div class="desc">Disconnect cloud account</div>
            </div>
            <button class="btn-ghost" data-action="cloud-logout" style="font-size:12px;color:var(--danger);border-color:color-mix(in srgb, var(--danger) 40%, var(--line))">Logout</button>
          </div>
        ` : html`
          <div class="set-row">
            <div class="set-info">
              <div class="lbl">Cloud Backup</div>
              <div class="desc">Sync your data across devices via GitHub</div>
            </div>
            <span class="gh-status"></span>
          </div>
          <div class="auth-actions">
            <button class="btn-primary" data-action="cloud-login" style="flex:1">${ICONS.download} Login</button>
            <button class="btn-ghost" data-action="cloud-register" style="flex:1">Register</button>
          </div>
        `}
      </div>

      <div class="set-group">
        <div class="set-group-title">Data</div>
        <div class="set-row" style="border-color:color-mix(in srgb, var(--danger) 30%, var(--line))">
          <div class="set-info">
            <div class="lbl" style="color:var(--danger)">Reset All Progress</div>
            <div class="desc">Clear all checkmarks and start fresh</div>
          </div>
          <button class="btn-ghost" data-action="reset-progress" style="font-size:12px;color:var(--danger);border-color:color-mix(in srgb, var(--danger) 40%, var(--line))">Reset</button>
        </div>
        <div class="set-row" style="border-color:color-mix(in srgb, var(--danger) 30%, var(--line))">
          <div class="set-info">
            <div class="lbl" style="color:var(--danger)">Clear All Bookmarks</div>
            <div class="desc">Remove all saved topics</div>
          </div>
          <button class="btn-ghost" data-action="reset-bookmarks" style="font-size:12px;color:var(--danger);border-color:color-mix(in srgb, var(--danger) 40%, var(--line))">Clear</button>
        </div>
        <div class="set-row" style="border-color:color-mix(in srgb, var(--danger) 40%, var(--line))">
          <div class="set-info">
            <div class="lbl" style="color:var(--danger)">Reset Everything</div>
            <div class="desc">Wipe all local data including theme preferences</div>
          </div>
          <button class="btn-ghost" data-action="reset-all" style="font-size:12px;color:var(--danger);border-color:color-mix(in srgb, var(--danger) 40%, var(--line))">Wipe</button>
        </div>
      </div>

      <div class="set-group">
        <div class="set-group-title">References &amp; Resources</div>
        <div class="set-refs">
          <div class="ref-grid">${REFS.map((r, i) => html`
            <div class="ref-card${r.url ? ' clickable' : ''}" data-url="${r.url || ''}">
              <h3>${r.name}</h3>
              <p>${r.desc}</p>
              ${r.url ? html`<div class="ref-link"><svg viewBox="0 0 24 24" class="ic" style="width:14px;height:14px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Open resource</div>` : ''}
            </div>
          `).join('')}</div>
        </div>
      </div>

      <div style="text-align:center;margin:30px 0;color:var(--muted);font-size:12px;font-weight:400">
        Anesthetick &mdash; EDAIC / FRCA Study Planner<br>
        <span style="font-size:11px">v1.1 &middot; Data saved locally on this device</span>
      </div>
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
    const chars = ['✓','●','✦','★','♦','♥','✧','⬡','◆','✶'];
    const colors = ['#e88d5a','#5bc0be','#4ade80','#fb923c','#f87171','#a78bfa','#facc15','#67e8f9','#f472b6','#34d399'];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti';
      p.textContent = chars[Math.floor(Math.random() * chars.length)];
      const angle = Math.random() * 360;
      const dist = 100 + Math.random() * 300;
      const rad = angle * Math.PI / 180;
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist - 100;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.left = '50%';
      p.style.top = '45%';
      p.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
      p.style.animationDelay = Math.random() * 0.2 + 's';
      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      p.style.fontSize = (12 + Math.random() * 20) + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
    sfxCelebrate();
  }

  function navigate(view, data, { replace = false } = {}) {
    switch (view) {
      case 'home': showView(viewHome); break;
      case 'bookmarks': showView(viewBookmarks); break;
      case 'settings': showView(viewCombinedSettings); break;
      case 'progress': showView(viewProgress); break;
      case 'category': showView(viewCategory, data); break;
      case 'topic': showView(viewTopic, data); break;
      case 'search': showView(viewSearch, data); break;
      default: showView(viewHome);
    }
    const navView = ['home', 'bookmarks', 'settings'].includes(view) ? view : 'home';
    updateNav(navView, view);
    const lastState = history.state;
    const isDuplicate = lastState && lastState.view === view &&
      JSON.stringify(lastState.data) === JSON.stringify(data);
    if (replace || isDuplicate) {
      history.replaceState({ view, data }, '');
    } else {
      history.pushState({ view, data }, '');
    }
  }

  function navigateToState(state) {
    if (!state) return;
    switch (state.view) {
      case 'home': showView(viewHome); break;
      case 'bookmarks': showView(viewBookmarks); break;
      case 'settings': showView(viewCombinedSettings); break;
      case 'progress': showView(viewProgress); break;
      case 'category': showView(viewCategory, state.data); break;
      case 'topic': showView(viewTopic, state.data); break;
      case 'search': showView(viewSearch, state.data); break;
      default: showView(viewHome);
    }
    const navView = ['home', 'bookmarks', 'settings'].includes(state.view) ? state.view : 'home';
    updateNav(navView, state.view);
  }

  const HOME_BTN_HTML = `<svg viewBox="0 0 24 24" class="ic"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg><span>Home</span>`;
  const BACK_BTN_HTML = `<svg viewBox="0 0 24 24" class="ic" style="width:22px;height:22px"><path d="M19 12H5M12 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Back</span>`;
  const DEEP_VIEWS = ['category', 'topic', 'progress', 'search'];

  function isDeepView(view) { return DEEP_VIEWS.includes(view); }

  function updateNav(activeView, actualView) {
    const homeBtn = $('.navbtn[data-view="home"]');
    if (homeBtn) {
      const isDeep = isDeepView(actualView != null ? actualView : activeView);
      homeBtn.classList.toggle('is-back', isDeep);
      homeBtn.innerHTML = isDeep ? BACK_BTN_HTML : HOME_BTN_HTML;
    }
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

  /* ── Confirm dialog ─────────────────────────────────────── */
  function showConfirm(title, msg, confirmLabel, cancelLabel) {
    return new Promise(resolve => {
      const backdrop = document.createElement('div');
      backdrop.className = 'dialog-backdrop';
      const dlg = document.createElement('div');
      dlg.className = 'dialog';
      dlg.innerHTML = `
        <h3>${title}</h3>
        <p>${msg}</p>
        <div class="dialog-actions">
          <button class="btn-ghost" data-dlg="cancel">${cancelLabel || 'Cancel'}</button>
          <button class="btn-primary" data-dlg="confirm">${confirmLabel || 'Confirm'}</button>
        </div>`;
      backdrop.appendChild(dlg);
      document.body.appendChild(backdrop);
      requestAnimationFrame(() => backdrop.classList.add('show'));
      const close = result => {
        backdrop.classList.remove('show');
        setTimeout(() => backdrop.remove(), 300);
        resolve(result);
      };
      backdrop.addEventListener('click', e => { if (e.target === backdrop) close(false); });
      dlg.querySelector('[data-dlg="cancel"]').addEventListener('click', () => close(false));
      dlg.querySelector('[data-dlg="confirm"]').addEventListener('click', () => close(true));
    });
  }

  /* ── Cloud sync (GitHub) ─────────────────────────────────── */
  const GITHUB_API = 'https://api.github.com';
  const GITHUB_DATA_PATH = 'userdata/data.json';

  function isCloudConnected() {
    return !!(state.githubUser && state.githubPin);
  }

  function getGithubAuth() {
    return btoa(state.githubUser + ':' + state.githubPin);
  }

  async function testCloudConnection(user, pass) {
    const auth = btoa(user + ':' + pass);
    const res = await fetch(GITHUB_API + '/user', { headers: { Authorization: 'Basic ' + auth } });
    if (!res.ok) throw new Error('Invalid credentials (' + res.status + ')');
    return (await res.json()).login;
  }

  async function syncToGithub(data) {
    if (!isCloudConnected()) throw new Error('Not connected');
    const url = GITHUB_API + '/repos/' + state.githubUser + '/anesthetick/contents/' + GITHUB_DATA_PATH;
    const auth = getGithubAuth();
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    let sha = null;
    try {
      const existing = await fetch(url, { headers: { Authorization: 'Basic ' + auth } });
      if (existing.ok) { const ex = await existing.json(); sha = ex.sha; }
    } catch (_) {}
    const body = { message: 'sync anesthetick data', content };
    if (sha) body.sha = sha;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Sync failed: ' + res.status);
    return true;
  }

  async function syncFromGithub() {
    if (!isCloudConnected()) throw new Error('Not connected');
    const url = 'https://raw.githubusercontent.com/' + state.githubUser + '/anesthetick/main/' + GITHUB_DATA_PATH;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Load failed: ' + res.status);
    return await res.json();
  }

  async function cloudRegister(user, pass) {
    const login = await testCloudConnection(user, pass);
    state.githubUser = user;
    state.githubPin = pass;
    saveState();
    // Create initial data file
    const data = {
      progress: state.progress,
      bookmarks: state.bookmarks,
      subBookmarks: state.subBookmarks,
      customSubs: state.customSubs,
      topicNotes: state.topicNotes
    };
    await syncToGithub(data);
    toast('Registered as ' + login);
    navigate('home');
  }

  async function cloudLogin(user, pass) {
    const login = await testCloudConnection(user, pass);
    state.githubUser = user;
    state.githubPin = pass;
    saveState();
    // Load remote data
    const data = await syncFromGithub();
    if (data.progress) state.progress = data.progress;
    if (data.bookmarks) state.bookmarks = data.bookmarks;
    if (data.subBookmarks) state.subBookmarks = data.subBookmarks;
    if (data.customSubs) state.customSubs = data.customSubs;
    if (data.topicNotes) state.topicNotes = data.topicNotes;
    saveState();
    toast('Welcome back ' + login);
    navigate('home');
  }

  function cloudLogout() {
    state.githubUser = '';
    state.githubPin = '';
    saveState();
    toast('Logged out');
    navigate('settings');
  }

  // Auto-sync when data changes (debounced)
  let autoSyncTimer;
  function triggerAutoSync() {
    if (!isCloudConnected()) return;
    clearTimeout(autoSyncTimer);
    autoSyncTimer = setTimeout(() => {
      const data = {
        progress: state.progress,
        bookmarks: state.bookmarks,
        subBookmarks: state.subBookmarks,
        customSubs: state.customSubs,
        topicNotes: state.topicNotes
      };
      syncToGithub(data).catch(() => {});
    }, 5000);
  }

  // Auto-login on start
  function tryAutoLogin() {
    if (!isCloudConnected()) return;
    testCloudConnection(state.githubUser, state.githubPin).then(login => {
      toast('Cloud: connected as ' + login);
      // Load remote data (silent merge)
      syncFromGithub().then(data => {
        let changed = false;
        if (data.progress) { state.progress = data.progress; changed = true; }
        if (data.bookmarks) { state.bookmarks = data.bookmarks; changed = true; }
        if (data.subBookmarks) { state.subBookmarks = data.subBookmarks; changed = true; }
        if (data.customSubs) { state.customSubs = data.customSubs; changed = true; }
        if (data.topicNotes) { state.topicNotes = data.topicNotes; changed = true; }
        if (changed) saveState();
      }).catch(() => {});
    }).catch(() => {
      // Credentials invalid — clear them
      state.githubUser = '';
      state.githubPin = '';
      saveState();
    });
  }

  // Login/Register dialog
  function showAuthDialog(mode) {
    return new Promise(resolve => {
      const backdrop = document.createElement('div');
      backdrop.className = 'dialog-backdrop';
      const dlg = document.createElement('div');
      dlg.className = 'dialog';
      dlg.style.maxWidth = '360px';
      dlg.innerHTML = `
        <h3>${mode === 'register' ? 'Create Cloud Account' : 'Cloud Login'}</h3>
        <p style="margin-bottom:16px">${mode === 'register'
          ? 'Your data will be stored securely in your GitHub repository. A Personal Access Token with <strong>repo</strong> scope is required.'
          : 'Sign in to sync your data across devices.'}</p>
        <div class="auth-form">
          <input type="text" id="authUser" placeholder="GitHub username" autocomplete="username" />
          <input type="password" id="authPass" placeholder="Personal Access Token (PIN)" autocomplete="current-password" />
          <p class="auth-hint">${mode === 'register'
            ? 'Create a token at GitHub &rarr; Settings &rarr; Developer settings &rarr; Personal access tokens &rarr; Tokens (classic) with <strong>repo</strong> scope.'
            : 'Enter the same credentials you used to register.'}</p>
        </div>
        <div class="dialog-actions" style="justify-content:stretch">
          <button class="btn-ghost" data-dlg="cancel" style="flex:1">Cancel</button>
          <button class="btn-primary" data-dlg="confirm" style="flex:1">${mode === 'register' ? 'Register' : 'Login'}</button>
        </div>`;
      backdrop.appendChild(dlg);
      document.body.appendChild(backdrop);
      requestAnimationFrame(() => backdrop.classList.add('show'));
      const close = result => {
        backdrop.classList.remove('show');
        setTimeout(() => backdrop.remove(), 300);
        resolve(result);
      };
      backdrop.addEventListener('click', e => { if (e.target === backdrop) close(null); });
      dlg.querySelector('[data-dlg="cancel"]').addEventListener('click', () => close(null));
      dlg.querySelector('[data-dlg="confirm"]').addEventListener('click', () => {
        const user = dlg.querySelector('#authUser').value.trim();
        const pass = dlg.querySelector('#authPass').value.trim();
        if (user && pass) close({ user, pass });
      });
      // Enter key in password field triggers confirm
      dlg.querySelector('#authPass').addEventListener('keydown', e => {
        if (e.key === 'Enter') dlg.querySelector('[data-dlg="confirm"]').click();
      });
      setTimeout(() => dlg.querySelector('#authUser').focus(), 350);
    });
  }

  /* ── event delegation ───────────────────────────────────── */

  $('#topTitle').addEventListener('click', () => {
    sfxNav();
    navigate('home');
  });

  // Swipe back gesture
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    // Swipe right from left edge → go back
    if (dx > 80 && Math.abs(dy) < 60 && touchStartX < 40) {
      e.preventDefault();
      window.history.back();
      touchStartX = 0;
    }
  }, { passive: false });

  // Pull to refresh
  let pullY = 0, pulling = false, pullDist = 0;
  let $pullEl = null;

  const VIEW_FN = { home: viewHome, bookmarks: viewBookmarks, settings: viewCombinedSettings, progress: viewProgress, category: viewCategory, topic: viewTopic, search: viewSearch };

  function createPullEl() {
    const el = document.createElement('div');
    el.className = 'pull-indicator';
    el.innerHTML = '<div class="pull-arrow">↓</div><div class="pull-text">Pull to refresh</div>';
    return el;
  }

  function pullRefresh() {
    const state = history.state;
    if (!state) return;
    if ($pullEl) $pullEl.classList.add('loading');
    const fn = VIEW_FN[state.view] || viewHome;
    showView(fn, state.data);
    toast('Refreshed');
  }

  $view.addEventListener('touchstart', e => {
    if (Math.round($view.scrollTop) > 0 || e.touches.length !== 1) return;
    pullY = e.touches[0].clientY;
    pullDist = 0;
    pulling = true;
  }, { passive: true });

  $view.addEventListener('touchmove', e => {
    if (!pulling || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - pullY;
    if (dy < 0) { pulling = false; removePullEl(); return; }
    e.preventDefault();
    pullDist = Math.min(dy * 0.4, 140);
    if (!$pullEl) { $pullEl = createPullEl(); $view.prepend($pullEl); }
    $pullEl.style.transform = `translateY(${pullDist - 60}px)`;
    const arrow = $pullEl.querySelector('.pull-arrow');
    if (arrow) arrow.style.transform = `rotate(${Math.min(pullDist / 80 * 180, 180)}deg)`;
    const text = $pullEl.querySelector('.pull-text');
    if (text) text.textContent = pullDist > 75 ? 'Release to refresh' : 'Pull to refresh';
  }, { passive: false });

  function removePullEl() {
    if ($pullEl) { $pullEl.remove(); $pullEl = null; }
  }

  $view.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    if (pullDist > 75) pullRefresh();
    removePullEl();
    pullDist = 0;
  }, { passive: true });

  // Main view events
  $view.addEventListener('click', e => {
    const target = e.target.closest('[data-nav], [data-cat], [data-action], [data-topic-id], [data-sec]');

    if (!target) return;

    if (target.dataset.nav) {
      const nav = target.dataset.nav;
      sfxNav();
      if (nav === 'home') navigate('home');
      else if (nav === 'category') navigate('category', target.dataset.cat);
      return;
    }

    // Category card
    if (target.dataset.cat) {
      sfxNav();
      navigate('category', target.dataset.cat);
      return;
    }

    // Topic click (click on topic row, not inside sub-item)
    if (target.dataset.topicId && !target.dataset.action && !e.target.closest('.sub-item, .sub-bookmark, .sub-del')) {
      sfxNav();
      navigate('topic', target.dataset.topicId);
      return;
    }

    const action = target.dataset.action;
    if (!action) return;

    // Add custom subtopic
    if (action === 'add-custom-sub') {
      const topicId = target.dataset.topicId;
      const input = document.getElementById('customSubInput');
      const text = input?.value.trim();
      if (text && topicId) {
        addCustomSub(topicId, text);
        input.value = '';
        navigate('topic', topicId);
        toast('Added: ' + text);
      }
      return;
    }

    // Delete custom sub-item
    if (action === 'del-custom-sub') {
      const topicId = target.dataset.topicId;
      const idx = parseInt(target.dataset.customIdx);
      if (!isNaN(idx) && topicId) {
        removeCustomSub(topicId, idx);
        navigate('topic', topicId);
        toast('Custom objective removed');
      }
      return;
    }

    // Sub-item bookmark toggle
    if (action === 'sub-bookmark') {
      e.stopPropagation();
      sfxBookmark();
      const uidStr = target.dataset.subUid;
      if (uidStr) {
        toggleSubBookmark(uidStr);
        target.classList.toggle('active', isSubBookmarked(uidStr));
        toast(isSubBookmarked(uidStr) ? 'Sub-item saved' : 'Sub-item removed');
      }
      return;
    }

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
          if (checkAll) { sfxCheck(); } else { sfxUncheck(); }
          if (checkAll) celebrate();
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
      sfxBookmark();
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
      if (checkVal) { sfxCelebrate(); celebrate(); } else { sfxUncheck(); }
      toast(checkVal ? 'All checked' : 'All unchecked');
      return;
    }

    // Install from settings
      if (action === 'install-app') {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          toast('App is already installed');
        } else if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(result => {
            if (result.outcome === 'accepted') {
              state.installDismissed = true;
              saveState();
            }
            deferredPrompt = null;
          });
        } else {
          toast('Open this page in Chrome and visit again — the install prompt will appear');
        }
        return;
      }

      // Cloud account actions
      if (action === 'cloud-login') {
        showAuthDialog('login').then(creds => {
          if (!creds) return;
          toast('Connecting…');
          cloudLogin(creds.user, creds.pass).catch(err => toast('Login failed: ' + err.message));
        });
        return;
      }
      if (action === 'cloud-register') {
        showAuthDialog('register').then(creds => {
          if (!creds) return;
          toast('Registering…');
          cloudRegister(creds.user, creds.pass).catch(err => toast('Register failed: ' + err.message));
        });
        return;
      }
      if (action === 'cloud-logout') {
        showConfirm('Logout', 'Disconnect cloud account? Local data will be kept.', 'Logout', 'Cancel').then(ok => {
          if (ok) cloudLogout();
        });
        return;
      }
      if (action === 'cloud-sync') {
        toast('Saving…');
        const data = {
          progress: state.progress,
          bookmarks: state.bookmarks,
          subBookmarks: state.subBookmarks,
          customSubs: state.customSubs,
          topicNotes: state.topicNotes
        };
        syncToGithub(data).then(() => toast('Saved to cloud')).catch(err => toast('Save failed: ' + err.message));
        return;
      }

    // Theme toggle
    if (action === 'toggle-theme') {
      toggleTheme();
      const toggleEl = target.closest('.theme-toggle');
      if (toggleEl) toggleEl.classList.toggle('on');
      toast(state.theme === 'light' ? 'Light theme' : 'Dark theme');
      sfxCheck();
      return;
    }

    // Reset actions in settings
    if (action === 'reset-progress') {
      showConfirm('Reset Progress', 'Clear all checkmarks? This cannot be undone.', 'Reset', 'Cancel').then(ok => {
        if (!ok) return;
        state.progress = {};
        saveState();
        toast('Progress reset');
      });
      return;
    }
    if (action === 'reset-bookmarks') {
      showConfirm('Clear Bookmarks', 'Remove all saved topics and sub-items? This cannot be undone.', 'Clear', 'Cancel').then(ok => {
        if (!ok) return;
        state.bookmarks = [];
        state.subBookmarks = [];
        saveState();
        toast('Bookmarks cleared');
      });
      return;
    }
    if (action === 'reset-all') {
      showConfirm('Reset Everything', 'Wipe all local data including progress, bookmarks, notes, and theme? This cannot be undone.', 'Wipe', 'Cancel').then(ok => {
        if (!ok) return;
        state = { progress: {}, bookmarks: [], subBookmarks: [], customSubs: {}, topicNotes: {}, githubUser: '', githubPin: '', installDismissed: false, theme: 'dark' };
        applyTheme('dark');
        saveState();
        toast('All data wiped');
        navigate('home');
      });
      return;
    }
  });

  // Sub-item clicks (inside topic view)
  $view.addEventListener('click', e => {
    const subItem = e.target.closest('.sub-item');
    if (!subItem || subItem.dataset.uid === undefined) return;
    // Don't toggle when clicking bookmark or delete buttons
    if (e.target.closest('.sub-bookmark, .sub-del, [data-action]')) return;
    const u = subItem.dataset.uid;
    const wasDone = isDone(u);
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
    if (wasDone) { sfxUncheck(); } else { sfxCheck(); }
    // Check if all subtopics are now done → celebrate
    const parentTopic = subItem.closest('[data-topic-id]');
    if (parentTopic) {
      const all = ALL_TOPICS.find(t => t.id === parentTopic.dataset.topicId);
      if (all && all.sub?.length) {
        const allDone = all.sub.every((_, i) => isDone(uid(all.catId, all.secId, all.id, i)));
        if (allDone) { sfxCelebrate(); celebrate(); }
      }
    }
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
      sfxBookmark();
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
    const wasDone = isDone(u);
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
    if (wasDone) { sfxUncheck(); } else { sfxCheck(); }
  });

  // Search input
  const $searchInput = $('#searchInput');
  const $searchWrap = $('#searchWrap');
  const $topTitle = $('#topTitle');

  let searchTimeout;

  function expandSearch() {
    $searchWrap.classList.add('open');
    $topTitle.classList.add('hidden');
    $searchInput.focus();
  }

  function collapseSearch() {
    $searchWrap.classList.remove('open');
    $topTitle.classList.remove('hidden');
    $searchInput.value = '';
    clearTimeout(searchTimeout);
    const st = history.state;
    if (st && st.view !== 'search') {
      navigateToState(st);
    } else {
      showView(viewHome);
    }
  }

  $searchWrap.addEventListener('click', (e) => {
    if (!$searchWrap.classList.contains('open')) {
      expandSearch();
    }
  });

  $searchInput.addEventListener('input', () => {
    const v = $searchInput.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (v) {
        showView(viewSearch, v);
      } else {
        navigate('home');
      }
    }, 150);
  });

  $searchInput.addEventListener('blur', () => {
    if (!$searchInput.value) {
      collapseSearch();
    }
  });

  $searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      collapseSearch();
      e.preventDefault();
    }
  });

  // Bottom navigation
  $$('.navbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (btn.classList.contains('is-back')) {
        sfxNav();
        window.history.back();
        return;
      }
      sfxNav();
      if ($searchWrap.classList.contains('open')) {
        $searchWrap.classList.remove('open');
        $topTitle.classList.remove('hidden');
        $searchInput.value = '';
      }
      navigate(view);
    });
  });

  // Sheet backdrop
  $sheetBackdrop.addEventListener('click', closeSheet);


  /* ── PWA install ────────────────────────────────────────── */
  const $installBanner = $('#installBanner');
  let deferredPrompt;

  // Topic notes textarea live save
  document.addEventListener('input', e => {
    const ta = e.target.closest('textarea[data-topic-note]');
    if (ta) setTopicNotes(ta.dataset.topicNote, ta.value);
  });

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

  /* ── Browser back button ────────────────────────────────── */
  window.addEventListener('popstate', e => {
    const state = e.state;
    if (!state) {
      showConfirm('Exit Anesthetick?', 'Your progress is saved locally on this device.', 'Exit', 'Stay').then(ok => {
        if (!ok) history.pushState({ view: 'home' }, '');
      });
      return;
    }
    navigateToState(state);
  });

  /* ── Ripple + global interaction ──────────────────────── */
  document.addEventListener('pointerdown', e => {
    const btn = e.target.closest('button, .navbtn, .cat, .topic, .sub-item, .result, .link-item, .set-row, .ref-card.clickable, .saved-sub-topic, .saved-sub-group');
    if (!btn) return;
    if (!btn.classList.contains('ripple-host')) btn.classList.add('ripple-host');
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const s = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = s + 'px';
    r.style.left = (e.clientX - rect.left - s / 2) + 'px';
    r.style.top = (e.clientY - rect.top - s / 2) + 'px';
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });

  /* ── Service worker registration ────────────────────────── */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  /* ── init ───────────────────────────────────────────────── */
  navigate('home');
  tryAutoLogin();
})();

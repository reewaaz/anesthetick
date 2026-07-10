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
        if (!parsed.githubLogin) parsed.githubLogin = '';
        if (!parsed.githubScopes) parsed.githubScopes = '';
        if (!parsed.pomodoro) parsed.pomodoro = { sessions: 0, total: 0, date: '', focusMin: 25, breakMin: 5, endTs: 0, mode: 'Focus', running: false };
        if (typeof parsed.pomodoro.total !== 'number') parsed.pomodoro.total = 0;
        if (typeof parsed.pomodoro.endTs !== 'number') parsed.pomodoro.endTs = 0;
        if (typeof parsed.pomodoro.running !== 'boolean') parsed.pomodoro.running = false;
        if (!parsed.examDate) parsed.examDate = '';
        if (typeof parsed.planWeeksAhead !== 'number') parsed.planWeeksAhead = 26;
        if (typeof parsed.studyDays !== 'number') parsed.studyDays = 5;
        if (!parsed.cloudSha) parsed.cloudSha = '';
        return parsed;
      }
    } catch (_) {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { progress: {}, bookmarks: [], subBookmarks: [], customSubs: {}, topicNotes: {}, githubUser: '', githubPin: '', githubLogin: '', githubScopes: '', cloudSha: '', installDismissed: false, theme: prefersDark ? 'dark' : 'light', pomodoro: { sessions: 0, total: 0, date: '', focusMin: 25, breakMin: 5, endTs: 0, mode: 'Focus', running: false }, examDate: '', planWeeksAhead: 26, studyDays: 5 };
  }

  function saveState(opts) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
    updatePlannerPct?.();
    if (!opts || !opts.silent) triggerAutoSync();
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
    haptic(12);
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

  function sfxCheck() {
    playTone(660, 0.08, 'sine', 0.08);
    playTone(880, 0.06, 'sine', 0.05);
  }
  function sfxUncheck() {
    playTone(300, 0.10, 'triangle', 0.05);
    playTone(240, 0.08, 'sine', 0.03);
  }
  function sfxNav() { playTone(1000, 0.04, 'sine', 0.03); }
  function sfxCelebrate() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.18, 'sine', 0.07), i * 70);
    });
  }
  function sfxBookmark() {
    playTone(880, 0.08, 'sine', 0.06);
    playTone(1100, 0.10, 'triangle', 0.04);
  }

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
    haptic(8);
  }

  function isBookmarked(topicId) {
    return state.bookmarks.includes(topicId);
  }

  function toggleBookmark(topicId) {
    const idx = state.bookmarks.indexOf(topicId);
    if (idx >= 0) state.bookmarks.splice(idx, 1);
    else state.bookmarks.push(topicId);
    saveStateDebounced();
    haptic(10);
  }

  function isSubBookmarked(uidStr) {
    return state.subBookmarks.includes(uidStr);
  }

  function toggleSubBookmark(uidStr) {
    const idx = state.subBookmarks.indexOf(uidStr);
    if (idx >= 0) state.subBookmarks.splice(idx, 1);
    else state.subBookmarks.push(uidStr);
    saveStateDebounced();
    haptic(10);
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
    play: '<svg viewBox="0 0 24 24" class="ic" style="width:14px;height:14px"><path d="M5 3l14 9-14 9z" fill="currentColor"/></svg>',
    book: '<svg viewBox="0 0 24 24" class="ic" style="width:14px;height:14px"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
    const isObj = sub && typeof sub === 'object';
    const text = isObj ? (sub.t || '') : (sub || '');
    const sb = isSubBookmarked(u);
    const customAttr = isCustom ? ' data-custom="1"' : '';
    const refs = isObj && Array.isArray(sub.r) ? sub.r : (topic.refs || []);
    const { books, others } = splitRefs(refs);
    const art = isObj ? articleLinkFor(sub) : null;
    const vid = isObj ? videoLinkFor(sub) : null;
    const hasRefs = !!(art || vid || others.length);
    return html`
      <div class="sub-item ${done ? 'done' : ''}" data-uid="${u}"${customAttr}>
        <div class="check">${ICONS.check}</div>
        <div class="sub-context">
          <span class="s-name">${text}</span>
          <div class="sub-books">
            ${books.map(r => html`<span class="ref-book" title="${bookTitle(r)}">${r}</span>`).join('')}
          </div>
          ${hasRefs ? html`
          <div class="sub-refs">
            ${art ? html`<a class="res-link art" href="${art.href}" target="_blank" rel="noopener" title="Open a relevant article">${ICONS.external} ${art.label}</a>` : ''}
            ${vid ? html`<a class="res-link vid" href="${vid.href}" target="_blank" rel="noopener" title="Supplementary video">${ICONS.play} ${vid.label}</a>` : ''}
            ${others.map(o => { const ol = otherRefLink(o); return html`<a class="res-link ref" href="${ol.href}" target="_blank" rel="noopener" title="${ol.title}">${ICONS.external} ${ol.label}</a>`; }).join('')}
          </div>` : ''}
        </div>
        <div class="sub-actions">
          ${hasRefs ? html`<button class="ref-btn" title="Show references" aria-label="Show references">${ICONS.link}</button>` : ''}
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

  // ── Reference resolution ──────────────────────────────────
  const RS = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
  function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
  function enc(s) { return encodeURIComponent(s || ''); }

  // Resolve a curriculum ref code -> { code, base, chapter, entry, chTitle }
  function resolveRef(code) {
    let base = code, chapter = null;
    const m = code.match(/^([A-Za-z& ]+?)\s+Ch\.([\d\-]+)$/);
    if (m) { base = m[1].trim(); chapter = m[2]; }
    let entry = (RS.REF_SOURCES && (RS.REF_SOURCES[code] || RS.REF_SOURCES[base])) || null;
    if (!entry && code.indexOf('RCoA') === 0) entry = RS.REF_SOURCES && RS.REF_SOURCES['RCoA'];
    const chTitle = (RS.CHAPTER_TITLES && (RS.CHAPTER_TITLES[code] || (chapter && RS.CHAPTER_TITLES[base + ':' + chapter]))) || null;
    return { code, base, chapter, entry, chTitle };
  }

  function bookTitle(r) {
    const rr = resolveRef(r);
    if (!rr.entry) return r;
    let t = rr.entry.label;
    if (rr.chTitle) t += ' — ' + rr.chTitle;
    else if (rr.chapter) t += ' (Ch.' + rr.chapter + ')';
    if (rr.entry.sub) t += ' · ' + rr.entry.sub;
    return t;
  }

  // Books are shown as plain text only (no outbound link). Codes that are not
  // textbooks and are not RCoA syllabus codes become "other references".
  const BOOK_CODES = ['MM', 'MIL', 'DD'];
  function isRCOA(code) { return code.indexOf('RCoA') === 0; }
  function splitRefs(refs) {
    const books = [], others = [];
    (refs || []).forEach(r => {
      if (isRCOA(r)) return;                       // drop syllabus refs entirely
      const base = r.split(/\s+Ch\./)[0].trim();
      if (BOOK_CODES.indexOf(base) !== -1) books.push(r);
      else others.push(r);
    });
    return { books, others };
  }

  // Strip parens / punctuation / excess words so searches return real results.
  function cleanQuery(s) {
    return (s || '')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 8)
      .join(' ');
  }

  // Where to READ an article for a sub-item. Trusted deep links used directly;
  // untrusted ones routed to a site-scoped search; otherwise a search scoped to
  // the main free anesthesia education sites (always returns relevant results).
  function articleLinkFor(sub) {
    const text = (sub && sub.t) || '';
    const a = sub && sub.a;
    if (a) {
      const h = hostOf(a);
      if (RS.TRUSTED_EXACT && RS.TRUSTED_EXACT.indexOf(h) !== -1) return { href: a, label: 'Read' };
      return { href: 'https://www.google.com/search?q=' + enc('site:' + h + ' ' + cleanQuery(text)), label: 'Read' };
    }
    const q = cleanQuery(text) + ' (site:openanesthesia.org OR site:derangedphysiology.com OR site:litfl.com OR site:nysora.com)';
    return { href: 'https://www.google.com/search?q=' + enc(q), label: 'Articles' };
  }
  function videoLinkFor(sub) {
    return { href: 'https://www.youtube.com/results?search_query=' + enc(cleanQuery((sub && sub.t) || '') + ' anaesthesia'), label: 'Video' };
  }
  function otherRefLink(code) {
    const rr = resolveRef(code);
    const label = rr.entry ? rr.entry.label : code;
    const href = (rr.entry && rr.entry.url)
      ? rr.entry.url
      : ('https://www.google.com/search?q=' + enc(label + ' anaesthesia'));
    return { code, label: code, title: label, href };
  }

  // Haptic feedback (mobile). No-op where unsupported.
  function haptic(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
  }

  // Reveal / hide the references panel for a sub-item (long-press on mobile,
  // hyperlink button on desktop).
  function toggleRefsPanel(el) {
    const panel = el && el.querySelector('.sub-refs');
    if (!panel) return;
    const open = panel.classList.toggle('open');
    if (open) haptic(12);
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
      ${cat.sections.map(sec => {
        const allBm = sec.topics.every(t => isBookmarked(t.id));
        return html`
        <div class="secg" data-sec="${sec.id}">
          <div style="display:flex;align-items:center;gap:10px;margin:18px 4px 10px">
            <div class="sec-name" style="margin:0">${sec.name}</div>
            <button class="sec-bookmark-btn ${allBm ? 'active' : ''}" data-action="section-bookmark">${allBm ? ICONS['bookmark-filled'] : ICONS.bookmark}</button>
          </div>
          ${sec.desc ? html`<div class="sec-desc">${sec.desc}</div>` : ''}
          ${sec.topics.map(t => renderTopicItem({ ...t, catId: cat.id, catName: cat.name, secId: sec.id, secName: sec.name, catColor: cat.color })).join('')}
        </div>`;}).join('')}
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
        <div class="refs">${topic.refs.filter(r => !isRCOA(r)).map(r => {
          const base = r.split(/\s+Ch\./)[0].trim();
          if (BOOK_CODES.indexOf(base) !== -1) return html`<span class="ref-book" title="${bookTitle(r)}">${r}</span>`;
          const rr = resolveRef(r);
          const href = (rr.entry && rr.entry.url) ? rr.entry.url : ('https://www.google.com/search?q=' + enc((rr.entry ? rr.entry.label : r) + ' anaesthesia'));
          return html`<a class="ref ref-link" href="${href}" target="_blank" rel="noopener" title="${rr.entry ? rr.entry.label : r}">${r}</a>`;
        }).join('')}</div>
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
      const subMatches = (t.sub || []).filter(s => ((typeof s === 'string' ? s : s.t) || '').toLowerCase().includes(q));
      const refMatches = (t.refs || []).some(r => r.toLowerCase().includes(q));
      if (nameMatch || refMatches) return true;
      if (subMatches.length > 0) {
        t._subMatches = subMatches;
        return true;
      }
      return false;
    }).map(t => {
      // Find the best matching subtopic for display
      const matchSub = (t.sub || []).find(s => ((typeof s === 'string' ? s : s.t) || '').toLowerCase().includes(q));
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
            ${r._matchSub ? html`<div class="r-match">${highlightMatch((r._matchSub && r._matchSub.t) || r._matchSub, q)}</div>` : ''}
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

  /* ── Planning helpers ───────────────────────────────────── */
  function planHorizonWeeks() {
    if (state.examDate) {
      const exam = new Date(state.examDate + 'T00:00:00');
      const now = new Date(); now.setHours(0, 0, 0, 0);
      const days = Math.round((exam - now) / 86400000);
      const weeks = Math.floor(days / 7);
      return { weeks: Math.max(weeks, 1), daysUntilExam: days, examDate: exam };
    }
    return { weeks: Math.max(state.planWeeksAhead || 26, 1), daysUntilExam: null, examDate: null };
  }

  function examCountdownLabel() {
    const h = planHorizonWeeks();
    if (h.daysUntilExam === null) return null;
    if (h.daysUntilExam < 0) return 'Exam date passed';
    if (h.daysUntilExam === 0) return 'Exam is today!';
    return h.daysUntilExam + ' days to exam';
  }

  /* ── Planner view ────────────────────────────────────────── */
  function viewPlanner() {
    const inner = document.createElement('div');
    inner.className = 'inner';
    try {
      const ov = overallProgress();
      const pct = ov.pct;

      const catProgresses = CURRICULUM.map(c => ({ cat: c, pct: catProgress(c.id) }))
        .sort((a, b) => a.pct - b.pct);
      const suggested = [];
      for (const cp of catProgresses) {
        if (suggested.length >= 5) break;
        for (const sec of cp.cat.sections) {
          for (const t of sec.topics) {
            const tPct = topicProgress({ ...t, catId: cp.cat.id, secId: sec.id });
            if (tPct < 1 && suggested.length < 5 && !suggested.find(s => s.id === t.id)) {
              suggested.push({ ...t, catId: cp.cat.id, secId: sec.id, catName: cp.cat.name, catColor: cp.cat.color, pct: tPct });
            }
          }
        }
      }

      const remaining = ov.total - ov.done;
      const studyDays = Math.max(state.studyDays || 5, 1);
      const horizon = planHorizonWeeks();
      const weeks = horizon.weeks;
      const weeklyTarget = Math.ceil(remaining / weeks);
      const dailyTarget = Math.ceil(weeklyTarget / studyDays);

      // On-track indicator: subtopics done per week vs expected
      const elapsedWeeks = horizon.examDate
        ? Math.max(0, Math.floor((weeks * 7 - horizon.daysUntilExam) / 7))
        : 0;
      const expectedDone = elapsedWeeks * weeklyTarget;
      const pace = expectedDone > 0 ? (ov.done / expectedDone) : (remaining === 0 ? 1 : 0);
      const paceLabel = remaining === 0 ? 'Complete' : (pace >= 0.9 ? 'On track' : pace >= 0.6 ? 'Behind' : 'Way behind');
      const paceClass = remaining === 0 ? 'ok' : (pace >= 0.9 ? 'ok' : pace >= 0.6 ? 'warn' : 'danger');

      const countdown = examCountdownLabel();
      const examStr = horizon.examDate
        ? horizon.examDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : (state.examDate ? '—' : 'Not set');

      // Pomodoro state init (daily reset)
      if (!state.pomodoro) state.pomodoro = { sessions: 0, total: 0, date: '', focusMin: 25, breakMin: 5, endTs: 0, mode: 'Focus', running: false };
      const today = new Date().toDateString();
      if (state.pomodoro.date !== today) {
        state.pomodoro.sessions = 0;
        state.pomodoro.date = today;
        state.pomodoro.running = false;
        state.pomodoro.endTs = 0;
        saveState();
      }

      inner.innerHTML = html`
        <div class="pl-card pl-hero">
          <div class="pl-ring-wrap">
            <svg viewBox="0 0 100 100" class="pl-ring">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface2)" stroke-width="7"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" stroke-width="7" stroke-dasharray="${2 * Math.PI * 40}" stroke-dashoffset="${2 * Math.PI * 40 * (1 - pct)}" transform="rotate(-90 50 50)" stroke-linecap="round"/>
              <text x="50" y="46" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="800" fill="var(--text)">${Math.round(pct * 100)}%</text>
              <text x="50" y="64" text-anchor="middle" font-size="9" fill="var(--muted)">complete</text>
            </svg>
          </div>
          <div class="pl-hero-stats">
            <div class="pl-sRow"><span>Completed</span><strong>${ov.done}</strong></div>
            <div class="pl-sRow"><span>Remaining</span><strong style="color:var(--warn)">${remaining}</strong></div>
            <div class="pl-sRow"><span>Exam date</span><strong>${examStr}</strong></div>
            ${countdown ? html`<div class="pl-countdown ${horizon.daysUntilExam < 0 ? 'passed' : ''}">${countdown}</div>` : ''}
          </div>
        </div>

        <div class="pl-card">
          <div class="pl-section-title">Your Study Plan</div>
          <div class="pl-plan-grid">
            <div class="pl-plan-item"><span class="pl-num">${dailyTarget}</span><span class="pl-lbl">Daily</span></div>
            <div class="pl-plan-item"><span class="pl-num">${weeklyTarget}</span><span class="pl-lbl">Weekly</span></div>
            <div class="pl-plan-item"><span class="pl-num">${remaining}</span><span class="pl-lbl">Left</span></div>
            <div class="pl-plan-item"><span class="pl-num">${weeks}</span><span class="pl-lbl">Weeks</span></div>
          </div>
          <div class="pl-pace">
            <span class="pl-pace-badge ${paceClass}">${paceLabel}</span>
            <span class="pl-focus">Focus: <strong>${catProgresses[0]?.cat?.name || '—'}</strong> (${catProgresses[0] ? Math.round(catProgresses[0].pct * 100) + '%' : '0%'} done)</span>
          </div>
        </div>

        <div class="pl-card">
          <div class="pl-section-title">Pomodoro Timer</div>
          <div class="pl-timer">
            <div class="pl-timer-display" id="plTimerDisplay">${formatTime(currentTimerSeconds())}</div>
            <div class="pl-timer-mode" id="plTimerMode">${state.pomodoro.mode || 'Focus'}</div>
            <div class="pl-timer-controls">
              <button class="pl-timer-btn primary" id="plTimerStart">${timerRunning ? 'Pause' : 'Start'}</button>
              <button class="pl-timer-btn" id="plTimerReset">Reset</button>
            </div>
            <div class="pl-timer-sessions">Today: <strong>${state.pomodoro.sessions}</strong> &middot; Total: <strong>${state.pomodoro.total}</strong> sessions</div>
            <div class="pl-timer-presets">
              <button class="pl-preset" data-min="25" data-mode="Focus">25m</button>
              <button class="pl-preset" data-min="15" data-mode="Break">15m</button>
              <button class="pl-preset" data-min="45" data-mode="Focus">45m</button>
              <button class="pl-preset" data-min="5" data-mode="Break">5m</button>
            </div>
          </div>
        </div>

        <div class="pl-card">
          <div class="pl-section-title">Suggested Topics</div>
          ${suggested.length ? html`
            ${suggested.map(s => html`
              <div class="pl-suggest" data-topic-id="${s.id}">
                <div class="pl-sg-dot" style="background:${s.catColor}"></div>
                <div class="pl-sg-body">
                  <div class="pl-sg-name">${s.name}</div>
                  <div class="pl-sg-cat">${s.catName}</div>
                </div>
                <span class="pl-sg-pct">${Math.round(s.pct * 100)}%</span>
              </div>
            `).join('')}
          ` : '<div class="pl-empty">All topics completed!</div>'}
        </div>

        <div class="pl-card">
          <div class="pl-section-title">Progress by Category</div>
          ${CURRICULUM.map(cat => {
            const p = catProgress(cat.id);
            return html`
              <div class="pl-cat-row">
                <div class="pl-cat-head">
                  <span class="pl-cat-name">${cat.name}</span>
                  <span class="pl-cat-pct">${Math.round(p * 100)}%</span>
                </div>
                <div class="pl-cat-bar"><i style="width:${p * 100}%;background:${cat.color}"></i></div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pl-card">
          <div class="pl-section-title">Stats</div>
          <div class="pl-plan-grid">
            <div class="pl-plan-item"><span class="pl-num">${CURRICULUM.length}</span><span class="pl-lbl">Categories</span></div>
            <div class="pl-plan-item"><span class="pl-num">${ALL_TOPICS.length}</span><span class="pl-lbl">Topics</span></div>
            <div class="pl-plan-item"><span class="pl-num">${ov.total}</span><span class="pl-lbl">Subtopics</span></div>
            <div class="pl-plan-item"><span class="pl-num">${Math.round(pct * 100)}%</span><span class="pl-lbl">Complete</span></div>
          </div>
        </div>
      `;

      requestAnimationFrame(() => {
        inner.querySelectorAll('.pl-suggest').forEach(el => {
          el.addEventListener('click', () => navigate('topic', el.dataset.topicId));
        });
        inner.querySelectorAll('.pl-preset').forEach(btn => {
          btn.addEventListener('click', () => startPreset(parseInt(btn.dataset.min, 10), btn.dataset.mode));
        });
        wirePomodoro(inner);
      });
    } catch (e) {
      inner.innerHTML = '<div class="empty"><p>Could not load planner.</p></div>';
    }
    return inner;
  }

  // Timer globals
  let timerSeconds = 25 * 60;
  let timerRunning = false;
  let timerMode = 'Focus';
  let timerInterval = null;

  function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function currentTimerSeconds() {
    if (timerRunning && state.pomodoro.endTs) {
      return Math.max(0, Math.round((state.pomodoro.endTs - Date.now()) / 1000));
    }
    if (timerSeconds > 0) return timerSeconds;
    return (timerMode === 'Break' ? state.pomodoro.breakMin : state.pomodoro.focusMin) * 60;
  }

  function presetSeconds(min, mode) {
    return min * 60;
  }

  function startPreset(min, mode) {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerMode = mode || (min <= 10 ? 'Break' : 'Focus');
    state.pomodoro.mode = timerMode;
    timerSeconds = presetSeconds(min, timerMode);
    if (timerMode === 'Focus') state.pomodoro.focusMin = min; else state.pomodoro.breakMin = min;
    timerRunning = true;
    startTimerTick();
  }

  function startTimerTick() {
    state.pomodoro.endTs = Date.now() + timerSeconds * 1000;
    state.pomodoro.running = true;
    saveState();
    const container = document.querySelector('#view .pl-card');
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerInterval = setInterval(() => {
      const remaining = Math.round((state.pomodoro.endTs - Date.now()) / 1000);
      timerSeconds = Math.max(0, remaining);
      updateTimerDisplay(null);
      if (remaining <= 0) completeTimerPhase();
    }, 250);
    updateTimerDisplay(null);
  }

  function completeTimerPhase() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerRunning = false;
    state.pomodoro.running = false;
    state.pomodoro.endTs = 0;
    if (timerMode === 'Focus') {
      state.pomodoro.sessions++;
      state.pomodoro.total++;
      saveState();
      timerMode = 'Break';
      state.pomodoro.mode = 'Break';
      timerSeconds = state.pomodoro.breakMin * 60;
      sfxCelebrate();
      toast('Focus session done — take a break!');
    } else {
      timerMode = 'Focus';
      state.pomodoro.mode = 'Focus';
      timerSeconds = state.pomodoro.focusMin * 60;
      toast('Break over — back to focus!');
    }
    saveState();
    updateTimerDisplay(null);
  }

  function wirePomodoro(container) {
    const display = container.querySelector('#plTimerDisplay');
    const modeEl = container.querySelector('#plTimerMode');
    const startBtn = container.querySelector('#plTimerStart');
    const resetBtn = container.querySelector('#plTimerReset');
    if (!display || !startBtn) return;

    // Resume a running timer after navigating back to the planner
    if (state.pomodoro.running && state.pomodoro.endTs) {
      timerSeconds = Math.max(0, Math.round((state.pomodoro.endTs - Date.now()) / 1000));
      timerMode = state.pomodoro.mode || 'Focus';
      if (timerSeconds > 0) {
        if (!timerRunning) timerRunning = true;
        startTimerTick();
      } else {
        completeTimerPhase();
      }
    }

    startBtn.onclick = () => {
      haptic(10);
      if (timerRunning) {
        timerRunning = false;
        state.pomodoro.running = false;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        // Persist remaining seconds so it can resume later
        state.pomodoro.endTs = Date.now() + timerSeconds * 1000;
        saveState();
        updateTimerDisplay(container);
        return;
      }
      if (timerSeconds <= 0) timerSeconds = (timerMode === 'Break' ? state.pomodoro.breakMin : state.pomodoro.focusMin) * 60;
      timerRunning = true;
      startTimerTick();
    };

    resetBtn.onclick = () => {
      haptic(10);
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      timerRunning = false;
      state.pomodoro.running = false;
      state.pomodoro.endTs = 0;
      timerMode = 'Focus';
      state.pomodoro.mode = 'Focus';
      timerSeconds = state.pomodoro.focusMin * 60;
      saveState();
      updateTimerDisplay(container);
    };

    updateTimerDisplay(container);
  }

  function updateTimerDisplay(container) {
    const viewEl = document.querySelector('#view');
    const display = (container || viewEl)?.querySelector('#plTimerDisplay');
    const modeEl = (container || viewEl)?.querySelector('#plTimerMode');
    const startBtn = (container || viewEl)?.querySelector('#plTimerStart');
    if (display) display.textContent = formatTime(currentTimerSeconds());
    if (modeEl) modeEl.textContent = timerMode;
    if (startBtn) startBtn.textContent = timerRunning ? 'Pause' : (currentTimerSeconds() > 0 ? 'Start' : 'Restart');
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
            : (((topic.sub && topic.sub[actualIdx] && topic.sub[actualIdx].t) || (topic.sub && topic.sub[actualIdx]) || '(deleted)'));
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
          haptic(8);
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
        <div class="set-group-title">Study Plan</div>
        <div class="set-row">
          <div class="set-info">
            <div class="lbl">Exam Date</div>
            <div class="desc">Drives your countdown &amp; weekly targets</div>
          </div>
          <input type="date" class="set-input" id="examDateInput" value="${state.examDate || ''}" max="2100-12-31" />
        </div>
        <div class="set-row" style="border-color:transparent">
          <div class="set-info">
            <div class="lbl">Planning Horizon</div>
            <div class="desc">Weeks of study left (used if no exam date)</div>
          </div>
          <input type="number" class="set-input narrow" id="planWeeksInput" value="${state.planWeeksAhead}" min="1" max="104" />
        </div>
        <div class="set-row" style="border-color:transparent">
          <div class="set-info">
            <div class="lbl">Study Days / Week</div>
            <div class="desc">Used to compute daily targets</div>
          </div>
          <input type="number" class="set-input narrow" id="studyDaysInput" value="${state.studyDays || 5}" min="1" max="7" />
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
              <div class="lbl">Auto-save</div>
              <div class="desc">Saves to cloud after every change</div>
            </div>
            <span class="sync-status" id="syncStatus">${syncStatusLabel()}</span>
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
              <div class="lbl">Check Connection</div>
              <div class="desc">Test repo access and permissions</div>
            </div>
            <button class="btn-ghost" data-action="cloud-check" style="font-size:12px">${ICONS.radio} Test</button>
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
          <div class="set-row" style="border-color:transparent">
            <div class="set-info">
              <div class="lbl">Auto-save</div>
              <div class="desc">Saves to cloud after every change (log in to enable)</div>
            </div>
            <span class="sync-status" id="syncStatus">${syncStatusLabel()}</span>
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
        <div class="set-group-title">Data</div>
        <div class="set-row" style="border-color:transparent">
          <div class="set-info">
            <div class="lbl">Export Data</div>
            <div class="desc">Download a backup file</div>
          </div>
          <button class="btn-ghost" data-action="export-data" style="font-size:12px">${ICONS.download} Export</button>
        </div>
        <div class="set-row" style="border-color:transparent">
          <div class="set-info">
            <div class="lbl">Import Data</div>
            <div class="desc">Restore from a backup file</div>
          </div>
          <button class="btn-ghost" data-action="import-data" style="font-size:12px">${ICONS.upload} Import</button>
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
          haptic(8);
          const url = card.dataset.url;
          if (url) window.open(url, '_blank', 'noopener');
        });
      });
      const examInput = inner.querySelector('#examDateInput');
      if (examInput) examInput.addEventListener('change', () => {
        state.examDate = examInput.value;
        saveState();
        toast(state.examDate ? 'Exam date set' : 'Exam date cleared');
      });
      const weeksInput = inner.querySelector('#planWeeksInput');
      if (weeksInput) weeksInput.addEventListener('change', () => {
        const v = parseInt(weeksInput.value, 10);
        state.planWeeksAhead = (isNaN(v) || v < 1) ? 1 : Math.min(v, 104);
        weeksInput.value = state.planWeeksAhead;
        saveState();
      });
      const daysInput = inner.querySelector('#studyDaysInput');
      if (daysInput) daysInput.addEventListener('change', () => {
        const v = parseInt(daysInput.value, 10);
        state.studyDays = (isNaN(v) || v < 1) ? 1 : Math.min(v, 7);
        daysInput.value = state.studyDays;
        saveState();
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
      case 'planner': showView(viewPlanner); break;
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
      case 'planner': showView(viewPlanner); break;
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
    haptic(10);
    $sheetContent.innerHTML = htmlContent;
    $sheetBackdrop.hidden = false;
    $sheet.hidden = false;
    requestAnimationFrame(() => {
      $sheetBackdrop.classList.add('show');
      $sheet.classList.add('show');
    });
  }

  function closeSheet() {
    haptic(8);
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
  function showConfirm(title, msg, onConfirm, onCancel, confirmLabel, cancelLabel) {
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
    function close() {
      backdrop.classList.remove('show');
      setTimeout(() => backdrop.remove(), 300);
    }
    backdrop.addEventListener('click', e => { if (e.target === backdrop) { haptic(8); close(); if (onCancel) onCancel(); } });
    dlg.querySelector('[data-dlg="cancel"]').addEventListener('click', () => { haptic(8); close(); if (onCancel) onCancel(); });
    dlg.querySelector('[data-dlg="confirm"]').addEventListener('click', () => { haptic(10); close(); if (onConfirm) onConfirm(); });
  }

  /* ── Cloud sync (GitHub) ─────────────────────────────────── */
  const GITHUB_API = 'https://api.github.com';
  const GITHUB_DATA_PATH = 'anesthetick-data.json';
  const GITHUB_REPO = 'anesthetick';

  function cloudPayload() {
    return {
      progress: state.progress,
      bookmarks: state.bookmarks,
      subBookmarks: state.subBookmarks,
      customSubs: state.customSubs,
      topicNotes: state.topicNotes,
      pomodoro: { total: state.pomodoro.total, sessions: state.pomodoro.sessions },
      examDate: state.examDate,
      planWeeksAhead: state.planWeeksAhead
    };
  }

  function applyCloudData(data) {
    if (!data || typeof data !== 'object') return false;
    let changed = false;
    if (data.progress) { state.progress = data.progress; changed = true; }
    if (data.bookmarks) { state.bookmarks = data.bookmarks; changed = true; }
    if (data.subBookmarks) { state.subBookmarks = data.subBookmarks; changed = true; }
    if (data.customSubs) { state.customSubs = data.customSubs; changed = true; }
    if (data.topicNotes) { state.topicNotes = data.topicNotes; changed = true; }
    if (data.pomodoro && typeof data.pomodoro.total === 'number') { state.pomodoro.total = data.pomodoro.total; changed = true; }
    if (typeof data.examDate === 'string') { state.examDate = data.examDate; changed = true; }
    if (typeof data.planWeeksAhead === 'number') { state.planWeeksAhead = data.planWeeksAhead; changed = true; }
    return changed;
  }

  function isCloudConnected() {
    return !!(state.githubUser && state.githubPin);
  }

  /* ══════════════════════════════════════════════════════════════
     CLOUD SYNC (GitHub) — clean rewrite
     Storage: <owner>/anesthetick  →  anesthetick-data.json  (Contents API)
     ══════════════════════════════════════════════════════════════ */

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let syncState = 'idle'; // idle | syncing | ok | error
  let syncStateMsg = '';
  function syncStatusLabel() {
    if (syncState === 'syncing') return '⟳ Saving…';
    if (syncState === 'ok') return '✓ Saved';
    if (syncState === 'error') return '⚠ ' + (syncStateMsg || 'Sync failed');
    return isCloudConnected() ? 'Auto' : 'Off';
  }
  function setSyncStatus(state_, msg) {
    syncState = state_;
    syncStateMsg = msg || '';
    const el = document.getElementById('syncStatus');
    if (el) el.textContent = syncStatusLabel();
  }

  function githubOwner() {
    // Use the authenticated login (exact case) to avoid owner-case 404s
    return state.githubLogin || state.githubUser;
  }
  function authHeader() {
    return 'Basic ' + btoa(state.githubUser + ':' + state.githubPin);
  }
  function canWritePrivate() {
    const s = (state.githubScopes || '').toLowerCase();
    if (!s) return false; // unknown scope — safest assume public
    const scopes = s.split(',').map(x => x.trim());
    return scopes.includes('repo'); // full repo scope → private writeable
  }

  // Timeout-protected fetch so a hung/proxied request can never stall the UI
  async function ghFetch(url, opts) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      return await fetch(url, Object.assign({ signal: ctrl.signal }, opts));
    } catch (e) {
      if (e && e.name === 'AbortError') {
        const err = new Error('GitHub request timed out (15s) — check your network/proxy.');
        err.isTimeout = true;
        throw err;
      }
      throw e;
    } finally {
      clearTimeout(t);
    }
  }

  function ghHeaders(extra) {
    return Object.assign({ Authorization: authHeader() }, extra || {});
  }

  async function testCloudConnection(user, pass) {
    const res = await ghFetch(GITHUB_API + '/user', { headers: { Authorization: 'Basic ' + btoa(user + ':' + pass) } });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      if (/<!DOCTYPE/i.test(t)) throw new Error('GitHub is unreachable (rate limit or outage). Try again shortly.');
      throw new Error('Invalid credentials (' + res.status + ')');
    }
    const scopes = (res.headers && res.headers.get ? res.headers.get('x-oauth-scopes') : '') || '';
    state.githubScopes = scopes;
    const json = await res.json().catch(() => null);
    if (!json || !json.login) throw new Error('Could not read GitHub account.');
    return json.login;
  }

  // GET a file from the repo. Returns { sha, content(base64) } or null if missing.
  async function readCloudFile(path) {
    const url = GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO + '/contents/' + path;
    const res = await ghFetch(url, { headers: ghHeaders(), cache: 'no-store' });
    if (res.status === 404) return null;
    if (res.ok) {
      const j = await res.json().catch(() => null);
      return j && j.sha ? { sha: j.sha, content: j.content } : null;
    }
    if (res.status >= 500) {
      const err = new Error('GitHub read error (' + res.status + ')');
      err.transient = true;
      throw err;
    }
    const t = await res.text().catch(() => '');
    if (/<!DOCTYPE/i.test(t)) {
      const err = new Error('GitHub is unreachable (proxy/outage).');
      err.transient = true;
      throw err;
    }
    const err = new Error('GitHub read error (' + res.status + ')');
    throw err;
  }

  function encodePayload(data) {
    const json = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(json)));
  }

  // PUT a file. Returns the API response (caller inspects status).
  async function writeCloudFile(path, contentB64, sha) {
    const url = GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO + '/contents/' + path;
    const body = { message: 'Anesthetick sync', content: contentB64 };
    if (sha) body.sha = sha;
    return ghFetch(url, {
      method: 'PUT',
      headers: ghHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    });
  }

  async function ensureRepo() {
    const check = await ghFetch(GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO, { headers: ghHeaders() });
    if (check.ok) {
      const repo = await check.json().catch(() => null);
      // Don't touch existing repo visibility — Pages requires public
      const branch = repo && repo.default_branch ? repo.default_branch : 'main';
      const ref = await ghFetch(GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO + '/git/refs/heads/' + branch, { headers: ghHeaders() });
      if (ref.ok) return;
    }
    // Create the repo
    const res = await ghFetch(GITHUB_API + '/user/repos', {
      method: 'POST',
      headers: ghHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name: GITHUB_REPO, description: 'Anesthetick study sync', private: false, auto_init: true })
    });
    if (res.status === 422) {
      // Repo exists but wasn't readable above (scope/permissions) — surface clearly
      const m = await res.json().catch(() => ({}));
      throw new Error('Repo "' + GITHUB_REPO + '" exists but is not accessible. ' + (m.message || 'Ensure your PAT has at least "public_repo" scope.'));
    }
    if (!res.ok) {
      const m = await res.json().catch(() => ({}));
      throw new Error('Cannot create repo "' + GITHUB_REPO + '". (' + (m.message || res.status) + ')');
    }
    // Wait for the default branch to be ready
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const rc = await ghFetch(GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO + '/git/refs/heads/main', { headers: ghHeaders() });
      if (rc.ok) return;
      const rm = await ghFetch(GITHUB_API + '/repos/' + githubOwner() + '/' + GITHUB_REPO + '/git/refs/heads/master', { headers: ghHeaders() });
      if (rm.ok) return;
    }
  }

  // Serialize writes so manual save + autosave never race (avoids sha conflict)
  let syncInFlight = null;
  async function syncToGithub(data) {
    if (!isCloudConnected()) throw new Error('Not connected — log in first');
    if (syncInFlight) return syncInFlight;
    syncInFlight = (async () => {
      await ensureRepo();
      for (let attempt = 0; attempt < 6; attempt++) {
        const existing = await readCloudFile(GITHUB_DATA_PATH).catch(e => { if (e.transient && attempt < 5) return 'RETRY'; throw e; });
        if (existing === 'RETRY') { await sleep(1200 * attempt); continue; }
        const sha = existing ? existing.sha : null;
        const contentB64 = encodePayload(data);
        const res = await writeCloudFile(GITHUB_DATA_PATH, contentB64, sha);
        if (res.ok) {
          try { const body = await res.json(); if (body?.content?.sha) { state.cloudSha = body.content.sha; cloudLastPushTime = Date.now(); saveState({ silent: true }); } } catch (_) {}
          return true;
        }
        const info = await res.text().catch(() => '');
        let msg = info.slice(0, 200);
        try { msg = (JSON.parse(info).message) || msg; } catch (_) {}
        if (attempt === 0) console.error('[anesthetick] PUT status', res.status, info.slice(0, 300));
        const conflict = res.status === 409 || res.status === 422 || /does not match/i.test(msg) || /branch was modified/i.test(msg);
        const transient = res.status >= 500 || res.status === 0 || /rate limit/i.test(msg) || /<!DOCTYPE/i.test(msg);
        if ((conflict || transient) && attempt < 5) {
          // On conflict, merge remote into our payload so no change is lost
          if (conflict && existing && existing.content) {
            try {
              const text = decodeURIComponent(escape(atob(existing.content)));
              const remote = JSON.parse(text);
              const merged = { ...remote, progress: { ...remote.progress, ...data.progress }, bookmarks: [...new Set([...(remote.bookmarks||[]), ...(data.bookmarks||[])])], subBookmarks: [...new Set([...(remote.subBookmarks||[]), ...(data.subBookmarks||[])])], customSubs: { ...remote.customSubs, ...data.customSubs }, topicNotes: { ...remote.topicNotes, ...data.topicNotes } };
              data = merged;
            } catch (_) {}
          }
          await sleep(1000 * Math.pow(1.5, attempt));
          continue;
        }
        if (res.status === 403) throw new Error('Save rejected (403). Ensure your classic PAT has at least "public_repo" scope.');
        if (res.status === 404) throw new Error('Repo "' + GITHUB_REPO + '" not found on GitHub.');
        throw new Error('Save failed: ' + msg);
      }
      throw new Error('Save failed after retries');
    })().finally(() => { syncInFlight = null; });
    return syncInFlight;
  }

  async function syncFromGithub() {
    if (!isCloudConnected()) throw new Error('Not connected');
    const existing = await readCloudFile(GITHUB_DATA_PATH);
    if (!existing || !existing.content) throw new Error('No data found on cloud');
    let text;
    try {
      text = decodeURIComponent(escape(atob(existing.content)));
    } catch (e) {
      throw new Error('Cloud data is not valid base64 (corrupted).');
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error('Saved cloud data is corrupted and could not be parsed.');
    }
  }

  async function cloudRegister(user, pass) {
    const login = await testCloudConnection(user, pass);
    state.githubUser = user;
    state.githubLogin = login;
    state.githubPin = pass;
    saveState();
    await ensureRepo();
    await syncToGithub(cloudPayload());
    startCloudPolling();
    toast('Registered as ' + login);
    navigate('home');
  }

  async function cloudLogin(user, pass) {
    const login = await testCloudConnection(user, pass);
    state.githubUser = user;
    state.githubLogin = login;
    state.githubPin = pass;
    saveState();
    try {
      const data = await syncFromGithub();
      const loaded = applyCloudData(data);
      // Store the sha of the data we just loaded
      try { const ex = await readCloudFile(GITHUB_DATA_PATH); if (ex?.sha) { state.cloudSha = ex.sha; } } catch (_) {}
      saveState();
      startCloudPolling();
      toast('Welcome back ' + login + (loaded ? ' — data loaded' : ''));
    } catch (err) {
      if (err.message && err.message.indexOf('No data found') !== -1) {
        toast('Welcome ' + login + ' — no saved data on cloud yet');
      } else if (err.isTimeout || /timed out|502|503|read error|unreachable|transient/i.test(err.message || '')) {
        toast('Welcome ' + login + ' — cloud unreachable, using local data');
      } else {
        toast('Welcome ' + login + ' — ' + err.message);
      }
      startCloudPolling();
    }
    navigate('home');
  }

  function cloudLogout() {
    stopCloudPolling();
    state.githubUser = '';
    state.githubPin = '';
    saveState();
    toast('Logged out');
    navigate('settings');
  }

  // Debounced auto-save after every local change
  let autoSyncTimer;
  let lastAutoSyncError = 0;
  function triggerAutoSync() {
    if (!isCloudConnected()) { setSyncStatus('idle'); return; }
    clearTimeout(autoSyncTimer);
    setSyncStatus('syncing');
    autoSyncTimer = setTimeout(() => {
      syncToGithub(cloudPayload())
        .then(() => setSyncStatus('ok'))
        .catch(err => {
          const now = Date.now();
          setSyncStatus('error', err.message);
          if (now - lastAutoSyncError > 60000) {
            toast('Auto-sync failed: ' + err.message);
            lastAutoSyncError = now;
          }
        });
    }, 100);
  }

  /* ── Cross-browser cloud polling ──────────────────────────── */
  let cloudLastPushTime = 0;
  let cloudPollTimer = null;

  // Full state replace from remote data (used by polling)
  function applyCloudState(remote) {
    if (!remote || typeof remote !== 'object') return false;
    let changed = false;
    if (remote.progress && typeof remote.progress === 'object') { state.progress = remote.progress; changed = true; }
    if (remote.bookmarks && Array.isArray(remote.bookmarks)) { state.bookmarks = remote.bookmarks; changed = true; }
    if (remote.subBookmarks && Array.isArray(remote.subBookmarks)) { state.subBookmarks = remote.subBookmarks; changed = true; }
    if (remote.customSubs && typeof remote.customSubs === 'object') { state.customSubs = remote.customSubs; changed = true; }
    if (remote.topicNotes && typeof remote.topicNotes === 'object') { state.topicNotes = remote.topicNotes; changed = true; }
    if (typeof remote.examDate === 'string') { state.examDate = remote.examDate; changed = true; }
    if (typeof remote.planWeeksAhead === 'number') { state.planWeeksAhead = remote.planWeeksAhead; changed = true; }
    if (typeof remote.studyDays === 'number') { state.studyDays = remote.studyDays; changed = true; }
    if (changed) saveState({ silent: true });
    return changed;
  }

  // Replace local state with remote + re-render (used by polling)
  function mergeCloudData(remote) {
    const changed = applyCloudState(remote);
    if (changed && history.state) navigateToState(history.state);
    return changed;
  }

  async function pollCloudChanges() {
    if (!isCloudConnected()) return;
    try {
      const existing = await readCloudFile(GITHUB_DATA_PATH);
      if (!existing) return;
      if (existing.sha === state.cloudSha) return;
      if (Date.now() - cloudLastPushTime < 1500) return;
      state.cloudSha = existing.sha;
      const text = decodeURIComponent(escape(atob(existing.content)));
      const remote = JSON.parse(text);
      if (mergeCloudData(remote)) {
        toast('Synced from another browser');
      }
    } catch (_) {}
  }

  function startCloudPolling() {
    stopCloudPolling();
    pollCloudChanges();
    cloudPollTimer = setInterval(pollCloudChanges, 2000);
  }

  function stopCloudPolling() {
    if (cloudPollTimer) { clearInterval(cloudPollTimer); cloudPollTimer = null; }
  }

  // Auto-login + load cloud data on app start
  function tryAutoLogin() {
    if (!isCloudConnected()) return;
    testCloudConnection(state.githubUser, state.githubPin)
      .then(login => {
        state.githubLogin = login;
        saveState();
        return syncFromGithub();
      })
      .then(data => {
        if (applyCloudData(data)) { saveState(); updatePlannerPct?.(); }
      })
      .catch(() => { /* ignore: no data / unreachable */ })
      .finally(() => {
        readCloudFile(GITHUB_DATA_PATH).then(ex => { if (ex?.sha) { state.cloudSha = ex.sha; saveState({ silent: true }); } }).catch(() => {});
        startCloudPolling();
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
        <p style="margin-bottom:16px;font-size:13px;line-height:1.5">${mode === 'register'
          ? 'Your data syncs via GitHub to a public repo named &ldquo;anesthetick&rdquo; in your account (required for Pages hosting). Create a <strong>classic PAT</strong> with <strong>public_repo</strong> scope, then enter it below.'
          : 'Enter your GitHub username and PAT to sync. Data lives in the &ldquo;anesthetick&rdquo; repo.'}</p>
        <div class="auth-form">
          <input type="text" id="authUser" placeholder="GitHub username" autocomplete="username" />
          <input type="password" id="authPass" placeholder="Personal Access Token" autocomplete="current-password" />
          <p class="auth-hint">${mode === 'register'
            ? '<a href="https://github.com/settings/tokens/new?description=anesthetick&scopes=public_repo" target="_blank" rel="noopener" style="color:var(--accent)">Create a token on GitHub &rarr;</a><br><span style="font-size:11px;color:var(--muted)">Use a <strong>classic</strong> token with <strong>public_repo</strong> scope. The token is stored on this device only.</span>'
            : 'Enter the same GitHub username and PAT you used to register.'}</p>
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
      backdrop.addEventListener('click', e => { if (e.target === backdrop) { haptic(8); close(null); } });
      dlg.querySelector('[data-dlg="cancel"]').addEventListener('click', () => { haptic(8); close(null); });
      dlg.querySelector('[data-dlg="confirm"]').addEventListener('click', () => {
        haptic(10);
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
    haptic(10); sfxNav();
    navigate('home');
  });

  $('#plannerBtn').addEventListener('click', () => {
    haptic(10); sfxNav();
    navigate('planner');
  });
  // Mobile touch support
  $('#plannerBtn').addEventListener('touchstart', e => {
    e.preventDefault(); // prevent click delay
    haptic(10); sfxNav();
    navigate('planner');
  }, { passive: false });

  function updatePlannerPct() {
    const el = $('#plannerPct');
    if (!el) return;
    const ov = overallProgress();
    el.textContent = Math.round(ov.pct * 100) + '%';
  }
  updatePlannerPct();

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
  let pullY = 0, pullX = 0, pulling = false, pullDist = 0;
  let $pullEl = null;

  const VIEW_FN = { home: viewHome, bookmarks: viewBookmarks, settings: viewCombinedSettings, progress: viewProgress, planner: viewPlanner, category: viewCategory, topic: viewTopic, search: viewSearch };

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
    pullX = e.touches[0].clientX;
    pullDist = 0;
    pulling = true;
  }, { passive: true });

  $view.addEventListener('touchmove', e => {
    if (!pulling || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - pullY;
    const dx = Math.abs(e.touches[0].clientX - pullX);
    if (dy < 0 || dx > 12) { pulling = false; removePullEl(); return; }
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
      haptic(8); sfxNav();
      if (nav === 'home') navigate('home');
      else if (nav === 'category') navigate('category', target.dataset.cat);
      return;
    }

    // Category card
    if (target.dataset.cat) {
      haptic(8); sfxNav();
      navigate('category', target.dataset.cat);
      return;
    }

    // Topic click (click on topic row, not inside sub-item or bookmark)
    if (target.dataset.topicId && !target.dataset.action && !e.target.closest('.sub-item, .sub-bookmark, .sub-del')) {
      // Clicks on the left 48px of the topic row trigger check instead of navigation
      const topicEl = target.closest('.topic');
      if (topicEl) {
        const rect = topicEl.getBoundingClientRect();
        if (e.clientX - rect.left < 48) {
          const checkBtn = topicEl.querySelector('.check');
          if (checkBtn) { checkBtn.click(); return; }
        }
      }
      haptic(8); sfxNav();
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
        haptic(10);
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
        haptic(10);
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
      haptic(12);
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
      haptic(12);
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
      haptic(12);
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

    // Section bookmark toggle (bookmark/unbookmark all topics in a section)
    if (action === 'section-bookmark') {
      e.stopPropagation();
      sfxBookmark();
      const secg = target.closest('.secg');
      if (secg) swipeLeft(secg, true);
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
      haptic(12);
      if (checkVal) { sfxCelebrate(); celebrate(); } else { sfxUncheck(); }
      toast(checkVal ? 'All checked' : 'All unchecked');
      return;
    }

    // Install from settings
      if (action === 'install-app') {
        haptic(10);
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
        haptic(10);
        showAuthDialog('login').then(creds => {
          if (!creds) return;
          toast('Connecting…');
          cloudLogin(creds.user, creds.pass).catch(err => toast('Login failed: ' + err.message));
        });
        return;
      }
      if (action === 'cloud-register') {
        haptic(10);
        showAuthDialog('register').then(creds => {
          if (!creds) return;
          toast('Registering…');
          cloudRegister(creds.user, creds.pass).catch(err => toast('Register failed: ' + err.message));
        });
        return;
      }
      if (action === 'cloud-logout') {
        haptic(10);
        showConfirm('Logout', 'Disconnect cloud account? Local data will be kept.', () => cloudLogout(), null, 'Logout', 'Cancel');
        return;
      }
      if (action === 'cloud-sync') {
        haptic(10);
        toast('Saving…');
        syncToGithub(cloudPayload()).then(() => toast('Saved to cloud')).catch(err => { console.error('[anesthetick] save failed:', err); toast('Save failed: ' + err.message); });
        return;
      }
      if (action === 'cloud-check') {
        haptic(10);
        toast('Checking…');
        (async () => {
          try {
            const login = await testCloudConnection(state.githubUser, state.githubPin);
            state.githubLogin = login;
            saveState();
            await ensureRepo();
            toast('Connected as ' + login + ' — repo ready');
          } catch (err) {
            toast('Connection issue: ' + err.message);
          }
        })();
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
      haptic(12);
      showConfirm('Reset Progress', 'Clear all checkmarks? This cannot be undone.', () => {
        state.progress = {};
        saveState();
        toast('Progress reset');
      }, null, 'Reset', 'Cancel');
      return;
    }
    if (action === 'reset-bookmarks') {
      haptic(12);
      showConfirm('Clear Bookmarks', 'Remove all saved topics and sub-items? This cannot be undone.', () => {
        state.bookmarks = [];
        state.subBookmarks = [];
        saveState();
        toast('Bookmarks cleared');
      }, null, 'Clear', 'Cancel');
      return;
    }
    if (action === 'reset-all') {
      haptic(12);
      showConfirm('Reset Everything', 'Wipe all local data including progress, bookmarks, notes, and theme? This cannot be undone.', () => {
        state = { progress: {}, bookmarks: [], subBookmarks: [], customSubs: {}, topicNotes: {}, githubUser: '', githubPin: '', githubScopes: '', cloudSha: '', installDismissed: false, theme: 'dark' };
        applyTheme('dark');
        saveState();
        toast('All data wiped');
        navigate('home');
      }, null, 'Wipe', 'Cancel');
      return;
    }

    if (action === 'export-data') {
      haptic(10);
      const data = {
        progress: state.progress,
        bookmarks: state.bookmarks,
        subBookmarks: state.subBookmarks,
        customSubs: state.customSubs,
        topicNotes: state.topicNotes,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'anesthetick-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Data exported');
      return;
    }

    if (action === 'import-data') {
      haptic(10);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target.result);
            if (data.progress) state.progress = data.progress;
            if (data.bookmarks) state.bookmarks = data.bookmarks;
            if (data.subBookmarks) state.subBookmarks = data.subBookmarks;
            if (data.customSubs) state.customSubs = data.customSubs;
            if (data.topicNotes) state.topicNotes = data.topicNotes;
            saveState();
            toast('Data imported successfully');
            navigate('home');
          } catch (_) {
            toast('Invalid backup file');
          }
        };
        reader.readAsText(file);
      });
      input.click();
      return;
    }
  });

  // Sub-item clicks (inside topic view)
  $view.addEventListener('click', e => {
    const subItem = e.target.closest('.sub-item');
    if (!subItem || subItem.dataset.uid === undefined) return;
    // Don't toggle when clicking bookmark, delete, reference links/buttons
    if (e.target.closest('a, .sub-bookmark, .sub-del, .ref-btn, .sub-refs, [data-action]')) return;
    const u = subItem.dataset.uid;
    const wasDone = isDone(u);
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
    haptic(wasDone ? 8 : 14);
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
    if (e.target.closest('a, .sub-bookmark, .sub-del, .ref-btn, .sub-refs, [data-action]')) return;
    const u = subItem.dataset.uid;
    const wasDone = isDone(u);
    toggleDone(u);
    subItem.classList.toggle('done', isDone(u));
    haptic(wasDone ? 8 : 14);
    if (wasDone) { sfxUncheck(); } else { sfxCheck(); }
  });

  // ── Reference button + gestures (long-press, swipe) ──────────
  let suppressClick = false;
  document.addEventListener('click', e => {
    if (suppressClick) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // Desktop: hyperlink button reveals the references panel.
  function bindRefsButton(root) {
    root.addEventListener('click', e => {
      const btn = e.target.closest('.ref-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest('.sub-item');
      if (item) toggleRefsPanel(item);
    }, true);
  }
  bindRefsButton($view);
  bindRefsButton($sheetContent);

  function refreshTopicPct(topicEl) {
    if (!topicEl) return;
    const all = ALL_TOPICS.find(t => t.id === topicEl.dataset.topicId);
    if (!all) return;
    const pct = topicProgress(all);
    const pctEl = topicEl.querySelector('.t-pct');
    if (pctEl) pctEl.textContent = Math.round(pct * 100) + '%';
    else if (pct > 0) {
      const meta = topicEl.querySelector('.t-meta');
      if (meta) { const s = document.createElement('span'); s.className = 't-pct'; s.textContent = Math.round(pct * 100) + '%'; meta.appendChild(s); }
    }
  }

  // Swipe right = tick; swipe left = bookmark.
  function swipeRight(el, isSub) {
    // Section swipe — check all topics inside
    if (el.classList.contains('secg')) {
      const secId = el.dataset.sec;
      if (!secId) return;
      const allTopics = ALL_TOPICS.filter(t => t.secId === secId);
      if (!allTopics.length) return;
      let anyUndone = false;
      for (const t of allTopics) {
        if (t.sub) for (let i = 0; i < t.sub.length; i++) {
          const u = uid(t.catId, t.secId, t.id, i);
          if (!isDone(u)) { anyUndone = true; state.progress[u] = true; }
        }
      }
      if (!anyUndone) for (const t of allTopics) { if (t.sub) for (let i = 0; i < t.sub.length; i++) delete state.progress[uid(t.catId, t.secId, t.id, i)]; }
      saveState();
      el.querySelectorAll('.topic').forEach(tp => {
        const tid = tp.dataset.topicId;
        const all = ALL_TOPICS.find(x => x.id === tid);
        if (all) { const p = topicProgress(all); tp.classList.toggle('done', p === 1); }
      });
      haptic(25);
      if (anyUndone) { sfxCelebrate(); celebrate(); toast('Section done!'); } else { toast('Section unmarked'); }
      return;
    }
    if (isSub) {
      const u = el.dataset.uid;
      if (!u) return;
      const was = isDone(u);
      state.progress[u] = !was;
      saveState();
      el.classList.toggle('done', !was);
      haptic(18);
      if (!was) { sfxCelebrate(); celebrate(); toast('Done!'); } else { toast('Undone'); }
      refreshTopicPct(el.closest('[data-topic-id]'));
    } else {
      const tid = el.dataset.topicId;
      const all = ALL_TOPICS.find(t => t.id === tid);
      if (!all || !all.sub || !all.sub.length) return;
      const allDone = all.sub.every((_, i) => isDone(uid(all.catId, all.secId, all.id, i)));
      const setVal = !allDone;
      for (let i = 0; i < all.sub.length; i++) state.progress[uid(all.catId, all.secId, all.id, i)] = setVal;
      saveState();
      el.classList.toggle('done', setVal);
      el.querySelectorAll('.sub-item').forEach(s => s.classList.toggle('done', setVal));
      haptic(25);
      if (setVal) { sfxCelebrate(); celebrate(); toast('Topic complete!'); } else { toast('Unmarked'); }
      refreshTopicPct(el);
    }
  }
  function swipeLeft(el, isSub) {
    // Section swipe — bookmark all topics inside
    if (el.classList.contains('secg')) {
      const secId = el.dataset.sec;
      if (!secId) return;
      const allTopics = ALL_TOPICS.filter(t => t.secId === secId);
      let anyAdded = false;
      for (const t of allTopics) {
        if (!isBookmarked(t.id)) { state.bookmarks.push(t.id); anyAdded = true; }
      }
      if (!anyAdded) {
        state.bookmarks = state.bookmarks.filter(id => !allTopics.some(t => t.id === id));
        el.querySelectorAll('.bookmark-btn').forEach(b => { b.classList.remove('active'); b.innerHTML = ICONS.bookmark; });
        el.querySelectorAll('.sec-bookmark-btn').forEach(b => { b.classList.remove('active'); b.innerHTML = ICONS.bookmark; });
      } else {
        el.querySelectorAll('.bookmark-btn').forEach(b => { b.classList.add('active'); b.innerHTML = ICONS['bookmark-filled']; });
        el.querySelectorAll('.sec-bookmark-btn').forEach(b => { b.classList.add('active'); b.innerHTML = ICONS['bookmark-filled']; });
      }
      saveState();
      haptic(18);
      toast(anyAdded ? 'Section bookmarked' : 'Section bookmarks removed');
      return;
    }
    if (isSub) {
      const u = el.dataset.uid;
      if (!u) return;
      toggleSubBookmark(u);
      const bm = el.querySelector('.sub-bookmark');
      if (bm) { bm.classList.toggle('active', isSubBookmarked(u)); bm.innerHTML = isSubBookmarked(u) ? ICONS['bookmark-filled'] : ICONS.bookmark; }
      haptic(18);
      toast(isSubBookmarked(u) ? 'Saved' : 'Removed');
    } else {
      const tid = el.dataset.topicId;
      if (!tid) return;
      toggleBookmark(tid);
      const btns = el.querySelectorAll('.bookmark-btn');
      btns.forEach(b => { b.classList.toggle('active'); b.innerHTML = isBookmarked(tid) ? ICONS['bookmark-filled'] : ICONS.bookmark; });
      haptic(18);
      toast(isBookmarked(tid) ? 'Topic saved' : 'Removed');
    }
  }

  function attachGestures(root) {
    let g = null;
    function createUnderlay(el) {
      const r = el.getBoundingClientRect();
      const u = document.createElement('div');
      u.className = 'swipe-underlay';
      u.style.cssText = `top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;`;
      document.body.appendChild(u);
      return u;
    }
    function removeUnderlay(u) { if (u) { u.remove(); } }
    root.addEventListener('touchstart', e => {
      const el = e.target.closest('.sub-item, .topic, .secg');
      if (!el || e.touches.length !== 1) { g = null; return; }
      const isSub = el.classList.contains('sub-item') || el.classList.contains('secg');
      g = { el, isSub, x: e.touches[0].clientX, y: e.touches[0].clientY, moved: false, swiped: false, longPressed: false, lp: null, underlay: null };
      g.lp = setTimeout(() => {
        if (g && !g.moved && !g.swiped) {
          g.longPressed = true;
          if (g.isSub) { toggleRefsPanel(g.el); haptic(12); }
        }
      }, 480);
    }, { passive: true });

    root.addEventListener('touchmove', e => {
      if (!g) return;
      const dx = e.touches[0].clientX - g.x;
      const dy = e.touches[0].clientY - g.y;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) { g.moved = true; if (g.lp) clearTimeout(g.lp); }
      const ratioOk = Math.abs(dx) > Math.abs(dy) * 1.2;
      // Show underlay early (before movement starts) so color/icon are visible immediately
      if (Math.abs(dx) > 12 && ratioOk && !g.underlay) {
        g.underlay = createUnderlay(g.el);
        if (g.lp) clearTimeout(g.lp);
      }
      if (g.underlay && ratioOk) {
        const intensity = Math.min(1, Math.abs(dx) / 60);
        if (dx > 0) {
          g.underlay.className = 'swipe-underlay right';
          g.underlay.innerHTML = '<svg viewBox="0 0 24 24" style="width:20px;height:20px;color:#22c55e;opacity:' + (0.3 + 0.7 * intensity) + '"><path d="M5 13l4 4 10-10" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        } else {
          g.underlay.className = 'swipe-underlay left';
          g.underlay.innerHTML = '<svg viewBox="0 0 24 24" style="width:18px;height:18px;color:#818cf8;opacity:' + (0.3 + 0.7 * intensity) + '"><path d="M6 3h12v18l-6-4-6 4z" fill="none" stroke="#818cf8" stroke-width="2" stroke-linejoin="round"/></svg>';
        }
      }
      if (Math.abs(dx) > 30 && ratioOk) {
        if (g.lp) clearTimeout(g.lp);
        g.swiped = true;
        const off = Math.max(-130, Math.min(130, dx));
        g.el.style.transition = 'none';
        g.el.style.transform = 'translateX(' + off + 'px)';
      }
    }, { passive: true });

    root.addEventListener('touchend', e => {
      if (!g) return;
      if (g.lp) clearTimeout(g.lp);
      const dx = e.changedTouches[0].clientX - g.x;
      const dy = e.changedTouches[0].clientY - g.y;
      const el = g.el;
      el.style.transition = 'transform .25s ease';
      el.style.transform = '';
      removeUnderlay(g.underlay);
      setTimeout(() => { el.style.transition = ''; }, 300);
      if (g.swiped && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 400);
        if (dx > 0) swipeRight(el, g.isSub); else swipeLeft(el, g.isSub);
      } else if (g.longPressed && g.isSub) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 400);
      }
      g = null;
    }, { passive: true });

    root.addEventListener('touchcancel', () => {
      if (g) {
        if (g.lp) clearTimeout(g.lp);
        g.el.style.transition = 'transform .25s ease';
        g.el.style.transform = '';
        removeUnderlay(g.underlay);
        setTimeout(() => { if (g && g.el) g.el.style.transition = ''; }, 300);
        g = null;
      }
    });
  }
  attachGestures($view);
  attachGestures($sheetContent);

  // Search input
  const $searchInput = $('#searchInput');
  const $searchWrap = $('#searchWrap');
  const $topTitle = $('#topTitle');

  let searchTimeout;

  function expandSearch() {
    haptic(10);
    $searchWrap.classList.add('open');
    $topTitle.classList.add('hidden');
    $searchInput.focus();
  }

  function collapseSearch() {
    haptic(10);
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
        haptic(10); sfxNav();
        window.history.back();
        return;
      }
      haptic(10); sfxNav();
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
    haptic(10);
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
    haptic(8);
    $installBanner.hidden = true;
    state.installDismissed = true;
    saveState();
    toast('Install option available in Settings');
  });

  /* ── Browser back button ────────────────────────────────── */
  window.addEventListener('popstate', e => {
    const state = e.state;
    if (!state) {
      showConfirm('Exit Anesthetick?', 'Your progress is saved locally on this device.', null, () => history.pushState({ view: 'home' }, ''), 'Exit', 'Stay');
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
  (function initTimerFromState() {
    if (state.pomodoro) {
      timerMode = state.pomodoro.mode || 'Focus';
      const dur = (timerMode === 'Break' ? state.pomodoro.breakMin : state.pomodoro.focusMin) * 60;
      if (state.pomodoro.running && state.pomodoro.endTs) {
        const rem = Math.round((state.pomodoro.endTs - Date.now()) / 1000);
        if (rem > 0) { timerSeconds = rem; timerRunning = true; }
        else { timerSeconds = dur; state.pomodoro.running = false; state.pomodoro.endTs = 0; }
      } else {
        timerSeconds = dur;
      }
    }
  })();

  navigate('home');
  tryAutoLogin();
})();

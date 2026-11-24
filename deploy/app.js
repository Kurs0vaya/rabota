/* =========================================================
   Мобильный тренажёр «Слепая печать и синтаксис»
   Автономное PWA-приложение. Данные хранятся в localStorage.
   ========================================================= */

'use strict';

/* ---------- Учебные данные ---------- */
const LANGS = {
  python: {
    name: 'Python',
    tokens: {
      1: ['print(', ')', "'hi'", 'x = 10', 'if x > 5:', 'def f():', 'return', 'for i in range(', ']:', '#', 'True', 'None'],
      2: ['def main(', '):', 'import os', 'self.', '__init__', '==', '!=', 'lambda x: x', '[1, 2, 3]', "{'a': 1}", 'try:', 'except', 'with open(', 'yield'],
      3: ['@decorator', 'async def ', 'await ', 'list comprehension', 'isinstance(x, int)', 'f"{x}!"', '**kwargs', '-> None', 'collections.OrderedDict', 'raise ValueError(']
    },
    code: {
      1: ['x = 5 ; y = 10 ; print(x + y)', 'if x > 0: print("ok")', 'for i in range(3): print(i)', 'def sq(n): return n * n'],
      2: ['def fact(n): if n <= 1: return 1 ; return n * fact(n - 1)', 'd = {"a": 1, "b": 2} ; print(d.get("a"))', 'try: x = int(s) except ValueError: x = 0'],
      3: ['@cache def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)', 'with open("data.txt") as f: data = f.read().splitlines()']
    }
  },
  javascript: {
    name: 'JavaScript',
    tokens: {
      1: ['console.log(', ')', 'let x = 1;', 'const y = 2;', 'if (x > 0) {', '}', 'function f() {', 'return true;', '==', '&&'],
      2: ['=>', '===', '!==', 'let arr = [1,2,3];', 'obj.prop', 'arr.map(x => x * 2)', 'new Date()', 'typeof x', 'null', 'undefined'],
      3: ['async function f() {', 'await fetch(url)', 'Promise.all([a, b])', '`text ${x}`', 'export default class A {', '??', '?.', '...args']
    },
    code: {
      1: ['let sum = 0; for (let i = 0; i < 5; i++) { sum += i; }', 'function add(a, b) { return a + b; }'],
      2: ['const f = x => x > 0 ? x : -x; console.log(f(5));', 'let a = [1,2,3]; a.forEach(x => console.log(x));'],
      3: ['async function load() { const r = await fetch(url); return r.json(); }', 'class Point { constructor(x, y) { this.x = x; this.y = y; } }']
    }
  },
  java: {
    name: 'Java',
    tokens: {
      1: ['public class Main {', '}', 'System.out.println(', ');', 'int x = 5;', 'if (x > 0) {', 'return;', 'static void main(', 'String[] args)'],
      2: ['private final ', 'new String(', '==', 'null', 'for (int i = 0; i < n; i++) {', 'List<String> list = new ArrayList<>();', '@Override', 'this.x'],
      3: ['public <T> T get(Class<T> c) {', 'Optional.ofNullable(x).orElse(0)', 'Map<String, Integer> m = new HashMap<>();', 'try (Stream s = files()) {']
    },
    code: {
      1: ['public class Main { public static void main(String[] args) { System.out.println("Hi"); } }', 'int a = 1, b = 2; if (a < b) { a = b; }'],
      2: ['for (int i = 0; i < 10; i++) { if (i % 2 == 0) System.out.println(i); }', 'String s = "test"; if (s.equals("test")) { return true; }'],
      3: ['List<Integer> l = Arrays.asList(1,2,3); l.stream().filter(x -> x > 1).forEach(System.out::println);']
    }
  },
  cpp: {
    name: 'C++',
    tokens: {
      1: ['#include <iostream>', 'int main() {', 'return 0;', 'std::cout <<', '<< std::endl;', 'int x = 5;', 'if (x > 0) {', '}'],
      2: ['std::vector<int> v;', 'for (auto x : v) {', 'const int n = 10;', 'char* s = "abc";', 'new int[5]', 'delete[] p;', '==', '&&'],
      3: ['template <typename T> T max(T a, T b) {', 'std::unique_ptr<int> p(new int(5));', 'auto f = [](int x) { return x * 2; };', 'std::map<std::string, int> m;']
    },
    code: {
      1: ['#include <iostream> int main() { std::cout << "Hi" << std::endl; return 0; }', 'int a = 1; int b = 2; if (a < b) { a = b; }'],
      2: ['for (int i = 0; i < 10; i++) { if (i % 2 == 0) std::cout << i; }', 'std::vector<int> v = {1, 2, 3}; for (auto x : v) { std::cout << x; }'],
      3: ['template <class T> T sq(T x) { return x * x; } int main() { return sq(5); }']
    }
  },
  sql: {
    name: 'SQL',
    tokens: {
      1: ['SELECT * FROM', 'WHERE', 'INSERT INTO', 'VALUES (', ');', 'UPDATE', 'SET', 'DELETE FROM', 'LIMIT 10;'],
      2: ['SELECT id, name FROM users', 'JOIN orders ON', 'GROUP BY', 'ORDER BY', 'DESC', 'COUNT(*)', 'AS', 'IS NOT NULL', 'LIKE \'%a%\''],
      3: ['CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50));', 'SELECT u.name, COUNT(o.id) FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.name;']
    },
    code: {
      1: ['SELECT name FROM users WHERE age > 18;', 'INSERT INTO users (name) VALUES (\'Ann\');'],
      2: ['SELECT u.name FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;'],
      3: ['CREATE TABLE t (id INT PRIMARY KEY, val VARCHAR(20) NOT NULL); SELECT * FROM t ORDER BY id DESC;']
    }
  }
};

const KEY_GROUPS = {
  1: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'asdf', 'jkl;', 'fjkd', 'asl;'],
  2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'qwer', 'tyui', 'poiu', 'zxcv', 'mnbv'],
  3: ['()', '{}', '[]', '<>', '==', '!=', '>=', '<=', '&&', '||', '/*', '*/', '::', '->', '=>', '_, #, $, @, \\, |, ~, `']
};

const LEVELS = { 1: 'Уровень 1', 2: 'Уровень 2', 3: 'Уровень 3' };
const TIMES = [30, 60, 120];

const ACHIEVEMENTS = [
  { id: 'first', icon: '01', name: 'Первый шаг', desc: 'Завершить первое занятие' },
  { id: 'speed50', icon: '02', name: 'Разгон', desc: '50 символов в минуту' },
  { id: 'speed100', icon: '03', name: 'Скорость', desc: '100 символов в минуту' },
  { id: 'acc95', icon: '04', name: 'Точно', desc: 'Точность 95% и выше' },
  { id: 'code10', icon: '05', name: 'Практик', desc: '10 занятий в режиме «Код»' },
  { id: 'syntax20', icon: '06', name: 'Знаток синтаксиса', desc: '20 занятий в режиме «Синтаксис»' },
  { id: 'week', icon: '07', name: 'Неделя подряд', desc: 'Заниматься 7 дней подряд' }
];

/* ---------- Хранилище ---------- */
const KEY = 'blindtype_v1';
const DEFAULT_STATE = {
  sessions: [],
  problemKeys: {},
  achievements: [],
  settings: { lang: 'python', level: 1, time: 60 }
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const s = JSON.parse(raw);
    return Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), s);
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

let state = load();
let session = null;
let timerId = null;

/* ---------- Утилиты ---------- */
const $ = id => document.getElementById(id);
const today = () => new Date().toISOString().slice(0, 10);
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.querySelector('[data-page="' + name + '"]');
  if (nav) nav.classList.add('active');
  if (name === 'stats') renderStats();
  if (name === 'achievements') renderAchievements();
  if (name === 'settings') renderSettings();
  if (name === 'home') renderHome();
}

/* ---------- Генерация задания ---------- */
function buildExercise(mode) {
  const lang = state.settings.lang;
  const lvl = state.settings.level;
  const problems = Object.keys(state.problemKeys).filter(k => state.problemKeys[k] >= 2);
  let text = '';

  if (mode === 'keys') {
    const pool = KEY_GROUPS[lvl].slice();
    if (problems.length) pool.push(...problems.filter(p => p.length <= 4));
    for (let i = 0; i < 30; i++) text += rand(pool) + ' ';
    return text.trim();
  }

  if (mode === 'syntax') {
    const pool = LANGS[lang].tokens[lvl].slice();
    if (problems.length) {
      pool.forEach(p => problems.forEach(k => { if (p.includes(k)) pool.push(p, p); }));
    }
    for (let i = 0; i < 22; i++) text += rand(pool) + ' ';
    return text.trim();
  }

  const pool = LANGS[lang].code[lvl];
  text = rand(pool);
  if (state.settings.time >= 120 && pool.length > 1) text += ' ' + rand(pool);
  return text;
}

/* ---------- Тренировка ---------- */
function startTraining(mode) {
  const expected = buildExercise(mode);
  session = {
    mode, expected, pos: 0, typed: 0, correct: 0, errors: 0,
    started: 0, remaining: state.settings.time, finished: false,
    wrongKeys: {}
  };
  $('trainLang').textContent = LANGS[state.settings.lang].name;
  $('trainLevel').textContent = LEVELS[state.settings.level];
  $('hudWpm').textContent = '0';
  $('hudAcc').textContent = '100%';
  $('hudTime').textContent = session.remaining;
  $('hintLine').textContent = '';
  $('keyboardTip').textContent = 'Начните печатать — таймер запустится сам';
  $('typeInput').value = '';
  $('typeInput').disabled = false;
  renderText();
  showPage('train');
  setTimeout(() => $('typeInput').focus(), 100);
}

function renderText() {
  const view = $('textView');
  view.innerHTML = '';
  const exp = session.expected;
  for (let i = 0; i < exp.length; i++) {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = exp[i];
    if (i < session.pos) span.classList.add(session.lastWrong && session.lastWrongIndex === i ? 'wrong' : 'done');
    else if (i === session.pos) span.classList.add('cur');
    view.appendChild(span);
  }
  const cur = view.querySelector('.cur');
  if (cur) {
    const box = $('textCard').getBoundingClientRect();
    const r = cur.getBoundingClientRect();
    if (r.bottom > box.bottom - 10 || r.top < box.top + 10) {
      cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

function onInput(e) {
  if (!session || session.finished) return;
  const val = e.target.value;
  if (!session.started) {
    session.started = Date.now();
    timerId = setInterval(tick, 1000);
    $('keyboardTip').textContent = 'Не смотрите на клавиатуру';
  }
  const exp = session.expected;
  session.pos = Math.min(val.length, exp.length);
  session.typed = val.length;

  let correct = 0;
  for (let i = 0; i < session.pos; i++) {
    if (val[i] === exp[i]) correct++;
    else { session.wrongKeys[exp[i]] = (session.wrongKeys[exp[i]] || 0) + 1; }
  }
  session.correct = correct;
  session.errors = session.pos - correct;
  session.lastWrong = session.errors > 0;
  session.lastWrongIndex = session.errors > 0 ? val.length - 1 : -1;

  updateHud();
  renderText();

  if (session.pos >= exp.length) finish('done');
}

function tick() {
  if (!session || session.finished) return;
  session.remaining--;
  $('hudTime').textContent = Math.max(0, session.remaining);
  updateHud();
  if (session.remaining <= 0) finish('time');
}

function updateHud() {
  const mins = Math.max((Date.now() - session.started) / 60000, 1 / 60);
  const wpm = Math.round(session.correct / mins);
  const acc = session.typed ? Math.round(session.correct / session.typed * 100) : 100;
  $('hudWpm').textContent = isFinite(wpm) ? wpm : 0;
  $('hudAcc').textContent = acc + '%';
}

function finish(reason) {
  if (session.finished) return;
  session.finished = true;
  clearInterval(timerId);
  $('typeInput').disabled = true;

  const elapsed = Math.max((Date.now() - session.started) / 1000, 1);
  const wpm = Math.round(session.correct / (elapsed / 60));
  const acc = session.typed ? Math.round(session.correct / session.typed * 100) : 0;

  const rec = {
    date: today(), wpm: isFinite(wpm) ? wpm : 0, acc,
    mode: session.mode, lang: state.settings.lang,
    level: state.settings.level, seconds: Math.round(elapsed)
  };
  state.sessions.push(rec);

  Object.entries(session.wrongKeys).forEach(([k, v]) => {
    state.problemKeys[k] = (state.problemKeys[k] || 0) + v;
  });

  const newAch = checkAchievements(rec);
  save();

  $('resWpm').textContent = rec.wpm;
  $('resAcc').textContent = rec.acc + '%';
  $('resTime').textContent = rec.seconds;
  $('resultMark').textContent = acc >= 95 ? '> ОТЛИЧНО' : (wpm >= 50 ? '> ХОРОШО' : '> ГОТОВО');
  $('resultNote').textContent = newAch.length
    ? 'Новое достижение: ' + newAch.map(a => a.name).join(', ')
    : (reason === 'time' ? 'Время вышло. Продолжайте тренироваться!' : 'Отличная работа!');
  $('resultModal').classList.add('show');
}

function checkAchievements(rec) {
  const got = [];
  const has = id => state.achievements.includes(id);
  const add = id => { if (!has(id)) { state.achievements.push(id); got.push(ACHIEVEMENTS.find(a => a.id === id)); } };

  if (state.sessions.length >= 1) add('first');
  if (rec.wpm >= 50) add('speed50');
  if (rec.wpm >= 100) add('speed100');
  if (rec.acc >= 95) add('acc95');
  if (state.sessions.filter(s => s.mode === 'code').length >= 10) add('code10');
  if (state.sessions.filter(s => s.mode === 'syntax').length >= 20) add('syntax20');
  if (calcStreak() >= 7) add('week');
  return got;
}

function calcStreak() {
  const days = [...new Set(state.sessions.map(s => s.date))].sort().reverse();
  if (!days.length) return 0;
  let d = new Date(days[0] + 'T00:00:00'), n = 0;
  const cur = new Date(today() + 'T00:00:00');
  if ((cur - d) / 86400000 > 1) return 0;
  for (const day of days) {
    const x = new Date(day + 'T00:00:00');
    if ((d - x) / 86400000 > 1) break;
    n++; d = x;
  }
  return n;
}

/* ---------- Экраны ---------- */
function renderHome() {
  const todaySessions = state.sessions.filter(s => s.date === today());
  const minutes = Math.round(todaySessions.reduce((a, s) => a + s.seconds, 0) / 60);
  $('goalNow').textContent = minutes;
  $('goalBar').style.width = Math.min(100, minutes / 5 * 100) + '%';
  $('streakValue').textContent = calcStreak();

  const last = state.sessions.slice(-1)[0];
  $('homeWpm').textContent = last ? last.wpm : 0;
  $('homeAcc').textContent = last ? last.acc + '%' : '0%';
  $('homeSessions').textContent = state.sessions.length;
}

function renderStats() {
  const data = state.sessions.slice(-10).map(s => s.wpm);
  const c = $('chart'), ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  if (!data.length) {
    ctx.fillStyle = '#78838f'; ctx.font = '18px Arial'; ctx.textAlign = 'center';
    ctx.fillText('Нет данных', c.width / 2, c.height / 2);
    return;
  }
  const max = Math.max(...data, 10) * 1.2;
  const bw = c.width / data.length;
  data.forEach((v, i) => {
    const h = (v / max) * (c.height - 40);
    ctx.fillStyle = '#2f7de1';
    ctx.fillRect(i * bw + 8, c.height - 25 - h, bw - 16, h);
    ctx.fillStyle = '#1b2430'; ctx.font = '14px Arial'; ctx.textAlign = 'center';
    ctx.fillText(v, i * bw + bw / 2, c.height - 32 - h);
    ctx.fillStyle = '#78838f'; ctx.font = '12px Arial';
    ctx.fillText(i + 1, i * bw + bw / 2, c.height - 6);
  });

  const box = $('problemKeys');
  const keys = Object.entries(state.problemKeys).filter(([, v]) => v >= 2)
    .sort((a, b) => b[1] - a[1]).slice(0, 12);
  box.innerHTML = '';
  if (!keys.length) { box.textContent = 'Пока нет данных — потренируйтесь'; return; }
  keys.forEach(([k, v]) => {
    const el = document.createElement('span');
    el.className = 'chip';
    el.textContent = k === ' ' ? 'пробел · ' + v : k + ' · ' + v;
    box.appendChild(el);
  });
}

function renderAchievements() {
  const box = $('achievementList');
  box.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const unlocked = state.achievements.includes(a.id);
    const el = document.createElement('div');
    el.className = 'ach' + (unlocked ? '' : ' locked');
    el.innerHTML = '<div class="ach-icon">' + a.icon + '</div><div><b>' + a.name + '</b><small>' + a.desc + '</small></div>';
    box.appendChild(el);
  });
}

function renderSettings() {
  function fill(container, items, current, onPick) {
    container.innerHTML = '';
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'opt' + (it.value === current ? ' sel' : '');
      b.textContent = it.label;
      b.onclick = () => { onPick(it.value); save(); renderSettings(); };
      container.appendChild(b);
    });
  }
  fill($('langOptions'), Object.entries(LANGS).map(([k, v]) => ({ value: k, label: v.name })),
    state.settings.lang, v => state.settings.lang = v);
  fill($('levelOptions'), Object.entries(LEVELS).map(([k, v]) => ({ value: +k, label: v })),
    state.settings.level, v => state.settings.level = v);
  fill($('timeOptions'), TIMES.map(t => ({ value: t, label: t + ' сек' })),
    state.settings.time, v => state.settings.time = v);
}

/* ---------- События ---------- */
document.querySelectorAll('.nav-item').forEach(b => b.onclick = () => showPage(b.dataset.page));
document.querySelectorAll('.mode-btn').forEach(b => b.onclick = () => startTraining(b.dataset.mode));
$('btnBack').onclick = () => { clearInterval(timerId); if (session) session.finished = true; showPage('home'); };
$('btnRestart').onclick = () => startTraining(session ? session.mode : 'syntax');
$('btnSkip').onclick = () => startTraining(session ? session.mode : 'syntax');
$('btnResultOk').onclick = () => { $('resultModal').classList.remove('show'); showPage('home'); };
$('typeInput').addEventListener('input', onInput);
$('btnReset').onclick = () => {
  if (!confirm('Очистить всю статистику?')) return;
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  save(); renderStats(); renderHome();
};

/* ---------- Регистрация Service Worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

renderHome();

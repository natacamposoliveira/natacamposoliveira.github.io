/* Natã Campos de Oliveira · portfólio · interações */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger, SplitText);

/* rolagem suave + âncoras */
let lenis = null;
if (hasG && !reduce && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: .11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return;
  e.preventDefault(); document.body.classList.remove('menu'); $('.nav')?.classList.remove('menu');
  lenis ? lenis.scrollTo(t, { offset: -70 }) : t.scrollIntoView({ behavior: 'smooth' });
}));

/* barra de progresso + menu */
const nav = $('.nav'), prog = $('.progress');
const onScroll = () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  if (prog) prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  nav?.classList.toggle('solid', y > 40);
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
$('.burger')?.addEventListener('click', () => { nav.classList.toggle('menu'); $('.burger').setAttribute('aria-expanded', nav.classList.contains('menu')); });
const secs = $$('section[id]'), links = $$('.nav ul a');
if (hasG) secs.forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%',
  onToggle: st => st.isActive && links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + s.id)) }));

/* textos que entram */
document.fonts.ready.then(() => {
  if (!hasG || reduce) return;
  $$('[data-split]').forEach(el => {
    const st = new SplitText(el, { type: 'words', mask: 'words' });
    gsap.from(st.words, { yPercent: 110, duration: 1, stagger: .05, ease: 'expo.out',
      scrollTrigger: el.dataset.split === 'now' ? null : { trigger: el, start: 'top 85%' } });
  });
  $$('[data-rise]').forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: .9, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 88%' } }));
  initRoute();
});

/* ---------- ESTEIRA ---------- */
const iso = $('#iso');
if (iso) {
  const tip = $('#tip'), boxes = $$('.box', iso);
  const span = 920 + 170, gap = span / boxes.length;
  let tl = null;
  if (hasG) {
    boxes.forEach((b, i) => gsap.set(b, { x: -170 + i * gap }));
    tl = gsap.timeline({ repeat: -1 });
    tl.to(boxes, { x: '+=' + span, duration: reduce ? 9999 : 26, ease: 'none',
      modifiers: { x: gsap.utils.unitize(x => ((parseFloat(x) + 170) % span) - 170) } });
  } else boxes.forEach((b, i) => b.style.transform = `translateX(${i * gap - 170}px)`);
  const show = b => {
    boxes.forEach(o => o.classList.toggle('on', o === b));
    $('b', tip).textContent = b.dataset.t; $('span', tip).textContent = b.dataset.d;
    const a = $('a', tip); a.href = '#casos'; a.dataset.filter = b.dataset.f || 'todos';
    tip.classList.add('show');
  };
  boxes.forEach(b => {
    b.addEventListener('pointerenter', () => { tl && gsap.to(tl, { timeScale: .12, duration: .4 }); show(b); });
    b.addEventListener('pointerleave', () => { tl && gsap.to(tl, { timeScale: 1, duration: .6 }); });
    b.addEventListener('click', () => show(b));
    b.addEventListener('focus', () => show(b));
  });
  $('a', tip).addEventListener('click', e => filterCases(e.currentTarget.dataset.filter));
  $('.scene').addEventListener('pointerleave', () => { tip.classList.remove('show'); boxes.forEach(o => o.classList.remove('on')); });
}

/* ---------- RADAR DA CADEIA ---------- */
const radar = $('#radar');
if (radar) {
  const elos = $$('.elo', radar), cv = $('canvas', radar), cx = cv.getContext('2d'), panel = $('#elo-panel');
  let C = 0, R = 0, hot = 0, parts = [];
  const layout = () => {
    const w = radar.clientWidth; cv.width = w * devicePixelRatio; cv.height = w * devicePixelRatio; C = w / 2; R = w * .41;
    elos.forEach((e, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / elos.length;
      e._x = C + Math.cos(a) * R; e._y = C + Math.sin(a) * R;
      e.style.transform = `translate(${e._x - e.offsetWidth / 2}px,${e._y - e.offsetHeight / 2}px)`; });
    parts = Array.from({ length: 46 }, (_, k) => ({ i: k % elos.length, t: Math.random(), s: .0025 + Math.random() * .004, hub: Math.random() < .4 }));
  };
  const pick = i => {
    hot = i; elos.forEach((e, j) => e.classList.toggle('on', j === i));
    const tpl = $('#elo-' + i); if (tpl && panel) { panel.innerHTML = tpl.innerHTML; hasG && gsap.fromTo(panel.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: .05, duration: .4 }); }
  };
  elos.forEach((e, i) => { e.addEventListener('click', () => pick(i)); e.addEventListener('pointerenter', () => pick(i)); });
  const frame = () => {
    const d = devicePixelRatio; cx.clearRect(0, 0, cv.width, cv.height);
    elos.forEach((a, i) => { const b = elos[(i + 1) % elos.length];
      cx.strokeStyle = (i === hot) ? 'rgba(255,95,31,.9)' : 'rgba(34,48,63,.22)'; cx.lineWidth = 3 * d;
      cx.beginPath(); cx.moveTo(a._x * d, a._y * d); cx.lineTo(b._x * d, b._y * d); cx.stroke();
      cx.setLineDash([5 * d, 9 * d]); cx.lineWidth = 2 * d; cx.strokeStyle = i === hot ? 'rgba(255,95,31,.7)' : 'rgba(34,48,63,.12)';
      cx.beginPath(); cx.moveTo(C * d, C * d); cx.lineTo(a._x * d, a._y * d); cx.stroke(); cx.setLineDash([]); });
    parts.forEach(p => { p.t += reduce ? 0 : p.s; if (p.t > 1) { p.t = 0; p.i = (p.i + 1) % elos.length; }
      const a = elos[p.i], b = elos[(p.i + 1) % elos.length]; let x, y;
      if (p.hub) { x = C + (a._x - C) * p.t; y = C + (a._y - C) * p.t; } else { x = a._x + (b._x - a._x) * p.t; y = a._y + (b._y - a._y) * p.t; }
      const s = 7 * d; cx.fillStyle = p.hub ? '#FF5F1F' : '#B98C5A'; cx.fillRect(x * d - s / 2, y * d - s / 2, s, s); });
    requestAnimationFrame(frame);
  };
  document.fonts.ready.then(() => { layout(); pick(0); frame(); });
  addEventListener('resize', layout);
}

/* ---------- ROTA DO CAMINHÃO ---------- */
function initRoute() {
  const route = $('#rota'); if (!route) return;
  const stops = $('#stops'), road = $('#road'), truck = $('#truck'), all = $$('.stop', stops);
  const mob = innerWidth < 700, step = mob ? 280 : 350, start = innerWidth * (mob ? .55 : .42);
  all.forEach((s, i) => s.style.left = (start + i * step) + 'px');
  const total = start + all.length * step + 160; road.style.width = stops.style.width = total + 'px';
  const dist = total - innerWidth, t0 = innerWidth * (mob ? .08 : .18), t1 = innerWidth * (mob ? .3 : .42);
  const light = p => { const tx = t0 + (t1 - t0) * p + 100; all.forEach((s, i) => s.classList.toggle('lit', start + i * step - dist * p <= tx)); };
  if (!hasG || reduce) { light(1); return; }
  gsap.set(truck, { x: t0 });
  gsap.timeline({ scrollTrigger: { trigger: route, pin: true, scrub: 1, end: () => '+=' + (dist + innerWidth * .3), invalidateOnRefresh: true, onUpdate: s => light(s.progress) } })
    .to([road, stops], { x: -dist, ease: 'none' }, 0)
    .to(truck, { x: t1, ease: 'none' }, 0)
    .to('#truck .wheel', { rotation: 360 * 14, ease: 'none' }, 0);
  light(0);
}

/* painel lateral com o detalhe da parada */
const drawer = $('#drawer');
if (drawer) {
  const body = $('.body', drawer); let last = null;
  const open = id => { const tpl = $('#' + id); if (!tpl) return; body.innerHTML = tpl.innerHTML; drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); lenis?.stop(); $('.close', drawer).focus(); };
  const close = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); lenis?.start(); last?.focus(); };
  $$('[data-open]').forEach(b => b.addEventListener('click', () => { last = b; open(b.dataset.open); }));
  $('.close', drawer).addEventListener('click', close); $('.shade', drawer).addEventListener('click', close);
  addEventListener('keydown', e => e.key === 'Escape' && drawer.classList.contains('open') && close());
  drawer.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (a) close(); });
}

/* ---------- CASOS: filtro + porta que sobe ---------- */
function filterCases(f) {
  $$('.filters button').forEach(b => b.classList.toggle('on', b.dataset.f === f));
  $$('.case').forEach(c => c.classList.toggle('hide', f !== 'todos' && !(c.dataset.tags || '').split(' ').includes(f)));
  hasG && gsap.fromTo('.case:not(.hide)', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .5 });
  hasG && ScrollTrigger.refresh();
}
$$('.filters button').forEach(b => b.addEventListener('click', () => filterCases(b.dataset.f)));
if (hasG) $$('.case .door').forEach(d => gsap.to(d, { yPercent: -101, ease: 'power2.inOut', scrollTrigger: { trigger: d.parentElement, start: 'top 80%', end: 'top 45%', scrub: reduce ? false : 1 } }));
else $$('.case .door').forEach(d => d.remove());

/* contadores */
$$('[data-count]').forEach(el => {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
  const fmt = v => pre + v.toFixed(dec).replace('.', ',') + suf;
  if (!hasG || reduce) { el.textContent = fmt(to); return; }
  const o = { v: 0 }; el.textContent = fmt(0);
  ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = fmt(o.v) }) });
});

/* passos e cartões que abrem */
$$('.step, .kp').forEach(s => { const t = () => { s.classList.toggle('open'); s.setAttribute('aria-expanded', s.classList.contains('open')); setTimeout(() => hasG && ScrollTrigger.refresh(), 500); };
  s.addEventListener('click', t); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } }); });

/* ---------- SIMULADOR DO IQF ---------- */
const sim = $('#sim');
if (sim) {
  const ins = $$('input', sim), v = $('.v', sim), bar = $('.bar i', sim), c = $('.c', sim);
  const calc = () => {
    let t = 0; ins.forEach(i => { t += i.value * i.dataset.w; i.closest('.lv').querySelector('output').textContent = (+i.value).toFixed(1).replace('.', ',') + '%'; });
    v.textContent = t.toFixed(2).replace('.', ',') + '%'; bar.style.width = t + '%';
    const k = t >= 85 ? ['Ótimo fornecedor: manter e ampliar a parceria', 'var(--ok)'] : t >= 70 ? ['Fornecedor regular: acompanhar com plano de melhoria', 'var(--warn)'] : ['Fornecedor crítico: ação corretiva imediata', 'var(--orange)'];
    bar.style.background = k[1]; c.textContent = k[0]; c.style.color = k[1];
  };
  ins.forEach(i => i.addEventListener('input', calc));
  $('.reset', sim)?.addEventListener('click', () => { ins.forEach(i => i.value = i.defaultValue); calc(); });
  calc();
}
})();

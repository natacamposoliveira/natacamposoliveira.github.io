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

function navSpy() { if (!hasG) return;
  secs.forEach(s => { const t = s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s;
    ScrollTrigger.create({ trigger: t, start: 'top 50%', end: 'bottom 50%', onToggle: st => st.isActive && links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + s.id)) }); });
  ScrollTrigger.refresh(); }

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
  initRoute(); navSpy();
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
  const world = $('#world'), truck = $('#truck'), places = $$('.place', world), lanes = $$('.road, .walk', world);
  let tl = null;
  const build = () => {
    tl && tl.scrollTrigger && tl.scrollTrigger.kill(); tl && tl.kill();
    const u = Math.min(innerHeight / 100, innerWidth * (innerWidth < 700 ? .022 : .013));
    const step = u * 30, start = Math.max(innerWidth * .5, u * 60), tw = u * 12;
    // a rota termina no último lugar, seja trabalho ou projeto; novos lugares estendem a rota sozinhos
    const lastI = Math.max(...places.map(p => +p.dataset.i));
    places.forEach(p => p.style.left = (start + +p.dataset.i * step) + 'px');
    const total = start + lastI * step + innerWidth * .25;
    lanes.forEach(l => l.style.width = total + 'px'); world.style.width = total + 'px';
    const dist = Math.max(0, total - innerWidth), lastX = start + lastI * step - dist;
    const t0 = innerWidth * .08, t1 = Math.max(t0, lastX - tw * .5);
    // acende cada lugar quando a frente do caminhão passa por ele
    const light = p => { const front = t0 + (t1 - t0) * p + tw * .9; places.forEach(pl => pl.classList.toggle('lit', start + +pl.dataset.i * step - dist * p <= front)); };
    if (!hasG || reduce) { light(1); return; }
    gsap.set(world, { x: 0 }); gsap.set(truck, { x: t0 });
    const drive = 1, park = .25; // percurso inteiro e depois uma pausa com o caminhão estacionado no fim
    tl = gsap.timeline({ scrollTrigger: { trigger: route, pin: true, scrub: 1, end: () => '+=' + Math.max(innerHeight * 1.2, (dist + t1 - t0) * 1.25),
        onUpdate: s => light(Math.min(1, s.progress * (drive + park) / drive)) } })
      .to(world, { x: -dist, ease: 'none', duration: drive }, 0)
      .to(truck, { x: t1, ease: 'none', duration: drive }, 0)
      .to('#truck .wheel', { rotation: 360 * 14, ease: 'none', duration: drive }, 0)
      .to({}, { duration: park });
    light(0);
  };
  build(); ScrollTrigger.refresh();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 250); });
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

/* Consulting Hub: mapa das frentes */
(() => {
  const nodes = document.querySelectorAll('.hm-node'), panel = document.getElementById('hmPanel');
  if (!nodes.length || !panel) return;
  const show = n => {
    nodes.forEach(x => { x.classList.toggle('on', x === n); x.setAttribute('aria-pressed', x === n); });
    panel.innerHTML = document.getElementById('hm-' + n.dataset.hm).innerHTML;
    if (window.gsap) gsap.fromTo(panel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' });
  };
  nodes.forEach(n => n.addEventListener('click', () => show(n)));
  show(nodes[0]);
})();

/* ---------- SAÚDE DO ESTOQUE: planilha ilustrativa ---------- */
(() => {
  const box = document.querySelector('.esa'); if (!box) return;
  const run = document.getElementById('esaRun'), why = document.getElementById('esaWhy');
  const rows = [...box.querySelectorAll('.esa-row')];
  rows.forEach((r, k) => r.querySelector('.res').style.setProperty('--k', k));
  const classify = () => { if (box.classList.contains('done')) return; box.classList.add('done'); run.textContent = 'Classificado'; run.disabled = true; why.innerHTML = '<p>Pronto. Toque num produto para ver por que ele ficou nesse nível.</p>'; };
  run.addEventListener('click', classify);
  rows.forEach(r => r.addEventListener('click', () => {
    classify();
    rows.forEach(x => x.classList.toggle('on', x === r));
    why.innerHTML = document.getElementById(r.dataset.r).innerHTML;
    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(why, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 });
  }));
})();

/* ---------- REFORMULAÇÃO DE COMPRAS: blueprint ---------- */
(() => {
  const why = document.getElementById('bpWhy'); if (!why) return;
  const hots = [...document.querySelectorAll('.bp-hot')];
  const show = h => { hots.forEach(x => x.classList.toggle('on', x === h)); why.innerHTML = document.getElementById(h.dataset.h).innerHTML;
    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(why, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 }); };
  hots.forEach(h => { h.addEventListener('click', () => show(h)); h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(h); } }); });
})();

/* ---------- SIMULADOR DE PRECIFICAÇÃO (reforma tributária) ----------
   Fórmulas idênticas à planilha Simulador_Precificacao_Tributaria_3.0 (conferidas centavo por centavo). */
(() => {
  const root = document.getElementById('tx'); if (!root) return;
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  function cronograma(y, P) {
    const r = P.cbsRef, i = P.ibsRef;
    if (y === 2026) return { cbs: .009, ibs: .001, fI: 1, pis: 1, efe: 0, sit: 'Ano de testes: CBS/IBS compensados, sem efeito no preço' };
    if (y === 2027 || y === 2028) return { cbs: r - .001, ibs: .001, fI: 1, pis: 0, efe: 1, sit: 'CBS em vigor; PIS/COFINS extintos' };
    if (y >= 2029 && y <= 2032) { const k = y - 2028; return { cbs: r, ibs: i * k / 10, fI: 1 - k / 10, pis: 0, efe: 1, sit: `Transição: ICMS a ${100 - 10 * k}% da alíquota` }; }
    return { cbs: r, ibs: i, fI: 0, pis: 0, efe: 1, sit: 'Modelo pleno: ICMS e ISS extintos' };
  }
  function calcular(I, y, P, base) {
    const c = cronograma(y, P), t = c.cbs + c.ibs;
    const vl = I.custo * (1 - I.icmsC) * (1 - I.pisC);
    const nf = I.repassa ? vl / ((1 - I.icmsC * c.fI) * (1 - I.pisC * c.pis)) : I.custo;
    const icd = nf * I.icmsC * c.fI, icc = I.credIcms ? icd : 0;
    const pcd = (nf - icd) * I.pisC * c.pis, pcc = I.credPis ? pcd : 0;
    const ibb = nf - icd - pcd, ibp = ibb * t * (1 - I.redC) * c.efe, ibc = I.credIbs ? ibp : 0;
    const cl = nf - icc - pcc + (ibp - ibc);
    const pie = I.icmsV * c.fI, ppe = I.pisV * (1 - pie) * c.pis, soma = pie + ppe + I.desp + I.margem, den = 1 - soma;
    const ok = den > 0, pv = ok ? cl / den : 0;
    const icv = pv * pie, pcv = (pv - icv) * I.pisV * c.pis, ibvb = pv - icv - pcv, ibv = ibvb * t * (1 - I.redV) * c.efe;
    const tot = pv + ibv, carga = tot > 0 ? (icv + pcv + ibv) / tot : 0;
    const aic = pv > 0 ? icv - icc : 0, apc = pv > 0 ? pcv - pcc : 0, aib = pv > 0 ? ibv - ibc : 0;
    const rl = pv - icv - pcv, cmv = pv > 0 ? cl : 0, lb = rl - cmv, dop = pv * I.desp, res = lb - dop;
    const mob = pv > 0 ? res / pv : 0, irc = Math.max(0, res) * I.ir, ll = res - irc, mll = pv > 0 ? ll / pv : 0;
    const d2 = 1 - pie - ppe - I.desp, baseOk = !base || base.ok, resBase = base ? base.res : res;
    const peq = d2 > 0 && baseOk ? (cl + resBase) / d2 : 0;
    const teq = peq + (peq - peq * pie - (peq - peq * pie) * I.pisV * c.pis) * t * (1 - I.redV) * c.efe;
    const vtot = base && base.tot > 0 && ok ? tot / base.tot - 1 : 0;
    return { y, ...c, t, vl, nf, icd, icc, pcd, pcc, ibb, ibp, ibc, cl, pie, ppe, soma, den, ok, pv, icv, pcv, ibvb, ibv, tot, carga, aic, apc, aib, atot: aic + apc + aib, rl, cmv, lb, dop, res, mob, irc, ll, mll, peq, teq, vtot };
  }
  const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const BRL = v => (v < 0 ? '−' : '') + 'R$ ' + nf2.format(Math.abs(v));
  const N = (v, d = 2) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const PCT = (v, d = 2) => N(v * 100, d) + '%';
  const P3 = v => PCT(v, 3).replace(/(,\d*?[1-9])0+%$/, '$1%').replace(/,0+%$/, '%');
  const parseBR = s => { s = String(s).trim().replace(/\s|R\$|%/g, ''); if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.'); const n = parseFloat(s); return isFinite(n) ? n : NaN; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PRESETS = {
    real: { produto: 'Liquidificador 2 velocidades', custo: 200, icmsC: .18, credIcms: 1, pisC: .0925, credPis: 1, credIbs: 1, redC: 0, repassa: 1, margem: .25, desp: .10, icmsV: .18, pisV: .0925, redV: 0, ir: .34 },
    presumido: { credPis: 0, pisV: .0365 }, semcred: { credIcms: 0, credPis: 0, credIbs: 0 }, reduzida: { redC: .6, redV: .6 },
  };
  const DEF = { I: { ...PRESETS.real }, P: { cbsRef: .113, ibsRef: .187 }, anos: [2026, 2027, 2030, 2033], mem: 0, preset: 'real' };
  const KEY = 'portfolioSimPrec';
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.I && v.P && v.anos ? v : null; } catch (e) { return null; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sem armazenamento: segue sem salvar */ } };
  let S = load() || JSON.parse(JSON.stringify(DEF));

  const NUMS = ['custo', 'icmsC', 'pisC', 'redC', 'margem', 'desp', 'icmsV', 'pisV', 'redV', 'ir'];
  function fillForm() {
    $('#produto').value = S.I.produto || '';
    NUMS.forEach(k => { const el = $('#' + k); el.value = el.dataset.kind === 'pct' ? N(S.I[k] * 100, S.I[k] * 100 % 1 ? 2 : 0) : N(S.I[k]); });
    ['cbsRef', 'ibsRef'].forEach(k => { $('#' + k).value = N(S.P[k] * 100, 1); });
    $$('[data-bool]').forEach(g => $$('button', g).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.v === S.I[g.dataset.bool]))));
    $$('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === S.preset)));
  }
  const readNum = el => { let v = parseBR(el.value); if (!isFinite(v)) return null; return el.dataset.kind === 'pct' ? v / 100 : v; };
  $('#txForm').addEventListener('submit', e => e.preventDefault());
  NUMS.forEach(k => {
    const el = $('#' + k);
    el.addEventListener('input', () => { const v = readNum(el); const bad = v === null || v < 0 || (el.dataset.kind === 'pct' && v > 1); el.closest('.tx-box').classList.toggle('bad', bad); if (bad) return; S.I[k] = v; S.preset = null; update(); });
    el.addEventListener('blur', () => { el.closest('.tx-box').classList.remove('bad'); fillForm(); });
  });
  ['cbsRef', 'ibsRef'].forEach(k => $('#' + k).addEventListener('input', e => { const v = readNum(e.target); if (v === null || v < 0 || v > 1) return; S.P[k] = v; update(); }));
  $('#produto').addEventListener('input', e => { S.I.produto = e.target.value; save(); });
  $$('[data-bool]').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.I[g.dataset.bool] = +b.dataset.v; S.preset = null; fillForm(); update(); }));
  $$('[data-preset]').forEach(b => b.addEventListener('click', () => { const p = b.dataset.preset; S.I = { ...PRESETS.real, ...(p === 'real' ? {} : PRESETS[p]), produto: S.I.produto }; S.preset = p; fillForm(); update(); }));
  $('#txReset').addEventListener('click', () => { S = JSON.parse(JSON.stringify(DEF)); fillForm(); update(); });

  const ANOS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
  const COMP = [['cl', 'Custo líquido', 'c1'], ['icv', 'ICMS', 'c2'], ['pcv', 'PIS/COFINS', 'c3'], ['dop', 'Despesas', 'c4'], ['res', 'Margem (resultado)', 'c5'], ['ibv', 'IBS/CBS por fora', 'c6']];
  const compute = () => { const b = calcular(S.I, S.anos[0], S.P); return S.anos.map(y => calcular(S.I, y, S.P, b)); };

  /* ---- animação: só transform/opacity, números com contagem, respeita reduced-motion ---- */
  const ease = t => 1 - Math.pow(1 - t, 3);
  function tween(el, to, fmt, ms = 520) {
    const from = el._v ?? to; el._v = to;
    if (reduce || !isFinite(from) || Math.abs(from - to) < 0.005) { el.textContent = fmt(to); return; }
    cancelAnimationFrame(el._raf); const t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / ms); el.textContent = fmt(from + (to - from) * ease(k)); if (k < 1) el._raf = requestAnimationFrame(step); };
    el._raf = requestAnimationFrame(step);
    if (el.animate) el.animate([{ color: '#FF5F1F' }, { color: '' }], { duration: 700, easing: 'ease-out' });
  }
  const pop = el => { if (!reduce && el.animate) el.animate([{ transform: 'scale(.82)', opacity: .4 }, { transform: 'scale(1.06)', opacity: 1, offset: .6 }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }); };
  const flip = el => { if (!reduce && el.animate) el.animate([{ transform: 'perspective(700px) rotateX(-70deg)', opacity: .3 }, { transform: 'perspective(700px) rotateX(0)', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' }); };
  const KV = [['pv', 'Preço de venda'], ['ibv', '+ IBS/CBS por fora'], ['cl', 'Custo líquido'], ['res', 'Resultado antes do IR', 'st'], ['ll', 'Lucro líquido estimado'], ['teq', 'Total p/ manter o resultado']];
  function buildScen() {
    $('#txScen').innerHTML = S.anos.map((y, i) => `
      <article class="tx-sc" data-i="${i}" aria-label="Cenário ${i + 1}">
        <div class="tx-sct"><span>Cenário ${i + 1}</span><select aria-label="Ano do cenário ${i + 1}">${ANOS.map(a => `<option>${a}</option>`).join('')}</select></div>
        <p class="tx-sit"></p>
        <div class="tx-okb"><p class="tx-lbl">Total pago pelo cliente</p><p class="tx-tot">—</p><span class="tx-delta"></span>
          <dl class="tx-kv">${KV.map(([k, l, c]) => `<dt class="${c || ''}">${l}</dt><dd class="${c || ''}" data-k="${k}">—</dd>`).join('')}</dl></div>
        <p class="tx-err" hidden></p>
        <button class="tx-see" type="button">Ver memória de cálculo</button>
      </article>`).join('');
    $$('.tx-sc').forEach(card => {
      const i = +card.dataset.i;
      $('select', card).addEventListener('change', e => { S.anos[i] = +e.target.value; flip(card); update(); });
      $('.tx-see', card).addEventListener('click', () => { S.mem = i; update(true); $('#txSteps').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); });
    });
  }
  function renderScen(R) {
    R.forEach((r, i) => {
      const card = $(`.tx-sc[data-i="${i}"]`); card.classList.toggle('on', i === S.mem);
      $('select', card).value = String(r.y); $('.tx-sit', card).textContent = r.sit;
      $('.tx-okb', card).hidden = !r.ok; const err = $('.tx-err', card); err.hidden = r.ok;
      if (!r.ok) { err.textContent = `Margem + tributos + despesas = ${PCT(r.soma, 1)}. A soma precisa ficar abaixo de 100%.`; $('.tx-tot', card)._v = undefined; return; }
      tween($('.tx-tot', card), r.tot, BRL, 650);
      const d = $('.tx-delta', card), txt = i ? `${r.vtot > 0 ? '+' : ''}${PCT(r.vtot, 1)} vs. cenário 1` : 'referência', cls = 'tx-delta' + (i ? (r.vtot <= 0 ? ' dn' : ' up') : '');
      if (d.textContent !== txt) { d.textContent = txt; d.className = cls; pop(d); }
      KV.forEach(([k]) => {
        const el = $(`dd[data-k="${k}"]`, card);
        if (k === 'teq') { const show = i > 0; el.hidden = !show; el.previousElementSibling.hidden = !show; if (!show) return; if (!r.peq) { el.textContent = '—'; el._v = undefined; return; } }
        tween(el, r[k], BRL);
      });
    });
  }
  function renderAlerts(R) {
    const bad = R.filter(r => !r.ok).length, base = R[0]; let h = '';
    if (bad) h += `<p class="tx-alert bad"><b>${bad} cenário${bad > 1 ? 's' : ''} sem preço.</b> A soma de margem, despesas e tributos dentro do preço chegou a 100% ou mais. Reduza a margem ou as despesas.</p>`;
    if (base.ok && base.y !== 2026) h += `<p class="tx-alert"><b>O cenário 1 não é 2026.</b> As comparações usam ${base.y} como referência.</p>`;
    const box = $('#txAlerts'); if (box.innerHTML !== h) { box.innerHTML = h; $$('.tx-alert', box).forEach(pop); }
  }
  const niceStep = m => { const raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
  function buildBars() {
    $('#txBars').innerHTML = S.anos.map((y, i) => `<div class="tx-bar" data-i="${i}"><span class="y"></span><div class="tr" role="img">${COMP.map(([k, l, c]) => `<i class="${c}" data-c="${c}"></i>`).join('')}</div><span class="v">—</span></div>`).join('') +
      `<div class="tx-axis"><span></span><div>${[0, 1, 2, 3, 4].map(() => '<span></span>').join('')}</div><span></span></div>`;
    $('#txKeys').innerHTML = COMP.map(([k, l, c]) => `<button type="button" data-c="${c}"><b class="${c}"></b>${l}</button>`).join('');
    const hl = c => { root.dataset.hl = c || ''; };
    $$('#txKeys button').forEach(b => { b.addEventListener('mouseenter', () => hl(b.dataset.c)); b.addEventListener('mouseleave', () => hl()); b.addEventListener('focus', () => hl(b.dataset.c)); b.addEventListener('blur', () => hl()); b.addEventListener('click', () => hl(root.dataset.hl === b.dataset.c ? '' : b.dataset.c)); });
    $$('.tx-bar .tr i').forEach(i => { i.addEventListener('mouseenter', () => hl(i.dataset.c)); i.addEventListener('mouseleave', () => hl()); });
  }
  function renderBars(R) {
    const max = Math.max(...R.map(r => r.ok ? r.tot : 0), 1), step = niceStep(max), top = Math.ceil(max / step) * step;
    R.forEach((r, i) => {
      const row = $(`.tx-bar[data-i="${i}"]`); $('.y', row).textContent = r.y;
      const tr = $('.tr', row);
      tr.setAttribute('aria-label', `Composição do total pago em ${r.y}: ${r.ok ? COMP.map(([k, l]) => l + ' ' + BRL(r[k])).join(', ') : 'preço não calculado'}`);
      let x = 0;
      COMP.forEach(([k, l], j) => { const seg = tr.children[j], w = r.ok ? Math.max(0, r[k]) / top : 0; seg.style.transform = `translateX(${x * 100}%) scaleX(${w})`; seg.title = `${l}: ${BRL(r[k])}`; x += w; });
      const v = $('.v', row); if (r.ok) tween(v, r.tot, BRL, 650); else { v.textContent = '—'; v._v = undefined; }
    });
    $$('.tx-axis div span').forEach((s, k) => { s.textContent = N(top * k / 4, 0); });
  }
  function renderMem(R, animMem) {
    $('#txTabs').innerHTML = R.map((r, i) => `<button type="button" role="tab" aria-selected="${i === S.mem}" data-tab="${i}">C${i + 1} · ${r.y}</button>`).join('');
    $$('[data-tab]').forEach(b => b.addEventListener('click', () => { S.mem = +b.dataset.tab; update(true); }));
    const r = R[S.mem], I = S.I;
    const p = v => `<b>${P3(v)}</b>`, m = v => `<b>${BRL(v)}</b>`, o = v => `<em>${v}</em>`;
    const steps = [
      ['Valores informados', `NF de compra ${m(r.nf)}${I.repassa && r.nf !== I.custo ? ` (fornecedor mantém o líquido de ${BRL(r.vl)})` : ''} · ICMS ${p(I.icmsC * r.fI)} · margem ${p(I.margem)} · despesas ${p(I.desp)} · CBS+IBS ${p(r.t)}${r.efe ? '' : ' (sem efeito no preço)'}`],
      ['Créditos considerados', `ICMS ${m(r.icc)}${I.credIcms ? '' : ' (sem direito)'} · PIS/COFINS ${m(r.pcc)}${I.credPis ? '' : ' (sem direito)'} · IBS/CBS ${m(r.ibc)}${I.credIbs ? '' : ' (sem direito)'}`],
      ['Custo líquido', `${m(r.nf)} − ${m(r.icc)} − ${m(r.pcc)}${r.ibp - r.ibc > 0.004 ? ` + ${m(r.ibp - r.ibc)} (IBS/CBS sem crédito)` : ''} = ${o(BRL(r.cl))}`],
      ['Tributos de saída (dentro do preço)', `ICMS ${p(r.pie)} + PIS/COFINS ${p(r.ppe)}${r.pis ? ` (= ${PCT(I.pisV, 2)} × (1 − ${PCT(r.pie, 0)}))` : ''} = ${o(P3(r.pie + r.ppe))}`],
      ['Margem e despesas', `${p(I.margem)} + ${p(I.desp)} = ${o(P3(I.margem + I.desp))}`],
      ['Denominador', `1 − (${P3(r.pie)} + ${P3(r.ppe)} + ${P3(I.desp)} + ${P3(I.margem)}) = ${o(N(r.den, 5))}${r.ok ? '' : ' → menor ou igual a zero: cálculo bloqueado'}`],
      ['Preço de venda', r.ok ? `${m(r.cl)} ÷ ${N(r.den, 5)} = ${o(BRL(r.pv))}${r.ibv ? ` · + IBS/CBS ${BRL(r.ibvb)} × ${PCT(r.t * (1 - I.redV), 2)} = ${BRL(r.ibv)} · total pago ${o(BRL(r.tot))}` : ''}` : 'Não calculado.'],
      ['Resultado', r.ok ? `${m(r.pv)} − ${m(r.icv + r.pcv)} (tributos) − ${m(r.cl)} (custo) − ${m(r.dop)} (despesas) = ${o(BRL(r.res))} · margem ${o(PCT(r.mob))} · lucro líquido estimado ${m(r.ll)}` : 'Sem resultado: revise os percentuais.'],
    ];
    $('#txSteps').innerHTML = steps.map(([t, e]) => `<li><h4>${t}</h4><p>${e}</p></li>`).join('');
    if (animMem && !reduce) $$('#txSteps li').forEach((li, k) => li.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: k * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
  }
  const ROWS = [
    ['g', 'Parâmetros do ano'], ['cbs', 'Alíquota CBS', 'Cronograma', 'p'], ['ibs', 'Alíquota IBS', 'Cronograma', 'p'], ['fI', 'ICMS vigente (% da alíquota)', 'Cronograma', 'p0'],
    ['g', 'Entrada · compra'], ['vl', 'Valor líquido do fornecedor', 'NF hoje × (1 − ICMS) × (1 − PIS/COFINS)'], ['nf', 'Valor da NF no cenário', 'Líquido ÷ tributos vigentes, se o fornecedor repassa'],
    ['icd', 'ICMS destacado', 'NF × ICMS × % vigente'], ['icc', '(−) Crédito de ICMS', 'Se houver direito'], ['pcd', 'PIS/COFINS da compra', '(NF − ICMS) × PIS/COFINS'], ['pcc', '(−) Crédito de PIS/COFINS', 'Se não cumulativo'],
    ['ibb', 'Base do IBS/CBS', 'NF − ICMS − PIS/COFINS (art. 12, § 2º, V)'], ['ibp', 'IBS/CBS pago (por fora)', 'Base × alíquota × (1 − redução)'], ['ibc', '(−) Crédito de IBS/CBS', 'Se houver direito'],
    ['k', 'cl', 'Custo líquido', 'NF − créditos + IBS/CBS sem crédito'],
    ['g', 'Venda · percentuais dentro do preço'], ['pie', 'ICMS efetivo', 'Alíquota × % vigente', 'p3'], ['ppe', 'PIS/COFINS efetivo', '9,25% × (1 − ICMS)', 'p3'], ['soma', 'Soma com despesas e margem', '', 'p3'], ['den', 'Denominador', '1 − soma', 'd'],
    ['g', 'Preço de venda'], ['k', 'pv', 'Preço de venda', 'Custo líquido ÷ denominador'], ['icv', 'ICMS sobre a venda', 'Preço × ICMS efetivo'], ['pcv', 'PIS/COFINS sobre a venda', '(Preço − ICMS) × PIS/COFINS'],
    ['ibv', '(+) IBS/CBS por fora', '(Preço − ICMS − PIS/COFINS) × alíquota'], ['k', 'tot', 'Total pago pelo cliente', 'Preço + IBS/CBS'], ['carga', 'Tributos no total pago', '', 'p'],
    ['g', 'Apuração · a recolher'], ['aic', 'ICMS', 'Débito − crédito'], ['apc', 'PIS/COFINS', 'Débito − crédito'], ['aib', 'IBS/CBS', 'Débito − crédito'], ['atot', 'Total a recolher', ''],
    ['g', 'Resultado do produto'], ['rl', 'Receita líquida', 'Preço − ICMS − PIS/COFINS'], ['lb', 'Lucro bruto', 'Receita líquida − custo'], ['k', 'res', 'Resultado antes do IRPJ/CSLL', 'Lucro bruto − despesas'],
    ['mob', 'Margem obtida', 'Resultado ÷ preço', 'p'], ['ll', 'Lucro líquido estimado', 'Resultado − IRPJ/CSLL'], ['mll', 'Margem líquida', '', 'p'],
    ['g', 'Comparação com o cenário 1'], ['peq', 'Preço para manter o resultado do cenário 1', '(Custo + resultado C1) ÷ (1 − ICMS − PIS/COFINS − despesas)'], ['teq', 'Total pago nesse preço', 'Preço equivalente + IBS/CBS'],
  ];
  const cellFmt = (v, f) => f === 'p' ? PCT(v) : f === 'p0' ? PCT(v, 0) : f === 'p3' ? PCT(v, 3) : f === 'd' ? N(v, 5) : BRL(v);
  const PRE = ['cbs', 'ibs', 'fI', 'vl', 'nf', 'icd', 'icc', 'pcd', 'pcc', 'ibb', 'ibp', 'ibc', 'cl', 'pie', 'ppe', 'soma', 'den'];
  function renderTable(R) {
    let h = `<thead><tr><th>Etapa</th><th>Como é calculado</th>${R.map((r, i) => `<th>C${i + 1} · ${r.y}</th>`).join('')}</tr></thead><tbody>`;
    ROWS.forEach(row => {
      if (row[0] === 'g') { h += `<tr class="g"><td colspan="${2 + R.length}">${row[1]}</td></tr>`; return; }
      const key = row[0] === 'k', [k, l, how, f] = key ? row.slice(1) : row;
      h += `<tr class="${key ? 'k' : ''}"><td>${l}</td><td class="how">${how || ''}</td>${R.map(r => `<td class="v${r[k] < -1e-9 ? ' neg' : ''}">${!r.ok && !PRE.includes(k) ? '—' : cellFmt(r[k], f)}</td>`).join('')}</tr>`;
    });
    $('#txTbl').innerHTML = h + '</tbody>';
  }
  function renderSched() {
    $('#txSched').innerHTML = `<thead><tr><th>Ano</th><th>CBS</th><th>IBS</th><th>ICMS/ISS</th><th>PIS/COFINS</th><th>Afeta o preço?</th></tr></thead><tbody>` +
      ANOS.map(y => { const c = cronograma(y, S.P); return `<tr><td class="v">${y}</td><td class="v">${PCT(c.cbs)}</td><td class="v">${PCT(c.ibs)}</td><td class="v">${PCT(c.fI, 0)}</td><td>${c.pis ? 'Vigente' : 'Extinto'}</td><td>${c.efe ? 'Sim' : 'Não (teste)'}</td></tr>`; }).join('') + '</tbody>';
  }
  function update(animMem) {
    const R = compute(); if (S.mem > R.length - 1) S.mem = 0;
    renderAlerts(R); renderScen(R); renderBars(R); renderMem(R, animMem); renderTable(R); renderSched(); syncSeg(); save();
    clearTimeout(update.t); update.t = setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 400);
  }
  function syncSeg() { $$('.tx-seg').forEach(g => { g.dataset.on = String(S.I[g.dataset.bool]); }); }
  // pressionar dá resposta imediata; troca de exemplo faz os cartões "respirarem"
  $$('[data-preset]').forEach(b => b.addEventListener('click', () => { if (!reduce) $$('.tx-sc').forEach((c, k) => c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'none' }], { duration: 420, delay: k * 50, easing: 'cubic-bezier(.34,1.56,.64,1)' })); }));
  buildScen(); buildBars(); fillForm();
  // entrada: quando o simulador aparece, os cartões sobem em cascata, os números contam do zero e as barras crescem
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('pre'); update();
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return; io.disconnect();
      $$('.tx-tot, .tx-bar .v, .tx-kv dd').forEach(el => { if (el._v !== undefined) el._v = 0; });
      root.classList.remove('pre'); update();
      $$('.tx-sc').forEach((c, k) => c.animate([{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: 90 * k, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
    }, { threshold: .2 });
    io.observe($('.tx-out'));
  } else update();
})();


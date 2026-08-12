var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _root, _els, _view, _ghostPct, _deathPhase, _timers, _token, _BossBarWidget_static, config_fn, teardown_fn, addT_fn, kick_fn, build_fn, applySteady_fn, applyTransition_fn, dieSeq_fn, particle_fn, splash_fn, impact_fn, healMotes_fn, crumbleGrains_fn, onTokenHud_fn;
import { a1 as sanitizeBossBarConfig, M as MODULE_ID, a2 as BOSS_BAR_SETTING, a3 as DEFAULT_BOSS_BAR, a4 as bossBarView, a5 as classifyTransition } from "./module-CGuPkFx8.js";
const CLIP_FULL = "polygon(calc(0% - 26px) -26px, calc(100% + 26px) -26px, calc(100% + 26px) calc(100% + 26px), calc(0% - 26px) calc(100% + 26px))";
const CLIP_GONE = "polygon(calc(0% - 26px) -26px, calc(0% - 26px) -26px, calc(0% - 26px) calc(100% + 26px), calc(0% - 26px) calc(100% + 26px))";
const SAND_SHADES = ["#D65A43", "#B03426", "#8F2418", "#4A4046", "#6B5F66", "#2B2429"];
const LOW_HP_PCT = 25;
function L(key, fallback) {
  var _a, _b;
  const full = `STORYFLOW_DUNGEONS_LAB.BossBar.${key}`;
  return ((_b = (_a = game.i18n) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, full)) ? game.i18n.localize(full) : fallback;
}
const _BossBarWidget = class _BossBarWidget {
  /**
   * Подключить хуки обновления. Вызывается один раз из регистратора плагина на
   * ready (все клиенты).
   */
  static mount() {
    Hooks.on("updateActor", (actor) => {
      var _a;
      const cfg = __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, config_fn).call(_a);
      if (cfg.visible && cfg.actorUuid && (actor == null ? void 0 : actor.uuid) === cfg.actorUuid) void _BossBarWidget.refresh();
    });
    Hooks.on("renderTokenHUD", (hud, html) => {
      var _a;
      return __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, onTokenHud_fn).call(_a, hud, html);
    });
    void _BossBarWidget.refresh();
  }
  /**
   * Показать полосу для boss-актора на каждом клиенте (только ГМ - запись мировой
   * настройки).
   * @param {string} actorUuid
   * @param {{label?: string}} [options]
   * @returns {Promise<boolean>} false, если не ГМ или актор не может быть
   * разрешен.
   */
  static async show(actorUuid, { label = "" } = {}) {
    if (!game.user.isGM) {
      console.warn(`${MODULE_ID} | bossBar.show is GM-only`);
      return false;
    }
    const actor = await fromUuid(actorUuid ?? "").catch(() => null);
    if (!actor) {
      console.warn(`${MODULE_ID} | bossBar.show: cannot resolve actor "${actorUuid}"`);
      return false;
    }
    await game.settings.set(MODULE_ID, BOSS_BAR_SETTING, {
      visible: true,
      actorUuid: actor.uuid,
      label: String(label ?? "")
    });
    return true;
  }
  /** Скрыть полосу на каждом клиенте (только ГМ). @returns {Promise<boolean>} */
  static async hide() {
    if (!game.user.isGM) {
      console.warn(`${MODULE_ID} | bossBar.hide is GM-only`);
      return false;
    }
    await game.settings.set(MODULE_ID, BOSS_BAR_SETTING, { ...DEFAULT_BOSS_BAR });
    return true;
  }
  /**
   * Повторно синхронизировать DOM с настройкой + актором. Безопасно вызывать в
   * любое время, на любом клиенте.
   */
  static async refresh() {
    var _a, _b, _c, _d, _e, _f;
    const cfg = __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, config_fn).call(_a);
    const actor = cfg.visible && cfg.actorUuid ? await fromUuid(cfg.actorUuid).catch(() => null) : null;
    const view = bossBarView(cfg, ((_c = (_b = actor == null ? void 0 : actor.system) == null ? void 0 : _b.attributes) == null ? void 0 : _c.hp) ?? null, (actor == null ? void 0 : actor.name) ?? "");
    const prev = __privateGet(_BossBarWidget, _view);
    if (!view.visible) {
      __privateMethod(_d = _BossBarWidget, _BossBarWidget_static, teardown_fn).call(_d);
      return;
    }
    const mounted = __privateGet(_BossBarWidget, _root) && document.body.contains(__privateGet(_BossBarWidget, _root));
    if (!mounted || !(prev == null ? void 0 : prev.visible) || prev.name !== view.name || prev.dead && !view.dead) {
      await __privateMethod(_e = _BossBarWidget, _BossBarWidget_static, build_fn).call(_e, view);
      return;
    }
    __privateMethod(_f = _BossBarWidget, _BossBarWidget_static, applyTransition_fn).call(_f, prev, view);
    __privateSet(_BossBarWidget, _view, view);
  }
};
_root = new WeakMap();
_els = new WeakMap();
_view = new WeakMap();
_ghostPct = new WeakMap();
_deathPhase = new WeakMap();
_timers = new WeakMap();
_token = new WeakMap();
_BossBarWidget_static = new WeakSet();
config_fn = function() {
  return sanitizeBossBarConfig(game.settings.get(MODULE_ID, BOSS_BAR_SETTING));
};
teardown_fn = function() {
  var _a;
  __privateWrapper(_BossBarWidget, _token)._++;
  for (const t of __privateGet(_BossBarWidget, _timers)) clearTimeout(t);
  __privateSet(_BossBarWidget, _timers, []);
  (_a = __privateGet(_BossBarWidget, _root)) == null ? void 0 : _a.remove();
  __privateSet(_BossBarWidget, _root, null);
  __privateSet(_BossBarWidget, _els, null);
  __privateSet(_BossBarWidget, _view, null);
  __privateSet(_BossBarWidget, _ghostPct, 0);
  __privateSet(_BossBarWidget, _deathPhase, null);
};
addT_fn = function(fn, ms) {
  const token = __privateGet(_BossBarWidget, _token);
  __privateGet(_BossBarWidget, _timers).push(
    setTimeout(() => {
      if (token === __privateGet(_BossBarWidget, _token)) fn();
    }, ms)
  );
};
kick_fn = function(el, animation) {
  if (!el) return;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = animation;
};
build_fn = async function(view) {
  var _a, _b, _c, _d, _e, _f, _g;
  __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, teardown_fn).call(_a);
  const token = __privateGet(_BossBarWidget, _token);
  const root = document.createElement("div");
  root.className = "storyflow-dungeons-lab storyflow-boss-bar";
  root.innerHTML = await foundry.applications.handlebars.renderTemplate(
    `modules/${MODULE_ID}/templates/boss-bar.hbs`,
    { victoryText: L("Victory", "VICTORY") }
  );
  if (token !== __privateGet(_BossBarWidget, _token)) return;
  document.body.appendChild(root);
  __privateSet(_BossBarWidget, _root, root);
  const q = (sel) => root.querySelector(sel);
  __privateSet(_BossBarWidget, _els, {
    nameText: q(".sfbb-name-text"),
    shake: q(".sfbb-shake"),
    fill: q(".sfbb-fill"),
    ghost: q(".sfbb-ghost"),
    shield: q(".sfbb-shield-fill"),
    flash: q(".sfbb-flash"),
    healping: q(".sfbb-healping"),
    vignette: q(".sfbb-vignette"),
    fx: q(".sfbb-fx"),
    gem66: q(".sfbb-gem.g66"),
    gem33: q(".sfbb-gem.g33")
  });
  __privateSet(_BossBarWidget, _view, view);
  __privateMethod(_b = _BossBarWidget, _BossBarWidget_static, applySteady_fn).call(_b, view, { intro: true });
  root.classList.add("is-intro");
  __privateMethod(_c = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_c, () => root.classList.add("is-vis", "is-typing"), 60);
  const name = view.name ?? "";
  for (let i = 1; i <= name.length; i++) {
    __privateMethod(_d = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_d, () => {
      __privateGet(_BossBarWidget, _els).nameText.textContent = name.slice(0, i);
    }, 300 + i * 55);
  }
  const tType = 300 + name.length * 55;
  __privateMethod(_e = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_e, () => {
    root.classList.remove("is-typing");
    root.classList.add("is-frame");
  }, tType + 300);
  __privateMethod(_f = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_f, () => {
    __privateGet(_BossBarWidget, _els).fill.style.width = `${view.pct}%`;
    __privateSet(_BossBarWidget, _ghostPct, view.pct);
    __privateGet(_BossBarWidget, _els).ghost.style.width = `${view.pct}%`;
  }, tType + 1100);
  __privateMethod(_g = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_g, () => {
    var _a2, _b2;
    root.classList.remove("is-intro");
    const live = __privateGet(_BossBarWidget, _view);
    if (live == null ? void 0 : live.visible) __privateMethod(_a2 = _BossBarWidget, _BossBarWidget_static, applySteady_fn).call(_a2, live, {});
    if ((live == null ? void 0 : live.visible) && live.dead) __privateMethod(_b2 = _BossBarWidget, _BossBarWidget_static, dieSeq_fn).call(_b2, live.pct);
  }, tType + 3500);
};
applySteady_fn = function(view, { intro = false } = {}) {
  const root = __privateGet(_BossBarWidget, _root);
  const els = __privateGet(_BossBarWidget, _els);
  if (!root || !els) return;
  if (!intro) {
    els.fill.style.width = `${view.dead ? 0 : view.pct}%`;
    __privateSet(_BossBarWidget, _ghostPct, Math.max(__privateGet(_BossBarWidget, _ghostPct), view.pct));
    els.ghost.style.width = `${__privateGet(_BossBarWidget, _ghostPct)}%`;
    els.nameText.textContent = view.name ?? "";
  }
  els.shield.style.width = `${view.shieldPct}%`;
  els.shield.classList.toggle("is-on", view.shieldPct > 0);
  els.gem66.classList.toggle("is-lit", view.phase >= 2);
  els.gem33.classList.toggle("is-lit", view.phase >= 3);
  root.classList.toggle("is-low", !view.dead && view.pct > 0 && view.pct <= LOW_HP_PCT);
};
applyTransition_fn = function(prev, view) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const els = __privateGet(_BossBarWidget, _els);
  const t = classifyTransition(prev, view);
  if (__privateGet(_BossBarWidget, _deathPhase)) return;
  __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, applySteady_fn).call(_a, view, {});
  if (t.kind === "death") {
    __privateMethod(_b = _BossBarWidget, _BossBarWidget_static, dieSeq_fn).call(_b, prev.pct);
    return;
  }
  if (t.kind === "damage") {
    els.fill.style.width = `${view.pct}%`;
    __privateMethod(_c = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_c, els.shake, t.big ? "sfbbShakeBig .45s cubic-bezier(.3,.1,.3,1)" : "sfbbShake .32s cubic-bezier(.3,.1,.3,1)");
    if (t.blood) __privateMethod(_d = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_d, els.fill, "sfbbHit .35s ease-out");
    __privateMethod(_e = _BossBarWidget, _BossBarWidget_static, splash_fn).call(_e, {
      edge: view.pct,
      n: Math.min(12, 3 + Math.round(t.amountPct / 2.5)),
      arcane: !t.blood
    });
    __privateMethod(_f = _BossBarWidget, _BossBarWidget_static, impact_fn).call(_f, view.pct, t.big ? 66 : 46, !t.blood);
    if (t.big) __privateMethod(_g = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_g, els.vignette, "sfbbVign .55s ease-out");
    if (t.phaseUp) __privateMethod(_h = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_h, els.flash, "sfbbPhasePing .85s ease-out");
    __privateMethod(_i = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_i, () => {
      const live = __privateGet(_BossBarWidget, _view);
      if (!(live == null ? void 0 : live.visible) || __privateGet(_BossBarWidget, _deathPhase)) return;
      __privateSet(_BossBarWidget, _ghostPct, live.pct);
      els.ghost.style.width = `${live.pct}%`;
    }, 520);
    return;
  }
  if (t.kind === "heal") {
    els.fill.style.width = `${view.pct}%`;
    __privateSet(_BossBarWidget, _ghostPct, Math.max(__privateGet(_BossBarWidget, _ghostPct), view.pct));
    els.ghost.style.width = `${__privateGet(_BossBarWidget, _ghostPct)}%`;
    __privateMethod(_j = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_j, els.fill, "sfbbHeal .55s ease-out");
    __privateMethod(_k = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_k, els.healping, "sfbbPhasePing 1.05s ease-out");
    __privateMethod(_l = _BossBarWidget, _BossBarWidget_static, healMotes_fn).call(_l, view.pct);
  }
};
dieSeq_fn = function(fromPct) {
  var _a, _b, _c, _d, _e, _f;
  const root = __privateGet(_BossBarWidget, _root);
  const els = __privateGet(_BossBarWidget, _els);
  if (!root || !els || __privateGet(_BossBarWidget, _deathPhase)) return;
  __privateSet(_BossBarWidget, _deathPhase, "drain");
  root.classList.add("is-dead", "is-draining");
  root.classList.remove("is-low");
  els.fill.style.width = "0%";
  els.shield.style.width = "0%";
  els.shield.classList.remove("is-on");
  els.shake.style.clipPath = CLIP_FULL;
  __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_a, els.shake, "sfbbShakeBig .5s cubic-bezier(.3,.1,.3,1)");
  __privateMethod(_b = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_b, els.fill, "sfbbHit .4s ease-out");
  __privateMethod(_c = _BossBarWidget, _BossBarWidget_static, kick_fn).call(_c, els.vignette, "sfbbVign .55s ease-out");
  __privateMethod(_d = _BossBarWidget, _BossBarWidget_static, splash_fn).call(_d, { spread: fromPct, n: 14, arcane: false });
  __privateMethod(_e = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_e, () => {
    __privateSet(_BossBarWidget, _deathPhase, "blink");
    root.classList.remove("is-draining");
    root.classList.add("is-blink");
  }, 1200);
  __privateMethod(_f = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_f, () => {
    var _a2, _b2;
    __privateSet(_BossBarWidget, _deathPhase, "crumble");
    root.classList.remove("is-blink");
    root.classList.add("is-crumbling");
    els.shake.style.transition = "clip-path 8s linear";
    els.shake.style.clipPath = CLIP_GONE;
    const DUR = 8e3;
    const STEPS = 80;
    for (let i = 0; i <= STEPS; i++) {
      __privateMethod(_a2 = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_a2, () => {
        var _a3;
        return __privateMethod(_a3 = _BossBarWidget, _BossBarWidget_static, crumbleGrains_fn).call(_a3, 100 - i / STEPS * 100);
      }, DUR / STEPS * i);
    }
    __privateMethod(_b2 = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_b2, () => {
      __privateSet(_BossBarWidget, _deathPhase, "gone");
      root.classList.remove("is-crumbling");
      root.classList.add("is-gone");
    }, DUR + 250);
  }, 4200);
};
particle_fn = function(className, style, lifeMs) {
  var _a;
  const els = __privateGet(_BossBarWidget, _els);
  if (!els) return;
  const p = document.createElement("div");
  p.className = className;
  Object.assign(p.style, style);
  els.fx.appendChild(p);
  __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, addT_fn).call(_a, () => p.remove(), lifeMs);
};
splash_fn = function({ edge = 0, spread = null, n = 6, arcane = false }) {
  var _a;
  for (let i = 0; i < n; i++) {
    const fall = !arcane && Math.random() < 0.42;
    const size = 3 + Math.random() * 4.5;
    const left = spread != null ? 2 + Math.random() * Math.max(2, spread - 4) : Math.max(1, edge + (Math.random() * 4 - 2));
    const dx = fall ? -12 + Math.random() * 24 : (Math.random() < 0.22 ? -1 : 1) * (8 + Math.random() * 50);
    const dy = fall ? 30 + Math.random() * 60 : -34 + Math.random() * 72;
    const dur = fall ? 0.55 + Math.random() * 0.4 : 0.45 + Math.random() * 0.4;
    __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, particle_fn).call(_a, `sfbb-drop${fall ? " fall" : ""}${arcane ? " arcane" : ""}`, {
      left: `calc(${left}% - 2px)`,
      top: `${fall ? 40 + Math.random() * 45 : 5 + Math.random() * 70}%`,
      width: `${size}px`,
      height: `${size}px`,
      "--dx": `${dx}px`,
      "--dy": `${dy}px`,
      "--rot": `${-160 + Math.random() * 320}deg`,
      "--dur": `${dur}s`
    }, 950);
  }
};
impact_fn = function(edge, size, arcane) {
  var _a;
  __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, particle_fn).call(_a, `sfbb-impact${arcane ? " arcane" : ""}`, {
    left: `calc(${edge}% - ${size / 2}px)`,
    marginTop: `${-size / 2}px`,
    width: `${size}px`,
    height: `${size}px`
  }, 500);
};
healMotes_fn = function(pct) {
  var _a;
  for (let i = 0; i < 9; i++) {
    const size = 2.5 + Math.random() * 2.5;
    __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, particle_fn).call(_a, "sfbb-mote", {
      left: `calc(${3 + Math.random() * Math.max(3, pct - 6)}% - 2px)`,
      top: `${55 + Math.random() * 35}%`,
      width: `${size}px`,
      height: `${size}px`,
      "--dx": `${-8 + Math.random() * 16}px`,
      "--dy": `${-(26 + Math.random() * 42)}px`,
      "--dur": `${0.8 + Math.random() * 0.55}s`
    }, 1450);
  }
};
crumbleGrains_fn = function(edge) {
  var _a, _b;
  const sparks = 1 + Math.round(Math.random());
  for (let i = 0; i < sparks; i++) {
    const size = 1.5 + Math.random() * 1.8;
    __privateMethod(_a = _BossBarWidget, _BossBarWidget_static, particle_fn).call(_a, "sfbb-spark", {
      left: `calc(${Math.min(100, Math.max(0.5, edge + (Math.random() * 3 - 1.5)))}% - 1px)`,
      top: `${-6 + Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      "--dx": `${-14 + Math.random() * 28}px`,
      "--dy": `${-(20 + Math.random() * 46)}px`,
      "--dur": `${0.5 + Math.random() * 0.45}s`
    }, 1400);
  }
  const grains = 5 + Math.round(Math.random() * 3);
  for (let i = 0; i < grains; i++) {
    const size = 1.8 + Math.random() * 3;
    __privateMethod(_b = _BossBarWidget, _BossBarWidget_static, particle_fn).call(_b, "sfbb-sand", {
      left: `calc(${Math.min(100, Math.max(0.5, edge + (Math.random() * 2.4 - 1.2)))}% - 1px)`,
      top: `${-10 + Math.random() * 112}%`,
      width: `${size}px`,
      height: `${size}px`,
      background: SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)],
      "--dx": `${-10 + Math.random() * 20}px`,
      "--dy": `${30 + Math.random() * 66}px`,
      "--rot": `${-220 + Math.random() * 440}deg`,
      "--dur": `${0.65 + Math.random() * 0.55}s`
    }, 1400);
  }
};
onTokenHud_fn = function(hud, html) {
  var _a, _b;
  if (!game.user.isGM) return;
  const actor = (_a = hud == null ? void 0 : hud.object) == null ? void 0 : _a.actor;
  if (!actor) return;
  const el = html instanceof HTMLElement ? html : html == null ? void 0 : html[0];
  const col = el == null ? void 0 : el.querySelector(".col.right");
  if (!col || col.querySelector(".storyflow-boss-bar-hud-toggle")) return;
  const cfg = __privateMethod(_b = _BossBarWidget, _BossBarWidget_static, config_fn).call(_b);
  const active = cfg.visible && cfg.actorUuid === actor.uuid;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `control-icon storyflow-boss-bar-hud-toggle${active ? " active" : ""}`;
  btn.dataset.tooltip = L("ToggleTip", "Boss Bar");
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-skull";
  btn.appendChild(icon);
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const on = btn.classList.contains("active");
    const ok = on ? await _BossBarWidget.hide() : await _BossBarWidget.show(actor.uuid);
    if (ok) btn.classList.toggle("active", !on);
  });
  col.appendChild(btn);
};
__privateAdd(_BossBarWidget, _BossBarWidget_static);
/** @type {HTMLElement|null} */
__privateAdd(_BossBarWidget, _root, null);
/** @type {Record<string, HTMLElement>|null} */
__privateAdd(_BossBarWidget, _els, null);
/** Последнее примененное представление (видимая форма из bossBarView). */
__privateAdd(_BossBarWidget, _view, null);
/** Ширина слоя-призрака в % (отстает от заполнения после урона). */
__privateAdd(_BossBarWidget, _ghostPct, 0);
/** null | "drain" | "blink" | "crumble" | "gone" */
__privateAdd(_BossBarWidget, _deathPhase, null);
/**
 * Ожидающие таймауты; обновленный токен аннулирует устаревшие последовательности
 * (повторный показ посреди интро).
 */
__privateAdd(_BossBarWidget, _timers, []);
__privateAdd(_BossBarWidget, _token, 0);
let BossBarWidget = _BossBarWidget;
export {
  BossBarWidget
};
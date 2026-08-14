var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _instance, _offWorldChanged, _touched, _touchTimer, _status, _StoryFlowPlaneSettingsApp_instances, repaint_fn, wireDock_fn, wireSliders_fn, touch_fn, apply_fn, _StoryFlowPlaneSettingsApp_static, onSelectPlane_fn, onSetCondition_fn, onRollCondition_fn, onTogglePerScene_fn, onOpenSeasons_fn;
import { ac as activeCondition, ad as activeParams, ae as clampParam, M as MODULE_ID, af as listPlanes, ag as getWorldState, ah as WORLD_CHANGED_HOOK, ai as patchWorldState, aj as planeConditionKeys } from "./module-6vV2bj2T.js";
function paramText(param, value) {
  const shown = param.step && param.step < 1 ? value.toFixed(1) : String(value);
  return `${shown}${param.unit ?? ""}`;
}
function buildPlaneSettingsContext({ world, planes, isGM, localize }) {
  const L2 = localize;
  const active = planes.find((p) => p.id === world.plane) ?? planes[0];
  const condKey = activeCondition(world);
  const values = activeParams(world);
  const planeName = (p) => L2(`Planes.${p.plane}`, p.plane);
  const styleName = (p) => L2(`SkyStyles.${p.id}`, p.label);
  const condName = (p, key) => {
    var _a;
    return L2(`PlaneConditions.${p.id}.${key}`, ((_a = p.conditions[key]) == null ? void 0 : _a.label) ?? key);
  };
  const dock = planes.map((p) => {
    var _a, _b;
    return {
      id: p.id,
      name: styleName(p),
      plane: planeName(p),
      icon: p.icon ?? "fa-circle",
      iconColor: p.id === (active == null ? void 0 : active.id) ? p.iconColor ?? "var(--storyflow-ember)" : "var(--storyflow-text-faint)",
      sky: ((_a = p.preview) == null ? void 0 : _a.sky) ?? "linear-gradient(180deg, #2A3F72, #6B4A62)",
      ridge: ((_b = p.preview) == null ? void 0 : _b.ridge) ?? "#080607",
      active: p.id === (active == null ? void 0 : active.id)
    };
  });
  const chips = (active == null ? void 0 : active.weather) ? [] : Object.keys((active == null ? void 0 : active.conditions) ?? {}).map((key) => {
    var _a, _b;
    return {
      key,
      label: condName(active, key),
      icon: ((_a = active.conditions[key]) == null ? void 0 : _a.icon) ?? "fa-circle",
      color: ((_b = active.conditions[key]) == null ? void 0 : _b.color) ?? "var(--storyflow-text-faint)",
      active: key === condKey
    };
  });
  const params = ((active == null ? void 0 : active.params) ?? []).map((p) => {
    const value = clampParam(p, values[p.key]);
    return {
      key: p.key,
      label: L2(`PlaneParams.${p.key}`, p.label),
      min: p.min,
      max: p.max,
      step: p.step,
      value,
      // The window formats the readout itself while the slider is being dragged, so it needs
      // the unit as data, not baked into the string.
      unit: p.unit ?? "",
      text: paramText(p, value)
    };
  });
  const effects = ((active == null ? void 0 : active.effects) ?? []).map((e) => ({
    text: L2(`PlaneEffects.${e.key}`, e.label ?? e.key),
    enabled: Boolean(e.enabled)
  }));
  const condLabel = active && !active.weather && condKey ? condName(active, condKey) : "";
  return {
    isGM,
    readOnly: !isGM,
    planeId: (active == null ? void 0 : active.id) ?? null,
    planeName: active ? planeName(active) : "",
    styleName: active ? styleName(active) : "",
    weatherPlane: Boolean(active == null ? void 0 : active.weather),
    headerSummary: active ? [planeName(active), condLabel].filter(Boolean).join(" · ") : "",
    dock,
    chips,
    hasChips: chips.length > 0,
    params,
    hasParams: params.length > 0,
    effects,
    showEffects: effects.length > 0,
    perScene: world.perScene,
    // Said plainly in the window, because "where did my rain go" is the obvious first question.
    weatherNote: (active == null ? void 0 : active.weather) ? L2(
      "PlaneWeatherOn",
      "The calendar rolls daily weather on this plane and mirrors it onto the scene."
    ) : L2(
      "PlaneWeatherOff",
      "This plane has no weather: the calendar rolls none and pushes none onto the scene. You set its state here."
    )
  };
}
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
function L(key, fallback) {
  var _a, _b;
  const full = `STORYFLOW_DUNGEONS_LAB.Calendar.${key}`;
  return ((_b = (_a = game.i18n) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, full)) ? game.i18n.localize(full) : fallback;
}
const DOCK_REACH = 132;
function sliderText(el) {
  const value = Number(el.value);
  const step = Number(el.step) || 1;
  return `${step < 1 ? value.toFixed(1) : String(value)}${el.dataset.unit ?? ""}`;
}
function paintFill(el) {
  const min = Number(el.min);
  const span = Number(el.max) - min || 1;
  el.style.setProperty("--ps-fill", `${(Number(el.value) - min) / span * 100}%`);
}
const _StoryFlowPlaneSettingsApp = class _StoryFlowPlaneSettingsApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _StoryFlowPlaneSettingsApp_instances);
    /** @type {(() => void)|null} */
    __privateAdd(this, _offWorldChanged, null);
    /** Param whose readout should flash (it just hit the world), and the timer that clears it. */
    __privateAdd(this, _touched, null);
    __privateAdd(this, _touchTimer, null);
    /** The faint "plane · condition" line the design puts in the window chrome. */
    __privateAdd(this, _status, null);
  }
  /** Open (or focus) the window. */
  static open() {
    __privateGet(_StoryFlowPlaneSettingsApp, _instance) ?? __privateSet(_StoryFlowPlaneSettingsApp, _instance, new _StoryFlowPlaneSettingsApp());
    __privateGet(_StoryFlowPlaneSettingsApp, _instance).render(true);
    return __privateGet(_StoryFlowPlaneSettingsApp, _instance);
  }
  /** @override */
  _prepareContext() {
    var _a;
    return buildPlaneSettingsContext({
      world: getWorldState(),
      planes: listPlanes(),
      isGM: Boolean((_a = game.user) == null ? void 0 : _a.isGM),
      localize: L
    });
  }
  /** @override — AppV2 draws the chrome, so the design's status line is injected into it. */
  async _renderFrame(options) {
    var _a;
    const frame = await super._renderFrame(options);
    __privateSet(this, _status, document.createElement("span"));
    __privateGet(this, _status).className = "ps-status";
    (_a = frame.querySelector(".window-title")) == null ? void 0 : _a.after(__privateGet(this, _status));
    return frame;
  }
  /** @override */
  _onRender(context, options) {
    var _a;
    (_a = super._onRender) == null ? void 0 : _a.call(this, context, options);
    if (__privateGet(this, _status)) __privateGet(this, _status).textContent = context.headerSummary ?? "";
    __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, wireDock_fn).call(this, context);
    __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, wireSliders_fn).call(this);
    if (!__privateGet(this, _offWorldChanged)) {
      const fn = () => __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, repaint_fn).call(this);
      Hooks.on(WORLD_CHANGED_HOOK, fn);
      __privateSet(this, _offWorldChanged, () => Hooks.off(WORLD_CHANGED_HOOK, fn));
    }
  }
  /** @override */
  _onClose(options) {
    var _a, _b;
    (_a = __privateGet(this, _offWorldChanged)) == null ? void 0 : _a.call(this);
    __privateSet(this, _offWorldChanged, null);
    clearTimeout(__privateGet(this, _touchTimer));
    __privateSet(_StoryFlowPlaneSettingsApp, _instance, null);
    (_b = super._onClose) == null ? void 0 : _b.call(this, options);
  }
};
_instance = new WeakMap();
_offWorldChanged = new WeakMap();
_touched = new WeakMap();
_touchTimer = new WeakMap();
_status = new WeakMap();
_StoryFlowPlaneSettingsApp_instances = new WeakSet();
/** Repaint the body only — the frame (and its status line) is updated in _onRender. */
repaint_fn = function() {
  this.render({ parts: ["main"] });
};
/**
 * The dock magnifies toward the pointer. Driven here rather than in CSS because a tile's
 * scale depends on its distance to the cursor, which CSS cannot see; the transform is written
 * straight to the node, so nothing re-renders while the pointer travels.
 * @param {object} context
 */
wireDock_fn = function(context) {
  const dock = this.element.querySelector(".ps-dock");
  if (!dock || context.readOnly) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const tiles = [...dock.querySelectorAll(".ps-tile")];
  const magnify = (x) => {
    for (const tile of tiles) {
      if (x == null) {
        tile.style.transform = "";
        continue;
      }
      const box = tile.getBoundingClientRect();
      const t = Math.max(0, 1 - Math.abs(x - (box.left + box.width / 2)) / DOCK_REACH);
      const k = t * t * (3 - 2 * t);
      tile.style.transform = `translateY(${(-6 * k).toFixed(2)}px) scale(${(1 + 0.14 * k).toFixed(3)})`;
    }
  };
  dock.addEventListener("pointermove", (ev) => magnify(ev.clientX));
  dock.addEventListener("pointerleave", () => magnify(null));
};
/**
 * A range input must not carry data-action (the click lands mid-drag): wire the live readout
 * on `input` and commit on `change`, so dragging does not write once per pixel.
 */
wireSliders_fn = function() {
  var _a;
  for (const slider of this.element.querySelectorAll("input[type=range][data-param]")) {
    const out = (_a = slider.parentElement) == null ? void 0 : _a.querySelector("[data-param-out]");
    if (slider.dataset.param === __privateGet(this, _touched)) out == null ? void 0 : out.classList.add("touched");
    paintFill(slider);
    slider.addEventListener("input", () => {
      paintFill(slider);
      if (out) out.textContent = sliderText(slider);
    });
    slider.addEventListener("change", () => {
      __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, touch_fn).call(this, slider.dataset.param);
      void __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, apply_fn).call(this, { params: { [slider.dataset.param]: Number(slider.value) } });
    });
  }
};
/**
 * Mark a readout as just-written. Held for the length of the flash rather than cleared on the
 * next render, because a world-setting change repaints the window more than once.
 * @param {string} param
 */
touch_fn = function(param) {
  __privateSet(this, _touched, param);
  clearTimeout(__privateGet(this, _touchTimer));
  __privateSet(this, _touchTimer, setTimeout(() => __privateSet(this, _touched, null), 900));
};
apply_fn = async function(patch) {
  var _a;
  if (!((_a = game.user) == null ? void 0 : _a.isGM)) return;
  const written = patchWorldState(patch);
  __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, repaint_fn).call(this);
  await written;
};
_StoryFlowPlaneSettingsApp_static = new WeakSet();
onSelectPlane_fn = async function(_event, target) {
  await __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, apply_fn).call(this, { plane: target.dataset.plane });
};
onSetCondition_fn = async function(_event, target) {
  await __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, apply_fn).call(this, { condition: target.dataset.cond });
};
onRollCondition_fn = async function() {
  const keys = planeConditionKeys(getWorldState().plane);
  if (!keys.length) return;
  await __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, apply_fn).call(this, { condition: keys[Math.floor(Math.random() * keys.length)] });
};
onTogglePerScene_fn = async function(_event, target) {
  await __privateMethod(this, _StoryFlowPlaneSettingsApp_instances, apply_fn).call(this, { perScene: target.checked });
};
onOpenSeasons_fn = async function() {
  const { StoryFlowSeasonConfigApp } = await import("./season-config-app-BOsWvD_A.js");
  StoryFlowSeasonConfigApp.open();
};
__privateAdd(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static);
__publicField(_StoryFlowPlaneSettingsApp, "DEFAULT_OPTIONS", {
  id: "storyflow-plane-settings",
  classes: [MODULE_ID, "storyflow-plane-settings"],
  position: { width: 620, height: "auto" },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Calendar.PlaneSettingsTitle",
    icon: "fa-solid fa-earth-americas",
    resizable: false
  },
  actions: {
    selectPlane: __privateMethod(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static, onSelectPlane_fn),
    setCondition: __privateMethod(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static, onSetCondition_fn),
    rollCondition: __privateMethod(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static, onRollCondition_fn),
    togglePerScene: __privateMethod(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static, onTogglePerScene_fn),
    openSeasons: __privateMethod(_StoryFlowPlaneSettingsApp, _StoryFlowPlaneSettingsApp_static, onOpenSeasons_fn)
  }
});
__publicField(_StoryFlowPlaneSettingsApp, "PARTS", {
  main: { template: `modules/${MODULE_ID}/templates/calendar/plane-settings.hbs` }
});
/** @type {StoryFlowPlaneSettingsApp|null} */
__privateAdd(_StoryFlowPlaneSettingsApp, _instance, null);
let StoryFlowPlaneSettingsApp = _StoryFlowPlaneSettingsApp;
export {
  StoryFlowPlaneSettingsApp
};
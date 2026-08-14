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
var _instance, _StoryFlowSeasonConfigApp_static, onSave_fn, onReset_fn;
import { M as MODULE_ID, D as getSeasons, al as DEFAULT_SEASONS, C as CONDITIONS, am as getMonthNameOverrides, an as getWeatherEffectMap, ao as listWeatherEffects, ap as CORE_PROVIDER, aq as saveSeasons, ar as normalizeSeasons, as as saveMonthNames, at as saveWeatherEffectMap } from "./module-6vV2bj2T.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
function L(key, fallback) {
  var _a, _b;
  const full = `STORYFLOW_DUNGEONS_LAB.Calendar.${key}`;
  return ((_b = (_a = game.i18n) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, full)) ? game.i18n.localize(full) : fallback;
}
const _StoryFlowSeasonConfigApp = class _StoryFlowSeasonConfigApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static open() {
    let app = __privateGet(_StoryFlowSeasonConfigApp, _instance);
    if (!app) app = __privateSet(_StoryFlowSeasonConfigApp, _instance, new _StoryFlowSeasonConfigApp());
    app.rendered ? app.bringToFront() : app.render(true);
    return app;
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const cfg = getSeasons();
    context.seasons = Object.keys(DEFAULT_SEASONS).map((key) => ({
      key,
      label: L(`Seasons.${key}`, key),
      tempMin: cfg[key].tempMin,
      tempMax: cfg[key].tempMax,
      weights: Object.entries(CONDITIONS).map(([c, meta]) => ({
        key: c,
        // Precomputed dotted path (not built via a `../` context-jump in the template —
        // Prettier's Glimmer-based hbs formatter rejects "../" concatenated with literal
        // text in an attribute value, even though real Handlebars.js supports it fine).
        name: `${key}.weights.${c}`,
        icon: meta.icon,
        color: meta.color,
        label: L(`Conditions.${c}`, c),
        value: cfg[key].weights[c]
      }))
    }));
    const overrides = getMonthNameOverrides();
    context.months = Array.fromRange(12).map((i) => ({
      name: `month.${i}`,
      value: String(overrides[i] ?? "").trim(),
      placeholder: L(`Months.${i}`, `Month ${i + 1}`)
    }));
    const mapping = getWeatherEffectMap();
    const effects = listWeatherEffects();
    context.effectRows = Object.entries(CONDITIONS).map(([cond, meta]) => ({
      name: `effect.${cond}`,
      icon: meta.icon,
      color: meta.color,
      label: L(`Conditions.${cond}`, cond),
      options: [
        { value: "", label: L("EffectNone", "No effect"), selected: mapping[cond] === "" },
        ...effects.map((e) => ({
          value: e.key,
          label: e.provider === CORE_PROVIDER ? e.label : `${e.providerLabel} · ${e.label}`,
          selected: mapping[cond] === e.key
        }))
      ]
    }));
    return context;
  }
};
_instance = new WeakMap();
_StoryFlowSeasonConfigApp_static = new WeakSet();
onSave_fn = async function() {
  const raw = {};
  const months = Array(12).fill("");
  for (const input of this.element.querySelectorAll("input[name]")) {
    if (input.name.startsWith("month.")) months[Number(input.name.slice(6))] = input.value;
    else foundry.utils.setProperty(raw, input.name, Number(input.value));
  }
  await saveSeasons(normalizeSeasons(raw));
  await saveMonthNames(months);
  const mapping = {};
  for (const sel of this.element.querySelectorAll("select[name^='effect.']")) {
    mapping[sel.name.slice("effect.".length)] = sel.value;
  }
  await saveWeatherEffectMap(mapping);
  void this.close();
};
onReset_fn = async function() {
  await saveSeasons(foundry.utils.deepClone(DEFAULT_SEASONS));
  void this.render({ parts: ["body"] });
};
__privateAdd(_StoryFlowSeasonConfigApp, _StoryFlowSeasonConfigApp_static);
__privateAdd(_StoryFlowSeasonConfigApp, _instance, null);
__publicField(_StoryFlowSeasonConfigApp, "DEFAULT_OPTIONS", {
  id: "storyflow-season-config",
  classes: [MODULE_ID, "storyflow-season-config"],
  position: { width: 720, height: "auto" },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Calendar.SeasonsTitle",
    icon: "fa-solid fa-cloud-sun-rain"
  },
  actions: {
    save: __privateMethod(_StoryFlowSeasonConfigApp, _StoryFlowSeasonConfigApp_static, onSave_fn),
    resetDefaults: __privateMethod(_StoryFlowSeasonConfigApp, _StoryFlowSeasonConfigApp_static, onReset_fn)
  }
});
__publicField(_StoryFlowSeasonConfigApp, "PARTS", {
  body: { template: `modules/${MODULE_ID}/templates/calendar/season-config.hbs` }
});
let StoryFlowSeasonConfigApp = _StoryFlowSeasonConfigApp;
export {
  StoryFlowSeasonConfigApp
};
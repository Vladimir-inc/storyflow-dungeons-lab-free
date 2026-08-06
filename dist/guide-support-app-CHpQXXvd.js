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
var _instance, _GuideSupportApp_instances, mascot_fn, play_fn, _GuideSupportApp_static, onKofi_fn, onDecline_fn;
import { M as MODULE_ID, a5 as setClip, a6 as hideVideoUntilDecoded } from "./module-C_DMsB8l.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const KOFI_URL = "https://ko-fi.com/dungeonslab";
const ASSETS = "modules/storyflow-dungeons-lab/assets/images/guide";
const _GuideSupportApp = class _GuideSupportApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GuideSupportApp_instances);
  }
  /**
   * Открыть карточку (повторный show() просто перерисовывает ее).
   * @returns {GuideSupportApp} приложение.
   */
  static show() {
    const app = __privateGet(_GuideSupportApp, _instance) ?? __privateSet(_GuideSupportApp, _instance, new _GuideSupportApp());
    app.render(true);
    return app;
  }
  /** @override */
  _prepareContext() {
    return { kofiUrl: KOFI_URL, mascotSrc: `${ASSETS}/ready.webm` };
  }
  /**
   * @override - наведение на "decline" проигрывает смерть; уход с него
   * воскрешает его.
   */
  _onRender(context, options) {
    super._onRender(context, options);
    hideVideoUntilDecoded(__privateMethod(this, _GuideSupportApp_instances, mascot_fn).call(this));
    const decline = this.element.querySelector('[data-action="declineSupport"]');
    decline == null ? void 0 : decline.addEventListener("mouseenter", () => {
      __privateMethod(this, _GuideSupportApp_instances, play_fn).call(this, "dead", false);
      this.element.classList.add("is-mourning");
    });
    decline == null ? void 0 : decline.addEventListener("mouseleave", () => {
      __privateMethod(this, _GuideSupportApp_instances, play_fn).call(this, "ready", true);
      this.element.classList.remove("is-mourning");
    });
  }
  /** @override */
  async _onClose(options) {
    if (__privateGet(_GuideSupportApp, _instance) === this) __privateSet(_GuideSupportApp, _instance, null);
    await super._onClose(options);
  }
};
_instance = new WeakMap();
_GuideSupportApp_instances = new WeakSet();
/** @returns {HTMLVideoElement|null} видео маскота карточки. */
mascot_fn = function() {
  var _a;
  return ((_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-guide-support-mascot")) ?? null;
};
/**
 * Сменить клип маскота.
 * @param {string} clip - основа имени файла внутри assets/images/guide.
 * @param {boolean} loop - зацикливать его.
 * @returns {void}
 */
play_fn = function(clip, loop) {
  var _a, _b;
  const v = __privateMethod(this, _GuideSupportApp_instances, mascot_fn).call(this);
  if (!v) return;
  v.loop = loop;
  setClip(v, clip);
  void ((_b = (_a = v.play()) == null ? void 0 : _a.catch) == null ? void 0 : _b.call(_a, () => {
  }));
};
_GuideSupportApp_static = new WeakSet();
onKofi_fn = function() {
  __privateMethod(this, _GuideSupportApp_instances, play_fn).call(this, "flying", true);
  this.element.classList.add("is-celebrating");
  window.open(KOFI_URL, "_blank", "noopener");
  setTimeout(() => this.close(), 2600);
};
onDecline_fn = function() {
  this.close();
};
__privateAdd(_GuideSupportApp, _GuideSupportApp_static);
/** @type {GuideSupportApp|null} Живой синглтон (null, пока окно закрыто). */
__privateAdd(_GuideSupportApp, _instance, null);
__publicField(_GuideSupportApp, "DEFAULT_OPTIONS", {
  id: "storyflow-guide-support",
  classes: [MODULE_ID, "storyflow-guide-support"],
  position: { width: 520, height: "auto" },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Guide.Support.Title",
    icon: "fa-solid fa-heart",
    resizable: false
  },
  actions: {
    openKofi: __privateMethod(_GuideSupportApp, _GuideSupportApp_static, onKofi_fn),
    declineSupport: __privateMethod(_GuideSupportApp, _GuideSupportApp_static, onDecline_fn)
  }
});
__publicField(_GuideSupportApp, "PARTS", {
  main: { template: "modules/storyflow-dungeons-lab/templates/guide/support.hbs" }
});
let GuideSupportApp = _GuideSupportApp;
export {
  GuideSupportApp
};
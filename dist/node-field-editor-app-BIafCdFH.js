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
var _canvas, _working, _userEdited, _applying, _edges, _meta, _filter, _find, _replace, _caseSensitive, _NodeFieldEditorApp_instances, bindTo_fn, pull_fn, chainViews_fn, scope_fn, applyFilter_fn, onFieldEdit_fn, refreshMatches_fn, setStale_fn, pullFromCanvas_fn, _NodeFieldEditorApp_static, onReplaceAll_fn, onApply_fn, onRefresh_fn, onRevealNode_fn;
import { M as MODULE_ID, Z as orderDialogueChains, n as nodePresentation, _ as DIALOGUE_TYPES, $ as countMatchesNodes, a0 as findReplaceNodes } from "./module-CGuPkFx8.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
let _instance = null;
const DIALOGUE_FIELDS = ["name", "speakerName", "portraitPath", "bodyHtml"];
const _NodeFieldEditorApp = class _NodeFieldEditorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _NodeFieldEditorApp_instances);
    /**
     * @type {import("./blueprint-canvas-app.mjs").BlueprintCanvasApp|null} Родительское
     * приложение холста.
     */
    __privateAdd(this, _canvas, null);
    /**
     * @type {Object<string, object>} Рабочая копия карты узлов (источник истины для
     * представления).
     */
    __privateAdd(this, _working, {});
    /** @type {boolean} Пользователь ввел/заменил непримененные правки? */
    __privateAdd(this, _userEdited, false);
    /**
     * @type {boolean} Подавлять автообновление, пока МЫ применяем изменения обратно на
     * холст.
     */
    __privateAdd(this, _applying, false);
    /**
     * @type {object[]} Ребра из последнего получения с холста (для
     * упорядочивания цепочек).
     */
    __privateAdd(this, _edges, []);
    /**
     * @type {object} Мета из последнего получения с холста (содержит id
     * входного узла).
     */
    __privateAdd(this, _meta, {});
    /**
     * @type {string} Активный фильтр (скрывает узлы, у которых name/speaker не
     * совпадают).
     */
    __privateAdd(this, _filter, "");
    /** @type {string} Активный поисковый термин. */
    __privateAdd(this, _find, "");
    /** @type {string} Активный термин замены. */
    __privateAdd(this, _replace, "");
    /** @type {boolean} Регистрозависимый поиск/замена. */
    __privateAdd(this, _caseSensitive, false);
  }
  /**
   * Открыть редактор полей - СТРОГО одно окно. Если один уже открыт, он переиспользуется
   * (получает фокус, и перенаправляется на запрашивающий холст, если другой), никогда не
   * дублируется. Экземпляр регистрируется синхронно до первого рендера, так что даже быстрые
   * двойные клики не могут породить второе окно.
   * @param {import("./blueprint-canvas-app.mjs").BlueprintCanvasApp} canvasApp
   * @returns {NodeFieldEditorApp}
   */
  static open(canvasApp) {
    var _a, _b, _c;
    if (_instance) {
      if (__privateGet(_instance, _canvas) !== canvasApp) {
        __privateMethod(_a = _instance, _NodeFieldEditorApp_instances, bindTo_fn).call(_a, canvasApp);
        _instance.render();
      }
      if (_instance.rendered) (_b = _instance.bringToFront) == null ? void 0 : _b.call(_instance);
      return _instance;
    }
    _instance = new _NodeFieldEditorApp();
    __privateMethod(_c = _instance, _NodeFieldEditorApp_instances, bindTo_fn).call(_c, canvasApp);
    _instance.render(true);
    return _instance;
  }
  /** @override */
  _prepareContext() {
    return {
      chains: __privateMethod(this, _NodeFieldEditorApp_instances, chainViews_fn).call(this),
      filter: __privateGet(this, _filter),
      find: __privateGet(this, _find),
      replace: __privateGet(this, _replace),
      caseSensitive: __privateGet(this, _caseSensitive),
      matchCount: countMatchesNodes(__privateGet(this, _working), __privateMethod(this, _NodeFieldEditorApp_instances, scope_fn).call(this))
    };
  }
  /**
   * @override - подключать панель поиска + делегированные правки полей (свежий
   * DOM при каждом рендере).
   */
  _onRender(context, options) {
    super._onRender(context, options);
    const root = this.element;
    const filterInput = root.querySelector(".storyflow-fe-filter-input");
    const findInput = root.querySelector(".storyflow-fe-find-input");
    const replaceInput = root.querySelector(".storyflow-fe-replace-input");
    const caseInput = root.querySelector(".storyflow-fe-case-input");
    const list = root.querySelector(".storyflow-fe-list");
    filterInput == null ? void 0 : filterInput.addEventListener("input", () => {
      __privateSet(this, _filter, filterInput.value);
      __privateMethod(this, _NodeFieldEditorApp_instances, applyFilter_fn).call(this);
    });
    findInput == null ? void 0 : findInput.addEventListener("input", () => {
      __privateSet(this, _find, findInput.value);
      __privateMethod(this, _NodeFieldEditorApp_instances, refreshMatches_fn).call(this);
    });
    replaceInput == null ? void 0 : replaceInput.addEventListener("input", () => {
      __privateSet(this, _replace, replaceInput.value);
    });
    caseInput == null ? void 0 : caseInput.addEventListener("change", () => {
      __privateSet(this, _caseSensitive, caseInput.checked);
      __privateMethod(this, _NodeFieldEditorApp_instances, refreshMatches_fn).call(this);
    });
    root.addEventListener("keydown", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "f") {
        e.preventDefault();
        findInput == null ? void 0 : findInput.focus();
        findInput == null ? void 0 : findInput.select();
      } else if (k === "h") {
        e.preventDefault();
        replaceInput == null ? void 0 : replaceInput.focus();
      }
    });
    list == null ? void 0 : list.addEventListener("input", (e) => __privateMethod(this, _NodeFieldEditorApp_instances, onFieldEdit_fn).call(this, e.target));
    if (__privateGet(this, _filter)) __privateMethod(this, _NodeFieldEditorApp_instances, applyFilter_fn).call(this);
    if (__privateGet(this, _find)) __privateMethod(this, _NodeFieldEditorApp_instances, refreshMatches_fn).call(this);
  }
  /**
   * Хук автообновления, вызываемый родительским холстом при любом изменении его графа.
   * Перезагружает с холста, ЕСЛИ ТОЛЬКО у пользователя нет непримененных правок, в противном
   * случае вместо этого показывает метку устаревших данных.
   */
  refresh() {
    if (__privateGet(this, _applying) || !this.element) return;
    if (__privateGet(this, _userEdited)) {
      __privateMethod(this, _NodeFieldEditorApp_instances, setStale_fn).call(this, true);
      return;
    }
    __privateMethod(this, _NodeFieldEditorApp_instances, pullFromCanvas_fn).call(this);
  }
  /** @override */
  async _onClose(options) {
    var _a, _b;
    (_b = (_a = __privateGet(this, _canvas)) == null ? void 0 : _a.unregisterFieldEditor) == null ? void 0 : _b.call(_a, this);
    if (_instance === this) _instance = null;
    await super._onClose(options);
  }
};
_canvas = new WeakMap();
_working = new WeakMap();
_userEdited = new WeakMap();
_applying = new WeakMap();
_edges = new WeakMap();
_meta = new WeakMap();
_filter = new WeakMap();
_find = new WeakMap();
_replace = new WeakMap();
_caseSensitive = new WeakMap();
_NodeFieldEditorApp_instances = new WeakSet();
/**
 * Направить редактор на холст: перерегистрировать, получить его узлы, сбросить любую
 * предыдущую связь с холстом.
 */
bindTo_fn = function(canvasApp) {
  var _a, _b, _c;
  if (__privateGet(this, _canvas) && __privateGet(this, _canvas) !== canvasApp) (_b = (_a = __privateGet(this, _canvas)).unregisterFieldEditor) == null ? void 0 : _b.call(_a, this);
  __privateSet(this, _canvas, canvasApp);
  __privateSet(this, _working, __privateMethod(this, _NodeFieldEditorApp_instances, pull_fn).call(this));
  __privateSet(this, _userEdited, false);
  (_c = canvasApp.registerFieldEditor) == null ? void 0 : _c.call(canvasApp, this);
};
/**
 * Глубоко клонировать текущую карту узлов холста; кэшировать ребра/мету для
 * упорядочивания цепочек.
 */
pull_fn = function() {
  var _a, _b;
  const model = ((_b = (_a = __privateGet(this, _canvas)) == null ? void 0 : _a.serializeModel) == null ? void 0 : _b.call(_a)) ?? { nodes: {}, edges: [], meta: {} };
  __privateSet(this, _edges, model.edges ?? []);
  __privateSet(this, _meta, model.meta ?? {});
  return foundry.utils.deepClone(model.nodes ?? {});
};
/** Цепочки диалога (Display + Text), каждая цветная, с четырьмя полями своих узлов. */
chainViews_fn = function() {
  const chains = orderDialogueChains({ nodes: __privateGet(this, _working), edges: __privateGet(this, _edges), meta: __privateGet(this, _meta) });
  return chains.map((chain, i) => ({
    index: i + 1,
    colorIndex: i % 8,
    // Перебирает 8 мягких цветов цепочек, определенных в field-editor.less
    count: chain.nodes.length,
    nodes: chain.nodes.map((node) => {
      var _a, _b, _c;
      const name = node.name ?? "";
      const speakerName = ((_a = node.data) == null ? void 0 : _a.speakerName) ?? "";
      return {
        id: node.id,
        typeLabel: nodePresentation(node.type).label,
        name,
        speakerName,
        portraitPath: ((_b = node.data) == null ? void 0 : _b.portraitPath) ?? "",
        bodyHtml: ((_c = node.data) == null ? void 0 : _c.bodyHtml) ?? "",
        search: `${name} ${speakerName}`.toLowerCase()
        // name + speaker, для поля фильтра
      };
    })
  }));
};
/**
 * Опции для ограниченного поиска/замены + счетчика совпадений (поля диалога, типы узлов
 * диалога).
 */
scope_fn = function(extra = {}) {
  return { find: __privateGet(this, _find), caseSensitive: __privateGet(this, _caseSensitive), fields: DIALOGUE_FIELDS, types: DIALOGUE_TYPES, ...extra };
};
/**
 * Скрыть узлы, у которых name/speaker не совпадает с фильтром; скрыть оставшиеся
 * пустыми цепочки.
 */
applyFilter_fn = function() {
  var _a, _b;
  const q = __privateGet(this, _filter).trim().toLowerCase();
  for (const section of ((_a = this.element) == null ? void 0 : _a.querySelectorAll(".storyflow-fe-node")) ?? []) {
    const hay = section.dataset.search ?? "";
    section.classList.toggle("is-hidden", Boolean(q) && !hay.includes(q));
  }
  for (const chain of ((_b = this.element) == null ? void 0 : _b.querySelectorAll(".storyflow-fe-chain")) ?? []) {
    chain.classList.toggle("is-hidden", !chain.querySelector(".storyflow-fe-node:not(.is-hidden)"));
  }
};
/** Применить одну правку ввода field/name в рабочую копию. */
onFieldEdit_fn = function(el) {
  var _a;
  const nid = (_a = el == null ? void 0 : el.dataset) == null ? void 0 : _a.nodeId;
  if (!nid) return;
  const node = __privateGet(this, _working)[nid];
  if (!node) return;
  __privateSet(this, _userEdited, true);
  __privateMethod(this, _NodeFieldEditorApp_instances, setStale_fn).call(this, false);
  if (el.dataset.nodeName !== void 0) {
    node.name = el.value;
    return;
  }
  const field = el.dataset.field;
  if (!field) return;
  node.data = node.data ?? {};
  switch (el.dataset.kind) {
    case "boolean":
      node.data[field] = el.checked;
      break;
    case "number":
      node.data[field] = el.value === "" ? null : Number(el.value);
      break;
    case "array":
      node.data[field] = el.value.split(",").map((s) => s.trim()).filter((s) => s.length);
      break;
    default:
      node.data[field] = el.value;
  }
  __privateMethod(this, _NodeFieldEditorApp_instances, refreshMatches_fn).call(this);
};
/**
 * Обновить счетчик совпадений + подсветить совпадающие поля ввода (без
 * повторного рендера).
 */
refreshMatches_fn = function() {
  var _a, _b;
  const count = countMatchesNodes(__privateGet(this, _working), __privateMethod(this, _NodeFieldEditorApp_instances, scope_fn).call(this));
  const countEl = (_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-fe-count");
  if (countEl) countEl.textContent = game.i18n.format("STORYFLOW_DUNGEONS_LAB.FieldEditor.Matches", { count });
  const term = __privateGet(this, _caseSensitive) ? __privateGet(this, _find) : __privateGet(this, _find).toLowerCase();
  for (const el of ((_b = this.element) == null ? void 0 : _b.querySelectorAll(".storyflow-fe-list [data-node-id]")) ?? []) {
    if (el.type === "checkbox") continue;
    const v = __privateGet(this, _caseSensitive) ? String(el.value ?? "") : String(el.value ?? "").toLowerCase();
    el.classList.toggle("storyflow-fe-hit", Boolean(term) && v.includes(term));
  }
};
/**
 * Переключить бейдж "canvas changed - Refresh" без повторного рендера (который бы затер
 * правки).
 */
setStale_fn = function(on) {
  var _a, _b;
  (_b = (_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-fe-stale")) == null ? void 0 : _b.classList.toggle("is-visible", on);
};
/**
 * Перезагрузить рабочую копию с холста и очистить состояние edited/stale, затем
 * перерендерить.
 */
pullFromCanvas_fn = function() {
  __privateSet(this, _working, __privateMethod(this, _NodeFieldEditorApp_instances, pull_fn).call(this));
  __privateSet(this, _userEdited, false);
  this.render();
};
_NodeFieldEditorApp_static = new WeakSet();
onReplaceAll_fn = function() {
  if (!__privateGet(this, _find)) return;
  const { nodes, count } = findReplaceNodes(__privateGet(this, _working), __privateMethod(this, _NodeFieldEditorApp_instances, scope_fn).call(this, { replace: __privateGet(this, _replace) }));
  __privateSet(this, _working, nodes);
  __privateSet(this, _userEdited, true);
  __privateMethod(this, _NodeFieldEditorApp_instances, setStale_fn).call(this, false);
  this.render();
  ui.notifications.info(game.i18n.format("STORYFLOW_DUNGEONS_LAB.FieldEditor.Replaced", { count }));
};
onApply_fn = function() {
  var _a, _b;
  __privateSet(this, _applying, true);
  try {
    (_b = (_a = __privateGet(this, _canvas)) == null ? void 0 : _a.applyNodes) == null ? void 0 : _b.call(_a, __privateGet(this, _working));
  } finally {
    __privateSet(this, _applying, false);
  }
  __privateMethod(this, _NodeFieldEditorApp_instances, pullFromCanvas_fn).call(this);
  ui.notifications.info(game.i18n.localize("STORYFLOW_DUNGEONS_LAB.FieldEditor.Applied"));
};
onRefresh_fn = function() {
  __privateMethod(this, _NodeFieldEditorApp_instances, pullFromCanvas_fn).call(this);
};
onRevealNode_fn = function(event, target) {
  var _a, _b, _c;
  const id = (_a = target == null ? void 0 : target.dataset) == null ? void 0 : _a.nodeId;
  if (id) (_c = (_b = __privateGet(this, _canvas)) == null ? void 0 : _b.revealNode) == null ? void 0 : _c.call(_b, id);
};
__privateAdd(_NodeFieldEditorApp, _NodeFieldEditorApp_static);
__publicField(_NodeFieldEditorApp, "DEFAULT_OPTIONS", {
  id: "storyflow-field-editor",
  classes: [MODULE_ID, "storyflow-field-editor-window"],
  position: { width: 620, height: 680 },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.FieldEditor.Title",
    icon: "fa-solid fa-pen-to-square",
    resizable: true
  },
  actions: {
    replaceAll: __privateMethod(_NodeFieldEditorApp, _NodeFieldEditorApp_static, onReplaceAll_fn),
    applyFields: __privateMethod(_NodeFieldEditorApp, _NodeFieldEditorApp_static, onApply_fn),
    refreshFields: __privateMethod(_NodeFieldEditorApp, _NodeFieldEditorApp_static, onRefresh_fn),
    revealNode: __privateMethod(_NodeFieldEditorApp, _NodeFieldEditorApp_static, onRevealNode_fn)
  }
});
__publicField(_NodeFieldEditorApp, "PARTS", {
  main: { template: "modules/storyflow-dungeons-lab/templates/canvas/node-field-editor.hbs" }
});
let NodeFieldEditorApp = _NodeFieldEditorApp;
export {
  NodeFieldEditorApp
};
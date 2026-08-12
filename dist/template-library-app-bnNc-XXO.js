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
var _instance, _editor, _query, _searchRestoreFocus, _menuId, _renamingId, _confirmId, _insertedId, _flash, _flashTimer, _selectedId, _preview, _collapsed, _preFullscreen, _TemplateLibraryApp_instances, authoring_fn, toggleFullscreen_fn, bindDragAndDrop_fn, moveById_fn, drawPreview_fn, flashNote_fn, _TemplateLibraryApp_static, rowId_fn, lookup_fn, insertById_fn, commitRename_fn, onInsert_fn, onOpenMenu_fn, onCloseMenus_fn, onEdit_fn, onStartRename_fn, onAskDelete_fn, onCancelDelete_fn, onConfirmDelete_fn, onExport_fn, promptName_fn, onCreate_fn, onAddFolder_fn, onToggleFolder_fn, onRenameFolder_fn, onDeleteFolder_fn, onMoveTemplate_fn, onImport_fn, write_fn, promote_fn, demote_fn;
import { M as MODULE_ID, S as SETTINGS, r as readTemplateStore, a as readPresetStore, m as moveTemplate, n as nodePresentation, b as renameTemplate, d as deleteTemplate, c as buildTemplateExport, s as slugifyName, T as TEMPLATE_DIR, u as upsertTemplate, e as uniqueTemplateName, f as addFolder, g as renameFolder, h as deleteFolder, p as parseTemplateImport, w as writePresetStore, i as writeTemplateStore } from "./module-CGuPkFx8.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FLASH_MS = 2200;
const BUILTIN_FOLDER = { id: "__dungeons-lab", name: "Dungeons Lab" };
const MOVE_TO_PRESET = "__sf-preset-dest";
const esc = (s) => String(s ?? "").replace(
  /[&<>"']/g,
  (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
);
const L = (k) => game.i18n.localize(`STORYFLOW_DUNGEONS_LAB.Templates.${k}`);
const F = (k, data) => game.i18n.format(`STORYFLOW_DUNGEONS_LAB.Templates.${k}`, data);
function pickTextFile(accept = "") {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    if (accept) input.accept = accept;
    input.style.display = "none";
    input.addEventListener("change", async () => {
      var _a;
      const file = (_a = input.files) == null ? void 0 : _a[0];
      input.remove();
      resolve(file ? await file.text() : null);
    });
    document.body.appendChild(input);
    input.click();
  });
}
const _TemplateLibraryApp = class _TemplateLibraryApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _TemplateLibraryApp_instances);
    /**
     * @type {import("./blueprint-canvas-app.mjs").BlueprintCanvasApp|null}
     * родительский редактор.
     */
    __privateAdd(this, _editor, null);
    /**
     * @type {string} Активный поисковый запрос (подстрока без учета регистра в
     * имени).
     */
    __privateAdd(this, _query, "");
    /**
     * @type {boolean} Восстановить фокус на поле поиска после следующего
     * рендера.
     */
    __privateAdd(this, _searchRestoreFocus, false);
    /** @type {string|null} Строка, для которой открыто меню kebab. */
    __privateAdd(this, _menuId, null);
    /** @type {string|null} Строка, переименовываемая на месте. */
    __privateAdd(this, _renamingId, null);
    /** @type {string|null} Строка, показывающая подтверждение удаления на месте. */
    __privateAdd(this, _confirmId, null);
    /**
     * @type {string|null} Строка, у которой кнопка Insert отображает "Inserted
     * ✓".
     */
    __privateAdd(this, _insertedId, null);
    /**
     * @type {string|null} Временная подсказка в подвале ("… inserted into the
     * editor.").
     */
    __privateAdd(this, _flash, null);
    /** @type {ReturnType<typeof setTimeout>|null} */
    __privateAdd(this, _flashTimer, null);
    /** @type {string|null} Шаблон, отображаемый в панели предпросмотра справа. */
    __privateAdd(this, _selectedId, null);
    /**
     * @type {{name: string, graph: {nodes: object[], edges: object[]}}|null} Сохранено _prepareContext для
     * _onRender.
     */
    __privateAdd(this, _preview, null);
    /**
     * @type {Set<string>} Идентификаторы свернутых папок (только на время
     * сессии).
     */
    __privateAdd(this, _collapsed, /* @__PURE__ */ new Set());
    /**
     * @type {object|null} Позиция, сохраненная перед переходом в полноэкранный режим, или
     * null, когда не полноэкранный режим
     */
    __privateAdd(this, _preFullscreen, null);
  }
  /**
   * Открыть (или сфокусировать) библиотеку. Последний открывший становится целью
   * Insert.
   * @param {import("./blueprint-canvas-app.mjs").BlueprintCanvasApp} [editor]
   */
  static open(editor = null) {
    if (!__privateGet(_TemplateLibraryApp, _instance)) __privateSet(_TemplateLibraryApp, _instance, new _TemplateLibraryApp());
    const app = __privateGet(_TemplateLibraryApp, _instance);
    if (editor) __privateSet(app, _editor, editor);
    app.render(true);
    if (app.rendered) app.bringToFront();
    return app;
  }
  /**
   * Перерендерить библиотеку, если она открыта (хранилище изменилось в другом месте:
   * создание флоу, сохранение режима редактирования).
   */
  static refreshIfOpen() {
    var _a;
    if ((_a = __privateGet(_TemplateLibraryApp, _instance)) == null ? void 0 : _a.rendered) __privateGet(_TemplateLibraryApp, _instance).render();
  }
  /** @override */
  async _prepareContext() {
    const store = await readTemplateStore();
    const presetStore = await readPresetStore();
    const authoring = __privateMethod(this, _TemplateLibraryApp_instances, authoring_fn).call(this);
    const q = __privateGet(this, _query).trim().toLowerCase();
    const all = store.templates;
    const filtered = q ? all.filter((t) => t.name.toLowerCase().includes(q)) : all;
    const lang = game.i18n.lang || void 0;
    const rowFor = (t, { preset = false } = {}) => {
      const renaming = __privateGet(this, _renamingId) === t.id;
      const date = new Date(t.updatedAt ?? t.createdAt ?? Date.now()).toLocaleDateString(lang, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      return {
        id: t.id,
        selected: __privateGet(this, _selectedId) === t.id,
        name: t.name,
        meta: F("Meta", { nodes: t.graph.nodes.length, date }),
        confirming: __privateGet(this, _confirmId) === t.id,
        confirmHtml: F("DeleteConfirm", { name: `<strong>${esc(t.name)}</strong>` }),
        renaming,
        menuOpen: __privateGet(this, _menuId) === t.id,
        insertLabel: __privateGet(this, _insertedId) === t.id ? L("InsertedLabel") : L("InsertLabel"),
        inserted: __privateGet(this, _insertedId) === t.id,
        preset,
        // Строки пресетов можно перетаскивать (чтобы понизить), и они получают kebab только во время
        // авторинга; locked = только для чтения (только Insert). Строки мира всегда полностью интерактивны.
        draggable: preset ? authoring : true,
        lockedPreset: preset && !authoring
      };
    };
    const folders = store.folders ?? [];
    const folderOf = (t) => folders.some((f) => f.id === t.folderId) ? t.folderId : null;
    const items = [];
    const presets = presetStore.templates;
    const presetFiltered = q ? presets.filter((t) => t.name.toLowerCase().includes(q)) : presets;
    if (!q || presetFiltered.length) {
      const collapsed = !q && __privateGet(this, _collapsed).has(BUILTIN_FOLDER.id);
      items.push({
        isFolder: true,
        builtin: true,
        authoring,
        id: BUILTIN_FOLDER.id,
        name: BUILTIN_FOLDER.name,
        collapsed,
        count: presets.length
      });
      if (!collapsed) {
        items.push(...presetFiltered.map((t) => ({ ...rowFor(t, { preset: true }), inFolder: true })));
      }
    }
    for (const f of folders) {
      const inFolder = filtered.filter((t) => folderOf(t) === f.id);
      if (q && inFolder.length === 0) continue;
      const collapsed = !q && __privateGet(this, _collapsed).has(f.id);
      items.push({
        isFolder: true,
        id: f.id,
        name: f.name,
        collapsed,
        count: all.filter((t) => folderOf(t) === f.id).length
      });
      if (!collapsed) items.push(...inFolder.map((t) => ({ ...rowFor(t), inFolder: true })));
    }
    items.push(...filtered.filter((t) => folderOf(t) === null).map((t) => rowFor(t)));
    const selected = all.find((t) => t.id === __privateGet(this, _selectedId)) ?? presets.find((t) => t.id === __privateGet(this, _selectedId)) ?? null;
    if (!selected) __privateSet(this, _selectedId, null);
    __privateSet(this, _preview, selected ? { name: selected.name, graph: selected.graph } : null);
    const selectedIsPreset = !!selected && presets.some((t) => t.id === selected.id);
    const empty = all.length === 0 && presets.length === 0;
    const busy = __privateGet(this, _renamingId) !== null || __privateGet(this, _confirmId) !== null;
    const n = filtered.length + presetFiltered.length;
    return {
      query: __privateGet(this, _query),
      authoring,
      hasPreview: !!selected,
      previewName: (selected == null ? void 0 : selected.name) ?? "",
      previewId: (selected == null ? void 0 : selected.id) ?? "",
      // Заблокированный пресет можно вставить + предпросмотреть, но не отредактировать; кнопка Edit в предпросмотре скрывается.
      previewCanEdit: !!selected && (!selectedIsPreset || authoring),
      items,
      showEmpty: empty,
      showNoResults: !empty && n === 0,
      showList: !empty && n > 0,
      noResultsText: F("NoResults", { query: __privateGet(this, _query).trim() }),
      footerIcon: __privateGet(this, _flash) ? "fa-solid fa-circle-check" : "fa-solid fa-crown",
      footerNote: __privateGet(this, _flash) ?? (busy ? L("FooterIdle") : L("FooterHint")),
      countNote: empty ? "" : F(n === 1 ? "CountOne" : "CountMany", { count: n })
    };
  }
  /**
   * @override - видимый переключатель полноэкранного режима в заголовке окна (тот же
   * паттерн, что и у deck).
   */
  _onFirstRender(context, options) {
    super._onFirstRender(context, options);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "header-control icon fa-solid fa-expand";
    btn.dataset.tooltip = game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Deck.Fullscreen");
    btn.addEventListener("click", () => __privateMethod(this, _TemplateLibraryApp_instances, toggleFullscreen_fn).call(this, btn));
    this.window.close.before(btn);
  }
  /**
   * @override - подключать императивные части при каждом рендере (свежий DOM -> слушатели
   * не накапливаются): живой поиск (с восстановлением фокуса, чтобы ввод продолжал
   * работать между рендерами), поле переименования на месте (Enter/Esc/blur) и двойной
   * клик по строке для вставки.
   */
  _onRender(context, options) {
    super._onRender(context, options);
    const search = this.element.querySelector(".storyflow-tpl-search input");
    if (search) {
      search.addEventListener("input", () => {
        __privateSet(this, _query, search.value);
        __privateSet(this, _menuId, null);
        __privateSet(this, _searchRestoreFocus, true);
        this.render();
      });
      if (__privateGet(this, _searchRestoreFocus)) {
        __privateSet(this, _searchRestoreFocus, false);
        search.focus();
        search.setSelectionRange(search.value.length, search.value.length);
      }
    }
    const rename = this.element.querySelector(".storyflow-tpl-rename");
    if (rename) {
      rename.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          void __privateMethod(this, _TemplateLibraryApp_instances, commitRename_fn).call(this, rename.value);
        } else if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          __privateSet(this, _renamingId, null);
          this.render();
        }
      });
      rename.addEventListener("blur", () => void __privateMethod(this, _TemplateLibraryApp_instances, commitRename_fn).call(this, rename.value));
      rename.focus();
      rename.select();
    }
    for (const row of this.element.querySelectorAll(".storyflow-tpl-row")) {
      row.addEventListener("dblclick", () => {
        const id = row.dataset.templateId;
        if (id === __privateGet(this, _renamingId)) return;
        void __privateMethod(this, _TemplateLibraryApp_instances, insertById_fn).call(this, id);
      });
      row.addEventListener("click", (ev) => {
        if (ev.target.closest("button, input")) return;
        const id = row.dataset.templateId;
        if (id === __privateGet(this, _selectedId)) return;
        __privateSet(this, _selectedId, id);
        this.render();
      });
    }
    __privateMethod(this, _TemplateLibraryApp_instances, bindDragAndDrop_fn).call(this);
    __privateMethod(this, _TemplateLibraryApp_instances, drawPreview_fn).call(this, this.element.querySelector(".storyflow-tpl-preview-stage"));
    const scroll = this.element.querySelector(".storyflow-tpl-scroll");
    const menu = this.element.querySelector(".storyflow-tpl-menu");
    if (menu && scroll && menu.getBoundingClientRect().bottom > scroll.getBoundingClientRect().bottom) {
      menu.classList.add("open-up");
    }
  }
  /** @override */
  async _onClose(options) {
    if (__privateGet(this, _flashTimer)) clearTimeout(__privateGet(this, _flashTimer));
    __privateSet(this, _flashTimer, null);
    __privateSet(this, _editor, null);
    __privateSet(_TemplateLibraryApp, _instance, null);
    await super._onClose(options);
  }
};
_instance = new WeakMap();
_editor = new WeakMap();
_query = new WeakMap();
_searchRestoreFocus = new WeakMap();
_menuId = new WeakMap();
_renamingId = new WeakMap();
_confirmId = new WeakMap();
_insertedId = new WeakMap();
_flash = new WeakMap();
_flashTimer = new WeakMap();
_selectedId = new WeakMap();
_preview = new WeakMap();
_collapsed = new WeakMap();
_preFullscreen = new WeakMap();
_TemplateLibraryApp_instances = new WeakSet();
/**
 * Авторинг папок пресетов разблокирован? (клиентская настройка только для разработки,
 * по умолчанию false => заблокировано).
 */
authoring_fn = function() {
  return Boolean(game.settings.get(MODULE_ID, SETTINGS.PRESET_AUTHORING));
};
toggleFullscreen_fn = function(btn) {
  if (__privateGet(this, _preFullscreen)) {
    this.setPosition(__privateGet(this, _preFullscreen));
    __privateSet(this, _preFullscreen, null);
  } else {
    const { width, height, left, top } = this.position;
    __privateSet(this, _preFullscreen, { width, height, left, top });
    this.setPosition({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
  }
  btn.classList.toggle("fa-expand", !__privateGet(this, _preFullscreen));
  btn.classList.toggle("fa-compress", !!__privateGet(this, _preFullscreen));
};
/**
 * Перетащить строку шаблона на папку, чтобы разместить в ней; на фон списка, чтобы
 * исключить из папки.
 */
bindDragAndDrop_fn = function() {
  const MIME = "text/sf-template-id";
  for (const row of this.element.querySelectorAll(".storyflow-tpl-row[draggable]")) {
    row.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData(MIME, row.dataset.templateId);
      ev.dataTransfer.effectAllowed = "move";
      row.classList.add("is-dragging");
    });
    row.addEventListener("dragend", () => row.classList.remove("is-dragging"));
  }
  const scroll = this.element.querySelector(".storyflow-tpl-scroll");
  if (scroll) {
    scroll.addEventListener("dragover", (ev) => {
      if (ev.dataTransfer.types.includes(MIME)) ev.preventDefault();
    });
    scroll.addEventListener("drop", (ev) => {
      const id = ev.dataTransfer.getData(MIME);
      if (!id) return;
      ev.preventDefault();
      void __privateMethod(this, _TemplateLibraryApp_instances, moveById_fn).call(this, id, null);
    });
  }
  const authoring = __privateMethod(this, _TemplateLibraryApp_instances, authoring_fn).call(this);
  for (const folder of this.element.querySelectorAll(".storyflow-tpl-folder")) {
    if (folder.dataset.builtin === "1" && !authoring) continue;
    folder.addEventListener("dragover", (ev) => {
      if (!ev.dataTransfer.types.includes(MIME)) return;
      ev.preventDefault();
      folder.classList.add("drop-hover");
    });
    folder.addEventListener("dragleave", () => folder.classList.remove("drop-hover"));
    folder.addEventListener("drop", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      folder.classList.remove("drop-hover");
      const id = ev.dataTransfer.getData(MIME);
      if (id) void __privateMethod(this, _TemplateLibraryApp_instances, moveById_fn).call(this, id, folder.dataset.folderId);
    });
  }
};
moveById_fn = async function(templateId, folderId) {
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, templateId);
  if (!found) return;
  if (folderId === BUILTIN_FOLDER.id) {
    if (found.isPreset) return;
    return __privateMethod(this, _TemplateLibraryApp_instances, promote_fn).call(this, templateId);
  }
  if (found.isPreset) return __privateMethod(this, _TemplateLibraryApp_instances, demote_fn).call(this, templateId, folderId || null);
  if (folderId) __privateGet(this, _collapsed).delete(folderId);
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, moveTemplate(found.store, templateId, folderId));
};
/**
 * Статический превью в виде SVG только для чтения графа выбранного шаблона - простая
 * отрисовка данных, намеренно НЕ живой холст LiteGraph (контракт замороженного холста
 * остается нетронутым).
 */
drawPreview_fn = function(stage) {
  var _a, _b;
  if (!stage || !__privateGet(this, _preview)) return;
  const NW = 156, NH = 44, PAD = 40;
  const nodes = (__privateGet(this, _preview).graph.nodes ?? []).filter(
    (n) => n && Number.isFinite(n.x) && Number.isFinite(n.y)
  );
  if (!nodes.length) return;
  const NS = "http://www.w3.org/2000/svg";
  const groups = (__privateGet(this, _preview).graph.groups ?? []).filter(
    (g) => g && Number.isFinite(g.x) && Number.isFinite(g.y)
  );
  const xs = [...nodes.map((n) => n.x), ...groups.map((g) => g.x)];
  const ys = [...nodes.map((n) => n.y), ...groups.map((g) => g.y)];
  const minX = Math.min(...xs) - PAD;
  const minY = Math.min(...ys) - PAD;
  const maxX = Math.max(...nodes.map((n) => n.x + NW), ...groups.map((g) => g.x + (g.width ?? 0))) + PAD;
  const maxY = Math.max(...nodes.map((n) => n.y + NH), ...groups.map((g) => g.y + (g.height ?? 0))) + PAD;
  const svg = document.createElementNS(NS, "svg");
  svg.classList.add("storyflow-tpl-preview-svg");
  svg.setAttribute("viewBox", `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  for (const g of groups) {
    const rect = document.createElementNS(NS, "rect");
    rect.classList.add("storyflow-tpl-preview-group");
    rect.setAttribute("x", g.x);
    rect.setAttribute("y", g.y);
    rect.setAttribute("width", g.width ?? 200);
    rect.setAttribute("height", g.height ?? 120);
    rect.setAttribute("rx", 6);
    if (g.color) {
      rect.style.stroke = g.color;
      rect.style.fill = g.color;
    }
    svg.appendChild(rect);
    if (g.title) {
      const title = document.createElementNS(NS, "text");
      title.classList.add("storyflow-tpl-preview-group-title");
      title.setAttribute("x", g.x + 10);
      title.setAttribute("y", g.y + 22);
      title.textContent = g.title.length > 30 ? `${g.title.slice(0, 29)}…` : g.title;
      svg.appendChild(title);
    }
  }
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (const e of __privateGet(this, _preview).graph.edges ?? []) {
    const a = byId.get((_a = e == null ? void 0 : e.source) == null ? void 0 : _a.node);
    const b = byId.get((_b = e == null ? void 0 : e.target) == null ? void 0 : _b.node);
    if (!a || !b) continue;
    const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2;
    const dx = Math.max(40, Math.abs(x2 - x1) / 2);
    const path = document.createElementNS(NS, "path");
    path.classList.add("storyflow-tpl-preview-edge");
    path.setAttribute("d", `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
    svg.appendChild(path);
  }
  for (const n of nodes) {
    const p = nodePresentation(n.type);
    const rect = document.createElementNS(NS, "rect");
    rect.classList.add("storyflow-tpl-preview-node");
    rect.setAttribute("x", n.x);
    rect.setAttribute("y", n.y);
    rect.setAttribute("width", NW);
    rect.setAttribute("height", NH);
    rect.setAttribute("rx", 8);
    rect.style.stroke = p.color;
    svg.appendChild(rect);
    const strip = document.createElementNS(NS, "rect");
    strip.classList.add("storyflow-tpl-preview-strip");
    strip.setAttribute("x", n.x);
    strip.setAttribute("y", n.y);
    strip.setAttribute("width", 5);
    strip.setAttribute("height", NH);
    strip.setAttribute("rx", 2.5);
    strip.style.fill = p.color;
    svg.appendChild(strip);
    const text = document.createElementNS(NS, "text");
    text.classList.add("storyflow-tpl-preview-label");
    text.setAttribute("x", n.x + 15);
    text.setAttribute("y", n.y + NH / 2 + 4);
    const label = p.label;
    text.textContent = label.length > 20 ? `${label.slice(0, 19)}…` : label;
    svg.appendChild(text);
  }
  stage.replaceChildren(svg);
};
/**
 * Показать временную подсказку в подвале; также очищает метку "Inserted ✓", когда
 * она истекает.
 */
flashNote_fn = function(msg) {
  if (__privateGet(this, _flashTimer)) clearTimeout(__privateGet(this, _flashTimer));
  __privateSet(this, _flash, msg);
  __privateSet(this, _flashTimer, setTimeout(() => {
    __privateSet(this, _flash, null);
    __privateSet(this, _insertedId, null);
    __privateSet(this, _flashTimer, null);
    if (this.rendered) this.render();
  }, FLASH_MS));
  this.render();
};
_TemplateLibraryApp_static = new WeakSet();
rowId_fn = function(target) {
  var _a;
  return ((_a = target.closest("[data-template-id]")) == null ? void 0 : _a.dataset.templateId) ?? null;
};
lookup_fn = async function(id) {
  if (!id) return null;
  const presetStore = await readPresetStore();
  const preset = presetStore.templates.find((t) => t.id === id);
  if (preset) return { store: presetStore, template: preset, isPreset: true };
  const store = await readTemplateStore();
  const template = store.templates.find((t) => t.id === id);
  if (!template) {
    this.render();
    return null;
  }
  return { store, template, isPreset: false };
};
insertById_fn = async function(id) {
  var _a;
  if (!((_a = __privateGet(this, _editor)) == null ? void 0 : _a.rendered)) {
    ui.notifications.warn(L("InsertNoEditor"));
    return;
  }
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, id);
  if (!found) return;
  await this.minimize();
  __privateGet(this, _editor).beginTemplatePlacement(found.template, (placed) => {
    void this.maximize().then(() => this.bringToFront());
    if (!placed) return;
    __privateSet(this, _insertedId, found.template.id);
    __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashInserted", { name: found.template.name }));
  });
};
commitRename_fn = async function(value) {
  const id = __privateGet(this, _renamingId);
  if (!id) return;
  __privateSet(this, _renamingId, null);
  const trimmed = String(value ?? "").trim();
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, id);
  if (!found) return;
  if (!trimmed || trimmed === found.template.name) return this.render();
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, renameTemplate(found.store, id, trimmed), found.isPreset);
};
onInsert_fn = function(event, target) {
  var _a;
  void __privateMethod(this, _TemplateLibraryApp_instances, insertById_fn).call(this, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
};
onOpenMenu_fn = function(event, target) {
  var _a;
  const id = __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target);
  __privateSet(this, _menuId, __privateGet(this, _menuId) === id ? null : id);
  this.render();
};
onCloseMenus_fn = function() {
  __privateSet(this, _menuId, null);
  this.render();
};
onEdit_fn = async function(event, target) {
  var _a;
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  if (!found) return;
  __privateSet(this, _menuId, null);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashEditing", { name: found.template.name }));
  const { BlueprintCanvasApp } = await import("./module-CGuPkFx8.js").then((n) => n.au);
  await BlueprintCanvasApp.openTemplate(found.template.id, { preset: found.isPreset });
};
onStartRename_fn = function(event, target) {
  var _a;
  __privateSet(this, _menuId, null);
  __privateSet(this, _confirmId, null);
  __privateSet(this, _renamingId, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  this.render();
};
onAskDelete_fn = function(event, target) {
  var _a;
  __privateSet(this, _menuId, null);
  __privateSet(this, _renamingId, null);
  __privateSet(this, _confirmId, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  this.render();
};
onCancelDelete_fn = function() {
  __privateSet(this, _confirmId, null);
  this.render();
};
onConfirmDelete_fn = async function(event, target) {
  var _a;
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  __privateSet(this, _confirmId, null);
  if (!found) return;
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, deleteTemplate(found.store, found.template.id), found.isPreset);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashDeleted", { name: found.template.name }));
};
onExport_fn = async function(event, target) {
  var _a;
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  if (!found) return;
  __privateSet(this, _menuId, null);
  const { template } = found;
  const envelope = buildTemplateExport(template);
  const filename = `${slugifyName(template.name)}.storyflow-template.json`;
  const FP = foundry.applications.apps.FilePicker.implementation ?? foundry.applications.apps.FilePicker;
  try {
    await FP.createDirectory("data", TEMPLATE_DIR).catch(() => {
    });
    const file = new File([JSON.stringify(envelope, null, 2)], filename, { type: "application/json" });
    const result = await FP.upload("data", TEMPLATE_DIR, file, {}, { notify: false });
    const path = (result == null ? void 0 : result.path) ?? `${TEMPLATE_DIR}/${filename}`;
    await ChatMessage.create({
      content: `<p>${F("ExportChat", { name: esc(template.name), path: esc(path) })}</p>`,
      whisper: [game.user.id]
    });
    __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashExported", { name: template.name }));
  } catch (err) {
    console.error(`${MODULE_ID} | template export failed`, err);
    ui.notifications.error(L("ExportFailed"));
  }
};
/**
 * Маленький запрос имени (используется при создании/переименовании папки). @returns
 * {Promise<string|null>}
 */
promptName_fn = function(titleKey, current = "") {
  const { DialogV2 } = foundry.applications.api;
  return DialogV2.prompt({
    window: { title: L(titleKey) },
    content: `<input type="text" name="name" value="${esc(current)}" autofocus style="width:100%" />`,
    ok: { callback: (event, button) => button.form.elements.name.value.trim() },
    rejectClose: false
  }).catch(() => null);
};
onCreate_fn = async function() {
  const name = await __privateMethod(this, _TemplateLibraryApp_instances, promptName_fn).call(this, "CreateTitle");
  if (!name) return;
  const store = await readTemplateStore();
  const { store: next, template } = upsertTemplate(
    store,
    { name: uniqueTemplateName(store, name), graph: { nodes: [], edges: [] } },
    { idGen: () => foundry.utils.randomID(16) }
  );
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, next);
  __privateSet(this, _selectedId, template.id);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashEditing", { name: template.name }));
  const { BlueprintCanvasApp } = await import("./module-CGuPkFx8.js").then((n) => n.au);
  await BlueprintCanvasApp.openTemplate(template.id);
};
onAddFolder_fn = async function() {
  const name = await __privateMethod(this, _TemplateLibraryApp_instances, promptName_fn).call(this, "AddFolderTitle");
  if (!name) return;
  const store = await readTemplateStore();
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, addFolder(store, name, { idGen: () => foundry.utils.randomID(16) }).store);
};
onToggleFolder_fn = function(event, target) {
  var _a;
  const id = (_a = target.closest("[data-folder-id]")) == null ? void 0 : _a.dataset.folderId;
  if (!id) return;
  if (__privateGet(this, _collapsed).has(id)) __privateGet(this, _collapsed).delete(id);
  else __privateGet(this, _collapsed).add(id);
  this.render();
};
onRenameFolder_fn = async function(event, target) {
  var _a, _b, _c;
  const id = (_a = target.closest("[data-folder-id]")) == null ? void 0 : _a.dataset.folderId;
  const store = await readTemplateStore();
  const current = ((_c = (_b = store.folders) == null ? void 0 : _b.find((f) => f.id === id)) == null ? void 0 : _c.name) ?? "";
  const name = await __privateMethod(this, _TemplateLibraryApp_instances, promptName_fn).call(this, "RenameFolderTitle", current);
  if (!name || name === current) return;
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, renameFolder(store, id, name));
};
onDeleteFolder_fn = async function(event, target) {
  var _a, _b, _c;
  const id = (_a = target.closest("[data-folder-id]")) == null ? void 0 : _a.dataset.folderId;
  if (!id) return;
  const store = await readTemplateStore();
  const name = ((_c = (_b = store.folders) == null ? void 0 : _b.find((f) => f.id === id)) == null ? void 0 : _c.name) ?? "";
  const { DialogV2 } = foundry.applications.api;
  const ok = await DialogV2.confirm({
    window: { title: L("DeleteFolderTitle") },
    content: `<p>${F("DeleteFolderConfirm", { name: `<strong>${esc(name)}</strong>` })}</p>`,
    rejectClose: false
  }).catch(() => false);
  if (!ok) return;
  __privateGet(this, _collapsed).delete(id);
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, deleteFolder(store, id));
};
onMoveTemplate_fn = async function(event, target) {
  var _a;
  const found = await __privateMethod(this, _TemplateLibraryApp_instances, lookup_fn).call(this, __privateMethod(_a = _TemplateLibraryApp, _TemplateLibraryApp_static, rowId_fn).call(_a, target));
  if (!found) return;
  __privateSet(this, _menuId, null);
  const worldStore = found.isPreset ? await readTemplateStore() : found.store;
  const options = [`<option value="">${esc(L("MoveRoot"))}</option>`];
  for (const f of worldStore.folders ?? []) {
    const sel = !found.isPreset && f.id === found.template.folderId ? " selected" : "";
    options.push(`<option value="${esc(f.id)}"${sel}>${esc(f.name)}</option>`);
  }
  if (__privateMethod(this, _TemplateLibraryApp_instances, authoring_fn).call(this) && !found.isPreset) {
    options.push(`<option value="${MOVE_TO_PRESET}">${esc(L("MovePresetFolder"))}</option>`);
  }
  const { DialogV2 } = foundry.applications.api;
  const dest = await DialogV2.prompt({
    window: { title: L("MoveTitle") },
    content: `<select name="folder" style="width:100%">${options.join("")}</select>`,
    ok: { callback: (event2, button) => button.form.elements.folder.value },
    rejectClose: false
  }).catch(() => null);
  if (dest === null) return;
  if (dest === MOVE_TO_PRESET) return __privateMethod(this, _TemplateLibraryApp_instances, promote_fn).call(this, found.template.id);
  if (found.isPreset) return __privateMethod(this, _TemplateLibraryApp_instances, demote_fn).call(this, found.template.id, dest || null);
  if (dest) __privateGet(this, _collapsed).delete(dest);
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, moveTemplate(found.store, found.template.id, dest || null));
};
onImport_fn = async function() {
  const text = await pickTextFile(".json,application/json").catch(() => null);
  if (text == null) return;
  const result = parseTemplateImport(text);
  if (!result.ok) {
    ui.notifications.error(game.i18n.localize(`STORYFLOW_DUNGEONS_LAB.Templates.Error.${result.error}`));
    return;
  }
  const store = await readTemplateStore();
  const name = uniqueTemplateName(store, result.template.name);
  const { store: next } = upsertTemplate(store, { name, graph: result.template.graph }, {
    idGen: () => foundry.utils.randomID(16)
  });
  await __privateMethod(this, _TemplateLibraryApp_instances, write_fn).call(this, next);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("Imported", { name }));
};
write_fn = async function(store, isPreset = false) {
  try {
    if (isPreset) await writePresetStore(store);
    else await writeTemplateStore(store);
  } catch (err) {
    console.error(`${MODULE_ID} | template store write failed`, err);
    ui.notifications.error(L("SaveFailed"));
    return;
  }
  this.render();
};
promote_fn = async function(templateId) {
  const world = await readTemplateStore();
  const tpl = world.templates.find((t) => t.id === templateId);
  if (!tpl) return this.render();
  const preset = await readPresetStore();
  const name = uniqueTemplateName(preset, tpl.name);
  const { store: nextPreset } = upsertTemplate(
    preset,
    { name, graph: tpl.graph },
    { idGen: () => foundry.utils.randomID(16) }
  );
  try {
    await writePresetStore(nextPreset);
    await writeTemplateStore(deleteTemplate(world, templateId));
  } catch (err) {
    console.error(`${MODULE_ID} | preset promote failed`, err);
    ui.notifications.error(L("SaveFailed"));
    return;
  }
  __privateGet(this, _collapsed).delete(BUILTIN_FOLDER.id);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashPromoted", { name }));
};
demote_fn = async function(presetId, folderId) {
  const preset = await readPresetStore();
  const tpl = preset.templates.find((t) => t.id === presetId);
  if (!tpl) return this.render();
  const world = await readTemplateStore();
  const name = uniqueTemplateName(world, tpl.name);
  const { store: added, template } = upsertTemplate(
    world,
    { name, graph: tpl.graph },
    { idGen: () => foundry.utils.randomID(16) }
  );
  const nextWorld = folderId ? moveTemplate(added, template.id, folderId) : added;
  try {
    await writeTemplateStore(nextWorld);
    await writePresetStore(deleteTemplate(preset, presetId));
  } catch (err) {
    console.error(`${MODULE_ID} | preset demote failed`, err);
    ui.notifications.error(L("SaveFailed"));
    return;
  }
  if (folderId) __privateGet(this, _collapsed).delete(folderId);
  __privateMethod(this, _TemplateLibraryApp_instances, flashNote_fn).call(this, F("FlashDemoted", { name }));
};
__privateAdd(_TemplateLibraryApp, _TemplateLibraryApp_static);
/** @type {TemplateLibraryApp|null} Единственный экземпляр (singleton). */
__privateAdd(_TemplateLibraryApp, _instance, null);
__publicField(_TemplateLibraryApp, "DEFAULT_OPTIONS", {
  id: "storyflow-template-library",
  classes: [MODULE_ID, "storyflow-template-library"],
  position: { width: 1100, height: 620 },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Templates.LibraryTitle",
    resizable: true,
    icon: "fa-solid fa-layer-group"
  },
  actions: {
    importTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onImport_fn),
    insertTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onInsert_fn),
    openTemplateMenu: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onOpenMenu_fn),
    closeMenus: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onCloseMenus_fn),
    editTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onEdit_fn),
    startRename: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onStartRename_fn),
    exportTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onExport_fn),
    askDelete: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onAskDelete_fn),
    cancelDelete: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onCancelDelete_fn),
    confirmDeleteTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onConfirmDelete_fn),
    createTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onCreate_fn),
    addFolder: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onAddFolder_fn),
    toggleFolder: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onToggleFolder_fn),
    renameFolder: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onRenameFolder_fn),
    deleteFolder: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onDeleteFolder_fn),
    moveTemplate: __privateMethod(_TemplateLibraryApp, _TemplateLibraryApp_static, onMoveTemplate_fn)
  }
});
__publicField(_TemplateLibraryApp, "PARTS", {
  // `scrollable` позволяет миксину сохранять/восстанавливать прокрутку списка между рендерами
  // (клики по кнопкам, фильтр, переключение папок) - без него каждый рендер сбрасывается в начало.
  list: {
    template: "modules/storyflow-dungeons-lab/templates/canvas/template-library.hbs",
    scrollable: [".storyflow-tpl-scroll"]
  }
});
let TemplateLibraryApp = _TemplateLibraryApp;
export {
  TemplateLibraryApp
};
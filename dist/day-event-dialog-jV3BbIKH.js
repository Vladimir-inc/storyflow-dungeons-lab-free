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
var _date, _eventId, _kind, _graphMode, _stash, _StoryFlowDayEventDialog_static, onSave_fn, onCancel_fn, onEditGraph_fn;
import { M as MODULE_ID, o as getEvents, q as monthNames, a9 as GRAPH_PAGE_TYPE, aa as saveEvent } from "./module-C_DMsB8l.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const CALENDAR_FOLDER_NAME = "StoryFlow Calendar";
const CALENDAR_FOLDER_COLOR = "#D98F39";
function L(key, fallback) {
  var _a, _b;
  const full = `STORYFLOW_DUNGEONS_LAB.Calendar.${key}`;
  return ((_b = (_a = game.i18n) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, full)) ? game.i18n.localize(full) : fallback;
}
const _StoryFlowDayEventDialog = class _StoryFlowDayEventDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _date);
    // {year, month, day}
    __privateAdd(this, _eventId, null);
    __privateAdd(this, _kind, "notification");
    __privateAdd(this, _graphMode, "create");
    /** Значения формы, сохраняемые между условными перерисовками kind/graphMode. */
    __privateAdd(this, _stash, null);
  }
  static open({ date, eventId } = {}) {
    const app = new _StoryFlowDayEventDialog();
    __privateSet(app, _date, date);
    __privateSet(app, _eventId, eventId ?? null);
    const existing = eventId ? getEvents()[eventId] : null;
    if (existing) {
      __privateSet(app, _date, { year: existing.year, month: existing.month, day: existing.day });
      __privateSet(app, _kind, existing.kind);
      __privateSet(app, _graphMode, "pick");
    }
    app.render(true);
    return app;
  }
  async _prepareContext(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const context = await super._prepareContext(options);
    const existing = __privateGet(this, _eventId) ? getEvents()[__privateGet(this, _eventId)] : null;
    const months = monthNames();
    const dateName = `${__privateGet(this, _date).day} ${months[__privateGet(this, _date).month]} ${__privateGet(this, _date).year}`;
    const graphPages = [];
    for (const entry of ((_a = game.journal) == null ? void 0 : _a.contents) ?? []) {
      for (const page of ((_b = entry.pages) == null ? void 0 : _b.contents) ?? []) {
        if (page.type === GRAPH_PAGE_TYPE)
          graphPages.push({
            uuid: page.uuid,
            name: `${entry.name} · ${page.name}`,
            on: page.uuid === (((_c = __privateGet(this, _stash)) == null ? void 0 : _c.pageUuid) ?? (existing == null ? void 0 : existing.pageUuid))
          });
      }
    }
    Object.assign(context, {
      dateText: dateName,
      hour: ((_d = __privateGet(this, _stash)) == null ? void 0 : _d.hour) ?? (existing == null ? void 0 : existing.hour) ?? 8,
      minute: ((_e = __privateGet(this, _stash)) == null ? void 0 : _e.minute) ?? (existing == null ? void 0 : existing.minute) ?? 0,
      label: ((_f = __privateGet(this, _stash)) == null ? void 0 : _f.label) ?? (existing == null ? void 0 : existing.label) ?? "",
      text: ((_g = __privateGet(this, _stash)) == null ? void 0 : _g.text) ?? (existing == null ? void 0 : existing.text) ?? "",
      isNotification: __privateGet(this, _kind) === "notification",
      isGraph: __privateGet(this, _kind) === "graph",
      audienceGm: ((existing == null ? void 0 : existing.audience) ?? "gm") === "gm",
      audienceAll: (existing == null ? void 0 : existing.audience) === "all",
      createNew: __privateGet(this, _graphMode) === "create",
      graphName: ((_h = __privateGet(this, _stash)) == null ? void 0 : _h.graphName) ?? L("EventGraphName", `Event - ${dateName}`).replace("{date}", dateName),
      graphPages,
      saveLabel: existing ? L("SaveEvent", "Save Event") : L("CreateEvent", "Create Event")
    });
    return context;
  }
  /**
   * Радиокнопки управляют условными секциями → перерисовка при изменении (подводный камень
   * декларативного showIf). Сначала сохранить общие поля, чтобы переключение kind никогда
   * не стирало то, что уже ввел ГМ.
   */
  _onRender(context, options) {
    var _a;
    (_a = super._onRender) == null ? void 0 : _a.call(this, context, options);
    const stashThenRender = () => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
      const form = this.element.querySelector("form");
      __privateSet(this, _stash, {
        hour: (_a2 = form.elements.hour) == null ? void 0 : _a2.value,
        minute: (_b = form.elements.minute) == null ? void 0 : _b.value,
        label: (_c = form.elements.label) == null ? void 0 : _c.value,
        text: ((_d = form.elements.text) == null ? void 0 : _d.value) ?? ((_e = __privateGet(this, _stash)) == null ? void 0 : _e.text),
        graphName: ((_f = form.elements.graphName) == null ? void 0 : _f.value) ?? ((_g = __privateGet(this, _stash)) == null ? void 0 : _g.graphName),
        pageUuid: ((_h = form.elements.pageUuid) == null ? void 0 : _h.value) ?? ((_i = __privateGet(this, _stash)) == null ? void 0 : _i.pageUuid)
      });
      void this.render({ parts: ["body"] });
    };
    for (const radio of this.element.querySelectorAll("input[name=kind]")) {
      radio.addEventListener("change", (ev) => {
        __privateSet(this, _kind, ev.target.value);
        stashThenRender();
      });
    }
    for (const radio of this.element.querySelectorAll("input[name=graphMode]")) {
      radio.addEventListener("change", (ev) => {
        __privateSet(this, _graphMode, ev.target.value);
        stashThenRender();
      });
    }
  }
};
_date = new WeakMap();
_eventId = new WeakMap();
_kind = new WeakMap();
_graphMode = new WeakMap();
_stash = new WeakMap();
_StoryFlowDayEventDialog_static = new WeakSet();
onSave_fn = async function() {
  var _a, _b, _c, _d;
  const form = this.element.querySelector("form");
  const get = (name2) => {
    var _a2;
    return (_a2 = form.elements[name2]) == null ? void 0 : _a2.value;
  };
  const clampInt = (v, min, max, dflt) => {
    const n = Number.parseInt(v, 10);
    return Math.min(max, Math.max(min, Number.isNaN(n) ? dflt : n));
  };
  const base = {
    id: __privateGet(this, _eventId) ?? foundry.utils.randomID(),
    ...__privateGet(this, _date),
    hour: clampInt(get("hour"), 0, 23, 8),
    minute: clampInt(get("minute"), 0, 59, 0),
    label: String(get("label") ?? "").trim(),
    kind: __privateGet(this, _kind),
    fired: false
    // редактирование снова активирует событие
  };
  if (__privateGet(this, _kind) === "notification") {
    const text = String(get("text") ?? "").trim();
    if (!text && !base.label)
      return void ((_a = ui.notifications) == null ? void 0 : _a.warn(L("NeedText", "Enter the notification text.")));
    await saveEvent({
      ...base,
      text,
      audience: get("audience") === "all" ? "all" : "gm",
      label: base.label || text.slice(0, 40)
    });
    return void this.close();
  }
  if (__privateGet(this, _graphMode) === "pick") {
    const pageUuid = get("pageUuid");
    if (!pageUuid) return void ((_b = ui.notifications) == null ? void 0 : _b.warn(L("NeedGraph", "Pick a graph page.")));
    const page = await fromUuid(pageUuid).catch(() => null);
    await saveEvent({ ...base, pageUuid, label: base.label || (page == null ? void 0 : page.name) || "" });
    return void this.close();
  }
  const name = String(get("graphName") ?? "").trim() || base.label || "Calendar Event";
  try {
    const folder = ((_c = game.folders) == null ? void 0 : _c.find((f) => f.type === "JournalEntry" && f.name === CALENDAR_FOLDER_NAME)) ?? await Folder.create({
      name: CALENDAR_FOLDER_NAME,
      type: "JournalEntry",
      color: CALENDAR_FOLDER_COLOR
    });
    const entry = await JournalEntry.create({ name, folder: (folder == null ? void 0 : folder.id) ?? null });
    const [page] = await entry.createEmbeddedDocuments("JournalEntryPage", [
      { name, type: GRAPH_PAGE_TYPE }
    ]);
    const startId = foundry.utils.randomID();
    await page.update({
      "system.nodes": {
        [startId]: { id: startId, type: "trigger.start", x: 400, y: 260, data: {} }
      },
      "system.meta.entry": startId
    });
    await saveEvent({ ...base, pageUuid: page.uuid, label: base.label || name });
    this.close();
    const { BlueprintCanvasApp } = await import("./module-C_DMsB8l.js").then((n) => n.al);
    BlueprintCanvasApp.open(page);
  } catch (err) {
    console.warn(`${MODULE_ID} | calendar create-graph failed:`, err);
    (_d = ui.notifications) == null ? void 0 : _d.warn(L("CreateGraphFail", "Could not create the graph page."));
  }
};
onCancel_fn = function() {
  void this.close();
};
onEditGraph_fn = async function() {
  var _a, _b, _c;
  const pageUuid = (_b = (_a = this.element.querySelector("form")) == null ? void 0 : _a.elements.pageUuid) == null ? void 0 : _b.value;
  const page = pageUuid ? await fromUuid(pageUuid).catch(() => null) : null;
  if (!page) return void ((_c = ui.notifications) == null ? void 0 : _c.warn(L("NeedGraph", "Pick a graph page.")));
  const { BlueprintCanvasApp } = await import("./module-C_DMsB8l.js").then((n) => n.al);
  BlueprintCanvasApp.open(page);
};
__privateAdd(_StoryFlowDayEventDialog, _StoryFlowDayEventDialog_static);
__publicField(_StoryFlowDayEventDialog, "DEFAULT_OPTIONS", {
  id: "storyflow-day-event",
  classes: [MODULE_ID, "storyflow-day-event-dialog"],
  position: { width: 420, height: "auto" },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Calendar.EventTitle",
    icon: "fa-solid fa-calendar-plus"
  },
  actions: {
    save: __privateMethod(_StoryFlowDayEventDialog, _StoryFlowDayEventDialog_static, onSave_fn),
    cancel: __privateMethod(_StoryFlowDayEventDialog, _StoryFlowDayEventDialog_static, onCancel_fn),
    editGraph: __privateMethod(_StoryFlowDayEventDialog, _StoryFlowDayEventDialog_static, onEditGraph_fn)
  }
});
__publicField(_StoryFlowDayEventDialog, "PARTS", {
  body: { template: `modules/${MODULE_ID}/templates/calendar/day-event-dialog.hbs` }
});
let StoryFlowDayEventDialog = _StoryFlowDayEventDialog;
export {
  StoryFlowDayEventDialog
};
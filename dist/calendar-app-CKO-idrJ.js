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
var _instance, _view, _selected, _draft, _rollText, _condMenuOpen, _StoryFlowCalendarApp_instances, fitToScreen_fn, _onWinResize, _refresh, selectDay_fn, openEventDialog_fn, _StoryFlowCalendarApp_static, onPrevMonth_fn, onNextMonth_fn, onGoToday_fn, onSelectDay_fn, onToggleCondMenu_fn, onSetCondition_fn, onTempUp_fn, onTempDown_fn, onRollWeather_fn, onApplyWeather_fn, onClearWeather_fn, onAddEvent_fn, onEditEvent_fn, onDeleteEvent_fn, onOpenSeasons_fn, bumpScale_fn, onScaleDown_fn, onScaleUp_fn, onOpenHelp_fn;
import { M as MODULE_ID, j as calendarScale, k as dateFromWorldTime, l as getWeatherMap, o as groupEventsByDay, q as getEvents, t as monthNames, v as buildDayPanel, x as compareDate, C as CONDITIONS, y as buildMonthGrid, W as WINDS, z as seasonOf, A as dayKey, B as pickWeather, D as getSeasons, E as setDayWeather, F as applySceneWeather, G as clearDayWeather, H as deleteEvent, S as SETTINGS, I as MONTHS_PER_YEAR, J as moonName, K as moonPhase } from "./module-6vV2bj2T.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
function L(key, fallback) {
  var _a, _b;
  const full = `STORYFLOW_DUNGEONS_LAB.Calendar.${key}`;
  return ((_b = (_a = game.i18n) == null ? void 0 : _a.has) == null ? void 0 : _b.call(_a, full)) ? game.i18n.localize(full) : fallback;
}
const _StoryFlowCalendarApp = class _StoryFlowCalendarApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _StoryFlowCalendarApp_instances);
    /** Viewed month/year + selected day + weather draft (GM-side, not persisted until Apply). */
    __privateAdd(this, _view, null);
    // {year, month}
    __privateAdd(this, _selected, null);
    // {year, month, day}
    __privateAdd(this, _draft, { cond: "overcast", temp: 6, wind: "light" });
    __privateAdd(this, _rollText, null);
    __privateAdd(this, _condMenuOpen, false);
    __privateAdd(this, _onWinResize, foundry.utils.debounce(() => __privateMethod(this, _StoryFlowCalendarApp_instances, fitToScreen_fn).call(this), 150));
    /** Refresh (debounced) on world-time + calendar-data changes while open. */
    __privateAdd(this, _refresh, foundry.utils.debounce(() => this.rendered && this.render({ parts: ["body"] }), 100));
  }
  /** Scale the design's 1180×760 frame by the 1920×1080-relative factor (content zooms in CSS). */
  _initializeApplicationOptions(options) {
    const opts = super._initializeApplicationOptions(options);
    const s = calendarScale();
    opts.position.width = Math.min(
      Math.round(opts.position.width * s),
      Math.floor(window.innerWidth * 0.95)
    );
    opts.position.height = Math.min(
      Math.round(opts.position.height * s),
      Math.floor(window.innerHeight * 0.92)
    );
    return opts;
  }
  static open() {
    var _a;
    let app = __privateGet(_StoryFlowCalendarApp, _instance);
    if (!app) app = __privateSet(_StoryFlowCalendarApp, _instance, new _StoryFlowCalendarApp());
    if (app.rendered) {
      app.bringToFront();
      __privateMethod(_a = app, _StoryFlowCalendarApp_instances, fitToScreen_fn).call(_a);
      void app.render();
    } else app.render(true);
    return app;
  }
  _onFirstRender(context, options) {
    var _a;
    (_a = super._onFirstRender) == null ? void 0 : _a.call(this, context, options);
    Hooks.on("updateWorldTime", __privateGet(this, _refresh));
    Hooks.on(`${MODULE_ID}.calendarChanged`, __privateGet(this, _refresh));
    window.addEventListener("resize", __privateGet(this, _onWinResize));
  }
  close(options) {
    Hooks.off("updateWorldTime", __privateGet(this, _refresh));
    Hooks.off(`${MODULE_ID}.calendarChanged`, __privateGet(this, _refresh));
    window.removeEventListener("resize", __privateGet(this, _onWinResize));
    return super.close({ ...options, animate: false });
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const isGM = game.user.isGM;
    const today = dateFromWorldTime(game.time.worldTime);
    __privateGet(this, _view) ?? __privateSet(this, _view, { year: today.year, month: today.month });
    __privateGet(this, _selected) ?? __privateSet(this, _selected, { year: today.year, month: today.month, day: today.day });
    const weatherMap = getWeatherMap();
    const eventsByDay = groupEventsByDay(getEvents());
    const months = monthNames();
    const weekdaysFull = Array.fromRange(7).map((i) => L(`WeekdaysFull.${i}`, `Day ${i + 1}`));
    const panel = buildDayPanel({ selected: __privateGet(this, _selected), today, weatherMap, eventsByDay, isGM });
    for (const ev of panel.events)
      ev.broken = ev.isGraph && !ev.fired && !fromUuidSync(ev.pageUuid ?? "");
    const isSelectedToday = compareDate(__privateGet(this, _selected), today) === 0;
    panel.kicker = panel.isFuture ? L("Kicker.ahead", "Days Ahead") : isSelectedToday ? L("Kicker.today", "Today") : L("Kicker.chronicle", "The Chronicle");
    panel.dateText = `${__privateGet(this, _selected).day} ${months[__privateGet(this, _selected).month]} · ${weekdaysFull[panel.weekday]}`;
    panel.seasonLabel = L(`Seasons.${panel.season}`, panel.season);
    panel.moonLabel = L(`Moon.${panel.moonKey}`, panel.moonKey);
    const selW = panel.weather;
    if (selW) {
      const c = CONDITIONS[selW.cond];
      panel.weather = {
        ...selW,
        icon: (c == null ? void 0 : c.icon) ?? "fa-cloud",
        color: (c == null ? void 0 : c.color) ?? "",
        label: L(`Conditions.${selW.cond}`, selW.cond),
        meta: `${selW.temp}°C · ${L(`Winds.${selW.wind}`, selW.wind)}`,
        flavor: L(`Flavor.${selW.cond}`, "")
      };
    }
    context.isGM = isGM;
    context.headerSummary = `${L(`Moon.${moonName(moonPhase(today.month, today.day))}`, "")} · ${L(`Seasons.${seasonOf(today.month)}`, "")}`;
    context.monthTitle = `${months[__privateGet(this, _view).month]} ${__privateGet(this, _view).year}`;
    context.weekdays = Array.fromRange(7).map((i) => L(`Weekdays.${i}`, ""));
    context.days = buildMonthGrid({
      viewYear: __privateGet(this, _view).year,
      viewMonth: __privateGet(this, _view).month,
      today,
      selected: __privateGet(this, _selected),
      weatherMap,
      eventsByDay,
      isGM
    });
    context.panel = panel;
    const draftMeta = CONDITIONS[__privateGet(this, _draft).cond];
    context.condMenu = {
      open: __privateGet(this, _condMenuOpen),
      icon: (draftMeta == null ? void 0 : draftMeta.icon) ?? "fa-cloud",
      color: (draftMeta == null ? void 0 : draftMeta.color) ?? "var(--storyflow-text-faint)",
      label: L(`Conditions.${__privateGet(this, _draft).cond}`, __privateGet(this, _draft).cond)
    };
    context.condItems = Object.entries(CONDITIONS).map(([key, c], i) => ({
      key,
      icon: c.icon,
      color: c.color,
      label: L(`Conditions.${key}`, key),
      flavor: L(`Flavor.${key}`, ""),
      on: __privateGet(this, _draft).cond === key,
      // Per-item stagger delay for the entry animation.
      delay: `${i * 22}ms`
    }));
    context.windOptions = WINDS.map((w) => ({
      key: w,
      label: L(`Winds.${w}`, w),
      on: __privateGet(this, _draft).wind === w
    }));
    context.draftTempText = `${__privateGet(this, _draft).temp}°C`;
    context.rollText = __privateGet(this, _rollText) ?? L("RollHint", `1d20 vs. the ${seasonOf(__privateGet(this, _selected).month)} table`);
    context.applyLabel = selW ? L("UpdateWeather", "Update Weather") : L("ChartWeather", "Chart Weather");
    context.canClear = isGM && Boolean(selW);
    context.showEmptyBanner = isGM && Object.keys(weatherMap).length === 0;
    context.footerIcon = isGM ? "fa-crown" : "fa-eye";
    context.footerNote = isGM ? L("FooterGm", "GM · charted weather is revealed to players when its day dawns") : L("FooterPlayer", "Player · the calendar is read-only; only revealed weather is shown");
    return context;
  }
  /** Wire the non-action listeners: wind <select> (never data-action) + day double-click. */
  _onRender(context, options) {
    var _a, _b;
    (_a = super._onRender) == null ? void 0 : _a.call(this, context, options);
    (_b = this.element.querySelector("select[name=wind]")) == null ? void 0 : _b.addEventListener("change", (ev) => {
      __privateGet(this, _draft).wind = ev.target.value;
    });
    for (const cell of this.element.querySelectorAll("[data-day]")) {
      cell.addEventListener("dblclick", () => {
        if (game.user.isGM) __privateMethod(this, _StoryFlowCalendarApp_instances, openEventDialog_fn).call(this, { day: Number(cell.dataset.day) });
      });
    }
    const close = () => {
      if (!__privateGet(this, _condMenuOpen)) return;
      __privateSet(this, _condMenuOpen, false);
      void this.render({ parts: ["body"] });
    };
    if (this.element.dataset.sfCondMenuBound !== "1") {
      this.element.dataset.sfCondMenuBound = "1";
      this.element.addEventListener("click", (ev) => {
        if (!(ev.target instanceof Element) || !ev.target.closest(".cal-cond-menu")) close();
      });
      this.element.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") close();
      });
    }
    const menuRoot = this.element.querySelector(".cal-cond-menu");
    if (!menuRoot) return;
    for (const item of menuRoot.querySelectorAll(".cal-cond-item")) {
      item.addEventListener("pointerdown", (ev) => rippleAt(item, ev));
    }
    if (__privateGet(this, _condMenuOpen)) {
      const panel = menuRoot.querySelector(".cal-cond-panel");
      const scroller = this.element.querySelector(".cal-day-panel");
      if (panel && scroller) {
        const overshoot = panel.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom;
        if (overshoot > 0) scroller.scrollTop += overshoot;
      }
    }
  }
};
_instance = new WeakMap();
_view = new WeakMap();
_selected = new WeakMap();
_draft = new WeakMap();
_rollText = new WeakMap();
_condMenuOpen = new WeakMap();
_StoryFlowCalendarApp_instances = new WeakSet();
/**
 * Size the frame from the 1180×760 design default × the 1920×1080-relative scale factor
 * (always from the default, so a re-grown screen gets the full size back), clamp it to
 * the viewport, and keep it fully on screen. The CONTENT scales via `zoom:
 * var(--sf-cal-scale)` in calendar.less — the frame here just matches it. Runs on open
 * and, debounced, on every browser-window resize while rendered.
 */
fitToScreen_fn = function() {
  if (!this.rendered) return;
  const { width: dw, height: dh } = _StoryFlowCalendarApp.DEFAULT_OPTIONS.position;
  const s = calendarScale();
  const width = Math.min(Math.round(dw * s), Math.floor(window.innerWidth * 0.95));
  const height = Math.min(Math.round(dh * s), Math.floor(window.innerHeight * 0.92));
  const left = Math.max(0, Math.min(this.position.left ?? 0, window.innerWidth - width));
  const top = Math.max(0, Math.min(this.position.top ?? 0, window.innerHeight - height));
  this.setPosition({ width, height, left, top });
};
_onWinResize = new WeakMap();
_refresh = new WeakMap();
/** Select a day → seed the draft from its charted weather (design behavior). */
selectDay_fn = function(day) {
  __privateSet(this, _selected, { year: __privateGet(this, _view).year, month: __privateGet(this, _view).month, day });
  const w = getWeatherMap()[dayKey(__privateGet(this, _selected))];
  __privateSet(this, _draft, w ? { cond: w.cond, temp: w.temp, wind: w.wind } : { cond: "overcast", temp: 6, wind: "light" });
  __privateSet(this, _rollText, null);
  __privateSet(this, _condMenuOpen, false);
  void this.render({ parts: ["body"] });
};
openEventDialog_fn = async function({ day, eventId } = {}) {
  if (day) __privateMethod(this, _StoryFlowCalendarApp_instances, selectDay_fn).call(this, day);
  const { StoryFlowDayEventDialog } = await import("./day-event-dialog-Bbnc8qk3.js");
  StoryFlowDayEventDialog.open({ date: { ...__privateGet(this, _selected) }, eventId });
};
_StoryFlowCalendarApp_static = new WeakSet();
onPrevMonth_fn = function() {
  __privateSet(this, _view, shiftMonth(__privateGet(this, _view), -1));
  void this.render({ parts: ["body"] });
};
onNextMonth_fn = function() {
  __privateSet(this, _view, shiftMonth(__privateGet(this, _view), 1));
  void this.render({ parts: ["body"] });
};
onGoToday_fn = function() {
  const t = dateFromWorldTime(game.time.worldTime);
  __privateSet(this, _view, { year: t.year, month: t.month });
  __privateMethod(this, _StoryFlowCalendarApp_instances, selectDay_fn).call(this, t.day);
};
onSelectDay_fn = function(_ev, target) {
  __privateMethod(this, _StoryFlowCalendarApp_instances, selectDay_fn).call(this, Number(target.dataset.day));
};
onToggleCondMenu_fn = function() {
  __privateSet(this, _condMenuOpen, !__privateGet(this, _condMenuOpen));
  void this.render({ parts: ["body"] });
};
onSetCondition_fn = function(_ev, target) {
  __privateGet(this, _draft).cond = target.dataset.cond;
  __privateSet(this, _condMenuOpen, false);
  void this.render({ parts: ["body"] });
};
onTempUp_fn = function() {
  __privateGet(this, _draft).temp += 1;
  void this.render({ parts: ["body"] });
};
onTempDown_fn = function() {
  __privateGet(this, _draft).temp -= 1;
  void this.render({ parts: ["body"] });
};
onRollWeather_fn = function() {
  const season = seasonOf(__privateGet(this, _selected).month);
  const w = pickWeather(getSeasons()[season]);
  __privateSet(this, _draft, { cond: w.cond, temp: w.temp, wind: w.wind });
  __privateSet(this, _rollText, `${L(`Conditions.${w.cond}`, w.cond)}, ${w.temp}°C, ${L(`Winds.${w.wind}`, w.wind)}`);
  void this.render({ parts: ["body"] });
};
onApplyWeather_fn = async function() {
  const key = dayKey(__privateGet(this, _selected));
  const entry = {
    cond: __privateGet(this, _draft).cond,
    temp: __privateGet(this, _draft).temp,
    wind: __privateGet(this, _draft).wind,
    source: "charted"
  };
  await setDayWeather(key, entry);
  if (key === dayKey(dateFromWorldTime(game.time.worldTime))) await applySceneWeather(entry);
};
onClearWeather_fn = async function() {
  await clearDayWeather(dayKey(__privateGet(this, _selected)));
};
onAddEvent_fn = function() {
  void __privateMethod(this, _StoryFlowCalendarApp_instances, openEventDialog_fn).call(this, {});
};
onEditEvent_fn = function(_ev, target) {
  void __privateMethod(this, _StoryFlowCalendarApp_instances, openEventDialog_fn).call(this, { eventId: target.dataset.eventId });
};
onDeleteEvent_fn = async function(_ev, target) {
  await deleteEvent(target.dataset.eventId);
};
onOpenSeasons_fn = async function() {
  const { StoryFlowPlaneSettingsApp } = await import("./plane-settings-app-D1M9ZN-8.js");
  StoryFlowPlaneSettingsApp.open();
};
bumpScale_fn = async function(delta) {
  const cur = Number(game.settings.get(MODULE_ID, SETTINGS.CALENDAR_USER_SCALE)) || 1;
  const next = Math.min(1.6, Math.max(0.6, Math.round((cur + delta) * 20) / 20));
  if (next === cur) return;
  await game.settings.set(MODULE_ID, SETTINGS.CALENDAR_USER_SCALE, next);
  __privateMethod(this, _StoryFlowCalendarApp_instances, fitToScreen_fn).call(this);
};
onScaleDown_fn = function() {
  void __privateMethod(this, _StoryFlowCalendarApp_instances, bumpScale_fn).call(this, -0.1);
};
onScaleUp_fn = function() {
  void __privateMethod(this, _StoryFlowCalendarApp_instances, bumpScale_fn).call(this, 0.1);
};
onOpenHelp_fn = function() {
  const sections = ["Nav", "Weather", "Events", "Seasons", "Widget", "Scale", "PerfMode"];
  const content = sections.map(
    (s) => `<p><strong>${L(`Help.${s}.Title`, s)}</strong><br>${L(`Help.${s}.Body`, "")}</p>`
  ).join("");
  void foundry.applications.api.DialogV2.prompt({
    window: { title: L("HelpTitle", "Calendar — Help"), icon: "fa-solid fa-circle-info" },
    position: { width: 480 },
    content,
    ok: { label: L("HelpClose", "Got it") }
  });
};
__privateAdd(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static);
__privateAdd(_StoryFlowCalendarApp, _instance, null);
__publicField(_StoryFlowCalendarApp, "DEFAULT_OPTIONS", {
  id: "storyflow-calendar",
  classes: [MODULE_ID, "storyflow-calendar"],
  position: { width: 1180, height: 760 },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Calendar.Title",
    resizable: false,
    icon: "fa-solid fa-calendar-days"
  },
  actions: {
    prevMonth: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onPrevMonth_fn),
    nextMonth: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onNextMonth_fn),
    goToday: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onGoToday_fn),
    selectDay: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onSelectDay_fn),
    toggleCondMenu: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onToggleCondMenu_fn),
    setCondition: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onSetCondition_fn),
    tempUp: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onTempUp_fn),
    tempDown: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onTempDown_fn),
    rollWeather: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onRollWeather_fn),
    applyWeather: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onApplyWeather_fn),
    clearWeather: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onClearWeather_fn),
    addEvent: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onAddEvent_fn),
    editEvent: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onEditEvent_fn),
    deleteEvent: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onDeleteEvent_fn),
    openSeasons: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onOpenSeasons_fn),
    openHelp: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onOpenHelp_fn),
    scaleDown: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onScaleDown_fn),
    scaleUp: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onScaleUp_fn)
  }
});
__publicField(_StoryFlowCalendarApp, "PARTS", { body: { template: `modules/${MODULE_ID}/templates/calendar/app.hbs` } });
let StoryFlowCalendarApp = _StoryFlowCalendarApp;
function rippleAt(el, ev) {
  const rect = el.getBoundingClientRect();
  const span = document.createElement("span");
  span.className = "cal-ripple";
  const size = Math.max(rect.width, rect.height);
  span.style.width = span.style.height = `${size}px`;
  span.style.left = `${ev.clientX - rect.left - size / 2}px`;
  span.style.top = `${ev.clientY - rect.top - size / 2}px`;
  el.appendChild(span);
  span.animate(
    [
      { transform: "scale(0)", opacity: 0.35 },
      { transform: "scale(2.2)", opacity: 0 }
    ],
    { duration: 480, easing: "ease-out" }
  ).finished.catch(() => {
  }).finally(() => span.remove());
}
function shiftMonth({ year, month }, delta) {
  const m = month + delta;
  const yearShift = Math.floor(m / MONTHS_PER_YEAR);
  return {
    year: year + yearShift,
    month: (m % MONTHS_PER_YEAR + MONTHS_PER_YEAR) % MONTHS_PER_YEAR
  };
}
export {
  StoryFlowCalendarApp
};
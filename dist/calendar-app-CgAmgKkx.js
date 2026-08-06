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
var _instance, _view, _selected, _draft, _rollText, _condMenuOpen, _refresh, _StoryFlowCalendarApp_instances, selectDay_fn, openEventDialog_fn, _StoryFlowCalendarApp_static, onPrevMonth_fn, onNextMonth_fn, onGoToday_fn, onSelectDay_fn, onToggleCondMenu_fn, onSetCondition_fn, onTempUp_fn, onTempDown_fn, onRollWeather_fn, onApplyWeather_fn, onClearWeather_fn, onAddEvent_fn, onEditEvent_fn, onDeleteEvent_fn, onOpenSeasons_fn;
import { M as MODULE_ID, j as dateFromWorldTime, k as getWeatherMap, l as groupEventsByDay, o as getEvents, q as monthNames, t as buildDayPanel, v as compareDate, C as CONDITIONS, x as moonName, y as moonPhase, z as buildMonthGrid, W as WINDS, A as seasonOf, B as dayKey, D as pickWeather, E as getSeasons, F as setDayWeather, G as applySceneWeather, H as clearDayWeather, I as deleteEvent, J as MONTHS_PER_YEAR } from "./module-C_DMsB8l.js";
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
    /**
     * Просматриваемый месяц/год + выбранный день + черновик погоды (со стороны ГМ, не
     * сохраняется до нажатия Apply).
     */
    __privateAdd(this, _view, null);
    // {year, month}
    __privateAdd(this, _selected, null);
    // {year, month, day}
    __privateAdd(this, _draft, { cond: "overcast", temp: 6, wind: "light" });
    __privateAdd(this, _rollText, null);
    __privateAdd(this, _condMenuOpen, false);
    /**
     * Обновление (с debounce) при изменениях мирового времени и данных
     * календаря, пока окно открыто.
     */
    __privateAdd(this, _refresh, foundry.utils.debounce(() => this.rendered && this.render({ parts: ["body"] }), 100));
  }
  static open() {
    let app = __privateGet(_StoryFlowCalendarApp, _instance);
    if (!app) app = __privateSet(_StoryFlowCalendarApp, _instance, new _StoryFlowCalendarApp());
    if (app.rendered) {
      app.bringToFront();
      void app.render();
    } else app.render(true);
    return app;
  }
  _onFirstRender(context, options) {
    var _a;
    (_a = super._onFirstRender) == null ? void 0 : _a.call(this, context, options);
    Hooks.on("updateWorldTime", __privateGet(this, _refresh));
    Hooks.on(`${MODULE_ID}.calendarChanged`, __privateGet(this, _refresh));
  }
  close(options) {
    Hooks.off("updateWorldTime", __privateGet(this, _refresh));
    Hooks.off(`${MODULE_ID}.calendarChanged`, __privateGet(this, _refresh));
    return super.close(options);
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
      // Пошаговая задержка для каждого элемента при анимации появления.
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
  /**
   * Подключить слушатели, не связанные с действиями: выбор ветра <select> (никогда не
   * data-action) и двойной клик по дню.
   */
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
_refresh = new WeakMap();
_StoryFlowCalendarApp_instances = new WeakSet();
/**
 * Выбрать день - инициализировать черновик по отображенной погоде (проектное
 * поведение).
 */
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
  const { StoryFlowDayEventDialog } = await import("./day-event-dialog-jV3BbIKH.js");
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
  const { StoryFlowSeasonConfigApp } = await import("./season-config-app-Bnk7vLf-.js");
  StoryFlowSeasonConfigApp.open();
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
    openSeasons: __privateMethod(_StoryFlowCalendarApp, _StoryFlowCalendarApp_static, onOpenSeasons_fn)
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
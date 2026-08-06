/**
 * @file nodes/__TYPE__/index.mjs
 * @description Пакет узлов __TYPE__ - манифест + регистрация. Без побочных
 * эффектов: сгенерированный загрузчик virtual:storyflow/nodes вызывает
 * register(). Все, что касается этого узла, живет в этой папке (спецификация
 * §3.1).
 */
import { API_VERSION } from "../../api/public-api.mjs";
import { payload, validate, clean } from "./payload.mjs";
import { behavior } from "./behavior.mjs";
import { inspector } from "./inspector.mjs";
import { editor } from "./editor.mjs";
import { overlay } from "./overlay.mjs";

/**
 * @param {(def: object) => boolean} registerBuiltinNode - Внутренний фасад
 * (src/api/builtin.mjs), передаваемый сгенерированным загрузчиком.
 * @returns {boolean} true, когда определение было принято.
 */
export function register(registerBuiltinNode) {
  return registerBuiltinNode({
    type: "__TYPE__",
    apiVersion: API_VERSION,
    category: "action",
    pins: { in: ["in"], out: ["out"] },
    catalog: { group: "actor", icon: "fa-puzzle-piece", keywords: ["__TYPE_SLUG__"] },
    // Фасад отделяет validate/clean от полезной нагрузки перед сохранением полей.
    payload: { ...payload, validate, clean },
    behavior,
    inspector,
    editor,
    overlay,
  });
}

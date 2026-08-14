/**
 * @file nodes/__TYPE__/index.mjs
 * @description __TYPE__ node package - manifest + registration. Side-effect-free:
 *              the generated virtual:storyflow/nodes loader calls register().
 *              Everything about this node lives in this folder (spec §3.1).
 */
import { API_VERSION } from "../../api/public-api.mjs";
import { payload, validate, clean } from "./payload.mjs";
import { behavior } from "./behavior.mjs";
import { inspector } from "./inspector.mjs";
import { editor } from "./editor.mjs";
import { overlay } from "./overlay.mjs";

/**
 * @param {(def: object) => boolean} registerBuiltinNode - The internal façade
 *        (src/api/builtin.mjs), handed in by the generated loader.
 * @returns {boolean} true when the definition was accepted.
 */
export function register(registerBuiltinNode) {
  return registerBuiltinNode({
    type: "__TYPE__",
    apiVersion: API_VERSION,
    category: "action",
    pins: { in: ["in"], out: ["out"] },
    catalog: { group: "actor", icon: "fa-puzzle-piece", keywords: ["__TYPE_SLUG__"] },
    // The façade splits validate/clean out of the payload before storing the fields.
    payload: { ...payload, validate, clean },
    behavior,
    inspector,
    editor,
    overlay,
  });
}

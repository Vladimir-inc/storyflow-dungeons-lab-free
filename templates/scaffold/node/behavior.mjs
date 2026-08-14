/**
 * @file nodes/__TYPE__/behavior.mjs
 * @description PURE runtime behavior for the __TYPE__ node (unit-tested, no Foundry
 *              imports). Hooks return an Outcome (spec §4.1): advance/block/settle/
 *              end/goto/render/await. State lives in ctx.state (per parking) and
 *              ctx.store (per run) - module-level mutable state is forbidden (Q5).
 */

export const behavior = {
  /**
   * @param {object} node - The graph node ({id, type, data}).
   * @param {object} ctx - BehaviorCtx (spec §4.1).
   * @returns {{advance: string}}
   */
  enter: () => ({ advance: "out" }),
};

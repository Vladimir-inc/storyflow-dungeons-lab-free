/**
 * @file nodes/__TYPE__/behavior.mjs
 * @description ЧИСТОЕ поведение во время выполнения для узла __TYPE__ (покрыто
 * модульными тестами, без импортов Foundry). Хуки возвращают Outcome (спецификация
 * §4.1): advance/block/settle/ end/goto/render/await. Состояние живет в ctx.state
 * (на parking) и ctx.store (на прогон) - изменяемое состояние на уровне модуля
 * запрещено (Q5).
 */

export const behavior = {
  /**
   * @param {object} node - Узел графа ({id, type, data}).
   * @param {object} ctx - BehaviorCtx (спецификация §4.1).
   * @returns {{advance: string}}
   */
  enter: () => ({ advance: "out" }),
};

/**
 * @file nodes/__TYPE__/payload.mjs
 * @description Карта полей Payload FieldSpec для узла __TYPE__ (управляет
 * cleanPayload / validate / стандартным циклом полей инспектора). Межполевая
 * валидация и очистка после приведения относятся к хукам validate/clean ниже -
 * НИКОГДА не как ключи среди полей.
 */

/** @type {Record<string, object>} Карта FieldSpec. */
export const payload = {
  label: { kind: "string", initial: "" },
};

/**
 * Опциональный хук межполевой валидации: ошибки сливаются с общим проходом полей.
 * Получает сырую полезную нагрузку; возвращать [] при валидности (объявлен без
 * параметров - scaffolded узел пока ничего не валидирует, а неиспользуемый параметр
 * вызывает lint в каждом месте).
 * @returns {Array<{field: string|null, msg: string}>}
 */
export const validate = () => [];

/**
 * Опциональный хук clean: приводит после поштучного приведения (в стиле
 * normalizeXxx).
 * @param {object} data - Полезная нагрузка после приведения полей.
 * @returns {object}
 */
export function clean(data) {
  return data;
}

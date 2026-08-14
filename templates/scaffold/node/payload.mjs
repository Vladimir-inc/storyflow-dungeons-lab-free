/**
 * @file nodes/__TYPE__/payload.mjs
 * @description Payload FieldSpec map for the __TYPE__ node (drives cleanPayload /
 *              validate / the inspector's default field loop). Cross-field validation
 *              and post-coercion cleanup belong in the validate/clean hooks below -
 *              NEVER as keys among the fields.
 */

/** @type {Record<string, object>} FieldSpec map. */
export const payload = {
  label: { kind: "string", initial: "" },
};

/**
 * Optional cross-field validation hook: errors merge into the generic field pass.
 * Receives the raw payload; return [] when valid (declared param-free - a scaffolded
 * node validates nothing yet, and an unused param trips lint in every location).
 * @returns {Array<{field: string|null, msg: string}>}
 */
export const validate = () => [];

/**
 * Optional clean hook: coerces after the per-field coercion (normalizeXxx-style).
 * @param {object} data - The field-coerced payload.
 * @returns {object}
 */
export function clean(data) {
  return data;
}

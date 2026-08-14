import { M as MODULE_ID, a8 as activeFace, a9 as discardedFace } from "./module-6vV2bj2T.js";
async function rollCheck(check, actor) {
  var _a, _b;
  const { kind, key, rollMode = "normal" } = check ?? {};
  const config = {
    advantage: rollMode === "advantage",
    disadvantage: rollMode === "disadvantage"
  };
  const dialog = { configure: false };
  const message = { create: false };
  let rolls;
  try {
    switch (kind) {
      case "skill":
        rolls = await actor.rollSkill({ skill: key, ...config }, dialog, message);
        break;
      case "save":
        rolls = await actor.rollSavingThrow({ ability: key, ...config }, dialog, message);
        break;
      case "ability":
        rolls = await actor.rollAbilityCheck({ ability: key, ...config }, dialog, message);
        break;
      case "tool":
        rolls = await actor.rollToolCheck({ tool: key, ...config }, dialog, message);
        break;
      default:
        console.warn(`${MODULE_ID} | unknown check kind:`, kind);
        return null;
    }
  } catch (err) {
    console.error(`${MODULE_ID} | check roll failed:`, err);
    return null;
  }
  const roll = rolls == null ? void 0 : rolls[0];
  if ((roll == null ? void 0 : roll.total) == null) return null;
  const out = { total: roll.total, formula: roll.formula ?? "" };
  const results = (_b = (_a = roll.dice) == null ? void 0 : _a[0]) == null ? void 0 : _b.results;
  const die = activeFace(results);
  if (typeof die === "number") {
    out.die = die;
    out.mod = roll.total - die;
    const other = discardedFace(results);
    if (typeof other === "number") out.otherDie = other;
  }
  return out;
}
export {
  rollCheck
};
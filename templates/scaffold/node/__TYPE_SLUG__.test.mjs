/**
 * @file nodes/__TYPE__/__TYPE_SLUG__.test.mjs
 * @description Расположенные рядом модульные тесты для пакета узлов __TYPE__.
 * Регистрация проходит через тот же внутренний фасад, который использует
 * сгенерированный загрузчик.
 */
import { describe, it, expect, afterEach } from "vitest";
import { registerBuiltinNode } from "../../api/builtin.mjs";
import { getNodeBehavior, _resetRegistriesForTest } from "../../api/registries.mjs";
import { pinsForType } from "../../data/pins.mjs";
import { register } from "./index.mjs";

describe("__TYPE__ node package", () => {
  afterEach(() => _resetRegistriesForTest());

  it("registers its definition and advances out on enter", () => {
    expect(register(registerBuiltinNode)).toBe(true);
    const behavior = getNodeBehavior("__TYPE__");
    expect(typeof behavior?.enter).toBe("function");
    expect(behavior.enter({ id: "n1", type: "__TYPE__", data: {} }, {})).toEqual({ advance: "out" });
    expect(pinsForType("__TYPE__")).toEqual({ in: ["in"], out: ["out"] });
  });
});

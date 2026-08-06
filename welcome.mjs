/**
 * @file welcome.mjs
 * @description Приветствие бесплатной версии: карточка Dungeons LAB Discord, отправляемая в
 * журнал чата при каждом запуске мира на каждом клиенте.
 *
 * ponytail: карточка рендерится локально через `ui.chat.postOne()` на НЕСОХРАНЕННОМ
 * ChatMessage - никогда `ChatMessage.create()`. Сохраненное приветствие добавляло бы один
 * документ в мировую базу данных за запуск и повторно рассылало бы всем. Ничего здесь не
 * трогает бандл модуля, поэтому оно переживает пересборку `dist/` нетронутым.
 */

const DISCORD_URL = "https://discord.gg/MUxsQCf587";

/**
 * @param {string} key Ключ внутри `STORYFLOW_DUNGEONS_LAB.Welcome`.
 * @returns {string}
 */
const t = (key) => game.i18n.localize(`STORYFLOW_DUNGEONS_LAB.Welcome.${key}`);

/**
 * Собрать разметку карточки. Стили inline: карточка должна отрисовываться одинаково
 * независимо от того, затемирована ли собственная таблица стилей модуля скином Dungeons
 * LAB.
 *
 * @returns {string}
 */
function cardHtml() {
  const item = (icon, text) =>
    `<li style="margin:0 0 4px;list-style:none;display:flex;gap:6px;align-items:flex-start;">
      <i class="${icon}" style="margin-top:3px;opacity:.8;"></i><span>${text}</span>
    </li>`;

  return `
<div style="border:1px solid #7a5c2e;border-radius:6px;padding:8px 10px;background:rgba(30,22,14,.35);">
  <h3 style="margin:0 0 6px;border:0;font-family:var(--font-primary);letter-spacing:.03em;">
    <i class="fa-solid fa-diagram-project"></i> ${t("Title")}
  </h3>
  <p style="margin:0 0 6px;">${t("Intro")}</p>
  <ul style="margin:0 0 8px;padding:0;">
    ${item("fa-solid fa-circle-question", t("Help"))}
    ${item("fa-solid fa-wand-magic-sparkles", t("Request"))}
    ${item("fa-solid fa-bug", t("Bug"))}
  </ul>
  <a href="${DISCORD_URL}" target="_blank" rel="noopener"
     style="display:inline-block;padding:4px 10px;border:1px solid #7a5c2e;border-radius:4px;text-decoration:none;">
    <i class="fa-brands fa-discord"></i> ${t("Button")}
  </a>
</div>`;
}

/** @returns {void} */
function postWelcome() {
  const message = new ChatMessage.implementation({
    author: game.user.id,
    speaker: { alias: "StoryFlow - Dungeons LAB" },
    content: cardHtml(),
  });
  ui.chat.postOne(message);
}

Hooks.once("ready", () => {
  // Боковая панель рендерится асинхронно - `postOne` тихо отбрасывает карточку,
  // если журнал еще не готов, поэтому ждем его отрисовки, если это так.
  if (ui.chat?.rendered) postWelcome();
  else Hooks.once("renderChatLog", postWelcome);
});

/**
 * @file welcome.mjs
 * @description Free-edition greeting: a Dungeons LAB Discord card posted to the chat log on
 *              every world launch, on every client.
 *
 * ponytail: the card is rendered locally via `ui.chat.postOne()` on an UNSAVED ChatMessage -
 * never `ChatMessage.create()`. A persisted greeting would add one document to the world
 * database per launch and re-broadcast to everyone. Nothing here touches the module bundle,
 * so it survives a `dist/` rebuild untouched.
 */

const DISCORD_URL = "https://discord.gg/MUxsQCf587";

/**
 * @param {string} key  Key under `STORYFLOW_DUNGEONS_LAB.Welcome`.
 * @returns {string}
 */
const t = (key) => game.i18n.localize(`STORYFLOW_DUNGEONS_LAB.Welcome.${key}`);

/**
 * Build the card markup. Styles are inline: the card must render identically whether or not
 * the module's own stylesheet is themed by the Dungeons LAB skin.
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
  // The sidebar renders asynchronously - `postOne` silently drops the card if the log is not
  // up yet, so wait for its render when that is the case.
  if (ui.chat?.rendered) postWelcome();
  else Hooks.once("renderChatLog", postWelcome);
});

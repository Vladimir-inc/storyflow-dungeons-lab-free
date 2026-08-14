import { M as MODULE_ID, N as humanizeType, ak as replaceNodesUpdate } from "./module-6vV2bj2T.js";
import { e as exampleFor, t as tutorialFor } from "./node-tutorial-app-CPO-Cphs.js";
const GRAPH_PAGE_TYPE = `${MODULE_ID}.graph`;
function buildTutorialPageData(type) {
  const { demo } = tutorialFor(type);
  if (!demo) return null;
  return {
    name: `Demo — ${humanizeType(type)}`,
    type: GRAPH_PAGE_TYPE,
    flags: { [MODULE_ID]: { tutorialType: type } },
    system: { nodes: demo.nodes, edges: demo.edges, meta: { entry: demo.meta.entry } }
  };
}
function buildTutorialExamplePageData(type) {
  const example = exampleFor(type);
  if (!example) return null;
  return {
    name: `Example — ${humanizeType(type)}`,
    type: GRAPH_PAGE_TYPE,
    flags: { [MODULE_ID]: { tutorialExampleType: type } },
    system: { nodes: example.nodes, edges: example.edges, meta: { entry: example.meta.entry } }
  };
}
async function tutorialJournal() {
  const existing = game.journal.find((e) => e.getFlag(MODULE_ID, "tutorialJournal") === true);
  if (existing) return existing;
  return await JournalEntry.create({
    name: game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.JournalName"),
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE },
    flags: { [MODULE_ID]: { tutorialJournal: true } }
  });
}
async function runTutorialDemo(type, demoPageUuid = "") {
  if (demoPageUuid) {
    const page2 = await fromUuid(demoPageUuid).catch(() => null);
    if (!page2 || page2.type !== GRAPH_PAGE_TYPE) {
      ui.notifications.warn(game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.Edit.DemoMissing"));
      return;
    }
    await game.modules.get(MODULE_ID).api.startFlow(page2.uuid);
    return;
  }
  const data = buildTutorialPageData(type);
  if (!data) return;
  const entry = await tutorialJournal();
  let page = entry.pages.find((p) => p.getFlag(MODULE_ID, "tutorialType") === type);
  if (page) {
    await page.update({ ...replaceNodesUpdate(data.system.nodes), "system.edges": data.system.edges, "system.meta": data.system.meta });
  } else {
    [page] = await entry.createEmbeddedDocuments("JournalEntryPage", [data]);
  }
  await game.modules.get(MODULE_ID).api.startFlow(page.uuid);
}
async function showTutorialExample(type) {
  const data = buildTutorialExamplePageData(type);
  if (!data) return;
  const entry = await tutorialJournal();
  let page = entry.pages.find((p) => p.getFlag(MODULE_ID, "tutorialExampleType") === type);
  if (page) {
    await page.update({ ...replaceNodesUpdate(data.system.nodes), "system.edges": data.system.edges, "system.meta": data.system.meta });
  } else {
    [page] = await entry.createEmbeddedDocuments("JournalEntryPage", [data]);
  }
  const { BlueprintCanvasApp } = await import("./module-6vV2bj2T.js").then((n) => n.au);
  BlueprintCanvasApp.open(page);
}
function exampleClipboardSlice(type) {
  const example = exampleFor(type);
  if (!example) return null;
  return { nodes: Object.values(example.nodes), edges: [...example.edges] };
}
async function copyTutorialExample(type) {
  const slice = exampleClipboardSlice(type);
  if (!slice) return false;
  const { setClipboardSlice } = await import("./module-6vV2bj2T.js").then((n) => n.au);
  return setClipboardSlice(slice.nodes, slice.edges);
}
export {
  buildTutorialExamplePageData,
  buildTutorialPageData,
  copyTutorialExample,
  exampleClipboardSlice,
  runTutorialDemo,
  showTutorialExample
};
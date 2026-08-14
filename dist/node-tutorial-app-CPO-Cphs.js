var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _instance, _trail, _running, _query, _searchRestoreFocus, _editing, _draft, _confirmingReset, _customPage, _customEditing, _customDraft, _NodeTutorialApp_instances, currentType_fn, storedOverride_fn, exitEdit_fn, buildEditContext_fn, demoOptions_fn, customCats_fn, saveCustomCats_fn, buildCustomGroups_fn, buildCustomPageContext_fn, promptName_fn, syncDraftFromForm_fn, syncCustomDraftFromForm_fn, _sidebarScroll, _NodeTutorialApp_static, onPickType_fn, onShowType_fn, onCrumbTo_fn, onRunDemo_fn, onShowExample_fn, onCopyExample_fn, onEditGuide_fn, onAddTip_fn, onRemoveTip_fn, onInsertCallout_fn, onAddPair_fn, onRemovePair_fn, onAddSection_fn, onRemoveSection_fn, onSaveGuide_fn, onCancelGuide_fn, onResetGuide_fn, onCancelResetGuide_fn, onConfirmResetGuide_fn, onAddCustomCategory_fn, onRenameCustomCategory_fn, onRemoveCustomCategory_fn, onAddCustomPage_fn, onRemoveCustomPage_fn, onPickCustomPage_fn, onEditCustomPage_fn, onSaveCustomPage_fn, onCancelCustomPage_fn;
import { U as cleanPayload, O as isKnownNodeType, P as NODE_TYPES, n as nodePresentation, V as categoryPresentation, M as MODULE_ID, S as SETTINGS, X as buildPalette, Y as nodeTypeIds } from "./module-6vV2bj2T.js";
const say = (id, x, body, extra = {}) => ({
  id,
  type: "display",
  x,
  y: 120,
  data: { speakerName: "StoryFlow Guide", bodyHtml: `<p>${body}</p>`, typewriter: true, cps: 40, ...extra }
});
const edge = (id, sn, sp, tn, tp) => ({ id, source: { node: sn, pin: sp }, target: { node: tn, pin: tp } });
const start = { id: "start", type: "trigger.start", x: 40, y: 120, data: {} };
const endAt = (x, y = 120) => ({ id: "end", type: "end", x, y, data: {} });
const pay = (type, overrides = {}) => cleanPayload(type, overrides);
const cleanSay = (id, x, body, extra = {}) => ({
  id,
  type: "display",
  x,
  y: 120,
  data: pay("display", { speakerName: "StoryFlow Guide", bodyHtml: `<p>${body}</p>`, typewriter: true, cps: 40, ...extra })
});
const comment = (id, x, y, text, w, h, bgColor = "#5f5326") => ({
  id,
  type: "comment",
  x,
  y,
  data: pay("comment", { text, bgColor, w, h })
});
const noteBelow = (id, siblingNodes, x, text, w, h, bgColor = "#5f5326") => {
  const maxY = Math.max(0, ...Object.values(siblingNodes).map((n) => n.y ?? 0));
  return comment(id, x, maxY + 200, text, w, h, bgColor);
};
const withComments = (demo, commentNodes) => {
  const nodes = {};
  for (const [id, n] of Object.entries(demo.nodes)) {
    nodes[id] = { ...n, data: isKnownNodeType(n.type) ? cleanPayload(n.type, n.data) : n.data };
  }
  for (const c of commentNodes) nodes[c.id] = c;
  return { nodes, edges: [...demo.edges], meta: { ...demo.meta } };
};
const NODE_TUTORIALS = {
  display: {
    tips: 3,
    pairsWith: ["text", "choice", "audio"],
    demo: {
      nodes: {
        start,
        n1: say("n1", 260, "Hi! I am a Display node — a speaker, a portrait, and this typewriter text."),
        n2: say("n2", 480, "Chain several of me to build a conversation. The player clicks to advance."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  choice: {
    tips: 3,
    pairsWith: ["display", "check", "jump"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "choice",
          x: 260,
          y: 120,
          data: {
            prompt: "The Choice node asks the triggering player to pick a path. Which door?",
            choices: [{ id: "cA", label: "The oak door" }, { id: "cB", label: "The iron door" }],
            background: "carry"
          }
        },
        a: say("a", 500, "You picked the oak door — this branch ran because choice #1 was selected."),
        b: { ...say("b", 500, "You picked the iron door — each choice pin leads to its own branch."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "choice_0", "a", "in"),
        edge("e3", "n1", "choice_1", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  check: {
    tips: 3,
    pairsWith: ["choice", "condition", "display"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "check",
          x: 260,
          y: 120,
          data: { logicOperator: "AND", hideBreakdown: true, checks: [], kind: "skill", key: "prc", dc: 10, rollMode: "normal" }
        },
        a: say("a", 500, "Success! Your Perception beat DC 10 — the success pin fired."),
        b: { ...say("b", 500, "Failed the DC 10 Perception check — the failure pin fired instead."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "success", "a", "in"),
        edge("e3", "n1", "failure", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  condition: {
    tips: 3,
    pairsWith: ["check", "choice", "jump"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "condition",
          x: 260,
          y: 120,
          data: { logicOperator: "AND", target: "trigger", targetActorId: "", conditions: [] }
        },
        a: say("a", 500, "TRUE branch: with no conditions configured, the check passes vacuously."),
        b: { ...say("b", 500, "FALSE branch — you will see this once you add a condition that fails."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "true", "a", "in"),
        edge("e3", "n1", "false", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  "trigger.start": {
    tips: 3,
    pairsWith: ["display", "condition"],
    demo: null
    // external entry point — the Usage text explains how flows are triggered
  },
  "trigger.region": {
    tips: 3,
    pairsWith: ["condition", "display", "notification"],
    demo: null
    // needs a real scene Region + token to enter it
  },
  "trigger.macro": {
    tips: 3,
    pairsWith: ["condition", "branch", "display"],
    demo: null
    // needs a pasted hotbar macro run by a GM/tile trigger
  },
  "trigger.weather": {
    tips: 3,
    pairsWith: ["display", "action.light", "notification"],
    demo: null
    // needs a real scene's weather effect to change
  },
  "trigger.time": {
    tips: 3,
    pairsWith: ["display", "condition", "action.changeScene"],
    demo: null
    // needs the world clock to advance across a phase boundary
  },
  "trigger.rest": {
    tips: 3,
    pairsWith: ["condition", "display", "action.healDamage"],
    demo: null
    // needs a real actor to complete a rest
  },
  "trigger.door": {
    tips: 3,
    pairsWith: ["action.door", "condition", "display"],
    demo: null
    // needs a real scene wall/door (and Tagger) to change state
  },
  "trigger.timer": {
    tips: 3,
    pairsWith: ["display", "condition", "notification"],
    demo: null
    // needs the world clock to cross its interval grid
  },
  "trigger.hp": {
    tips: 3,
    pairsWith: ["condition", "action.healDamage", "display"],
    demo: null
    // needs a real actor's HP to cross the threshold
  },
  "trigger.spell": {
    tips: 3,
    pairsWith: ["condition", "display", "check"],
    demo: null
    // needs a real spell item cast by an actor
  },
  "trigger.roll": {
    tips: 3,
    pairsWith: ["condition", "display", "check"],
    demo: null
    // needs a real dnd5e roll or applied status effect
  },
  text: {
    tips: 3,
    pairsWith: ["display", "wait", "choice"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "text",
          x: 260,
          y: 120,
          data: {
            speakerName: "",
            portraitPath: "",
            bodyHtml: "<p>The narrator sets the scene — no speaker name, no portrait, just prose.</p>",
            voiceOverPath: "",
            background: "scene",
            typewriter: true,
            cps: 40,
            autoAdvance: false,
            autoAdvanceDelay: 1500
          }
        },
        n2: say("n2", 480, "Text is Display's narrator sibling — same typewriter and pacing controls, no speaker/portrait."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  jump: {
    tips: 3,
    pairsWith: ["display", "choice", "condition"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "jump",
          x: 260,
          y: 120,
          data: { targetNodeId: "shared", showLink: true }
        },
        shared: say(
          "shared",
          480,
          "You jumped straight here! Jump redirects the run to any node in the graph by id — no output pin required, so many branches can converge on one shared beat like this."
        ),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "shared", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  wait: {
    tips: 2,
    pairsWith: ["display", "text", "transition"],
    demo: {
      nodes: {
        start,
        n1: say("n1", 260, "Beat one — a short pause is coming before the story continues."),
        n2: { id: "n2", type: "wait", x: 480, y: 120, data: { seconds: 2 } },
        n3: say("n3", 700, "Beat two — two seconds of silence just passed. Wait paces a scene without asking for a click."),
        end: endAt(920)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "n3", "in"),
        edge("e4", "n3", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  branch: {
    tips: 3,
    pairsWith: ["choice", "condition", "random"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "branch",
          x: 260,
          y: 120,
          data: {
            prompt: "GM: which way does the story go?",
            decider: "gm",
            paths: [
              { id: "pA", label: "The safe road" },
              { id: "pB", label: "The shortcut" }
            ]
          }
        },
        a: say("a", 500, "You (the GM) picked the safe road — path_0 fired."),
        b: { ...say("b", 500, "You (the GM) picked the shortcut — path_1 fired instead."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "path_0", "a", "in"),
        edge("e3", "n1", "path_1", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  random: {
    tips: 3,
    pairsWith: ["branch", "choice", "condition"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "random",
          x: 260,
          y: 120,
          data: {
            paths: [
              { id: "rCommon", label: "Common encounter", weight: 70 },
              { id: "rRare", label: "Rare encounter", weight: 30 }
            ]
          }
        },
        a: say("a", 500, "The 70%-weighted path fired — a common encounter."),
        b: { ...say("b", 500, "The 30%-weighted path fired instead — a rare encounter. Run it again to see the odds play out."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "rand_0", "a", "in"),
        edge("e3", "n1", "rand_1", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  preload: {
    tips: 2,
    pairsWith: ["action.changeScene", "display", "wait"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "preload",
          x: 260,
          y: 120,
          data: { confirmBeforeRun: false, timeoutSeconds: 20 }
        },
        n2: say("n2", 480, "The barrier just waited for every connected client to finish fetching this graph's assets before continuing — invisible solo, essential with a full table."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  end: {
    tips: 2,
    pairsWith: ["display", "jump"],
    demo: {
      nodes: {
        start: { ...start, data: pay("trigger.start", {}) },
        n1: cleanSay("n1", 260, "The End node stops the run here."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  comment: {
    tips: 2,
    pairsWith: ["jump", "condition"],
    demo: null
    // no pins at all — unreachable by design, nothing to run
  },
  showImage: {
    tips: 2,
    pairsWith: ["display", "wait", "transition"],
    demo: {
      nodes: {
        start: { ...start, data: pay("trigger.start", {}) },
        n1: { id: "n1", type: "showImage", x: 260, y: 120, data: pay("showImage", { imagePath: "icons/svg/book.svg", seconds: 3 }) },
        n2: cleanSay("n2", 500, "A Foundry core icon was shown fullscreen for three seconds."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  notification: {
    tips: 2,
    pairsWith: ["display", "audio"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "notification",
          x: 260,
          y: 120,
          data: { style: "toast", text: "This toast came from the Notification node." }
        },
        n2: say("n2", 480, "Notifications fire and the flow moves on immediately — no click needed."),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  "action.giveItem": {
    tips: 3,
    pairsWith: ["condition", "notification", "action.giveGold"],
    demo: null
    // needs a real dropped item uuid, and mutates the trigger actor's inventory
  },
  "action.healDamage": {
    tips: 3,
    pairsWith: ["trigger.hp", "condition", "check"],
    demo: null
    // rolls a real formula and applies it to a real actor's HP — not a safe demo
  },
  "action.giveGold": {
    tips: 3,
    pairsWith: ["trader", "condition", "notification"],
    // A blank formula + trigger target validates fine with no world refs, but the node
    // ROLLS the formula and writes actor.system.currency.gp for real — it mutates a
    // character's purse, so it fails the "safe" bar even with no refs to satisfy.
    demo: null
  },
  "action.applyEffect": {
    tips: 3,
    pairsWith: ["condition", "check", "trigger.roll"],
    demo: null
    // effectId is a required runtime dropdown pick, and it mutates the target's status effects
  },
  "action.changeScene": {
    tips: 3,
    pairsWith: ["action.preloadScene", "trigger.time", "display"],
    demo: null
    // sceneId is a required reference and activating a scene changes what every client sees
  },
  "action.preloadScene": {
    tips: 2,
    pairsWith: ["action.changeScene", "preload"],
    demo: null
    // sceneId is a required Scene reference — nothing to preload without one
  },
  "action.token": {
    tips: 3,
    pairsWith: ["action.door", "trigger.region", "condition"],
    demo: null
    // move/create/delete all need a captured scene + tokens or an actor to spawn, and mutate the scene
  },
  "action.macro": {
    tips: 3,
    pairsWith: ["trigger.macro", "condition", "branch"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "action.macro",
          x: 260,
          y: 120,
          data: { macroUuid: "", code: 'console.log("StoryFlow Guide: this action.macro node just ran.");' }
        },
        n2: say(
          "n2",
          480,
          "Check your F12 console — that inline code just ran on the GM-authority client (open your console before running this demo)."
        ),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  "action.door": {
    tips: 3,
    pairsWith: ["trigger.door", "action.light", "condition"],
    demo: null
    // captured mode needs a real wall selection; tag mode risks matching a real tagged door if Tagger is active
  },
  "action.light": {
    tips: 3,
    pairsWith: ["trigger.weather", "action.door", "action.effect"],
    demo: null
    // captured mode needs a real light selection; tag mode risks matching a real tagged light if Tagger is active
  },
  "action.effect": {
    tips: 3,
    pairsWith: ["action.endEffect", "check", "notification"],
    demo: null
    // animation is a required Sequencer/JB2A database path — no canned asset to point at
  },
  "action.endEffect": {
    tips: 3,
    pairsWith: ["action.effect", "action.tiles"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "action.endEffect",
          x: 260,
          y: 120,
          data: { mode: "all", name: "", group: "" }
        },
        n2: say(
          "n2",
          480,
          `mode "all" only ends THIS module's own persistent effects (namespaced storyflow:) — safe to run even with none playing, and it never touches another module's Sequencer effects.`
        ),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  "action.tiles": {
    tips: 3,
    pairsWith: ["action.endEffect", "action.effect", "condition"],
    demo: null
    // animation is a required Sequencer/JB2A path AND it mass-places real tiles on a scene
  },
  showOnMap: {
    tips: 3,
    pairsWith: ["display", "trader", "notification"],
    demo: null
    // sceneId is a required captured camera location — nothing to pan to without one
  },
  trader: {
    tips: 3,
    pairsWith: ["action.giveGold", "condition", "showOnMap"],
    demo: null
    // traderUuid is a required reference to a real Trader journal page
  },
  journal: {
    tips: 3,
    pairsWith: ["parchment", "condition", "notification"],
    demo: null
    // open/write/createPage need a real Journal reference; createEntry permanently creates a new world document
  },
  parchment: {
    tips: 3,
    pairsWith: ["journal", "display", "notification"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "parchment",
          x: 260,
          y: 120,
          data: {
            style: "scroll",
            pageUuid: "",
            text: "<p>By torchlight you make out an aged, hand-lettered warning: turn back, or turn the page.</p>",
            title: "A Weathered Scrap",
            subtitle: "found tucked behind the shelf",
            audience: "all"
          }
        },
        n2: say("n2", 500, "A blank pageUuid falls back to inline text like that — you never needed a real Journal page for this demo."),
        end: endAt(720)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  audio: {
    tips: 2,
    pairsWith: ["display", "transition", "stopAudio"],
    demo: null
    // audioPath is a real file path from your world — no canned asset to point at
  },
  stopAudio: {
    tips: 2,
    pairsWith: ["audio", "display"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "stopAudio",
          x: 260,
          y: 120,
          data: { mode: "all", name: "" }
        },
        n2: say(
          "n2",
          480,
          `mode "all" only stops sounds THIS module started — safe to run even with nothing playing, and it never touches another module's music.`
        ),
        end: endAt(700)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  transition: {
    tips: 3,
    pairsWith: ["wait", "showImage", "display"],
    demo: {
      nodes: {
        start,
        n1: say("n1", 260, "Watch the screen as this beat ends — a cinematic Transition is about to sweep in."),
        n2: {
          id: "n2",
          type: "transition",
          x: 480,
          y: 120,
          data: {
            style: "fade",
            phase: "both",
            color: "#000000",
            duration: 1,
            hold: 0.5,
            direction: "left",
            audience: "all"
          }
        },
        n3: say("n3", 700, 'That was phase "both" — cover and reveal in one node, masking the swap to this very beat.'),
        end: endAt(920)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "n3", "in"),
        edge("e4", "n3", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  screenAnimation: {
    tips: 3,
    pairsWith: ["display", "transition", "notification"],
    demo: {
      nodes: {
        start,
        n1: say("n1", 260, "Brace yourself — a quick Screen Animation is about to shake the view."),
        n2: {
          id: "n2",
          type: "screenAnimation",
          x: 480,
          y: 120,
          data: {
            animationType: "shake",
            intensity: 12,
            duration: 500,
            audience: "all",
            waitForCompletion: true
          }
        },
        n3: say("n3", 700, "The screen shook and snapped right back — the camera's zoom and position are untouched."),
        end: endAt(920)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "out", "n2", "in"),
        edge("e3", "n2", "out", "n3", "in"),
        edge("e4", "n3", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  crate: {
    tips: 3,
    pairsWith: ["action.giveGold", "trader", "notification"],
    demo: null
    // every catalog row needs a real dropped Item reference — no canned catalog to point at
  },
  "prop.cryptex": {
    tips: 3,
    pairsWith: ["check", "condition", "display"],
    demo: {
      nodes: {
        start,
        n1: {
          id: "n1",
          type: "prop.cryptex",
          x: 260,
          y: 120,
          data: {
            title: "Old Cryptex",
            text: "Turn the rings to spell out the engraved word.",
            mode: "submit",
            rings: 3,
            alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            solution: "CAT",
            maxAttempts: 3,
            image: ""
          }
        },
        a: say("a", 500, 'The rings matched "CAT" — solved! The success pin fired.'),
        b: { ...say("b", 500, "Out of attempts — the failure pin fired instead. Start the demo again for another try."), y: 260 },
        end: endAt(740, 190)
      },
      edges: [
        edge("e1", "start", "out", "n1", "in"),
        edge("e2", "n1", "success", "a", "in"),
        edge("e3", "n1", "failure", "b", "in"),
        edge("e4", "a", "out", "end", "in"),
        edge("e5", "b", "out", "end", "in")
      ],
      meta: { entry: "start" }
    }
  },
  // Plugin-registered (first-party Quests plugin) — content lives here like any built-in.
  quest: {
    tips: 3,
    pairsWith: ["display", "notification", "condition"],
    demo: null
    // targetUuid is a required reference to a real Quest/Lore board page
  },
  // Plugin-registered (first-party Factions plugin).
  "action.modifyReputation": {
    tips: 3,
    pairsWith: ["condition", "notification", "choice"],
    demo: null
    // factionId is a required reference to a real faction, and it mutates reputation
  },
  "trigger.combat": {
    tips: 2,
    pairsWith: ["display", "condition", "transition"],
    demo: null
    // needs a real combat encounter to start/end/change rounds
  },
  "trigger.levelup": {
    tips: 2,
    pairsWith: ["display", "notification", "action.giveItem"],
    demo: null
    // needs a real actor gaining a class level
  },
  // Plugin-registered (first-party Boss Bar plugin).
  "action.bossBar": {
    tips: 2,
    pairsWith: ["trigger.combat", "trigger.hp", "display"],
    demo: null
    // actorUuid is a required reference to a real world actor
  },
  "action.modifyAffinity": {
    tips: 2,
    pairsWith: ["choice", "condition", "display"],
    demo: null
    // actorUuid is a required reference to a real NPC actor, and it mutates affinity
  }
};
NODE_TUTORIALS.display.example = withComments(NODE_TUTORIALS.display.demo, [
  noteBelow("c1", NODE_TUTORIALS.display.demo.nodes, 260, "This **Display** node shows a speaker portrait and body text to players.\nFill: **Speaker Name**, **Body HTML**, **Typewriter**, **CPS**.\nSafe to run: it only renders UI text.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.choice.example = withComments(NODE_TUTORIALS.choice.demo, [
  noteBelow("c1", NODE_TUTORIALS.choice.demo.nodes, 260, "This **Choice** node pauses the flow and shows buttons to the triggering player.\nFill: **Prompt**, **Choices** (id + label), **Background**.\nEach choice becomes its own output pin.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.check.example = withComments(NODE_TUTORIALS.check.demo, [
  noteBelow("c1", NODE_TUTORIALS.check.demo.nodes, 260, "This **Check** node rolls one or more d20 tests and branches on success/failure.\nFill: **Logic Operator**, **Checks** list, or legacy **Kind / Key / DC**.\nA real actor must roll, so it needs a live trigger actor.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.condition.example = withComments(NODE_TUTORIALS.condition.demo, [
  noteBelow("c1", NODE_TUTORIALS.condition.demo.nodes, 260, "This **Condition** node tests actor or world state and branches true/false.\nFill: **Target**, **Conditions** list.\nWith no conditions it passes vacuously in this example.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.text.example = withComments(NODE_TUTORIALS.text.demo, [
  noteBelow("c1", NODE_TUTORIALS.text.demo.nodes, 260, "This **Text** node is Display without a speaker box — narrator prose.\nFill: **Body HTML**, **Background**, **Typewriter**, **CPS**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.jump.example = withComments(NODE_TUTORIALS.jump.demo, [
  noteBelow("c1", NODE_TUTORIALS.jump.demo.nodes, 260, "This **Jump** node redirects the run to another node by id.\nFill: **Target Node Id**, **Show Link**.\nNo output pin — many branches can converge on one target.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.wait.example = withComments(NODE_TUTORIALS.wait.demo, [
  noteBelow("c1", NODE_TUTORIALS.wait.demo.nodes, 480, "This **Wait** node pauses the flow for a number of seconds.\nFill: **Seconds**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.branch.example = withComments(NODE_TUTORIALS.branch.demo, [
  noteBelow("c1", NODE_TUTORIALS.branch.demo.nodes, 260, "This **Branch** node asks the GM (or trigger player) to pick a story path.\nFill: **Prompt**, **Decider**, **Paths**.\nEach path becomes a dynamic output pin.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.random.example = withComments(NODE_TUTORIALS.random.demo, [
  noteBelow("c1", NODE_TUTORIALS.random.demo.nodes, 260, "This **Random** node picks a weighted path at runtime.\nFill: **Paths** (id, label, weight).", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.preload.example = withComments(NODE_TUTORIALS.preload.demo, [
  noteBelow("c1", NODE_TUTORIALS.preload.demo.nodes, 260, "This **Preload** node waits for every client to fetch assets before continuing.\nFill: **Confirm Before Run**, **Timeout Seconds**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.notification.example = withComments(NODE_TUTORIALS.notification.demo, [
  noteBelow("c1", NODE_TUTORIALS.notification.demo.nodes, 260, "This **Notification** node shows a toast, epic, or secret alert.\nFill: **Style**, **Text**, **Seconds**, **Audience**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS["action.macro"].example = withComments(NODE_TUTORIALS["action.macro"].demo, [
  noteBelow("c1", NODE_TUTORIALS["action.macro"].demo.nodes, 260, "This **Macro** action runs inline JavaScript on the GM-authority client.\nFill: **Macro UUID** or **Code**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS["action.endEffect"].example = withComments(NODE_TUTORIALS["action.endEffect"].demo, [
  noteBelow("c1", NODE_TUTORIALS["action.endEffect"].demo.nodes, 260, "This **End Effect** action ends StoryFlow Sequencer effects.\nFill: **Mode** (name / graph / all / tiles).\nMode **all** is safe even when nothing is playing.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.parchment.example = withComments(NODE_TUTORIALS.parchment.demo, [
  noteBelow("c1", NODE_TUTORIALS.parchment.demo.nodes, 260, "This **Parchment** node shows a styled scroll or letter.\nFill: **Style**, **Page UUID** (blank falls back to inline **Text**).", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.stopAudio.example = withComments(NODE_TUTORIALS.stopAudio.demo, [
  noteBelow("c1", NODE_TUTORIALS.stopAudio.demo.nodes, 260, "This **Stop Audio** action ends sounds this module started.\nFill: **Mode** (name / all).\nMode **all** is safe even when nothing is playing.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.transition.example = withComments(NODE_TUTORIALS.transition.demo, [
  noteBelow("c1", NODE_TUTORIALS.transition.demo.nodes, 480, "This **Transition** node plays a cinematic screen wipe.\nFill: **Style**, **Phase**, **Color**, **Duration**, **Hold**, **Direction**.", 360, 120, "#5f5326")
]);
NODE_TUTORIALS.screenAnimation.example = withComments(NODE_TUTORIALS.screenAnimation.demo, [
  noteBelow("c1", NODE_TUTORIALS.screenAnimation.demo.nodes, 480, "This **Screen Animation** node plays a quick one-shot effect, then restores the view.\nFill: **Effect** (Shake / Zoom / Punch / Tilt / Flash), its per-effect fields, **Duration**, **Target Users**, **Wait For Completion**.", 360, 140, "#5f5326")
]);
NODE_TUTORIALS["prop.cryptex"].example = withComments(NODE_TUTORIALS["prop.cryptex"].demo, [
  noteBelow("c1", NODE_TUTORIALS["prop.cryptex"].demo.nodes, 260, "This **Cryptex** prop shows spinning letter rings.\nFill: **Title**, **Text**, **Mode**, **Rings**, **Alphabet**, **Solution**, **Max Attempts**.\nSuccess / failure pins branch the flow.", 360, 150, "#5f5326")
]);
NODE_TUTORIALS.end.example = withComments(NODE_TUTORIALS.end.demo, [
  noteBelow("c1", NODE_TUTORIALS.end.demo.nodes, 260, "The **End** node stops the current run.\nIt has no fields and no output pin.", 360, 120, "#5f5326")
]);
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    note: { id: "note", type: "comment", x: 260, y: 120, data: pay("comment", { text: "Example sticky note: mark intents, TODOs, or reminders for other authors.", bgColor: "#5f5326", w: 340, h: 82 }) }
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Comment** node is a sticky note with no pins.\nIt is never reachable at runtime — use it to leave author notes.", 360, 120, "#5f5326");
  NODE_TUTORIALS.comment.example = { nodes, edges: [], meta: { entry: "start" } };
}
NODE_TUTORIALS.showImage.example = withComments(NODE_TUTORIALS.showImage.demo, [
  noteBelow("c1", NODE_TUTORIALS.showImage.demo.nodes, 260, "The **Show Image** node displays a fullscreen image for a few seconds.\nThis example uses a Foundry core icon path so it can run safely.", 360, 120, "#5f5326")
]);
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "audio", x: 260, y: 120, data: pay("audio", { audioPath: "", mode: "once", volume: 100, persistAfterEnd: false, name: "", tracks: [], selectMode: "random" }) },
    n2: cleanSay("n2", 500, "The audio path is blank — no reliable core sound asset exists, so this example stays silent."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Audio** node plays a sound or playlist track.\nThe audio path is left blank because no reliable core sound asset exists.", 360, 120, "#5f5326");
  NODE_TUTORIALS.audio.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.start", x: 40, y: 120, data: pay("trigger.start", { label: "Start here" }) },
    n2: cleanSay("n2", 260, "The Start trigger is the default entry point for a graph run."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Start Trigger** is the default entry point for a graph.\nFill: **Label**. The flow begins when the GM clicks Run.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.start"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.region", x: 40, y: 120, data: pay("trigger.region", { label: "Enter the region", once: false, enabled: true, whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "A token entered the region — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Region Trigger** fires when a token enters a drawing region.\nFill: **Label**, **Who Triggers**. Needs a real scene region to fire live.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.region"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.macro", x: 40, y: 120, data: pay("trigger.macro", { label: "Macro run", once: false, enabled: true, whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "The linked macro ran — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Macro Trigger** fires when its linked hotbar macro runs.\nFill: **Label**, **Who Triggers**. Needs a real macro and a hotbar click.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.macro"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.weather", x: 40, y: 120, data: pay("trigger.weather", { label: "Weather changes", once: false, enabled: true, weather: "" }) },
    n2: cleanSay("n2", 260, "The scene weather effect changed — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Weather Trigger** fires when the scene weather effect changes.\nFill: **Label**, **Weather**. Needs a real scene weather setup.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.weather"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.time", x: 40, y: 120, data: pay("trigger.time", { label: "Dawn", once: false, enabled: true, phase: "dawn" }) },
    n2: cleanSay("n2", 260, "The world clock entered dawn — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Time Trigger** fires when the world clock enters a new phase.\nFill: **Label**, **Phase**. Needs the calendar to advance.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.time"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.rest", x: 40, y: 120, data: pay("trigger.rest", { label: "Rest finished", once: false, enabled: true, restType: "any", whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "An actor finished a rest — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Rest Trigger** fires when an actor finishes a rest.\nFill: **Label**, **Rest Type**, **Who Triggers**. Needs a real actor.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.rest"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.door", x: 40, y: 120, data: pay("trigger.door", { label: "Door opens", once: false, enabled: true, doorState: "open", tag: "", tagScope: "active" }) },
    n2: cleanSay("n2", 260, "A matching door changed state — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Door Trigger** fires when a matching door changes state.\nFill: **Label**, **Door State**, **Tag**. Needs a real door wall and Tagger.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.door"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.timer", x: 40, y: 120, data: pay("trigger.timer", { enabled: true, anchorYear: 735, anchorMonth: "0", anchorDay: 1, anchorHour: 0, every: 1, unit: "days", once: false }) },
    n2: cleanSay("n2", 260, "The calendar interval fired — the repeating timer triggered."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Timer Trigger** fires on repeating calendar intervals.\nFill: **Anchor**, **Every**, **Unit**. Needs the world clock to advance.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.timer"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.hp", x: 40, y: 120, data: pay("trigger.hp", { label: "HP drops", once: false, enabled: true, mode: "percent", threshold: 50, stage: "2", maxFires: 0, whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "Actor HP crossed the threshold — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **HP Trigger** fires when actor HP crosses a threshold.\nFill: **Mode**, **Threshold**, **Who Triggers**. Needs a real actor.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.hp"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.spell", x: 40, y: 120, data: pay("trigger.spell", { label: "Spell cast", once: false, enabled: true, spells: [], whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "A watched spell was cast — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Spell Trigger** fires when a watched spell is cast.\nFill: **Label**, **Spells**, **Who Triggers**. Needs a real actor and spell.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.spell"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.roll", x: 40, y: 120, data: pay("trigger.roll", { label: "Roll made", once: false, enabled: true, rules: [], whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "A matching d20 roll happened — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Roll Trigger** fires on matching d20 rolls or status effects.\nFill: **Label**, **Rules**, **Who Triggers**. Needs a real roll.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.roll"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.combat", x: 40, y: 120, data: pay("trigger.combat", { label: "Combat starts", once: false, enabled: true, event: "start", round: 0 }) },
    n2: cleanSay("n2", 260, "Combat started — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Combat Trigger** fires when combat starts, ends, or changes round.\nFill: **Label**, **Event**. Needs a real combat encounter.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.combat"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    n1: { id: "n1", type: "trigger.levelup", x: 40, y: 120, data: pay("trigger.levelup", { label: "Level gained", once: false, enabled: true, level: 0, whoTriggers: "any", specificActorIds: [] }) },
    n2: cleanSay("n2", 260, "An actor gained a level — the trigger fired."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 40, "The **Level Up Trigger** fires when an actor gains a level.\nFill: **Label**, **Level**, **Who Triggers**. Needs a real actor.", 360, 120, "#5f5326");
  NODE_TUTORIALS["trigger.levelup"].example = { nodes, edges: [
    edge("e1", "n1", "out", "n2", "in"),
    edge("e2", "n2", "out", "end", "in")
  ], meta: { entry: "n1" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.giveItem", x: 260, y: 120, data: pay("action.giveItem", { mode: "give", itemUuid: "", quantity: 1 }) },
    n2: cleanSay("n2", 500, "This node would copy the dropped item onto the actor's inventory. The item reference is left blank so nothing is given live."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Give Item** action copies a dropped item onto an actor.\nFill: **Mode**, **Item UUID**, **Quantity**. Left blank so it will not mutate inventory live.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.giveItem"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.healDamage", x: 260, y: 120, data: pay("action.healDamage", { mode: "damage", formula: "1d6", target: "trigger" }) },
    n2: cleanSay("n2", 500, "This node would roll a formula and change actor HP. The formula is left as a harmless example."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Heal / Damage** action rolls a formula and changes actor HP.\nFill: **Mode**, **Formula**, **Target**. This is a Show-only example — it will not run automatically.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.healDamage"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.giveGold", x: 260, y: 120, data: pay("action.giveGold", { mode: "give", formula: "10", target: "trigger" }) },
    n2: cleanSay("n2", 500, "This node would change actor currency. The formula is left as a harmless example."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Give Gold** action changes actor currency.\nFill: **Mode**, **Formula**, **Target**. This is a Show-only example — it will not run automatically.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.giveGold"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.applyEffect", x: 260, y: 120, data: pay("action.applyEffect", { effectId: "", mode: "apply", target: "trigger" }) },
    n2: cleanSay("n2", 500, "This node would add or remove a status effect. The effect id is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Apply Effect** action adds or removes a status effect.\nFill: **Effect Id**, **Mode**, **Target**. Needs a real effect and actors.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.applyEffect"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.changeScene", x: 260, y: 120, data: pay("action.changeScene", { sceneId: "", activate: true }) },
    n2: cleanSay("n2", 500, "This node would activate a scene for every client. The scene reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Change Scene** action activates a scene for everyone.\nFill: **Scene Id**, **Activate**. Needs a real scene reference.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.changeScene"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.preloadScene", x: 260, y: 120, data: pay("action.preloadScene", { sceneId: "", allClients: true }) },
    n2: cleanSay("n2", 500, "This node would preload a scene before changing. The scene reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Preload Scene** action fetches a scene before changing.\nFill: **Scene Id**, **All Clients**. Needs a real scene reference.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.preloadScene"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.token", x: 260, y: 120, data: pay("action.token", { operation: "move", targeting: "tag", tag: "guards", tagScope: "active", sceneId: "", tokenIds: [], duration: 1, actorUuid: "", destMode: "tag", destSceneId: "", destX: 0, destY: 0, destTileId: "", destTag: "door", destTagScope: "active" }) },
    n2: cleanSay("n2", 500, "This node would move tagged tokens to a tagged destination. No real tokens are captured."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Token** action moves, creates, or deletes tokens.\nThis example uses **Tag** targeting so no real tokens are captured.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.token"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.door", x: 260, y: 120, data: pay("action.door", { operation: "open", targeting: "tag", sceneId: "", wallIds: [], tag: "dungeon-door", tagScope: "active" }) },
    n2: cleanSay("n2", 500, "This node would open tagged doors. No real walls are captured."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Door** action opens, closes, locks, or toggles doors.\nThis example uses **Tag** targeting so no real walls are captured.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.door"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.light", x: 260, y: 120, data: pay("action.light", { operation: "on", targeting: "tag", sceneId: "", lightIds: [], tag: "chandelier", tagScope: "active" }) },
    n2: cleanSay("n2", 500, "This node would turn tagged lights on. No real lights are captured."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Light** action toggles or configures lights.\nThis example uses **Tag** targeting so no real lights are captured.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.light"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.effect", x: 260, y: 120, data: pay("action.effect", { animation: "jb2a.fireball.explosion.orange", target: "screen" }) },
    n2: cleanSay("n2", 500, "This node would play a Sequencer animation on the whole screen. The path is a placeholder."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Effect** action plays a Sequencer / JB2A animation.\nFill: **Animation**, **Target**. Needs the Sequencer module and a valid path.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.effect"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.tiles", x: 260, y: 120, data: pay("action.tiles", { animation: "jb2a.fireball.explosion.orange", group: "demo-effects" }) },
    n2: cleanSay("n2", 500, "This node would mass-place looping video tiles. The group is a placeholder."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Tiles** action mass-places looping video tiles.\nFill: **Animation**, **Group**. Would create real tiles if run live.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.tiles"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "showOnMap", x: 260, y: 120, data: pay("showOnMap", { sceneId: "", x: 0, y: 0, scale: 1, duration: 2, audience: "all" }) },
    n2: cleanSay("n2", 500, "This node would pan the camera to a captured location. The camera location is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Show On Map** action pans the camera to a captured location.\nFill: **Scene Id**, **Position**, **Scale**. Needs a confirmed camera location.", 360, 120, "#5f5326");
  NODE_TUTORIALS.showOnMap.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "trader", x: 260, y: 120, data: pay("trader", { traderUuid: "", background: "carry", backdropPath: "" }) },
    n2: cleanSay("n2", 500, "This node would open a merchant sheet. The trader reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Trader** node opens a merchant sheet for players.\nFill: **Trader UUID**, **Background**. Needs a real trader journal page.", 360, 120, "#5f5326");
  NODE_TUTORIALS.trader.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "journal", x: 260, y: 120, data: pay("journal", { operation: "createEntry", pageUuid: "", entryUuid: "", folderId: "", target: "trigger", writeMode: "append", newName: "Demo Journal Entry", content: "<p>Created by the Journal node example.</p>", reveal: false }) },
    n2: cleanSay("n2", 500, "This node would create a new journal entry. The operation is set to create so no existing page is needed."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Journal** node opens, writes, or creates journal entries.\nThis example uses **Create Entry** so no existing page is needed, but it would still create a document.", 360, 120, "#5f5326");
  NODE_TUTORIALS.journal.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "crate", x: 260, y: 120, data: pay("crate", { title: "Demo Crate", text: "A practice crate for the example.", costGold: 0, maxSpins: 0, items: [], audience: "participants" }) },
    n2: cleanSay("n2", 500, "Every player could spin the practice crate. The item list is empty."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Crate** node gives players a loot-case spin.\nFill: **Title**, **Text**, **Items**. Needs real item references for real rewards.", 360, 120, "#5f5326");
  NODE_TUTORIALS.crate.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "quest", x: 260, y: 120, data: { targetType: "quest", targetUuid: "", operation: "announce", objectiveId: "", status: "active" } },
    n2: cleanSay("n2", 500, "This node would update a quest or lore board page. The target reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Quest** node updates a quest or lore board page.\nFill: **Target Type**, **Target UUID**, **Operation**. Needs a real quest page.", 360, 120, "#5f5326");
  NODE_TUTORIALS.quest.example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.modifyReputation", x: 260, y: 120, data: { factionId: "", mode: "add", value: 1, target: "trigger" } },
    n2: cleanSay("n2", 500, "This node would change faction standing. The faction reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Modify Reputation** action changes faction standing.\nFill: **Faction Id**, **Mode**, **Value**, **Target**. Needs a real faction.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.modifyReputation"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.bossBar", x: 260, y: 120, data: { operation: "show", actorUuid: "", label: "" } },
    n2: cleanSay("n2", 500, "This node would show a cinematic boss health bar. The actor reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Boss Bar** action shows a cinematic health bar.\nFill: **Operation**, **Actor UUID**, **Label**. Needs a real actor.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.bossBar"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
{
  const nodes = {
    start: { ...start, data: pay("trigger.start", {}) },
    n1: { id: "n1", type: "action.modifyAffinity", x: 260, y: 120, data: { actorUuid: "", mode: "add", value: 1 } },
    n2: cleanSay("n2", 500, "This node would change an NPC's disposition. The actor reference is left blank."),
    end: endAt(700)
  };
  nodes.c1 = noteBelow("c1", nodes, 260, "The **Modify Affinity** action changes NPC disposition.\nFill: **Actor UUID**, **Mode**, **Value**. Needs a real NPC actor.", 360, 120, "#5f5326");
  NODE_TUTORIALS["action.modifyAffinity"].example = { nodes, edges: [
    edge("e1", "start", "out", "n1", "in"),
    edge("e2", "n1", "out", "n2", "in"),
    edge("e3", "n2", "out", "end", "in")
  ], meta: { entry: "start" } };
}
function tutorialFor(type) {
  const t = NODE_TUTORIALS[type];
  if (!t) return { filled: false, tips: 0, pairsWith: [], demo: null };
  return { filled: true, ...t };
}
function exampleFor(type) {
  const t = NODE_TUTORIALS[type];
  return (t == null ? void 0 : t.example) ?? (t == null ? void 0 : t.demo) ?? null;
}
const CALLOUT_MARKERS = {
  "[!tip] ": "tip",
  "[!warning] ": "warning",
  "[!info] ": "info"
};
function parseCallouts(text) {
  const src = String(text ?? "");
  if (src.trim() === "") return [];
  const blocks = [];
  for (const line of src.split("\n")) {
    let kind = "text";
    let content = line;
    for (const [marker, markerKind] of Object.entries(CALLOUT_MARKERS)) {
      if (line.startsWith(marker)) {
        kind = markerKind;
        content = line.slice(marker.length);
        break;
      }
    }
    const prev = blocks[blocks.length - 1];
    if (prev && prev.kind === kind) {
      prev.text += `
${content}`;
    } else {
      blocks.push({ kind, text: content });
    }
  }
  return blocks;
}
const L = "STORYFLOW_DUNGEONS_LAB.Tutorial";
const CALLOUT_ICONS = {
  tip: "fa-lightbulb",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info"
};
function enrichBlocks(blocks) {
  return blocks.map((b) => ({
    ...b,
    isText: b.kind === "text",
    icon: CALLOUT_ICONS[b.kind] ?? ""
  }));
}
function loc(key) {
  var _a, _b, _c;
  return ((_c = (_b = (_a = globalThis.game) == null ? void 0 : _a.i18n) == null ? void 0 : _b.has) == null ? void 0 : _c.call(_b, key)) ? game.i18n.localize(key) : "";
}
function buildTutorialContext(type, override = null) {
  const def = NODE_TYPES[type] ?? { pins: { in: [], out: [] } };
  const p = nodePresentation(type);
  const t = tutorialFor(type);
  const dynamicOut = def.pins.out === "dynamic";
  const ov = override ?? { summary: "", usage: "", tips: [], pairs: [], demoPageUuid: "", sections: [] };
  const pairsSrc = ov.pairs.length ? ov.pairs : t.pairsWith.map((other) => ({ type: other, why: loc(`${L}.${type}.Pair.${other}`) }));
  const overrideFilled = Boolean(
    ov.summary || ov.usage || ov.tips.length || ov.pairs.length || ov.sections.length
  );
  const tips = ov.tips.length ? ov.tips : Array.from({ length: t.tips }, (_, i) => loc(`${L}.${type}.Tip${i + 1}`)).filter(Boolean);
  const usage = ov.usage || loc(`${L}.${type}.Usage`);
  return {
    type,
    label: p.label,
    icon: p.icon,
    color: p.color,
    groupLabel: categoryPresentation(p.group).label,
    summary: ov.summary || loc(`${L}.${type}.Summary`) || p.summary,
    usage,
    usageBlocks: enrichBlocks(parseCallouts(usage)),
    tips,
    tipBlocks: tips.map((tip) => enrichBlocks(parseCallouts(tip))),
    sections: ov.sections.map((s) => ({ title: s.title, bodyBlocks: enrichBlocks(parseCallouts(s.body)) })),
    pins: {
      inputs: def.pins.in ?? [],
      outputs: dynamicOut ? [] : def.pins.out ?? [],
      dynamicOut
    },
    pairs: pairsSrc.map(({ type: other, why }) => {
      const op = nodePresentation(other);
      return { type: other, label: op.label, icon: op.icon, color: op.color, why };
    }),
    hasDemo: t.demo !== null || Boolean(ov.demoPageUuid),
    customDemoUuid: ov.demoPageUuid,
    filled: t.filled || overrideFilled
  };
}
const str = (v) => typeof v === "string" ? v.trim() : "";
function normalizeOverride(entry) {
  const e = entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
  return {
    summary: str(e.summary),
    usage: str(e.usage),
    tips: (Array.isArray(e.tips) ? e.tips : []).map(str).filter(Boolean),
    pairs: (Array.isArray(e.pairs) ? e.pairs : []).map((p) => ({ type: str(p == null ? void 0 : p.type), why: str(p == null ? void 0 : p.why) })).filter((p) => p.type && isKnownNodeType(p.type)),
    demoPageUuid: str(e.demoPageUuid),
    sections: (Array.isArray(e.sections) ? e.sections : []).map((s) => ({ title: str(s == null ? void 0 : s.title), body: str(s == null ? void 0 : s.body) })).filter((s) => s.title || s.body)
  };
}
function normalizeOverrides(raw) {
  const out = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [type, entry] of Object.entries(raw)) {
    if (!isKnownNodeType(type) || !entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    out[type] = normalizeOverride(entry);
  }
  return out;
}
function normalizeCustomCategories(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list.filter((c) => c && typeof c.id === "string" && c.id.length > 0).map((c) => ({
    id: c.id,
    label: typeof c.label === "string" ? c.label : "",
    pages: normalizePages(c.pages)
  }));
}
function normalizePages(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list.filter((p) => p && typeof p.id === "string" && p.id.length > 0).map((p) => ({
    id: p.id,
    title: typeof p.title === "string" ? p.title : "",
    text: typeof p.text === "string" ? p.text : ""
  }));
}
const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
const MAX_TRAIL = 8;
const GRAPH_PAGE_TYPE = `${MODULE_ID}.graph`;
const _NodeTutorialApp = class _NodeTutorialApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _NodeTutorialApp_instances);
    /** @type {string[]} Navigation trail; the current type is always the last element. */
    __privateAdd(this, _trail, ["display"]);
    /** @type {boolean} Demo run in flight (debounces the button). */
    __privateAdd(this, _running, false);
    /** @type {string} Live sidebar search query. */
    __privateAdd(this, _query, "");
    /** @type {boolean} Restore focus + caret to the sidebar search after a re-render. */
    __privateAdd(this, _searchRestoreFocus, false);
    /** @type {boolean} GM edit mode active for the current type. */
    __privateAdd(this, _editing, false);
    /** @type {import("../data/nodes/tutorial-overrides.mjs").TutorialOverride|null} Working copy while editing. */
    __privateAdd(this, _draft, null);
    /** @type {boolean} Inline "reset to default" confirm row shown. */
    __privateAdd(this, _confirmingReset, false);
    /** @type {{categoryId: string, pageId: string}|null} Selected custom page. */
    __privateAdd(this, _customPage, null);
    /** @type {boolean} GM edit mode active for the selected custom page. */
    __privateAdd(this, _customEditing, false);
    /** @type {{title: string, text: string}|null} Working copy while editing a custom page. */
    __privateAdd(this, _customDraft, null);
    /** @type {number} Sidebar scroll position, carried across full-part re-renders. */
    __privateAdd(this, _sidebarScroll, 0);
  }
  /** Open (or refocus) the guide on a node type — always resets the trail to just that type. */
  static open(type) {
    if (!__privateGet(_NodeTutorialApp, _instance)) __privateSet(_NodeTutorialApp, _instance, new _NodeTutorialApp());
    const app = __privateGet(_NodeTutorialApp, _instance);
    if (type) __privateSet(app, _trail, [type]);
    app.render(true);
    if (app.rendered) app.bringToFront();
    return app;
  }
  /** @override */
  _prepareContext() {
    const isGM = game.user.isGM;
    const groups = buildPalette({ query: __privateGet(this, _query) }).map((group) => ({
      ...group,
      nodes: group.nodes.map((node) => ({ ...node, isActive: node.type === __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this) }))
    }));
    const customGroups = __privateMethod(this, _NodeTutorialApp_instances, buildCustomGroups_fn).call(this);
    const crumbs = __privateGet(this, _trail).map((t, index) => ({
      index,
      label: nodePresentation(t).label,
      isLast: index === __privateGet(this, _trail).length - 1
    }));
    const base = {
      query: __privateGet(this, _query),
      groups,
      customGroups,
      hasSidebarItems: groups.length > 0 || customGroups.length > 0,
      crumbs,
      isGM,
      // Guide/custom-page authoring (override editor + custom category/page CRUD) is a
      // dev-only surface — see the `__FEATURE_DEV_TOOLS__` guard on every mutating action
      // handler below. Every real production build folds this to `false`.
      canEditGuides: isGM && false
    };
    if (__privateGet(this, _customPage)) {
      const custom = __privateMethod(this, _NodeTutorialApp_instances, buildCustomPageContext_fn).call(this, __privateGet(this, _customPage).categoryId, __privateGet(this, _customPage).pageId);
      if (custom) return { ...base, ...custom, showingCustomPage: true };
      __privateSet(this, _customPage, null);
    }
    const type = __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this);
    const stored = __privateMethod(this, _NodeTutorialApp_instances, storedOverride_fn).call(this);
    const context = {
      ...base,
      ...buildTutorialContext(type, stored),
      running: __privateGet(this, _running),
      showingCustomPage: false,
      hasOverride: stored !== null,
      hasExample: isGM && exampleFor(type) !== null,
      editing: __privateGet(this, _editing),
      confirmingReset: __privateGet(this, _confirmingReset)
    };
    context.showRunSection = context.hasDemo || context.hasExample;
    context.runHint = context.hasDemo ? "STORYFLOW_DUNGEONS_LAB.Tutorial.RunDemoHint" : "STORYFLOW_DUNGEONS_LAB.Tutorial.ShowExampleHint";
    context.inactiveNote = "STORYFLOW_DUNGEONS_LAB.Tutorial.ExampleInactiveNote";
    if (__privateGet(this, _editing) && __privateGet(this, _draft)) context.edit = __privateMethod(this, _NodeTutorialApp_instances, buildEditContext_fn).call(this, __privateGet(this, _draft));
    return context;
  }
  /** @override — every render replaces the whole body part; remember the sidebar scroll. */
  async _preRender(context, options) {
    var _a;
    await super._preRender(context, options);
    const list = (_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-tutorial-sidebar-list");
    if (list) __privateSet(this, _sidebarScroll, list.scrollTop);
  }
  /** @override — wire the sidebar search each render (fresh DOM → listeners never stack). */
  _onRender(context, options) {
    super._onRender(context, options);
    const list = this.element.querySelector(".storyflow-tutorial-sidebar-list");
    if (list) list.scrollTop = __privateGet(this, _sidebarScroll);
    const search = this.element.querySelector(".storyflow-tutorial-sidebar-search input");
    if (!search) return;
    search.addEventListener("input", () => {
      __privateSet(this, _query, search.value);
      __privateSet(this, _searchRestoreFocus, true);
      this.render();
    });
    if (__privateGet(this, _searchRestoreFocus)) {
      __privateSet(this, _searchRestoreFocus, false);
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
  }
  /** @override */
  async _onClose(options) {
    __privateSet(_NodeTutorialApp, _instance, null);
    await super._onClose(options);
  }
};
_instance = new WeakMap();
_trail = new WeakMap();
_running = new WeakMap();
_query = new WeakMap();
_searchRestoreFocus = new WeakMap();
_editing = new WeakMap();
_draft = new WeakMap();
_confirmingReset = new WeakMap();
_customPage = new WeakMap();
_customEditing = new WeakMap();
_customDraft = new WeakMap();
_NodeTutorialApp_instances = new WeakSet();
/** @returns {string} Type currently shown — always the last trail entry. */
currentType_fn = function() {
  return __privateGet(this, _trail)[__privateGet(this, _trail).length - 1];
};
/** @returns {import("../data/nodes/tutorial-overrides.mjs").TutorialOverride|null} Stored override for the current type. */
storedOverride_fn = function() {
  const type = __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this);
  return normalizeOverrides(game.settings.get(MODULE_ID, SETTINGS.TUTORIAL_OVERRIDES))[type] ?? null;
};
/** Navigating away from the current guide discards any unsaved edit (v1: no dirty-guard). */
exitEdit_fn = function() {
  __privateSet(this, _editing, false);
  __privateSet(this, _draft, null);
  __privateSet(this, _confirmingReset, false);
  __privateSet(this, _customEditing, false);
  __privateSet(this, _customDraft, null);
};
/**
 * Render context for the edit form from the working draft.
 * @param {import("../data/nodes/tutorial-overrides.mjs").TutorialOverride} draft
 */
buildEditContext_fn = function(draft) {
  const allTypes = nodeTypeIds().map((t) => ({ value: t, label: nodePresentation(t).label }));
  return {
    summary: draft.summary,
    usage: draft.usage,
    tips: draft.tips.map((value, index) => ({ index, value })),
    pairs: draft.pairs.map((p, index) => ({
      index,
      why: p.why,
      typeOptions: allTypes.map((o) => ({ ...o, selected: o.value === p.type }))
    })),
    sections: draft.sections.map((s, index) => ({ index, title: s.title, body: s.body })),
    demoOptions: __privateMethod(this, _NodeTutorialApp_instances, demoOptions_fn).call(this, draft.demoPageUuid)
  };
};
/**
 * Demo-page `<select>` options: the built-in demo, then every world graph page.
 * @param {string} selectedUuid
 */
demoOptions_fn = function(selectedUuid) {
  const options = [
    {
      value: "",
      label: game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.Edit.BuiltinDemo"),
      selected: !selectedUuid
    }
  ];
  for (const entry of game.journal ?? []) {
    for (const page of entry.pages ?? []) {
      if (page.type !== GRAPH_PAGE_TYPE) continue;
      options.push({
        value: page.uuid,
        label: `${entry.name}: ${page.name}`,
        selected: page.uuid === selectedUuid
      });
    }
  }
  return options;
};
/** @returns {{id: string, label: string, pages: object[]}[]} */
customCats_fn = function() {
  return normalizeCustomCategories(
    game.settings.get(MODULE_ID, SETTINGS.GUIDE_CUSTOM_CATEGORIES)
  );
};
saveCustomCats_fn = async function(cats) {
  await game.settings.set(MODULE_ID, SETTINGS.GUIDE_CUSTOM_CATEGORIES, cats);
  void this.render();
};
/**
 * Sidebar groups for custom categories, filtered by the live search query.
 * Categories with no matching pages are hidden while a query is active.
 */
buildCustomGroups_fn = function() {
  const q = __privateGet(this, _query).trim().toLowerCase();
  return __privateMethod(this, _NodeTutorialApp_instances, customCats_fn).call(this).map((cat) => ({
    ...cat,
    pages: cat.pages.filter((p) => !q || p.title.toLowerCase().includes(q)).map((p) => {
      var _a, _b;
      return {
        ...p,
        isActive: ((_a = __privateGet(this, _customPage)) == null ? void 0 : _a.categoryId) === cat.id && ((_b = __privateGet(this, _customPage)) == null ? void 0 : _b.pageId) === p.id
      };
    })
  })).filter((cat) => !q || cat.pages.length > 0);
};
/**
 * Render context for the selected custom page.
 * @param {string} categoryId
 * @param {string} pageId
 */
buildCustomPageContext_fn = function(categoryId, pageId) {
  const cat = __privateMethod(this, _NodeTutorialApp_instances, customCats_fn).call(this).find((c) => c.id === categoryId);
  const page = cat == null ? void 0 : cat.pages.find((p) => p.id === pageId);
  if (!cat || !page) return null;
  const edit = __privateGet(this, _customEditing) && __privateGet(this, _customDraft) ? { title: __privateGet(this, _customDraft).title, text: __privateGet(this, _customDraft).text } : null;
  return {
    customCategoryLabel: cat.label,
    customPageTitle: page.title,
    customPageBlocks: enrichBlocks(parseCallouts(page.text)),
    customEditing: __privateGet(this, _customEditing),
    customEdit: edit
  };
};
promptName_fn = async function(titleKey, current = "") {
  const result = await DialogV2.prompt({
    window: { title: game.i18n.localize(titleKey) },
    content: `<input type="text" name="name" value="${esc(current)}" autofocus style="width:100%" />`,
    ok: { callback: (event, button) => button.form.elements.name.value.trim() },
    rejectClose: false
  }).catch(() => null);
  return result;
};
/** Copy the edit form's current values into #draft (list-mutating actions call this first). */
syncDraftFromForm_fn = function() {
  var _a;
  const form = (_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-tutorial-edit-form");
  if (!form || !__privateGet(this, _draft)) return;
  const fd = new FormData(form);
  const str2 = (v) => String(v ?? "");
  __privateGet(this, _draft).summary = str2(fd.get("summary"));
  __privateGet(this, _draft).usage = str2(fd.get("usage"));
  __privateGet(this, _draft).tips = __privateGet(this, _draft).tips.map((_, i) => str2(fd.get(`tip-${i}`)));
  __privateGet(this, _draft).pairs = __privateGet(this, _draft).pairs.map((_, i) => ({
    type: str2(fd.get(`pair-type-${i}`)),
    why: str2(fd.get(`pair-why-${i}`))
  }));
  __privateGet(this, _draft).sections = __privateGet(this, _draft).sections.map((_, i) => ({
    title: str2(fd.get(`section-title-${i}`)),
    body: str2(fd.get(`section-body-${i}`))
  }));
  __privateGet(this, _draft).demoPageUuid = str2(fd.get("demoPageUuid"));
};
/** Copy the custom-page edit form's current values into #customDraft. */
syncCustomDraftFromForm_fn = function() {
  var _a;
  const form = (_a = this.element) == null ? void 0 : _a.querySelector(".storyflow-tutorial-custom-edit-form");
  if (!form || !__privateGet(this, _customDraft)) return;
  const fd = new FormData(form);
  const str2 = (v) => String(v ?? "");
  __privateGet(this, _customDraft).title = str2(fd.get("customTitle"));
  __privateGet(this, _customDraft).text = str2(fd.get("customBody"));
};
_sidebarScroll = new WeakMap();
_NodeTutorialApp_static = new WeakSet();
onPickType_fn = function(event, target) {
  var _a;
  const type = (_a = target.closest("[data-type]")) == null ? void 0 : _a.dataset.type;
  if (!type) return;
  __privateSet(this, _customPage, null);
  __privateMethod(this, _NodeTutorialApp_instances, exitEdit_fn).call(this);
  __privateSet(this, _trail, [type]);
  this.render();
};
onShowType_fn = function(event, target) {
  var _a;
  const type = (_a = target.closest("[data-type]")) == null ? void 0 : _a.dataset.type;
  if (!type || type === __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this)) return;
  __privateSet(this, _customPage, null);
  __privateMethod(this, _NodeTutorialApp_instances, exitEdit_fn).call(this);
  __privateGet(this, _trail).push(type);
  if (__privateGet(this, _trail).length > MAX_TRAIL) __privateGet(this, _trail).shift();
  this.render();
};
onCrumbTo_fn = function(event, target) {
  var _a;
  const index = Number((_a = target.closest("[data-index]")) == null ? void 0 : _a.dataset.index);
  if (!Number.isInteger(index) || index < 0 || index >= __privateGet(this, _trail).length) return;
  __privateSet(this, _customPage, null);
  __privateMethod(this, _NodeTutorialApp_instances, exitEdit_fn).call(this);
  __privateSet(this, _trail, __privateGet(this, _trail).slice(0, index + 1));
  this.render();
};
onRunDemo_fn = async function() {
  if (__privateGet(this, _running)) return;
  __privateSet(this, _running, true);
  this.render();
  try {
    const type = __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this);
    const demoUuid = buildTutorialContext(type, __privateMethod(this, _NodeTutorialApp_instances, storedOverride_fn).call(this)).customDemoUuid;
    const { runTutorialDemo } = await import("./tutorial-run-JVtC6W2R.js");
    await runTutorialDemo(type, demoUuid);
  } catch (err) {
    console.error(`${MODULE_ID} | tutorial demo failed`, err);
    ui.notifications.error(game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.RunFailed"));
  } finally {
    __privateSet(this, _running, false);
    if (this.rendered) this.render();
  }
};
onShowExample_fn = async function() {
  if (__privateGet(this, _running) || !game.user.isGM) return;
  __privateSet(this, _running, true);
  this.render();
  try {
    const type = __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this);
    const { showTutorialExample } = await import("./tutorial-run-JVtC6W2R.js");
    await showTutorialExample(type);
  } catch (err) {
    console.error(`${MODULE_ID} | tutorial example failed`, err);
    ui.notifications.error(game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.RunFailed"));
  } finally {
    __privateSet(this, _running, false);
    if (this.rendered) this.render();
  }
};
onCopyExample_fn = async function() {
  if (!game.user.isGM) return;
  try {
    const type = __privateMethod(this, _NodeTutorialApp_instances, currentType_fn).call(this);
    const { copyTutorialExample } = await import("./tutorial-run-JVtC6W2R.js");
    const copied = await copyTutorialExample(type);
    ui.notifications[copied ? "info" : "warn"](
      game.i18n.localize(
        copied ? "STORYFLOW_DUNGEONS_LAB.Tutorial.ExampleCopied" : "STORYFLOW_DUNGEONS_LAB.Tutorial.ExampleCopyFailed"
      )
    );
  } catch (err) {
    console.error(`${MODULE_ID} | tutorial example copy failed`, err);
    ui.notifications.error(game.i18n.localize("STORYFLOW_DUNGEONS_LAB.Tutorial.RunFailed"));
  }
};
onEditGuide_fn = function() {
  if (!game.user.isGM || true) return;
};
onAddTip_fn = function() {
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  __privateGet(this, _draft).tips.push("");
  this.render();
};
onRemoveTip_fn = function(event, target) {
  var _a;
  const index = Number((_a = target.closest("[data-index]")) == null ? void 0 : _a.dataset.index);
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  if (Number.isInteger(index)) __privateGet(this, _draft).tips.splice(index, 1);
  this.render();
};
onInsertCallout_fn = function(event, target) {
  var _a, _b, _c;
  const kind = (_a = target.closest("[data-callout]")) == null ? void 0 : _a.dataset.callout;
  const targetName = (_b = target.closest("[data-target]")) == null ? void 0 : _b.dataset.target;
  if (!kind || !targetName) return;
  const marker = `[!${kind}] `;
  const ta = (_c = this.element) == null ? void 0 : _c.querySelector(`textarea[name="${targetName}"]`);
  if (!ta) return;
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  __privateMethod(this, _NodeTutorialApp_instances, syncCustomDraftFromForm_fn).call(this);
  const start2 = ta.selectionStart ?? 0;
  const end = ta.selectionEnd ?? 0;
  ta.value = ta.value.slice(0, start2) + marker + ta.value.slice(end);
  const caret = start2 + marker.length;
  ta.focus();
  ta.setSelectionRange(caret, caret);
};
onAddPair_fn = function() {
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  __privateGet(this, _draft).pairs.push({ type: nodeTypeIds()[0] ?? "", why: "" });
  this.render();
};
onRemovePair_fn = function(event, target) {
  var _a;
  const index = Number((_a = target.closest("[data-index]")) == null ? void 0 : _a.dataset.index);
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  if (Number.isInteger(index)) __privateGet(this, _draft).pairs.splice(index, 1);
  this.render();
};
onAddSection_fn = function() {
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  __privateGet(this, _draft).sections.push({ title: "", body: "" });
  this.render();
};
onRemoveSection_fn = function(event, target) {
  var _a;
  const index = Number((_a = target.closest("[data-index]")) == null ? void 0 : _a.dataset.index);
  __privateMethod(this, _NodeTutorialApp_instances, syncDraftFromForm_fn).call(this);
  if (Number.isInteger(index)) __privateGet(this, _draft).sections.splice(index, 1);
  this.render();
};
onSaveGuide_fn = async function() {
  if (!game.user.isGM || true) return;
};
onCancelGuide_fn = function() {
  __privateMethod(this, _NodeTutorialApp_instances, exitEdit_fn).call(this);
  this.render();
};
onResetGuide_fn = function() {
  __privateSet(this, _confirmingReset, true);
  this.render();
};
onCancelResetGuide_fn = function() {
  __privateSet(this, _confirmingReset, false);
  this.render();
};
onConfirmResetGuide_fn = async function() {
  if (!game.user.isGM || true) return;
};
onAddCustomCategory_fn = async function() {
  if (!game.user.isGM || true) return;
};
onRenameCustomCategory_fn = async function(event, target) {
  if (!game.user.isGM || true) return;
};
onRemoveCustomCategory_fn = async function(event, target) {
  if (!game.user.isGM || true) return;
};
onAddCustomPage_fn = async function(event, target) {
  if (!game.user.isGM || true) return;
};
onRemoveCustomPage_fn = async function(event, target) {
  if (!game.user.isGM || true) return;
};
onPickCustomPage_fn = function(event, target) {
  const { catid, pageid } = target.dataset;
  if (!catid || !pageid) return;
  __privateSet(this, _customPage, { categoryId: catid, pageId: pageid });
  __privateMethod(this, _NodeTutorialApp_instances, exitEdit_fn).call(this);
  this.render();
};
onEditCustomPage_fn = function() {
  if (!game.user.isGM || true) return;
};
onSaveCustomPage_fn = async function() {
  if (!game.user.isGM || true) return;
};
onCancelCustomPage_fn = function() {
  __privateSet(this, _customEditing, false);
  __privateSet(this, _customDraft, null);
  this.render();
};
__privateAdd(_NodeTutorialApp, _NodeTutorialApp_static);
/** @type {NodeTutorialApp|null} singleton instance. */
__privateAdd(_NodeTutorialApp, _instance, null);
__publicField(_NodeTutorialApp, "DEFAULT_OPTIONS", {
  id: "storyflow-node-tutorial",
  classes: [MODULE_ID, "storyflow-node-tutorial"],
  position: { width: 880, height: 640 },
  window: {
    title: "STORYFLOW_DUNGEONS_LAB.Tutorial.WindowTitle",
    resizable: true,
    icon: "fa-solid fa-graduation-cap"
  },
  actions: {
    pickType: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onPickType_fn),
    showType: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onShowType_fn),
    crumbTo: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onCrumbTo_fn),
    runDemo: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRunDemo_fn),
    showExample: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onShowExample_fn),
    copyExample: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onCopyExample_fn),
    editGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onEditGuide_fn),
    addTip: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onAddTip_fn),
    removeTip: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRemoveTip_fn),
    insertCallout: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onInsertCallout_fn),
    addPair: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onAddPair_fn),
    removePair: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRemovePair_fn),
    addSection: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onAddSection_fn),
    removeSection: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRemoveSection_fn),
    saveGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onSaveGuide_fn),
    cancelGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onCancelGuide_fn),
    resetGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onResetGuide_fn),
    cancelResetGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onCancelResetGuide_fn),
    confirmResetGuide: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onConfirmResetGuide_fn),
    addCustomCategory: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onAddCustomCategory_fn),
    renameCustomCategory: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRenameCustomCategory_fn),
    removeCustomCategory: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRemoveCustomCategory_fn),
    addCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onAddCustomPage_fn),
    removeCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onRemoveCustomPage_fn),
    pickCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onPickCustomPage_fn),
    editCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onEditCustomPage_fn),
    saveCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onSaveCustomPage_fn),
    cancelCustomPage: __privateMethod(_NodeTutorialApp, _NodeTutorialApp_static, onCancelCustomPage_fn)
  }
});
__publicField(_NodeTutorialApp, "PARTS", {
  body: { template: "modules/storyflow-dungeons-lab/templates/canvas/node-tutorial.hbs" }
});
let NodeTutorialApp = _NodeTutorialApp;
const nodeTutorialApp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeTutorialApp
}, Symbol.toStringTag, { value: "Module" }));
export {
  exampleFor as e,
  nodeTutorialApp as n,
  tutorialFor as t
};
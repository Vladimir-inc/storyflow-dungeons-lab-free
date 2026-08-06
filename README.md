# StoryFlow - Dungeons LAB

Build your scenes as flowcharts instead of scripting them.

StoryFlow is a Foundry VTT module that gives you a visual node editor for the things you would
otherwise improvise or hard-code: an NPC conversation that branches on a Persuasion check, 
a quest that updates itself when the right character walks into the right room.

You drag nodes onto a canvas, connect them with wires, and the module runs the result live at
your table. No macros, no JavaScript.

---

## What it looks like in practice

Say you want this: the party enters the crypt, a voice whispers to them, and whoever passes a
Wisdom check hears the real warning while everyone else hears nonsense.

In StoryFlow that is six nodes on a canvas:

```
[Region Trigger]  ->  [Display: "The air goes cold."]
                          |
                      [Check: Wisdom DC 13]
                       /              \
              (pass)  /                \  (fail)
        [Text: the real warning]   [Text: garbled whispers]
                       \                /
                        \              /
                           [End]
```

Drop a region on the scene, point the trigger at it, and it runs the next time someone steps in.

---

## What you get in this free build

**Story flow**
Start, Display, Text, Choice, Jump, Wait, End, Comment

**Logic**
Condition, Check

**Actions**
Give / Remove Item, Give / Take Gold, Heal / Damage, Apply Effect, Token, Change Scene,
Preload Scene, Show Image, Show on Map, Notification

**Triggers**
Region Trigger (fire a graph when a token enters a scene region), Start

**Quest Board**
A shared quest log your players can actually open. The Quest node writes to it from inside your
graph, so objectives tick over on their own instead of you remembering to announce them.

Everything above is authorable in this build. Graphs made in a larger edition still *run* here,
so nothing breaks if a friend shares one with you.

---

## Requirements

| | |
|---|---|
| Foundry VTT | v13 minimum, verified on v14 |
| Game system | dnd5e |
| Required modules | [Tagger](https://foundryvtt.com/packages/tagger), Dungeons LAB Hub |

Dungeons LAB Hub is our launcher module. It is where StoryFlow lives alongside our other tools,
and it handles updates and settings for all of them in one place.

---

## Install

### Manifest link
1. Open latest release.
2. Right click on module.json -> copy link.
3. Paste manifest link in Add-Ons in Foundry VTT.

### Manual
1. Install and enable **Tagger** and **Dungeons LAB Hub**.
2. Unzip this package into your Foundry `Data/modules/` folder. You should end up with
   `Data/modules/storyflow-dungeons-lab/module.json`.
3. Restart Foundry and enable **StoryFlow Dungeons Lab** in *Manage Modules*.

The module ships in English and Russian and follows whatever language Foundry is set to.

---

## Your first graph

1. Open any Journal Entry and add a page of type **StoryFlow Graph**.
2. Open the page. The canvas opens with it.
3. Double click empty canvas to add a node, drag from a pin to wire two nodes together.
4. Start with a **Start** node, wire it into a **Display** node, type something into it.
5. Save the page and hit play.

A guided tour runs the first time you open the editor, and every node type has a short
explanation inside its inspector. If you would rather learn by reading someone else's work,
the template library has ready-made graphs you can drop in and take apart.

---

## How it behaves at the table

Graphs run on the GM client and push the results to players over Foundry's socket, so a Display
beat lands on everyone's screen at the same moment. Players never see the canvas, only what the
graph shows them.

Region triggers are attached to scene regions as a **StoryFlow Trigger** region behavior. That
means they live with the scene, survive copies, and can be toggled off without editing the graph.

---

## Getting help, and getting features built

We are a small team and we actually read what people send us.

- **Discord** - [discord.gg/MUxsQCf587](https://discord.gg/MUxsQCf587)
  Questions, bug reports, feature requests. Fastest way to reach us. If a node is missing, ask
  for it. A fair share of what shipped this year started as someone's message in that server.
- **Patreon** - [patreon.com/c/Dungeons_LAB](https://www.patreon.com/c/Dungeons_LAB)
  Supporting us here funds the development time and gets you the larger editions of StoryFlow,
  plus everything else we make.
- **Ko-fi** - [ko-fi.com/dungeonslab](https://ko-fi.com/dungeonslab)
  One-off tip, no subscription, no strings. Genuinely appreciated.

---

## License and artwork

The code and the artwork here are not free assets. In particular the animated dragon in
`assets/images/guide/` and the Dungeons LAB logo may not be extracted, repackaged, or reused
outside this module, on their own or as part of anything else. Using the module normally in your
game is of course fine. See [LICENSE](LICENSE) for the exact terms.

---

Made by Dungeons LAB. Have fun at your table.

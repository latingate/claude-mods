# yellow-prompt

Makes the prompts you type easy to spot when you scroll back through a Claude Code conversation.

## Install

```
/plugin install yellow-prompt --marketplace latingate/claude-mods
```

The repository is private, so the computer needs a GitHub login first. See [INSTALL.md](INSTALL.md) for the full steps.

## Disable, re-enable or remove

| To | Run at the Claude Code prompt |
| --- | --- |
| Turn it off for now (stays installed) | `/plugin disable yellow-prompt` |
| Turn it back on after disabling | `/plugin enable yellow-prompt` |
| Remove it from this computer | `/plugin uninstall yellow-prompt` |

After `enable` or `disable`, run `/reload-plugins` to apply it in the session you're in. New sessions pick it up by themselves. If you uninstalled it, `enable` won't bring it back: install it again with the line under **Install**.

From the menu: run `/plugin`, go to the installed plugins, select `yellow-prompt`, and choose enable, disable or uninstall.

From a shell, drop the slash: `claude plugin enable yellow-prompt`, `claude plugin disable yellow-prompt`, `claude plugin uninstall yellow-prompt`. Once it's off, your prompts go back to Claude Code's normal look. Each command only affects the computer you run it on.

## What it does

With the default settings:

- **While you type:** the text in the prompt box is drawn in yellow.
- **After you send:** each prompt you typed is shown in the transcript in yellow, with a `❯` marker, inside a thin yellow box with rounded corners:

  ```
  ╭──────────────────────────────╮
  │ ❯ how do I run the tests?    │
  ╰──────────────────────────────╯
  ```

- **Everything else is unchanged:** messages that you didn't type (background task notifications, other agents, SDK messages) keep Claude Code's normal look. Only the display changes. The text that gets sent is exactly what you typed.

## Settings

Each person who installs the mod can choose their own colours and border:

| Setting | What it changes | Values | Default |
| --- | --- | --- | --- |
| **Text colour** (`textColor`) | Your text in the prompt box and in sent prompts, including the `❯` marker | A colour name (`yellow`, `cyan`, `magenta`, `green`, `red`, `blue`, `white`, …) or a hex value like `#f5c518` | `yellow` |
| **Border colour** (`borderColor`) | The box around sent prompts | Same as text colour | `yellow` |
| **Border style** (`borderStyle`) | The shape of that box | `round`, `single`, `double`, `bold`, or `none` (no box, coloured text only) | `round` |

At install, right after the plugin details, Claude Code shows a screen with these settings. Press Enter to keep the defaults.

### Changing settings

After the mod is installed, you can change the settings at any time.

**In `/config` (easiest):**

1. Type `/config` at the Claude Code prompt.
2. Find the yellow-prompt rows: **Text colour**, **Border colour** and **Border style**. Type to filter the list if it's long.
3. Select a row and change its value. Type a colour name or hex value for the colours, and pick from the list for the border style.

The change applies right away, with no reinstall or reload. Your next prompt shows the new look.

**In `settings.json` (by hand):** the values are stored in your user settings file, `~/.claude/settings.json` (on Windows: `C:\Users\<you>\.claude\settings.json`), under `pluginConfigs`:

```json
"pluginConfigs": {
  "yellow-prompt@claude-mods": {
    "options": {
      "textColor": "cyan",
      "borderColor": "#f5c518",
      "borderStyle": "double"
    }
  }
}
```

Leave out any setting you want at its default. After saving the file, run `/reload-plugins` or start a new session.

**Back to the defaults:** clear the value in `/config`, or remove it from `settings.json`.

If a setting is blank or invalid, the default is used. A border style other than the five listed counts as unset. Your choices live in your own Claude Code settings, so updating the mod never resets them, and each computer keeps its own.

Colour names are the terminal's own, so their exact shade follows your terminal's colour scheme. A hex value gives the same shade everywhere.

## How it works

It's a Claude Code mod: a hooks module in `hooks/register.tsx`, loaded through `hooks/hooks.json`.

The settings are declared under `userConfig` in `.claude-plugin/plugin.json`. Claude Code passes their values to `register(on, options)`. The module reads `textColor`, `borderColor` and `borderStyle` from `options`, falling back to the defaults in `DEFAULTS` when a value is missing or blank. When a setting changes in `/config`, Claude Code reloads the module with the new values.

It then registers three hooks:

| Hook | What it does |
| --- | --- |
| `prompt.edit` | Runs on every keystroke or paste in the prompt box. It lets Claude Code apply the edit, then adds a decoration that paints the whole draft in the text colour. Decorations are paint only and never change the text. |
| `prompt.fill` | Runs when a command or plugin puts text into the box. It adds the same decoration to that text. |
| `ui.render` on `UserMessage` | Runs when Claude Code draws a user message in the transcript. If the message came from the prompt box (`origin.kind === 'composer'`), it draws its own row: a `Box` with the chosen border style and colour, holding a `❯` and the message text in the text colour. With border style `none`, the `Box` has no border. Any other message is passed on with `next(e)`, so Claude Code draws it as usual. |

## Limits

- The border around the prompt box itself can't be changed. Claude Code draws that frame, and mods can't redraw it.
- Text recalled with the up arrow may show in the normal colour until you type the next character.
- Your sent prompts are drawn as plain text, so any styling Claude Code normally gives them is replaced.

## Development

```sh
claude plugin validate yellow-prompt   # check the manifest and hooks
claude plugin test yellow-prompt       # run hooks/register.test.tsx
```

Run `tsc -p yellow-prompt` to type-check. It needs the type files Claude Code writes to `.claude-plugin/types/` the first time it loads the mod. That folder is git-ignored.

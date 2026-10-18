# yellow-prompt

Makes the prompts you type easy to spot when you scroll back through a Claude Code conversation.

## Install

```
/plugin install yellow-prompt --marketplace latingate/claude-mods
```

The repository is private, so the computer needs a GitHub login first. See [INSTALL.md](INSTALL.md) for the full steps.

## What it does

- **While you type:** the text in the prompt box is drawn in yellow.
- **After you send:** each prompt you typed is shown in the transcript in yellow, with a `❯` marker, inside a thin yellow box with rounded corners:

  ```
  ╭──────────────────────────────╮
  │ ❯ how do I run the tests?    │
  ╰──────────────────────────────╯
  ```

- **Everything else is unchanged:** messages that you didn't type (background task notifications, other agents, SDK messages) keep Claude Code's normal look. Only the display changes. The text that gets sent is exactly what you typed.

## How it works

It's a Claude Code mod: a hooks module in `hooks/register.tsx`, loaded through `hooks/hooks.json`. It registers three hooks:

| Hook | What it does |
| --- | --- |
| `prompt.edit` | Runs on every keystroke or paste in the prompt box. It lets Claude Code apply the edit, then adds a decoration that paints the whole draft yellow. Decorations are paint only and never change the text. |
| `prompt.fill` | Runs when a command or plugin puts text into the box. It adds the same yellow decoration to that text. |
| `ui.render` on `UserMessage` | Runs when Claude Code draws a user message in the transcript. If the message came from the prompt box (`origin.kind === 'composer'`), it draws its own row: a yellow rounded `Box` holding a yellow `❯` and the message text. Any other message is passed on with `next(e)`, so Claude Code draws it as usual. |

The colour is the constant `YELLOW` at the top of `register.tsx`. It's the terminal's named `yellow`, so the shade follows your terminal's colour scheme. Set it to a hex value such as `'#f5c518'` for a fixed shade.

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

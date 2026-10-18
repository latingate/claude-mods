# claude-mods

latingate's personal Claude Code mods. The repository is a plugin **marketplace**: `.claude-plugin/marketplace.json` lists every mod, and each mod lives in its own folder.

| Mod | What it does |
| --- | --- |
| [yellow-prompt](yellow-prompt/README.md) | Draws your own prompts in colour (yellow by default, configurable), in the prompt box and in the transcript |

## Installing a mod on a computer

The repository is private. On each computer, sign in once:

```sh
gh auth login
gh auth setup-git
```

Then, at the Claude Code prompt in a terminal:

```
/plugin install <mod> --marketplace latingate/claude-mods
```

Answer `y` to add the marketplace (only the first time), then choose the **user** scope so the mod loads in all projects.

From a shell: `claude plugin install <mod> --marketplace latingate/claude-mods`.
In the desktop app: **+** next to the prompt box → **Plugins** → **Add marketplace** (`latingate/claude-mods`) → **Add plugin**.

Each mod's own `INSTALL.md` has the details.

## Disabling or removing a mod

At the Claude Code prompt (or run `/plugin` with no arguments and manage it from the menu):

| To | Run | Effect |
| --- | --- | --- |
| Turn it off for now | `/plugin disable <mod>` | The mod stays installed but stops loading. |
| Turn it back on | `/plugin enable <mod>` | A disabled mod loads again, with nothing to reinstall. |
| Remove it | `/plugin uninstall <mod>` | The mod is deleted from the computer. Install it again with `/plugin install <mod> --marketplace latingate/claude-mods`. |
| Remove the whole marketplace | `/plugin marketplace remove claude-mods` | The computer forgets this repository and every mod installed from it. |

To apply an enable or disable in the session you're in, run `/reload-plugins` afterwards. New sessions pick up the change by themselves.

From the menu: run `/plugin`, go to the installed plugins, select the mod, and choose enable, disable or uninstall.

From a shell, the same commands work without the slash: `claude plugin enable <mod>`, `claude plugin disable <mod>`, `claude plugin uninstall <mod>`.
In the desktop app: **+** next to the prompt box → **Plugins**, then turn the mod on, off or remove it.

These only change the computer you run them on. The repository and your other computers are untouched.

## Adding a new mod

### 1. Build it

The easiest way is to ask Claude Code to "make a mod" (the plugin-authoring skill). It builds the mod in a session folder and hot-reloads it while you try it out. When you're happy with it, copy the mod's folder into this repository, leaving out any `.git`:

```
claude-mods/
├── .claude-plugin/marketplace.json
├── README.md
├── yellow-prompt/
└── <new-mod>/                     ← the new mod's folder
    ├── .claude-plugin/plugin.json
    ├── hooks/hooks.json
    ├── hooks/register.tsx
    ├── hooks/register.test.tsx
    ├── README.md                  ← what it does and how
    └── INSTALL.md                 ← how to install it
```

A mod needs at least:

- `.claude-plugin/plugin.json`: `{ "name": "<new-mod>", "version": "0.1.0", "description": "<one line>", "author": { "name": "latingate" } }`. The `name` must match the folder name and the marketplace entry.
- `hooks/hooks.json`: `{ "modules": ["./register.tsx"] }`
- `hooks/register.tsx`: the hooks module, `export const register: Register = (on) => { ... }`

### 2. List it in the marketplace

Add an entry to the `plugins` array in `.claude-plugin/marketplace.json`:

```json
{ "name": "<new-mod>", "source": "./<new-mod>", "description": "<one line>" }
```

Also add a row to the table at the top of this README.

### 3. Check it

```sh
claude plugin validate .            # marketplace file + every listed mod
claude plugin validate <new-mod>    # one mod's manifest and hooks
claude plugin test <new-mod>        # its *.test.ts / *.test.tsx files
```

### 4. Commit and push

Before committing, make sure there are no keys, tokens or other secrets in the folder. Then push, and install it on each computer with `/plugin install <new-mod> --marketplace latingate/claude-mods`. Computers that already added the marketplace run `/plugin marketplace update claude-mods` first, so they see the new entry.

### Changing an existing mod

Edit it here, raise `version` in its `plugin.json`, and push. Then, on each computer:

1. Run `/plugin marketplace update claude-mods` at the Claude Code prompt. This fetches the marketplace and installs the new version of any mod it lists that's installed on the computer.
2. Run `/reload-plugins` in any open session, or start a new one.

### Mod settings

A mod can let each person pick their own settings, such as colours, by declaring them under `userConfig` in its `plugin.json`. yellow-prompt shows how.

- **At install:** Claude Code shows a screen to set them.
- **Any time after:** type `/config` at the Claude Code prompt, find the mod's rows, and change them. The change applies right away.
- **By hand:** edit `~/.claude/settings.json` under `pluginConfigs` → `"<mod>@claude-mods"` → `options`, then run `/reload-plugins`.

Settings are stored per computer and survive updates. See each mod's README for its settings.

### Trying changes before pushing

Start a session with the mod loaded straight from this folder:

```sh
claude --plugin-dir C:\Users\gal\Dropbox\DEV\claude-mods-gs\<mod>
```

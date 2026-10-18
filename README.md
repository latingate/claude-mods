# claude-mods

latingate's personal Claude Code mods. The repository is a plugin **marketplace**: `.claude-plugin/marketplace.json` lists every mod, and each mod lives in its own folder.

| Mod | What it does |
| --- | --- |
| [yellow-prompt](yellow-prompt/README.md) | Draws your own prompts in yellow, in the prompt box and in the transcript |

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

Edit it here, raise `version` in its `plugin.json`, push, then run `/plugin marketplace update claude-mods` on each computer.

### Trying changes before pushing

Start a session with the mod loaded straight from this folder:

```sh
claude --plugin-dir C:\Users\gal\claude-mods\<mod>
```

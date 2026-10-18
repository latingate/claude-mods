# Installing yellow-prompt

`latingate/claude-mods` is a **private** repository, so each computer needs a GitHub login that can read it before it can install.

## 1. One-time GitHub setup on the computer

```sh
gh auth login      # sign in as latingate
gh auth setup-git  # let git use that login for github.com
```

The install never asks for credentials. It uses whatever git already has. An SSH key for github.com also works.

## 2. Install

At the Claude Code prompt in a terminal:

```
/plugin install yellow-prompt --marketplace latingate/claude-mods
```

Or from a shell:

```sh
claude plugin install yellow-prompt --marketplace latingate/claude-mods
```

- Answer `y` to **Add marketplace?** (`github:latingate/claude-mods`). This only happens the first time on each computer.
- Pick the **user** scope, which is listed first, so the mod loads in every project.
- On the settings screen, choose a text colour, border colour and border style, or press Enter to keep the defaults (yellow, yellow, round). You can change them later in `/config`. See **Settings** in [README.md](README.md).

You'll see `Installed yellow-prompt. Plugin is now active.` It works right away in that session and loads by itself in every session after that.

In the desktop app, where `/plugin` doesn't run: click **+** next to the prompt box, then **Plugins**, then **Add marketplace** with `latingate/claude-mods`, then **Add plugin**.

## Updating

After a new version is pushed (with `version` raised in `.claude-plugin/plugin.json`), run this on each computer:

```
/plugin marketplace update claude-mods
```

Then, from a shell:

```sh
claude plugin update yellow-prompt
```

Finally, run `/reload-plugins` in any open session, or start a new one. Your settings are kept across updates.

## Uninstalling

```
/plugin uninstall yellow-prompt
```

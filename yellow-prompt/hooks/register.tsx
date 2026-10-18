import type { PluginOptions, PromptDecoration, Register } from 'claude-code'

const DEFAULTS = { textColor: 'yellow', borderColor: 'yellow', borderStyle: 'round' }

// A setting left blank (or not a string) falls back to the default.
const pick = (options: PluginOptions, key: keyof typeof DEFAULTS): string => {
  const value = options[key]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : DEFAULTS[key]
}

export const register: Register = (on, options) => {
  const textColor = pick(options, 'textColor')
  const borderColor = pick(options, 'borderColor')
  const borderStyle = pick(options, 'borderStyle')

  const paintAll = (text: string): PromptDecoration => ({ start: 0, end: text.length, color: textColor })

  // Every keystroke or paste: repaint the whole draft.
  on('prompt.edit', async ($, e, next) => {
    const r = await next(e)
    return { ...r, decorations: [...(r.decorations ?? []), paintAll(r.text)] }
  })

  // Text put into the box by a command or plugin: paint it as it lands.
  on('prompt.fill', ($, e, next) =>
    next({ ...e, decorations: [...(e.decorations ?? []), paintAll(e.text)] }),
  )

  // Prompts you typed, as they show in the transcript: coloured and boxed, so they stand out when scrolling.
  on('ui.render', { component: 'UserMessage' }, ($, e, next) => {
    if (e.props.origin.kind !== 'composer') {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const border = borderStyle === 'none' ? {} : { borderStyle, borderColor, paddingX: 1 }

    return (
      <Box flexDirection="row" {...border}>
        <Text color={textColor} bold>{'❯ '}</Text>
        <Text color={textColor}>{e.props.text}</Text>
      </Box>
    )
  })
}

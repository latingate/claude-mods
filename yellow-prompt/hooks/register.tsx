import type { PromptDecoration, Register } from 'claude-code'

const YELLOW = 'yellow'

const paintAll = (text: string): PromptDecoration => ({ start: 0, end: text.length, color: YELLOW })

export const register: Register = on => {
  // Every keystroke or paste: repaint the whole draft yellow.
  on('prompt.edit', async ($, e, next) => {
    const r = await next(e)
    return { ...r, decorations: [...(r.decorations ?? []), paintAll(r.text)] }
  })

  // Text put into the box by a command or plugin: paint it as it lands.
  on('prompt.fill', ($, e, next) =>
    next({ ...e, decorations: [...(e.decorations ?? []), paintAll(e.text)] }),
  )

  // Prompts you typed, as they show in the transcript: yellow, so they stand out when scrolling.
  on('ui.render', { component: 'UserMessage' }, ($, e, next) => {
    if (e.props.origin.kind !== 'composer') {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" borderStyle="round" borderColor={YELLOW} paddingX={1}>
        <Text color={YELLOW} bold>{'❯ '}</Text>
        <Text color={YELLOW}>{e.props.text}</Text>
      </Box>
    )
  })
}

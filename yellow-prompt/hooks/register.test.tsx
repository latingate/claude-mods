import { expect, test } from 'claude-code/testing'

const SURFACES = ['terminal', 'desktop'] as const
const PROMPT = { text: 'my question', origin: { kind: 'composer' as const }, isExpanded: true }

test('filled text is painted yellow by default', async ($, on) => {
  let seen: unknown
  on('prompt.fill', ($, e) => {
    seen = e.decorations
    return { isFilled: true }
  })
  await $.prompt.fill({ text: 'hello', mode: 'replace', origin: { kind: 'plugin', name: 'test' } })
  expect(seen).toEqual([{ start: 0, end: 5, color: 'yellow' }])
})

test('filled text uses the chosen text colour', { options: { textColor: '#00ffff' } }, async ($, on) => {
  let seen: unknown
  on('prompt.fill', ($, e) => {
    seen = e.decorations
    return { isFilled: true }
  })
  await $.prompt.fill({ text: 'hi', mode: 'replace', origin: { kind: 'plugin', name: 'test' } })
  expect(seen).toEqual([{ start: 0, end: 2, color: '#00ffff' }])
})

for (const surface of SURFACES) {
  test(`typed prompt is yellow in a round yellow box by default on ${surface}`, async $ => {
    const ui = await $.ui.mount({ plugin: 'yellow-prompt', surface, component: 'UserMessage', props: PROMPT })
    expect(await ui.drawn()).toMatchObject({
      type: 'Box',
      props: { borderStyle: 'round', borderColor: 'yellow' },
      children: [
        { type: 'Text', props: { color: 'yellow' } },
        { type: 'Text', props: { color: 'yellow' }, children: ['my question'] },
      ],
    })
  })

  test(
    `typed prompt uses the chosen colours and style on ${surface}`,
    { options: { textColor: 'cyan', borderColor: 'magenta', borderStyle: 'double' } },
    async $ => {
      const ui = await $.ui.mount({ plugin: 'yellow-prompt', surface, component: 'UserMessage', props: PROMPT })
      expect(await ui.drawn()).toMatchObject({
        type: 'Box',
        props: { borderStyle: 'double', borderColor: 'magenta' },
        children: [
          { type: 'Text', props: { color: 'cyan' } },
          { type: 'Text', props: { color: 'cyan' }, children: ['my question'] },
        ],
      })
    },
  )

  test(`border style none draws no box on ${surface}`, { options: { borderStyle: 'none' } }, async $ => {
    const ui = await $.ui.mount({ plugin: 'yellow-prompt', surface, component: 'UserMessage', props: PROMPT })
    const drawn = (await ui.drawn()) as { props: Record<string, unknown> }
    expect(drawn.props.borderStyle).toBeUndefined()
    expect(drawn).toMatchObject({ children: [{ props: { color: 'yellow' } }, { props: { color: 'yellow' } }] })
  })
}

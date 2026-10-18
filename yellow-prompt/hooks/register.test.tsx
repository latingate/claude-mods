import { expect, test } from 'claude-code/testing'

test('filled text is painted yellow', async ($, on) => {
  let seen: unknown
  on('prompt.fill', ($, e) => {
    seen = e.decorations
    return { isFilled: true }
  })
  await $.prompt.fill({ text: 'hello', mode: 'replace', origin: { kind: 'plugin', name: 'test' } })
  expect(seen).toEqual([{ start: 0, end: 5, color: 'yellow' }])
})

for (const surface of ['terminal', 'desktop'] as const) {
  test(`typed prompt in the transcript is yellow on ${surface}`, async $ => {
    const ui = await $.ui.mount({
      plugin: 'yellow-prompt',
      surface,
      component: 'UserMessage',
      props: { text: 'my question', origin: { kind: 'composer' }, isExpanded: true },
    })
    expect(await ui.drawn()).toMatchObject({
      type: 'Box',
      props: { borderStyle: 'round', borderColor: 'yellow' },
      children: [
        { type: 'Text', props: { color: 'yellow' } },
        { type: 'Text', props: { color: 'yellow' }, children: ['my question'] },
      ],
    })
  })
}

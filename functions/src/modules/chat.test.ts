import { chat } from './chat'

jest.setTimeout(30000)

describe('chat function', () => {
  it('should process messages and return the final chat completion', async () => {
    const res = await chat('Hello')
    console.log(res.choices)
  })
})

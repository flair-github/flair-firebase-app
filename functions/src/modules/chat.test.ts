import { chat } from './chat'

describe('chat function', () => {
  it('should process messages and return the final chat completion', async () => {
    const res = await chat('Hello')
    console.log(res.choices)
  })
})

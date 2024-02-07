import OpenAI from 'openai'
import { OPEN_AI_API_KEY } from '../config'

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
})

export const chat = async (content: string) => {
  const stream = await openai.beta.chat.completions.stream({
    model: 'gpt-4',
    messages: [{ role: 'user', content }],
    stream: true,
  })

  stream.on('content', (delta, snapshot) => {
    process.stdout.write(delta)
  })

  // or, equivalently:
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }

  const chatCompletion = await stream.finalChatCompletion()

  return chatCompletion
}

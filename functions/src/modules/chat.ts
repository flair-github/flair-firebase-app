import OpenAI from 'openai'
import { OPEN_AI_API_KEY, PINECONE_API_KEY } from '../config'
import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
})

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
})

const index = pc.Index('faq-docs')

export const chat = async (content: string) => {
  const embeddingsRes = await openai.embeddings.create({
    input: content,
    model: 'text-embedding-3-small',
  })

  const values = embeddingsRes.data[0].embedding

  const indexQueryRes = index.query({
    vector: values,
    topK: 1,
    includeValues: true,
    includeMetadata: true,
  })

  const context = (await indexQueryRes).matches[0].metadata

  const prompt = `
  Respond to the user query given the following context:

  CONTEXT:
  question: ${context?.question}
  answer: ${context?.answer}

  QUERY:
  ${content}
`

  const stream = await openai.beta.chat.completions.stream({
    model: 'gpt-4-1106-preview',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    temperature: 0,
  })

  const chatCompletion = await stream.finalChatCompletion()

  return chatCompletion
}

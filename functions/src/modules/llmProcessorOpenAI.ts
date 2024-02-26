import { OPEN_AI_API_KEY } from '../config'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
})

export const llmProcessorOpenAI = async (table: Record<string, string>[], llmConfig: any) => {
  const copiedSource = structuredClone(table)

  const promisedResult = copiedSource.map(async tableRow => {
    try {
      const transcript = tableRow.transcript || ''

      const columnPrompts = (llmConfig.initialContents.columns as any[])
        .map((row, i) => i + 1 + '. ' + row.name + ': ' + row.prompt + '\n')
        .join('')

      const prompt = `
      You are a seasoned call center manager reviewing calls with prospects. Analyze the provided call transcript and identify the following key attributes:

      ${columnPrompts}

      Apply this prompt to the provided transcript below and provide responses in JSON format. For any fields that a list should be provided, use [] so it can be parsed with python.

      TRANSCRIPT:
      ${transcript}
      `

      const stream = openai.beta.chat.completions.stream({
        model: 'gpt-4-1106-preview',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        temperature: 0,
        response_format: { type: 'json_object' },
      })

      const chatCompletion = await stream.finalChatCompletion()

      const aiResponse = chatCompletion.choices[0].message.content || '{}'
      const aiJSON = JSON.parse(aiResponse)

      const merged = { ...tableRow }

      for (const llmColumnData of llmConfig.initialContents.columns) {
        const val = aiJSON[llmColumnData.name]

        if (typeof val === 'object') {
          merged[llmColumnData.name] = JSON.stringify(aiJSON[llmColumnData.name]) || ''
        } else {
          merged[llmColumnData.name] = aiJSON[llmColumnData.name]
        }
      }

      return merged
    } catch (e) {
      console.log(e)
      return tableRow
    }
  })

  const res = await Promise.all(promisedResult)

  return res
}

import { googleSheetsExporter } from './googleSheetsExporter'
import { llmProcessorOpenAI } from './llmProcessorOpenAI'

jest.setTimeout(60000)

describe('test', () => {
  it('test', async () => {
    const res = await googleSheetsExporter([{ test: 'hello' }])
    console.log(JSON.stringify(res, null, 2))
  })
})

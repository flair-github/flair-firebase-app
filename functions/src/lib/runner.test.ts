import { workflowRunner } from './runner'

jest.setTimeout(60000)

describe('test', () => {
  it('test', async () => {
    workflowRunner()
  })
})

import { dataSourceS3 } from './dataSourceS3'

jest.setTimeout(30000)

describe('aws loader', () => {
  it('aws loader', async () => {
    const res = await dataSourceS3()
    console.log(res)
  })
})

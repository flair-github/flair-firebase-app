import { emailSender } from './emailSender'

jest.setTimeout(60000)

describe('test', () => {
  it('test', async () => {
    emailSender()
  })
})

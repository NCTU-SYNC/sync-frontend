import { api, getBaseURL } from '@/utils/api'
import nock from 'nock'

describe('api', () => {
  it('POST: data should contains "token"', async() => {
    const header = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }

    const scope = nock(getBaseURL())
      .defaultReplyHeaders(header)
      .post('/', (body) => body.token)
      .reply(200)

    const res = await api.post('/')

    expect(res.status).toEqual(200)

    scope.done()
  })
})

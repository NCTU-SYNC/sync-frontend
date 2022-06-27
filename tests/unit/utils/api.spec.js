import { api, getBaseURL } from '@/utils/api'
import firebaseAuth from '@/utils/firebase'
import nock from 'nock'

describe('api', () => {
  it('POST: data should contains "token"', async() => {
    const getTokenMock = jest.spyOn(firebaseAuth, 'token', 'get')
    getTokenMock.mockImplementation(() => 'token')

    const header = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }

    const scope = nock(getBaseURL())
      .defaultReplyHeaders(header)
      .post('/', (body) => body.token)
      .reply(200)

    const res = await api.post('/')

    expect(getTokenMock).toBeCalled()

    expect(res.status).toEqual(200)

    scope.done()
  })
})

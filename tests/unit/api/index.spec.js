import { vi, describe, it } from 'vitest'
import nock from 'nock'

import APIBase from '@/api'
import { getBaseURL } from '../../../src/utils/api'
import firebaseAuth from '@/utils/firebase'

vi.mock('@/store')

describe('API basic spec', () => {
  const getTokenMock = jest.spyOn(firebaseAuth, 'token', 'get')
  getTokenMock.mockImplementation(() => 'token')

  it('data body should contain "token" when method is "post" or "put"', async() => {
    const header = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }

    const scope = nock(getBaseURL())
      .defaultReplyHeaders(header)
      // response preflight request
      .options('/')
      .reply(204, null, {
        'Access-Control-Allow-Methods': 'POST, PATCH'
      })
      .put('/', (body) => body.token)
      .reply(200)
      .post('/', (body) => body.token)
      .reply(200)

    const apiBase = new APIBase()

    let res = await apiBase.action('/', {}, 'post')
    expect(res.status).toBe(200)

    res = await apiBase.action('/', {}, 'put')
    expect(res.status).toBe(200)

    scope.done()
  })
})

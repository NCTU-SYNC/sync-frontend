import { api } from '@/utils/api'

describe('api', () => {
  it('api should contains baseURL', () => {
    const want = process.env.VUE_APP_BASE_URL + process.env.VUE_APP_API_URL
    expect(api.defaults.baseURL).toBe(want)
  })
})

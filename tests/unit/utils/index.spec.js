import { Utils } from '@/utils'

const isValidUrl = Utils.isValidUrl

describe('isValidUrl', () => {
  it('invalid', () => {
    const url = 'abc'
    expect(isValidUrl(url)).toBe(false)
  })

  it('valid', () => {
    const url = 'https://google.com'
    expect(isValidUrl(url)).toBe(true)
  })
})

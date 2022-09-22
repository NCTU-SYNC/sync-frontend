import { describe, it, assert } from 'vitest'
import { Utils } from '@/utils'

const isValidUrl = Utils.isValidUrl

describe('isValidUrl', () => {
  it('invalid', () => {
    const url = 'abc'
    assert.equal(isValidUrl(url), false)
  })

  it('valid', () => {
    const url = 'https://google.com'
    assert.equal(isValidUrl(url), true)
  })
})

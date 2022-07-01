jest.mock('@/store')
jest.mock('@/router', () => {
  return {
    currentRoute: {
      params: {
        q: 'test',
        tbs: 'qdr:a',
        category: 'news'
      }
    }
  }
})
jest.mock('@/api/article').resetAllMocks()
const searchAPI = jest.spyOn(articleAPI, 'search')

import { getters, mutations, actions } from '@/store/search'
import articleAPI from '@/api/article'

describe('getters', () => {
  const state = {
    q: 'keyword',
    tbs: 'qdr:a',
    category: 'news'
  }

  it.concurrent('keyword', () => {
    expect(getters.keyword(state)).toBe('keyword')
  })

  it.concurrent('timeQuery', () => {
    expect(getters.timeQuery(state)).toBe('qdr:a')
  })

  it.concurrent('category', () => {
    expect(getters.category(state)).toBe('news')
  })
})

describe('mutations', () => {
  const { SET_Q, SET_TBS, SET_CATEGORY } = mutations

  it.concurrent.each([
    { q: 'test', wanted: 'test' },
    { q: '', wanted: '' },
    { q: undefined, wanted: '' }
  ])('SET_Q: "$q"', ({ q, wanted }) => {
    const state = { q: '' }
    SET_Q(state, q)
    expect(state.q).toBe(wanted)
  })

  it.concurrent.each([
    { tbs: 'qdr:w', wanted: 'qdr:w' },
    { tbs: 'test', wanted: 'qdr:a' },
    { tbs: '', wanted: 'qdr:a' },
    { tbs: undefined, wanted: 'qdr:a' }
  ])('SET_TBS: "$tbs"', ({ tbs, wanted }) => {
    const state = { tbs: 'qdr:a' }
    SET_TBS(state, tbs)
    expect(state.tbs).toBe(wanted)
  })

  it.concurrent.each([
    { category: 'test', wanted: 'test' },
    { category: '', wanted: '' },
    { category: undefined, wanted: '' }
  ])('SET_CATEGORY: "$category"', ({ category, wanted }) => {
    const state = { category: '' }
    SET_CATEGORY(state, category)
    expect(state.category).toBe(wanted)
  })
})

describe('actions', () => {
  it('search', async() => {
    const query = {
      q: 'test',
      tbs: 'qdr:a',
      category: 'news'
    }

    const mockCommit = jest.fn()
    await actions.search({ commit: mockCommit }, query)

    expect(mockCommit).toHaveBeenCalledWith('SET_Q', 'test')
    expect(mockCommit).toHaveBeenCalledWith('SET_TBS', 'qdr:a')
    expect(mockCommit).toHaveBeenCalledWith('SET_CATEGORY', 'news')

    expect(searchAPI).toBeCalled()
  })
})

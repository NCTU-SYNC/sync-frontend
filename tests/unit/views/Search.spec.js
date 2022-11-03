import { vi, describe, it, expect } from 'vitest'
import { render, waitFor, fireEvent } from '@testing-library/vue'
import Search from '@/views/new/Search.vue'
import articleAPI from '@/api/article'
import store from '@/store'

vi.mock('@/router')
vi.mock('@/utils/firebase')

const mockRoute = {
  query: {
    q: 'test'
  }
}

const mockRouter = {
  push: jest.fn(() => new Promise())
}

describe('Time Button', () => {
  describe('init style', () => {
    it.concurrent.each([
      { btnName: '不限', queryTbs: 'qdr:a' },
      { btnName: '上個月', queryTbs: 'qdr:m' },
      { btnName: '上禮拜', queryTbs: 'qdr:w' }
    ])(
      '"$btnName" is bold when time query is "$queryTbs"',
      async({ btnName, queryTbs }) => {
        const searchAPI = jest.spyOn(articleAPI, 'search')
        searchAPI.mockImplementation(() => Promise.resolve({
          data: { type: 'success', data: [] }
        }))

        mockRoute.query.tbs = queryTbs

        const { getByText } = render(Search, {
          mocks: {
            $route: mockRoute,
            $router: mockRouter
          },
          store,
          props: {
            query: {
              q: 'test',
              tbs: queryTbs,
              category: ''
            }
          }
        })

        await waitFor(() => {
          expect(getByText(btnName)).toHaveClass('active')
        })
      })
  })

  describe('click', () => {
    it.concurrent.each([
      { btnName: '不限', queryTbs: 'qdr:a' },
      { btnName: '上個月', queryTbs: 'qdr:m' },
      { btnName: '上禮拜', queryTbs: 'qdr:w' }
    ])(
      'time query is "$queryTbs" when "$btnName" is clicked',
      async({ btnName, queryTbs }) => {
        const searchAPI = jest.spyOn(articleAPI, 'search')
        searchAPI.mockImplementation(() => Promise.resolve({
          data: { type: 'success', data: [] }
        }))

        mockRoute.query.tbs = 'qdr:d'

        const { getByText } = render(Search, {
          mocks: {
            $route: mockRoute,
            $router: mockRouter
          },
          store,
          props: {
            query: {
              q: 'test',
              tbs: queryTbs,
              category: ''
            }
          }
        })

        const btn = await waitFor(() => getByText(btnName))
        await fireEvent.click(btn)

        // btn should be active after being clicked
        expect(btn).toHaveClass('active')
      })
  })
})

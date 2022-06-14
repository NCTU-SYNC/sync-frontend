import '@testing-library/jest-dom'
import { render, getByText } from '@testing-library/vue'
import ArticleCard from '@/components/ArticleCard.vue'
import store from '@/store'

let props

beforeEach(() => {
  // set default props
  props = {
    title: 'title',
    viewsCount: 0,
    category: '未分類',
    lastUpdatedAt: '2021-04-26T00:00:00',
    editedCount: 0,
    blocks: null,
    articleId: '',
    full: false
  }
})

describe('ArticleCard.vue', () => {
  it('default value', () => {
    const { container } = render(ArticleCard, { props, store })
    const heading = container.querySelector('.heading')
    const footer = container.querySelector('.card-footer')
    const category = container.querySelector('.article-category')
    const fullCardText = container.querySelector('.article-excerpt--wide')

    expect(getByText(heading, 'title')).toBeInTheDocument()
    expect(getByText(footer, '觀看數：0 | 編輯數：0'))
    expect(getByText(footer, '2021.04.26 00:00'))
    expect(getByText(category, '未分類'))
    expect(fullCardText).not.toBeInTheDocument()

    // TODO: add test on content
  })
})

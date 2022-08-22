import _ from 'lodash'
import APIBase from '.'

class ArticleAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = '/article'
  }

  /**
   * fetch articles
   * @returns {Promise<any>}
   */
  get() {
    return this.action('/', {}, 'get')
  }

  // TODO: temporary solution
  /**
   * get recommendations
   * @param {Number} limit : limit number of articles
   * @returns {Promise<Any>}
   */
  getRecommended(limit) {
    return this.action('/', { limit }, 'get')
  }

  /**
   * fetch article by id
   * @param {string} id : article id
   * @returns {Promise<any>}
   */
  getById(id) {
    return this.action(`/${id}`, {}, 'get')
  }

  /**
   * create new article
   * @param {Any} data : article data
   * @returns {Promise<any>}
   */
  create(data) {
    return this.action('/', data, 'post')
  }

  /**
   * update article by id
   *
   * ! **IMPORTANT**: id should be passed in data
   * @param {Any} data : article data
   * @returns {Promise<any>}
   * @memberof ArticleAPI
   */
  update(data) {
    return this.action('/', data, 'put')
  }

  search(keyword, timeQuery = 'qdr:a', category = '') {
    this.prefix_path = '/'
    const query = {
      q: keyword ?? '',
      timeQuery: timeQuery ?? 'qdr:a',
      category: category ?? ''
    }

    const ret = this.action('/search', {
      ...query
    }, 'get')
    this.prefix_path = '/article'

    return ret
  }
}

export function getTimeQuery(timeRange = 'all') {
  return _.get(TIME_QUERY, timeRange.toUpperCase(), TIME_QUERY.ALL)
}

export const TIME_QUERY = Object.freeze({
  ALL: 'qdr:a',
  YEAR: 'qdr:y',
  MONTH: 'qdr:m',
  WEEK: 'qdr:w',
  DAY: 'qdr:d'
})

export default new ArticleAPI()

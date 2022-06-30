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
  getRecommended(params) {
    return this.action('/', params, 'get')
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

  search(data) {
    // TODO: implement article/search
    this.prefix_path = '/'
    const ret = this.action('/search', data, 'get')
    this.prefix_path = '/article'

    return ret
  }
}

export default new ArticleAPI()

import APIBase from '.'

class NewsAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = '/news'
  }

  /**
   * search news in db
   * @param {String} keyword : keyword to search
   * @param {Number} pageNum : page number
   * @param {String} tbs : time range
   * @param {String} mediaSource : media source
   * @returns {Promise<Any>}
   */
  search(keyword = '', pageNum = 0, tbs = 'qdr:a', mediaSource = '') {
    return this.action(
      '',
      {
        q: keyword,
        page: pageNum,
        tbs: tbs,
        media: mediaSource
      },
      'get'
    )
  }
}

export default new NewsAPI()

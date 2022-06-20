import APIBase from '.'

class HistoryAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = ''
  }

  /**
   * get versions of an article by article id
   * @param {String} articleId : article id
   * @param {Number} limit : number of query results
   * @param {Number} page : page number
   * @returns {Promise<Any>} : versions of article
   */
  getVersions(articleId, limit, page) {
    return this.action(`/history/${articleId}`, { limit, page }, 'get')
  }

  /**
   * get revisions of a block by block id
   * @param {String} blockId : block id
   * @param {Number} blockIndex : block index
   * @returns {Promise<Any>}
   */
  getBlockRevision(blockId, blockIndex) {
    return this.action(`/revision/${blockId}`, { blockIndex }, 'get')
  }

  /**
   * get comparison of two verions of an article
   * @param {String} articleId : article id
   * @param {Number} base : base version
   * @param {Number} compare : compare version
   * @returns {Promise<Any>}
   */
  getComparison(articleId, base, compare) {
    return this.action(`/compare/${articleId}`, { base, compare }, 'get')
  }
}

export default new HistoryAPI()

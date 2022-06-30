import APIBase from '.'

class UserAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = ''
  }

  login(idToken) {
    return this.action('/login', { idToken }, 'post')
  }

  /**
   * get user's profile from firebase
   * @returns {Promise<Any>}
   */
  getProfile() {
    return this.action('/profile', {}, 'post')
  }

  /**
   * get:
   *  - viewed articles
   *  - subscribed articles
   *  - edited articles
   *  - user's point
   * @returns {Promise<Any>}
   */
  getArticleInfo() {
    return this.action('/profile/article', {}, 'post')
  }

  /**
   * add article to user's viewed history
   * @param {String} articleId : article id
   * @returns {Promise<Any>}
   */
  articleViewed(articleId) {
    return this.action('/profile/view', { articleId }, 'post')
  }

  /**
   * subscribe or unsubscribe article
   * @param {String} articleId
   * @param {Boolean} subscribe : subscribe or unsubscribe
   * @returns {Promise<Any>}
   */
  subscribeArticle(articleId, subscribe) {
    return this.action('profile/subscribe', { articleId, subscribe }, 'post')
  }
}

export default new UserAPI()

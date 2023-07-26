import APIBase from '.'
import FirebaseAuthInstance from '../utils/firebase'

class UserAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = ''
  }

  login(userdata) {
    return this.action('/login', userdata, 'post')
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

  /**
    * get user's preference
    * @returns {Promise<Any>}
    */
  async getPreference() {
    const token = await FirebaseAuthInstance.token
    return this.action('/profile/preference', { token }, 'get')
  }

  /**
   * update user's preference
   * @param {Partial<{editedNotification: Boolean, isAnonymous: Boolean, subscribedNotification: Boolean}>} preference : user's preference
   * @returns {Promise<Any>}
   */
  updatePreference(preferences) {
    return this.action('/profile/preference', { payload: { preferences }}, 'put')
  }
}

export default new UserAPI()

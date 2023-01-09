import APIBase from '.'

class HashtagAPI extends APIBase {
  constructor() {
    super()
    this.prefix_path = '/hashtag'
  }

  // TODO: mock data
  /**
   * fetch recommended hashtags
   * @param {Number} limit : limit number of hashtags
   * @returns {Promise<string[]>}
   */
  getRecommendHashtags(limit = null) {
    const mock_data = [
      '九合一大選', '強尼戴普', '加密貨幣', 'COVID-19', '墮胎自主權',
      '防疫政策', '烏俄戰爭', '加密貨幣', '普丁', '快篩試劑',
      '兒童疫苗', '金曲獎33', '猴痘', '確診'
    ]
    limit = limit || mock_data.length
    return new Promise((resolve, reject) => {
      resolve(mock_data.slice(0, limit))
    })
  }
}

export default new HashtagAPI()

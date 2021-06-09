function getRandomString() {
  return Math.random().toString(36).substring(7)
}

// returns text from article with a given limit, returns all if no limit given
function getArticleContent(blocks, limit) {
  var res = { content: [], count: 0 }
  getArticleText(blocks, res, limit)
  const text = res.content.join(' ')
  const ellipse = (text.length > limit) ? ' ...' : ''
  return text.slice(0, limit) + ellipse
}

// helper function of getArticleContent
function getArticleText(object, result, limit) {
  if (Object.prototype.hasOwnProperty.call(object, 'type') && object.type === 'text') {
    result.content.push(object.text)
    result.count += object.text.length
    if (limit !== undefined && result.count > limit) {
      return
    }
  }
  for (var i = 0; i < Object.keys(object).length; i++) {
    if (typeof object[Object.keys(object)[i]] === 'object') {
      getArticleText(object[Object.keys(object)[i]], result, limit)
      if (limit !== undefined && result.count > limit) {
        return
      }
    }
  }
}

class Utils {
  static getRandomString = getRandomString
  static getArticleContent = getArticleContent
}

export { Utils }

import './moment'

function getRandomString() {
  return Math.random().toString(36).substring(7)
}

// returns text from article with a given limit, returns all if no limit given
function getArticleContent(blocks, limit) {
  const res = { content: [], count: 0 }
  getArticleText(blocks, res, limit)
  const text = res.content.join(' ')
  const ellipse = (text.length > limit) ? ' ...' : ''
  return text.slice(0, limit) + ellipse
}

// helper function of getArticleContent
function getArticleText(object, result, limit) {
  if (object == null) return
  if (Object.prototype.hasOwnProperty.call(object, 'type') && object.type === 'text') {
    result.content.push(object.text)
    result.count += object.text.length
    if (limit !== undefined && result.count > limit) {
      return
    }
  }
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'object') {
      getArticleText(object[key], result, limit)
      if (limit !== undefined && result.count > limit) {
        return
      }
    }
  }
}

// returns first image in aricle, if no images exist, return null
function getArticleFirstImage(blocks) {
  const res = { imgLinks: [] }
  getArticleImages(blocks, res, 1)
  return res.imgLinks.length === 0 ? null : res.imgLinks[0]
}

// returns first "limit" numbers of image from article
function getArticleImages(blocks, result, limit = 10) {
  if (blocks == null) return
  if (Object.prototype.hasOwnProperty.call(blocks, 'type') && blocks.type === 'image') {
    result.imgLinks.push(blocks.attrs.src)
    if (result.imgLinks.length >= limit) {
      return
    }
  }
  for (const key of Object.keys(blocks)) {
    if (typeof blocks[key] === 'object') {
      getArticleImages(blocks[key], result, limit)
      if (result.imgLinks.length >= limit) {
        return
      }
    }
  }
}

function getArticleBlockTitles(blocks, limits = 0) {
  const titles = blocks.flatMap((block) => block.blockTitle)

  if (limits !== 0) return titles.slice(0, limits)

  return titles
}

// url validation
function isValidUrl(url) {
  try {
    new URL(url)
  } catch (e) {
    return false
  }
  return true
}

class Utils {
  static getRandomString = getRandomString
  static getArticleContent = getArticleContent
  static getArticleFirstImage = getArticleFirstImage
  static isValidUrl = isValidUrl
  static getArticleBlockTitles = getArticleBlockTitles
}

export { Utils }

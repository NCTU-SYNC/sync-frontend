import _ from 'lodash'
import { axios, api } from '@/utils/api'

function pathJoin(parts, sep) {
  const seperator = sep || '/'
  const replace = new RegExp(seperator + '{1,}', 'g')
  return parts.join(seperator).replace(replace, seperator)
}

class APIBase {
  constructor() {
    this.prefix_path = '/'
    this.path = ''
    this.defaultMethod = 'get'
    this.param = {}
  }

  getPath(path) {
    path = path || this.path
    return pathJoin([this.baseURL, this.prefix_path, path], '/')
  }

  action(path = null, data = {}, method = null) {
    method = method || this.defaultMethod

    const url = this.getPath(path)
    const config = {}

    switch (method.toLowerCase()) {
      case 'post':
        return api.post(url, data, config)
      case 'get':
        // if no param specified
        if (_.isPlainObject(data) && JSON.stringify(data) == '{}') {
          return api.get(url)
        } else return api.get(url, { params: data })
      case 'delete':
        return api.delete(url, { params: data })
      case 'put':
      case 'patch':
        return api.patch(url, data)
      default:
        console.log('unknown method')
        return api({ url, method, data })
    }
  }
}

export default APIBase

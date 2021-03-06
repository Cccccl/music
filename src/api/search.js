import jsonp from 'common/js/jsonp'
// import {commonParams, options} from './config'
import {options} from './config'
import axios from 'axios'

export function getHotKey (musicId) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, {
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) {
  const url = '/api/search'
  const data = Object.assign({}, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
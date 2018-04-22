import {commonParams} from './config'
import axios from 'axios'

export const getLyric = (mid) => {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    pcachetime: +new Date(),
    playform: 'yqq',
    notice: 0,
    uin: 0,
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    format: 'jsonp',
    callback: 'MusicJsonCallback___lrc'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getMusic(mid) {
  const url = '/api/music'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 9605722104,
    platform: 'yqq',
    loginUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    uin: 0,
    cid: 205361747,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
/* jshint esversion: 6 */
export default class Singer {
  constructor ({id, name, mid}) {
    this.id = id
    this.name = name
    this.mid = mid
    this.avatar = 'http://y.gtimg.cn/music/photo_new/T001R300x300M000' + mid + '.jpg?max_age=2592000'
  }
}
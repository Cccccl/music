const express = require('express')
const config = require('./config/index')
const axios = require('axios')
const app = express()
const apiRoutes = express.Router()

apiRoutes.get('/getDiscList',function(req,res){
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url,{
    headers:{
    referer: 'https://y.qq.com/portal/playlist.html',
    host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})
apiRoutes.get('/getLyric',function(req,res){
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers:{
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    var ret = response.data
    if(typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if(matches){
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e)=>{
    console.log(e)
  })
})
app.use('/api',apiRoutes)
app.use(express.static('./dist'))

const port = process.env.PORT || config.build.port
module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:'+port+'\n')
})

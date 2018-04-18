/*
 * 启动脚本 
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(`Example app listening at: ${port}`);
});
/*
 * 启动脚本 
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const hostname = '192.168.31.239';
const port = 3000;
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
var server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
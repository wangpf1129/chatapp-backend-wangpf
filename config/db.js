// 配置数据库连接
const mongoose = require('mongoose')

// 连接数据库的地址
const db = mongoose.createConnection('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
})
// 连接失败情况
db.on('error', console.error.bind(console, '数据库连接失败'))
// 连接成功情况
db.once('open', function () {
  console.info('Wang-pf的数据库连接成功')
})


// 把数据库暴露出去
module.exports = db
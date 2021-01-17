// 聊天

const dbServer = require('../dao/dbserver')

// 获取一对一消息数据
exports.getPageMessage = function (req, res) {
  let data = req.body
  dbServer.getPageMessage(data, res)
}
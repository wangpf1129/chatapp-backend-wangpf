// 群

const dbServer = require('../dao/dbserver')

// 创建群
exports.createGroup = function (req, res) {
  let data = req.body
  dbServer.createGroup(data, res)
}

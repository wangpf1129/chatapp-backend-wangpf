// 用户详情
const dbServer = require('../dao/dbserver')

// 详情
exports.userDetail = function (req, res) {
  let id = req.body.id
  dbServer.userDetail(id, res)
}


// 用户信息修改
exports.userUpdate = function (req, res) {
  let data = req.body
  dbServer.userUpdate(data, res)
}

// 获取好友昵称
exports.getFriendMarkName = function (req, res) {
  let data = req.body
  dbServer.getFriendMarkName(data, res)
}

// 修改好友昵称
exports.modifyFriendMarkName = function (req, res) {
  let data = req.body
  dbServer.modifyFriendMarkName(data, res)
}
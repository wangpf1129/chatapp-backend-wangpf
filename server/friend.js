// 好友

const dbServer = require('../dao/dbserver')

// 好友申请
exports.applyFriend = function (req, res) {
  let data = req.body
  dbServer.applyFriend(data, res)
}

// 好友状态更新
exports.updateFriendState = function (req, res) {
  let data = req.body
  dbServer.updateFriendState(data, res)
}

// 拒接好友 或者 删除好友
exports.deleteFriend = function (req, res) {
  let data = req.body
  dbServer.deleteFriend(data, res)
}
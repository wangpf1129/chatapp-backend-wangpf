// 搜索用户/群 功能

const dbServer = require('../dao/dbserver')

// 用户搜索
exports.searchUser = function (req, res) {
  let data = req.body.data
  dbServer.searchUser(data, res)
}

// 判断是否为好友
exports.isFriend = function (req, res) {
  let {uID, fID} = req.body
  dbServer.isFriend(uID, fID, res)
}

// 搜索群
exports.searchGroup = function (req, res) {
  let {data} = req.body
  dbServer.searchGroup(data, res)
}

// 判断是否在群内
exports.inGroup = function (req, res) {
  let {uID, gID} = req.body
  dbServer.inGroup(uID, gID, res)
}
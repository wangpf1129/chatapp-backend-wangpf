// index主页  数据获取
const dbServer = require('../dao/dbserver')

// 获取好友列表
exports.getFriendList = function (req, res) {
  let data = req.body
  if(data.state === 0){
    dbServer.getFriendList(data, res)
  }else if(data.state === 1){
    dbServer.getFriendList1(data, res)
  }
}


// 获取和好友的最后一条消息
exports.getLastMessage = function (req, res) {
  let data = req.body
  dbServer.getOneMessage(data, res)
}

// 获取好友未读消息数
exports.unReadMessage = function (req,res) {
  let data = req.body
  dbServer.unReadMessage(data, res)
}

// 好友消息标记已读
exports.updateMessage =function (req,res) {
  let data = req.body
  dbServer.updateMessage(data, res)
}



// 获取群列表
exports.getGroupList = function (req, res) {
  let data = req.body
  dbServer.getGroupList(data, res)
}

// 获取和群的的最后一条消息
exports.getLastGroupMessage = function (req, res) {
  let data = req.body
  dbServer.getOneGroupMessage(data, res)
}


// 群消息标记已读
exports.updateGroupMessage =function (req,res) {
  let data = req.body
  dbServer.updateGroupMessage(data, res)
}
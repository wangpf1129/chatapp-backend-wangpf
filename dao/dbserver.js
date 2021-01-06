// 引入加密文件
const bcrypt = require('./bcrypt')
// 引入token
const jwt = require('../dao/jwt')
// 处理数据
const dbModel = require('../model/dbmodel')
const User = dbModel.model('User')
const Friend = dbModel.model('Friend')
const Group = dbModel.model('Group')
const GroupUser = dbModel.model('GroupUser')
const Message = dbModel.model('Message')
// 新建用户
exports.buildUser = function (name, email, pwd, res) {
  // 密码加密
  let password = bcrypt.encryption(pwd)

  // 用户信息存起来
  let data = {
    userName: name,
    password: password,
    email: email,
    registerDate: new Date()
  }

  let user = new User(data)
  user.save()
    .then(function () {
      res.send({status: 200})
    })
    .catch(function () {
      res.send({status: 500})
    })
  // user.save((err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200})
  //   }
  // })
}

// 匹配用户元素个数
exports.countUserValue = function (data, type, res) {
  // 输入的什么
  let whereStr = {}
  // whereStr = {  'type' : data }
  whereStr[type] = data
  // // mongodb API  匹配用户
  User.countDocuments(whereStr)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      res.send({status: 200, result})
    })
  // User.countDocuments(whereStr, (err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200, result})
  //   }
  // })
}

// 用户验证
exports.userMatch = function (data, pwd, res) {
  // 输出的什么。 有肯定是 name，有可能是邮箱
  let whereStr = {$or: [{'userName': data}, {'email': data}]}
  // 输出的什么。  要和数据库的表一致 需要输出 用户名、头像、密码
  let out = {'userName': 1, 'imgUrl': 1, 'password': 1}

  //  mongodb find 方法
  User.find(whereStr, out)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      if (result.length === 0) {  // 判断 result 是否 为空
        res.send({status: 400})
      }
      result.map((e) => {
        // 密码匹配
        // pwd 用户输入的密码     e.password 数据库中存放的密码（用bcrypt解密）    俩个密码与之匹配
        const pwdMatch = bcrypt.verification(pwd, e.password)
        if (pwdMatch) {
          let token = jwt.generateToken(e._id)
          // 返回的东西
          let back = {
            id: e._id,
            userName: e.userName,
            imgUrl: e.imgUrl,
            token: token
          }
          res.send({status: 200, back})
        } else {
          res.send({status: 400})
        }
      })
    })

  // User.find(whereStr, out, (err, result) => {
  //   // console.log(result)
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     if (result.length === 0) {  // 判断 result 是否 为空
  //       res.send({status: 400})
  //     }
  //     result.map((e) => {
  //       // 密码匹配
  //       // pwd 用户输入的密码     e.password 数据库中存放的密码（用bcrypt解密）    俩个密码与之匹配
  //       const pwdMatch = bcrypt.verification(pwd, e.password)
  //       if (pwdMatch) {
  //         let token = jwt.generateToken(e._id)
  //         // 返回的东西
  //         let back = {
  //           id: e._id,
  //           userName: e.userName,
  //           imgUrl: e.imgUrl,
  //           token: token
  //         }
  //         res.send({status: 200, back})
  //       } else {
  //         res.send({status: 400})
  //       }
  //     })
  //   }
  // })
}

// 搜索用户
exports.searchUser = function (data, res) {
  // 彩蛋： 当我搜索 wpf 时 就显示所有的用户
  let whereStr
  if (data === 'wpf') {
    whereStr = {}
  } else {
    // $regex : mongodb的正则 模糊查找
    whereStr = {$or: [{'userName': {$regex: data}}, {'email': {$regex: data}}]}
  }

  let out = {'userName': 1, 'email': 1, 'imgUrl': 1}

  //  whereStr 要和 out 匹配上才能显示出
  User.find(whereStr, out)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      res.send({status: 200, result})
    })
  // User.find(whereStr, out, (err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200, result})
  //   }
  // })
}

// 判断是否为好友
exports.isFriend = function (uID, fID, res) {
  let whereStr = {'userID': uID, 'friendID': fID, 'state': 0}

  Friend.findOne(whereStr)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      if (result) {
        // 则是好友
        res.send({status: 200})
      } else {
        // 则不是好友
        res.send({status: 400})
      }
    })
  // Friend.findOne(whereStr, function (err, result) {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     if (result) {
  //       // 则是好友
  //       res.send({status: 200})
  //     } else {
  //       // 则不是好友
  //       res.send({status: 400})
  //     }
  //   }
  // })
}

// 搜索群
exports.searchGroup = function (data, res) {
// 彩蛋： 当我搜索 wpf 时 就显示所有的群
  let whereStr
  if (data === 'wpf') {
    whereStr = {}
  } else {
    // $regex : mongodb的正则 模糊查找
    whereStr = {'groupName': {$regex: data}}
  }
  let out = {'groupName': 1, 'imgUrl': 1}

  //  whereStr 要和 out 匹配上才能显示出
  Group.find(whereStr, out)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      res.send({status: 200, result})
    })
  // Group.find(whereStr, out, (err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200, result})
  //   }
  // })
}


// 判断是否在群内
exports.inGroup = function (uID, gID, res) {
  let whereStr = {'userID': uID, 'groupID': gID}
  GroupUser.findOne(whereStr)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      if (result) {
        // 则在群内
        res.send({status: 200})
      } else {
        // 则不在群内
        res.send({status: 400})
      }
    })
  // GroupUser.findOne(whereStr, function (err, result) {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     if (result) {
  //       // 则在群内
  //       res.send({status: 200})
  //     } else {
  //       // 则不在群内
  //       res.send({status: 400})
  //     }
  //   }
  // })
}

// 用户详情页
exports.userDetail = function (id, res) {
  let whereStr = {'_id': id}
  let out = {'password': 0}
  User.findOne(whereStr, out)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      res.send({status: 200, result})
    })
  // User.findOne(whereStr, out, (err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200, result})
  //   }
  // })
}

// 用户信息修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update)
    .catch(function () {
      // 修改失败
      res.send({status: 500})
    })
    .then(function () {
      // 修改成功
      res.send({status: 200})
    })
}

function match(updateStr, data, res) {
  User.countDocuments(updateStr)
    .catch(function () {
      res.send({status: 500})
    })
    .then(function (result) {
      // 如果没有匹配项， 可以修改
      if (result === 0) {
        update(data.id, updateStr, res)
      } else {
        // 修改的邮箱已存在
        res.send({status: 300})
      }
    })
}

exports.userUpdate = function (data, res) {
  // data 传给前端的数据对象
  let updateStr = {}

  // 判断是否有密码
  if (typeof (data.password) !== 'undefined') {
    // 有密码进行匹配
    User.find({'_id': data.id}, {'password': 1})
      .catch(function () {
        res.send({status: 500})
      })
      .then(function (result) {
        result.map((e) => {
          // 密码匹配
          // password 用户输入的密码     e.password 数据库中存放的密码（用bcrypt解密）    俩个密码与之匹配
          const pwdMatch = bcrypt.verification(data.password, e.password)
          if (pwdMatch) {
            // 密码验证成功
            // 如果为修改密码 需要先加密
            if (data.type === 'password') {
              // 密码加密
              updateStr[data.type] = bcrypt.encryption(data.data)
              update(data.id, updateStr, res)
            } else {
              // 修改邮箱需要密码
              // 先进行邮箱匹配
              updateStr[data.type] = data.data
              match(updateStr, data, res)
            }

          } else {
            // 密码匹配失败
            res.send({status: 400})
          }
        })
      })
  } else if (data.type === 'userName') {
    // 如果是用户名先进行匹配
    updateStr[data.type] = data.data
    match(updateStr, data, res)
  } else {
    // 一般项修改 （不需要密码的）
    updateStr[data.type] = data.data
    update(data.id, updateStr, res)

  }
}

// 获取好友昵称
exports.getFriendMarkName = function (data, res) {
  let whereStr = {'userID': data.uID, 'friendID': data.fID}
  let out = {'markName': 1}
  Friend.findOne(whereStr, out)
    .catch(function () {
      // 获取失败
      res.send({status: 500})
    })
    .then(function () {
      // 获取成功
      res.send({status: 200})
    })
}

// 修改好友昵称
exports.modifyFriendMarkName = function (data, res) {
  let whereStr = {'userID': data.uID, 'friendID': data.fID}
  let updateStr = {'markName': data.name}
  Friend.updateOne(whereStr, updateStr)
    .catch(function () {
      // 修改失败
      res.send({status: 500})
    })
    .then(function () {
      // 修改成功
      res.send({status: 200})
    })
}


// 用户操作
// 添加好友表
exports.buildFriend = function (uID, fID, state) {
  // 把好友信息存起来
  let data = {
    userID: uID,
    friendID: fID,
    state: state,
    createDate: new Date(),
    lastTime: new Date(),
  }
  let friend = new Friend(data)
  friend.save()
    .catch(function () {
      console.log('添加好友表失败')
    })
}

// 好友最后通讯时间
exports.friendLastTime = function (data) {
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'friendID': data.uID, 'userID': data.fID}]}
  let updateStr = {'lastTime': new Date()}
  Friend.updateMany(whereStr, updateStr)
    .catch(function () {
      console.log('好友最后通讯时间生成失败')
    })
}

// 添加一对一消息
exports.insertMessage = function (uID, fID, msg, type, res) {
  let data = {
    userID: uID,
    friendID: fID,
    message: msg,
    messageTypes: type,
    sendTime: new Date(),
    state: 1
  }
  let message = new Message(data)
  message.save()
    .then(function () {
      res.send({status: 200})
    })
    .catch(function () {
      res.send({status: 500})
    })
}


// 好友申请
exports.applyFriend = function (data, res) {
  //  判断是否以及申请过
  let whereStr = {'userID': data.uID, 'friendID': data.fID}
  Friend.countDocuments(whereStr)
    .catch(function () {
      res.send({status: 500})
    })
    .then((result) => {
      // 如果result 为 0 ， 则为初次申请
      if (result === 0) {
        this.buildFriend(data.uID, data.fID, 2)
        this.buildFriend(data.fID, data.uID, 1)
      } else {
        // 已经申请过好友
        this.friendLastTime(data)
      }
      //添加消息
      this.insertMessage(data.uID, data.fID, data.msg, 0, res)
    })
}


//  更新好友状态
exports.updateFriendState = function (data, res) {
  // 修改项
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'friendID': data.uID, 'userID': data.fID}]}
  Friend.updateMany(whereStr, {'state': 0})
    .then(function () {
      res.send({status: 200})
    })
    .catch(function () {
      res.send({status: 500})
    })
}

// 拒接好友 或者 删除好友
exports.deleteFriend = function (data, res) {
  // 修改项
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'friendID': data.uID, 'userID': data.fID}]}
  Friend.deleteMany(whereStr)
    .then(function () {
      res.send({status: 200})
    })
    .catch(function () {
      res.send({status: 500})
    })
}
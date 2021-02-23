// 引入加密文件
const bcrypt = require('./bcrypt');
// 引入token
const jwt = require('../dao/jwt');
// 处理数据
const dbModel = require('../model/dbmodel');
const User = dbModel.model('User');
const Friend = dbModel.model('Friend');
const Group = dbModel.model('Group');
const GroupUser = dbModel.model('GroupUser');
const Message = dbModel.model('Message');
const GroupMessage = dbModel.model('GroupMessage');
// 新建用户
exports.buildUser = function (name, email, pwd, res) {
  // 密码加密
  let password = bcrypt.encryption(pwd);

  // 用户信息存起来
  let data = {
    userName: name,
    password: password,
    email: email,
    registerDate: new Date()
  };

  let user = new User(data);
  user.save()
    .then(function () {
      res.send({status: 200});
    })
    .catch(function () {
      res.send({status: 500});
    });

};

// 匹配用户元素个数
exports.countUserValue = function (data, type, res) {
  // 输入的什么
  let whereStr = {};
  // whereStr = {  'type' : public }
  whereStr[type] = data;
  // // mongodb API  匹配用户
  User.countDocuments(whereStr)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      res.send({status: 200, result});
    });

};

// 用户验证
exports.userMatch = function (data, pwd, res) {
  // 输出的什么。 有肯定是 name，有可能是邮箱
  let whereStr = {$or: [{'userName': data}, {'email': data}]};
  // 输出的什么。  要和数据库的表一致 需要输出 用户名、头像、密码
  let out = {'userName': 1, 'imgUrl': 1, 'password': 1};
  //  mongodb find 方法
  User.find(whereStr, out)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      if (result.length === 0) {  // 判断 result 是否 为空
        res.send({status: 400});
      }
      result.map((e) => {
        // 密码匹配
        // pwd 用户输入的密码     e.password 数据库中存放的密码（用bcrypt解密）    俩个密码与之匹配
        const pwdMatch = bcrypt.verification(pwd, e.password);
        if (pwdMatch) {
          let token = jwt.generateToken(e._id);
          // 返回的东西
          let back = {
            id: e._id,
            userName: e.userName,
            imgUrl: e.imgUrl,
            token: token
          };
          res.send({status: 200, back});
        } else {
          res.send({status: 400});
        }
      });
    });

};

// 搜索用户
exports.searchUser = function (data, res) {
  // 彩蛋： 当我搜索 wpf 时 就显示所有的用户
  let whereStr;
  if (data === 'wpf') {
    whereStr = {};
  } else {
    // $regex : mongodb的正则 模糊查找
    whereStr = {$or: [{'userName': {$regex: data}}, {'email': {$regex: data}}]};
  }

  let out = {'userName': 1, 'email': 1, 'imgUrl': 1};

  //  whereStr 要和 out 匹配上才能显示出
  User.find(whereStr, out)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      res.send({status: 200, result});
    });
  // User.find(whereStr, out, (err, result) => {
  //   if (err) {
  //     res.send({status: 500})
  //   } else {
  //     res.send({status: 200, result})
  //   }
  // })
};

// 判断是否为好友
exports.isFriend = function (uID, fID, res) {
  let whereStr = {'userID': uID, 'friendID': fID, 'state': 0};

  Friend.findOne(whereStr)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      if (result) {
        // 则是好友
        res.send({status: 200});
      } else {
        // 则不是好友
        res.send({status: 400});
      }
    });
};

// 搜索群
exports.searchGroup = function (data, res) {
  // 彩蛋： 当我搜索 wpf 时 就显示所有的群
  let whereStr;
  if (data === 'wpf') {
    whereStr = {};
  } else {
    // $regex : mongodb的正则 模糊查找
    whereStr = {'groupName': {$regex: data}};
  }
  let out = {'groupName': 1, 'imgUrl': 1};

  //  whereStr 要和 out 匹配上才能显示出
  Group.find(whereStr, out)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      res.send({status: 200, result});
    });

};


// 判断是否在群内
exports.inGroup = function (uID, gID, res) {
  let whereStr = {'userID': uID, 'groupID': gID};
  GroupUser.findOne(whereStr)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      if (result) {
        // 则在群内
        res.send({status: 200});
      } else {
        // 则不在群内
        res.send({status: 400});
      }
    });
};

// 用户详情页
exports.userDetail = function (id, res) {
  let whereStr = {'_id': id};
  let out = {'password': 0};
  User.findOne(whereStr, out)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      res.send({status: 200, result});
    });
};

// 用户信息修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update)
    .catch(function () {
      // 修改失败
      res.send({status: 500});
    })
    .then(function () {
      // 修改成功
      res.send({status: 200});
    });
}

function match(updateStr, data, res) {
  User.countDocuments(updateStr)
    .catch(function () {
      res.send({status: 500});
    })
    .then(function (result) {
      // 如果没有匹配项， 可以修改
      if (result === 0) {
        update(data.id, updateStr, res);
      } else {
        // 修改的邮箱已存在
        res.send({status: 600});
      }
    });
}

exports.userUpdate = function (data, res) {
  // public 传给前端的数据对象
  let updateStr = {};

  // 判断是否有密码
  if (typeof (data.password) !== 'undefined') {
    // 有密码进行匹配
    User.find({'_id': data.id}, {'password': 1})
      .catch(function () {
        res.send({status: 500});
      })
      .then(function (result) {
        result.map((e) => {
          // 密码匹配
          // password 用户输入的密码     e.password 数据库中存放的密码（用bcrypt解密）    俩个密码与之匹配
          const pwdMatch = bcrypt.verification(data.password, e.password);
          if (pwdMatch) {
            // 密码验证成功
            // 如果为修改密码 需要先加密
            if (data.type === 'password') {
              // 密码加密
              updateStr[data.type] = bcrypt.encryption(data.data);
              update(data.id, updateStr, res);
            } else {
              // 修改邮箱需要密码
              // 先进行邮箱匹配
              updateStr[data.type] = data.data;
              match(updateStr, data, res);
            }

          } else {
            // 密码匹配失败
            res.send({status: 400});
          }
        });
      });
  } else if (data.type === 'userName') {
    // 如果是用户名先进行匹配
    updateStr[data.type] = data.data;
    match(updateStr, data, res);
  } else {
    // 一般项修改 （不需要密码的）
    updateStr[data.type] = data.data;
    update(data.id, updateStr, res);

  }
};

// 获取好友昵称
exports.getFriendMarkName = function (data, res) {
  let whereStr = {'userID': data.uID, 'friendID': data.fID};
  let out = {'markName': 1};
  Friend.findOne(whereStr, out)
    .catch(function () {
      // 获取失败
      res.send({status: 500});
    })
    .then(function (result) {
      // 获取成功
      res.send({status: 200, result});
    });
};

// 修改好友昵称
exports.modifyFriendMarkName = function (data, res) {
  let whereStr = {'userID': data.uID, 'friendID': data.fID};
  let updateStr = {'markName': data.name};
  Friend.updateOne(whereStr, updateStr)
    .catch(function () {
      // 修改失败
      res.send({status: 500});
    })
    .then(function () {
      // 修改成功
      res.send({status: 200});
    });
};


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
  };
  let friend = new Friend(data);
  friend.save()
    .catch(function () {
      console.log('添加好友表失败');
    });
};

// 好友最后通讯时间
exports.friendLastTime = function (data) {
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'friendID': data.uID, 'userID': data.fID}]};
  let updateStr = {'lastTime': new Date()};
  Friend.updateMany(whereStr, updateStr)
    .catch(function () {
      console.log('好友最后通讯时间生成失败');
    });
};

// 添加一对一消息
exports.insertMessage = function (uID, fID, msg, type, res) {
  let data = {
    userID: uID,
    friendID: fID,
    message: msg,
    messageTypes: type,
    sendTime: new Date(),
    state: 1
  };
  let message = new Message(data);
  message.save()
    .then(function () {
      if (res) {
        res.send({status: 200});
      }
    })
    .catch(function () {
      if (res) {
        res.send({status: 500});
      }
    });
};


// 好友申请
exports.applyFriend = function (data, res) {
  //  判断是否以及申请过
  let whereStr = {'userID': data.uID, 'friendID': data.fID};
  Friend.countDocuments(whereStr)
    .catch(function () {
      res.send({status: 500});
    })
    .then((result) => {
      // 如果result 为 0 ， 则为初次申请
      if (result === 0) {
        this.buildFriend(data.uID, data.fID, 2);
        this.buildFriend(data.fID, data.uID, 1);
      } else {
        // 已经申请过好友
        this.friendLastTime(data);
      }
      //添加消息
      this.insertMessage(data.uID, data.fID, data.msg, 0, res);
    });
};


//  更新好友状态
exports.updateFriendState = function (data, res) {
  // 修改项
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'userID': data.fID, 'friendID': data.uID}]};
  Friend.updateMany(whereStr, {'state': 0})
    .then(function () {
      res.send({status: 200});
    })
    .catch(function () {
      res.send({status: 500});
    });
};

// 拒接好友 或者 删除好友
exports.deleteFriend = function (data, res) {
  // 修改项
  let whereStr = {$or: [{'userID': data.uID, 'friendID': data.fID}, {'userID': data.fID, 'friendID': data.uID}]};
  Friend.deleteMany(whereStr)
    .then(function () {
      res.send({status: 200});
    })
    .catch(function () {
      res.send({status: 500});
    });
};


// 按要求获取好友列表
exports.getFriendList1 = function (data, res) {
  let query = Friend.find({});
  // 查询条件
  query.where({'userID': data.uID, 'state': data.state});
  // 查找 friendID 关联的 user对象
  query.populate('friendID');
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'lastTime': -1});
  // 查询结果
  query.exec()
    .then(function (e) {
      let result = e.map(item => {
        return {
          // friendID的数据 是从用户表里取出来
          // item 就是好友表中的数据
          id: item.friendID._id,     // 好友的iD   （ 指 用户表中的 id）
          name: item.friendID.userName,   // 好友名 （指 用户表中的 userName）
          markName: item.markName,       //  好友的昵称   （指 好友表中的 markName）
          imgUrl: item.friendID.imgUrl,    // （ 指 用户表中的 头像）
          lastTime: item.lastTime,   // 最后通讯事件 （指 好友表中的 lastTime）
          type: 0
        };
      });
      res.send({status: 200, result});
    })
    .catch(() => {
      res.send({status: 500});
    });
};

exports.getFriendList = function (data, res) {
  asyncGetFriendList(data, res);
};


function getFriendsList(data) {
  return new Promise(function (resolve, reject) {
    let query = Friend.find({});
    // 查询条件
    query.where({'userID': data.uID, 'state': data.state});
    // 查找 friendID 关联的 user对象
    query.populate('friendID');
    //  排序方式： 以最后通讯时间 从前往后排
    query.sort({'lastTime': -1});
    // 查询结果
    query.exec()
      .then(function (e) {
        let result = e.map(item => {
          return {
            // friendID的数据 是从用户表里取出来
            // item 就是好友表中的数据
            id: item.friendID._id,     // 好友的iD   （ 指 用户表中的 id）
            name: item.friendID.userName,   // 好友名 （指 用户表中的 userName）
            markName: item.markName,       //  好友的昵称   （指 好友表中的 markName）
            imgUrl: item.friendID.imgUrl,    // （ 指 用户表中的 头像）
            lastTime: item.lastTime,   // 最后通讯事件 （指 好友表中的 lastTime）
            type: 0
          };
        });
        resolve(result);
      })
      .catch(() => {
        reject({status: 500});
      });
  });
}

// 按要求获取一条一对一消息
exports.getOneMessage = function (data, res) {
  let query = Message.findOne({});
  // 查询条件
  query.where({$or: [{'userID': data.uID, 'friendID': data.fID}, {'userID': data.fID, 'friendID': data.uID}]});
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'sendTime': -1});
  // 查询结果
  query.exec().then(function (item) {
    let result = {
      message: item.message,
      sendTime: item.sendTime,
      messageTypes: item.messageTypes
    };
    res.send({status: 200, result});
  }).catch(() => {
    res.send({status: 500});
  });
};

function getOneMessages(uID, fID) {
  return new Promise(function (resolve, reject) {
    let query = Message.findOne({});
    // 查询条件
    query.where({$or: [{'userID': uID, 'friendID': fID}, {'userID': fID, 'friendID': uID}]});
    //  排序方式： 以最后通讯时间 从前往后排
    query.sort({'sendTime': -1});
    // 查询结果
    query.exec()
      .then(function (item) {
        let result = {
          message: item.message,
          sendTime: item.sendTime,
          messageTypes: item.messageTypes
        };
        resolve(result);
      })
      .catch(() => {
        reject({status: 500});
      });
  });
}

//  汇总一对一消息未读数
exports.unReadMessage = function (data, res) {
  // 汇总条件
  let whereStr = {'userID': data.fID, 'friendID': data.uID, 'state': 1};
  Message.countDocuments(whereStr)
    .catch(() => {
      res.send({status: 500});
    })
    .then((result) => {
      res.send({status: 200, result});
    });
};

function unReadMessages(uID, fID) {
  return new Promise(function (resolve, reject) {
    // 汇总条件
    let whereStr = {'userID': fID, 'friendID': uID, 'state': 1};
    Message.countDocuments(whereStr)
      .catch(() => {
        reject({status: 500});
      })
      .then((result) => {
        resolve(result);
      });
  });
}

//async/await 联合查找好友及最后一条消息和未读消息数
async function asyncGetFriendList(data, res) {
  let result, lastMessage, unRead, err
  ;[err, result] = await getFriendsList(data).then(data => [null, data]).catch(err => [err, null]);

  for (let i = 0; i < result.length; i++) {
    ;[err, lastMessage] = await getOneMessages(data.uID, result[i].id).then(data => [null, data]).catch(err => [err, null]);
    let messageTypesMap = {
      1: '[图片]',
      2: '[语音]',
      3: '[位置]'
    };
    if (lastMessage === null) {return; }
    if (lastMessage.messageTypes === '0') {
      // 文字
    } else {
      lastMessage.message = messageTypesMap[lastMessage.messageTypes];
    }
    result[i].message = lastMessage.message
    ;[err, unRead] = await unReadMessages(data.uID, result[i].id).then(data => [null, data]).catch(err => [err, null]);
    result[i].tips = unRead;
  }
  if (err) {
    res.send(err);
  } else {
    res.send({status: 200, result});
  }
}

//async/await 联合查找群及最后一条消息和未读消息数
async function asyncGetGroupList(data, res) {
  let result, lastMessage, unRead, err
  ;[err, result] = await getGroupsList(data).then(data => [null, data]).catch(err => [err, null]);
  for (let i = 0; i < result.length; i++) {
    ;[err, lastMessage] = await getGroupMessages(data.uID, result[i].id).then(data => [null, data]).catch(err => [err, null]);
    let messageTypesMap = {
      1: '[图片]',
      2: '[语音]',
      3: '[位置]'
    };
    if (lastMessage === null) {return; }
    if (lastMessage.messageTypes === '0') {
      // 文字
    } else {
      lastMessage.message = messageTypesMap[lastMessage.messageTypes];
    }
    result[i].message = lastMessage.message
    ;[err, unRead] = await unReadGroupMessages(data.uID, result[i].id).then(data => [null, data]).catch(err => [err, null]);
    result[i].tips = unRead;
  }
  if (err) {
    res.send(err);
  } else {
    res.send({status: 200, result});
  }
}

// 一对一消息状态修改
exports.updateMessage = function (data, res) {
  //  修改项条件
  let whereStr = {'userID': data.uID, 'friendID': data.fID, 'state': 1};
  // 修改内容
  let updateStr = {'state': 0};
  Message.updateMany(whereStr, updateStr)
    .catch(() => {
      res.send({status: 500});
    })
    .then(() => {
      res.send({status: 200});
    });
};
// 群消息状态修改
exports.updateGroupMessage = function (data, res) {
  //  修改项条件
  let whereStr = {'groupID': data.gID,'state': 1};
  // 修改内容
  let updateStr = {'state': 0};
  GroupMessage.updateMany(whereStr, updateStr)
    .catch(() => {
      res.send({status: 500});
    })
    .then(() => {
      res.send({status: 200});
    });
};

// 添加新成员到群
function insertGroupUser(data) {
  let groupUser = new GroupUser(data);
  groupUser.save((err, res) => {
    if (err) {
      res.send({status: 500});
    } else {
      console.log('添加群成员成功！');
    }
  });

}

// 新建群
exports.createGroup = function (data, res) {
  let groupData = {
    userID: data.uID, //创建群的群主ID
    groupName: data.groupName, // 群名
    imgUrl: data.imgUrl, // 群头像
    createDate: new Date(),  //创建时间
  };
  let group = new Group(groupData);

  group.save()
    .catch(() => {
      res.send({status: 500});
    })
    .then((value) => {
      console.log(value);
      // 添加好友入群
      for (let i = 0; i < data.user.length; i++) {
        let fData = {
          groupID: value._id,    // 群ID
          userID: data.user[i],  // 群主ID
          joinDate: new Date(), // 进入时间
          lastTime: new Date(), // 最后通讯时间
        };
        // 加入
        insertGroupUser(fData, res);
        //添加群消息
        this.insertGroupMessage(fData.userID, fData.groupID, res);
      }
      res.send({status: 200});
    });
};
// exports.createGroup = function (data, res) {
//   return new Promise(function(resolve, reject){
//     let groupData = {
//       userID: data.uID, //创建群的群主ID
//       groupName: data.groupName, // 群名
//       imgUrl: data.imgUrl, // 群头像
//       createDate: new Date(),  //创建时间
//     }
//
//     let group = new Group(groupData)
//
//     group.save(function(err, result){
//       if (err) {
//         reject({status:500})
//       } else {
//         resolve(result)
//       }
//     })
//   }).then(function onFulfilled(value){
//     // 添加好友入群
//     for (let i = 0; i < data.user.length; i++) {
//       let fData = {
//         groupID: value._id, // 群ID
//         userID: data.use[i],  // 群主ID
//         joinDate: new Date(), // 进入时间
//         lastTime: new Date(), // 最后通讯时间
//       }
//       // 加入
//       insertGroupUser(fData, res)
//     }
//     //创建成功
//     res.send({status: 200})
//   }).catch(function onRejected(error){
//     res.send(error)
//   })
// }


// 按要求获取群列表
exports.getGroupList1 = function (data, res) {
  // id 为用户 所在的群
  let query = GroupUser.find({});
  // 查询条件
  query.where({'userID': data.uID});
  // 查找 groupID 关联的 user对象
  query.populate('groupID');
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'lastTime': -1});

  // 查询结果
  query.exec()
    .then(function (e) {
      let result = e.map(item => {
        return {
          // groupID 是从群表里取出来
          // item 就是群成员表中的数据
          id: item.groupID._id,    // 群ID   （在群表里找）
          name: item.groupID.groupName,  // 群名   （在群表里找）
          markName: item.groupUserName,  // markName 指 在 群内的昵称   （在群成员表里找）
          imgUrl: item.groupID.imgUrl,  // 群头像    （在群表里找）
          lastTime: item.lastTime,     // 群的最后通讯时间   （在群成员表里找）
          tip: item.tip,
          type: 1
        };
      });
      res.send({status: 200, result});
    })
    .catch(() => {
      res.send({status: 500});
    });
};
exports.getGroupList = function (data, res) {
  asyncGetGroupList(data, res);

};

function getGroupsList(data) {
  return new Promise(function (resolve, reject) {

    let query = GroupUser.find({});
    // 查询条件
    query.where({'userID': data.uID});
    // 查找 friendID 关联的 user对象
    query.populate('groupID');
    //  排序方式： 以最后通讯时间 从前往后排
    query.sort({'lastTime': -1});

    // 查询结果
    query.exec()
      .then(function (e) {
        let result = e.map(item => {
          return {
            // groupID 是从群表里取出来
            // item 就是群成员表中的数据
            id: item.groupID._id,    // 群ID   （在群表里找）
            name: item.groupID.groupName,  // 群名   （在群表里找）
            markName: item.groupUserName,  // markName 指 在 群内的昵称   （在群成员表里找）
            imgUrl: item.groupID.imgUrl,  // 群头像    （在群表里找）
            lastTime: item.lastTime,     // 群的最后通讯时间   （在群成员表里找）
            tip: item.tip,
            type: 1
          };
        });
        resolve(result);
      })
      .catch(() => {
        reject({status: 500});
      });
  });
}

// 添加群消息
exports.insertGroupMessage = function (groupID, fromID, msg, messageTypes, res) {
  let data = {
    groupID: groupID,
    userID: fromID,
    message: msg,
    messageTypes: messageTypes,
    sendTime: new Date(),
    state: 1
  };
  let message = new GroupMessage(data);
  message.save()
    .then(function () {
      if (res) {
        res.send({status: 200});
      }
    })
    .catch(function () {
      if (res) {
        res.send({status: 500});
      }
    });
};


// 按要求获取群消息
exports.getOneGroupMessage = function (data, res) {
  let query = GroupMessage.findOne({});
  // 查询条件
  query.where({'groupID': data.gID});
  // 关联的 user对象
  query.populate('userID');
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'sendTime': -1});
  // 查询结果
  query.exec()
    .then(function (item) {
      let result = {
        message: item.message,
        sendTime: item.sendTime,
        messageTypes: item.messageTypes,
        userName: item.userID.userName
      };
      res.send({status: 200, result});
    })
    .catch(() => {
      res.send({status: 500});
    });
};

function getGroupMessages(uID, gID) {
  return new Promise(function (resolve, reject) {
    let query = GroupMessage.findOne({});
    // 查询条件
    query.where({'groupID': gID, 'userID': uID,});
    //  排序方式： 以最后通讯时间 从前往后排
    query.sort({'sendTime': -1});
    // 查询结果
    query.exec()
      .then(function (item) {
        let result = {
          message: item.message,
          sendTime: item.sendTime,
          messageTypes: item.messageTypes,
          userName: item.userID.userName
        };
        resolve(result);
      })
      .catch(() => {
        reject({status: 500});
      });
  });
}


// 获取群未读消息数
function unReadGroupMessages(uID, gID) {
  return new Promise(function (resolve, reject) {
    // 汇总条件
    let whereStr = {'userID': uID, 'groupID': gID, 'state': 1};
    GroupMessage.countDocuments(whereStr)
      .catch(() => {
        reject({status: 500});
      })
      .then((result) => {
        resolve(result);
      });
  });
}

// 消息操作
// 分页获取数据一对一聊天数据
exports.getPageMessage = function (data, res) {
  // data: uID, fID , nowPage , pageSize
  let skipNumber = data.nowPage * data.pageSize; // 跳过的条数

  let query = Message.find({});
  // 查询条件
  query.where({$or: [{'userID': data.uID, 'friendID': data.fID}, {'userID': data.fID, 'friendID': data.uID}]});
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'sendTime': -1});
  // 查找friendID 关联的user对象
  query.populate('userID');
  // 跳过条数
  query.skip(skipNumber);
  // 一页条数
  query.limit(data.pageSize);

  // 查询结果
  query.exec()
    .then(function (e) {

      let result = e.map(item => {
        return {
          id: item._id, // 该消息的ID
          message: item.message, //  消息
          messageTypes: item.messageTypes, // 消息类型
          sendTime: item.sendTime,   // 发送时间
          fromID: item.userID._id,  // 发送该消息的 人的ID
          imgUrl: item.userID.imgUrl, // 发送该消息的 人的头像
        };
      });
      res.send({status: 200, result});
    })
    .catch(() => {
      res.send({status: 500});
    });

};
exports.getPageGroupMessage = function (data, res) {
  // data: uID, fID , nowPage , pageSize
  let skipNumber = data.nowPage * data.pageSize; // 跳过的条数
  let query = GroupMessage.find({});

  // 查询条件
  // query.where({$or: [{'groupID': data.gID, 'userID': data.uID}, {'groupID': data.uID, 'userID': data.gID}]});
  query.where({'groupID': data.gID});
  //  排序方式： 以最后通讯时间 从前往后排
  query.sort({'sendTime': -1});
  // 查找friendID 关联的user对象
  query.populate('userID');
  // 跳过条数
  query.skip(skipNumber);
  // 一页条数
  query.limit(data.pageSize);

  // 查询结果
  query.exec()
    .then(function (e) {
      let result = e.map(item => {
        return {
          id: item._id, // 该消息的ID
          message: item.message,  // 消息
          messageTypes: item.messageTypes, // 消息类型
          sendTime: item.sendTime,  // 发送时间
          fromID: item.userID._id,  // 群的ID
          imgUrl: item.userID.imgUrl,
        };
      });

      res.send({status: 200, result});
    })
    .catch(() => {
      res.send({status: 500});
    });

};
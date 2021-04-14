const express = require('express')
const router = express.Router()
// 引入邮箱发送方法
const emailServe = require('../dao/emailserver')
// 引入 User数据
const dbServer = require('../dao/dbserver')
// 注册页面服务
const signUp = require('../server/signup')
// 登录页面服务
const signIn = require('../server/signin')
// 搜索页面服务
const search = require('../server/search')
// 用户详情页面服务
const user = require('../server/userDetails')
// 好友申请操作
const friend = require('../server/friend')
// 聊天数据
const chat = require('../server/chat')
// 群
const group = require('../server/group')

// 上传附件操作
const upload = require('./file')
// 首页 好友列表渲染数据
const index = require('../server/index')
router.post('/test', (req, res) => {
  dbServer.findUser(res)
})
router.post('/mail', (req, res) => {
  let mail = req.body.mail
  // console.log(mail)
  emailServe.emailSignUp(mail, res)
  // res.send(mail)
})

// 注册页面
// 注册
router.post('/signUp/add', (req, res) => {
  signUp.signUp(req, res)
})

// 判断用户或邮箱是否被占用
router.post('/signUp/judge', (req, res) => {
  signUp.judgeValue(req, res)
})

// 用户验证
router.post('/signIn/match', (req, res) => {
  signIn.signIn(req, res)
})

// // 测试token 是否取到
// router.post('/signIn/testToken',(req,res)=>{
//   // res.send('这里token正确')
//   signIn.testToken(req,res)
// })

// 搜索页面
//  搜索用户
router.post('/search/user', (req, res) => {
  search.searchUser(req, res)
})

// 判断是否为好友
router.post('/search/isFriend', (rqe, res) => {
  search.isFriend(rqe, res)
})

// 搜索群
router.post('/search/group', (req, res) => {
  search.searchGroup(req, res)
})

// 判断是否在群内
router.post('/search/inGroup', (req, res) => {
  search.inGroup(req, res)
})

// 用户详情
// 详情
router.post('/user/detail', (req, res) => {
  user.userDetail(req, res)
})

// 用户信息修改
router.post('/user/update', (req, res) => {
  user.userUpdate(req, res)
})

//  获取好友昵称
router.post('/user/getFriendMarkName', (req, res) => {
  user.getFriendMarkName(req, res)
})
// 好友昵称修改
router.post('/user/modifyFriendMarkName', (req, res) => {
  user.modifyFriendMarkName(req, res)
})

// 好友操作
router.post('/friend/applyFriend', (req, res) => {
  friend.applyFriend(req, res)
})

// 申请状态修改
router.post('/friend/updateFriendState', (req, res) => {
  friend.updateFriendState(req, res)
})


// 拒接好友 或者 删除好友
router.post('/friend/deleteFriend', (req, res) => {
  friend.deleteFriend(req, res)
})



// 附件上传
router.post('/files/upload', upload.array('file', 9), function (req, res, next) {
  //获取路径
  let url = req.body.url
  // 获取文件名
  let name = req.files[0].filename
  let imgUrl = '/' + url +'/' +name
  // 返回给前端
  res.send(imgUrl)
})

// 渲染主页列表
// 获取好友
router.post('/index/getFriendList', (req, res) => {
  index.getFriendList(req,res)
})

// 获取和好友的最后一条消息  // 前端已废弃
router.post('/index/getLastMessage', (req, res) => {
  index.getLastMessage(req,res)
})
// 获取好友的未读消息数 // 前端已废弃
router.post('/index/unReadMessage', (req, res) => {
  index.unReadMessage(req,res)
})

// 好友消息标记已读
router.post('/index/updateMessage', (req, res) => {
  index.updateMessage(req,res)
})


// 获取群
router.post('/index/getGroupList', (req, res) => {
  index.getGroupList(req,res)
})

// 获取和群的最后一条消息
router.post('/index/getLastGroupMessage', (req, res) => {
  index.getLastGroupMessage(req,res)
})

// 群消息标记已读
router.post('/index/updateGroupMessage', (req, res) => {
  index.updateGroupMessage(req,res)
})

// 聊天页面
// 获取一对一聊天数据
router.post('/chat/getPageMessage', (req, res) => {
  chat.getPageMessage(req,res)
})
// 获取群聊天数据
router.post('/chat/getPageGroupMessage', (req, res) => {
  chat.getPageGroupMessage(req,res)
})


// 创建群页面
// 建群
router.post('/group/createGroup', (req, res) => {
  group.createGroup(req,res)
})

// 详情
router.post('/group/detail', (req, res) => {
  group.groupDetail(req, res)
})

// 群信息修改
router.post('/group/update', (req, res) => {
  group.groupUpdate(req, res)
})


//  获取群成员
router.post('/group/groupMemberID', (req, res) => {
  group.groupMemberID(req, res)
})

router.post('/group/groupMember', (req, res) => {
  group.groupMember(req, res)
})

module.exports = router





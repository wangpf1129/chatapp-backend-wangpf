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








module.exports = router





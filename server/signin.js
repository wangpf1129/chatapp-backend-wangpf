// 用户登录

const dbServer = require('../dao/dbserver')

// 引入token  目的测试token
const jwt = require('../dao/jwt')
// 登录
exports.signIn = function (req, res) {
  let {data, pwd} = req.body
  dbServer.userMatch(data, pwd, res)
}

// 测试token
exports.testToken = function (req, res) {
  let {token} = req.body
  let result = jwt.verifyToken(token)
  res.send(result)
}
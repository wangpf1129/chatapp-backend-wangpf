const dbServer = require('../dao/dbserver')

// 用户注册
exports.signUp = function (req,res) {
    // 获取用户的 用户名，邮箱，密码
  let {name,email,pwd} = req.body

  // res.send({name,mail,pwd})  //  测试用的

  // 传入dbServer中(数据库)
  dbServer.buildUser(name,email,pwd,res)
}

//  判断用户或邮箱是否被占用
exports.judgeValue = function (req,res) {
  let {data,type}  = req.body
 // res.send({data,type})   //测试用的

  // 传入dbServer中(数据库)
  dbServer.countUserValue(data,type,res)
}
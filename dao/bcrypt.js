const bcrypt =  require('bcryptjs')

exports.encryption = function (e) {
  // 生成 随机的 salt
  let salt = bcrypt.genSaltSync(10)

  // 生成hash密码
  // let hash = bcrypt.hashSync(e,salt)
  //
  // return hash
  return bcrypt.hashSync(e,salt)
}

// 解密
exports.verification = function (e,hash) {
  // e 用户传过来的密码， hash 数据库存的密码
  //  let verif = bcrypt.compareSync(e,hash)
  // return verif
  return bcrypt.compareSync(e,hash)
}
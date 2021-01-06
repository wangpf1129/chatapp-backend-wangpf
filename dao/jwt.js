// token
// 引入token
const jwt = require('jsonwebtoken')

// 签名
const secret = 'chatApp'

// 生成token
exports.generateToken = function (e) {
  let payload = {id: e, time: new Date()}

  // sign(payload,secret, {expiresIn:60*60*24// 授权时效24小时})
  // 此方法会生成一个token，第一个参数是数据，第二个参数是签名,第三个参数是token的过期时间可以不设置

  return jwt.sign(
    payload,
    secret,
    {expiresIn: 60 * 60 * 24 * 365}  // 存活1年
  )
}


//解码
exports.verifyToken = function (token) {
  // verify(token,secret)
  // 此方法会将一个token解码，这个token是由哪些数据构成的，只要传进去的secret正确，就可以解码出对应的数据，
  // 第一个参数是一个token，第二个参数是一个签名
  let payload
  jwt.verify(token, secret, (err) => {
    if (err) {
      payload = 0
    } else {
      payload = 1
    }
  })
  return payload
}
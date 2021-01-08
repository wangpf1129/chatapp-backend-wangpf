// 动态新建目录
const fs = require('fs')
const path = require('path')

exports.mkdir = function (pathname, callback) {
  // 需要判断是否是绝对路径 （避免不必要的bug）
  pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname)

  // 获取相对路径
  pathname = path.relative(__dirname, pathname)
  let flowers = pathname.split(path.sep) // path.sep 避免平台差异带来的bug
  let pre = ''

  flowers.forEach(flower => {
    try {
      // 没有异常， 文件已经创建 ，提示用户改变已经创建
      let _start = fs.statSync(path.join(__dirname, pre, flower))
      let hasMkdir = _start && _start.isDirectory()
      if (hasMkdir) {
        // callback  && callback(`文件${flower}已经存在，不能重复创建，请重新创建`)
      }
    } catch (error) {
      // 抛出异常，文件不存在则创建文件
      try {
        // 避免父文件还没有创建的时候先创建子文件所处的意外bug，  这里选择同步创建文件
        fs.mkdirSync(path.join(__dirname, pre, flower))
        callback && callback(null)
      } catch (error) {
        callback && callback(error)
      }
    }
    pre = path.join(pre, flower) // 路径拼合
  })
}
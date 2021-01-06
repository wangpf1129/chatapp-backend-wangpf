// 配置Schema

const mongoose = require('mongoose')
const db = require('../config/db')

//  架构
const Schema = mongoose.Schema

// 设计文档结构/架构（表结构）
// 字段名称就是表结构中的属性名称
// 约束的目的是为了保证数据的完整性， 不要有脏数据

// 用户表
let UserSchema = new Schema({
  userName: {type: String},                   // 用户名
  password: {type: String},                   // 密码
  email: {type: String},                       // 邮箱
  gender: {type: String, default: 'asexual'},  //性别
  birth: {type: Date},                         // 生日
  phone:{type:String},                        // 电话
  explain: {type: String},                     // 介绍
  imgUrl: {type: String, default: 'user.png'}, // 用户头像
  registerDate: {type: Date},                   // 注册日期
})
// 好友表
let FriendSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},        // 用户ID
  friendID: {type: Schema.Types.ObjectId, ref: 'User'},     // 好友ID
  state: {type: String},                                   // 用户状态 （0表示 已为好友  1表示申请中  2 表示申请发送方）
  markName:{type:String},                                  // 好友昵称
  createDate: {type: Date},                                // 成为好友日期
  lastTime: {type: Date},                                  // 最后通讯时间 （后添加的）
})
// 一对一消息表
let MessageSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},         // 用户ID
  friendID: {type: Schema.Types.ObjectId, ref: 'User'},      // 好友ID
  message: {type: String},                                  // 消息内容
  messageTypes: {type: String},                             // 消息类型（0文字，1图片链接，2音频链接）
  sendTime: {type: Date},                                  // 发送时间
  state: {type: Number},                                   // 消息状态（0已读，1未读）
})

// 群表
let GroupSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},   // 用户ID
  groupName: {type: String},                            // 群名称
  imgUrl: {type: String, default: 'group.png'},          // 群头像
  createDate: {type: Date},                             // 创建日期
  notice: {type: String},                               // 群公告
  lastTime: {type: Date},                                  // 最后通讯时间 （后添加的）
})

// 群成员表
let GroupUserSchema = new Schema({
  groupID :{type: Schema.Types.ObjectId, ref: 'Group'},    // 群id
  userID: {type: Schema.Types.ObjectId, ref: 'User'},     // 用户ID
  groupUserName:{type:String},                           // 群内成员名称
  tip:{type:Number,default:0},                          // 未读消息数
  joinDate:{type:Date},                                // 加入时间
  shield:{type:Number},                               // 是否屏蔽消息（0不屏蔽，1屏蔽）
})

// 群消息表
let GroupMessageSchema = new Schema({
  groupID :{type: Schema.Types.ObjectId, ref: 'Group'},   // 群id
  userID: {type: Schema.Types.ObjectId, ref: 'User'},    // 用户ID
  message: {type: String},                              // 群消息内容
  messageTypes: {type: String},                        // 消息类型（0文字，1图片链接，2音频链接）
  sendTime:{type:Date},                               // 发送时间
})

// 3.将文档结构发布为 模型 model 并暴露出去
//  mongoose.model 方法就是用来将一个 架构Schema 发布为一个 model
module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMessage', GroupMessageSchema)
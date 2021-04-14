// 群

const dbServer = require('../dao/dbserver');

// 创建群
exports.createGroup = function (req, res) {
  let data = req.body;
  dbServer.createGroup(data, res);
};
// 详情
exports.groupDetail = function (req, res) {
  let id = req.body.id;
  dbServer.groupDetail(id, res);
};


// 群信息修改
exports.groupUpdate = function (req, res) {
  let data = req.body;
  dbServer.groupUpdate(data, res);
};
// 获取群成员ID
exports.groupMemberID = function (req, res) {
  let data = req.body;
  dbServer.groupMemberID(data, res);
};

// 获取群成员信息
exports.groupMember = function (req, res) {
  let data = req.body;
  dbServer.groupMember(data, res);
};
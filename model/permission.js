var CFG = new Object();
CFG["LID_ADMIN"] = '最高管理者';
CFG["LID_BOSS"] = '主管使用者';
CFG["LID_USER"] = '一般使用者';
exports.permission = CFG;
exports.AuthObject;
exports.AuthObject = new Object();
exports.AuthObject["LID_USER"] = new Object();
exports.AuthObject["LID_USER"]["user.js"] = new Object();
exports.AuthObject["LID_USER"]["user.js"]['function'] = new Array();
exports.AuthObject["LID_USER"]["user.js"]['function'] = [
    'pwd'
];
exports.AuthObject["LID_USER"]["user.js"]['pwd'] = new Array();
exports.AuthObject["LID_USER"]["user.js"]['pwd'] = [
    'doSelfChangepwdForm', 
    'doSelfChangepwd'
];
exports.AuthObject["LID_ADMIN"] = new Object();
exports.AuthObject["LID_ADMIN"] = new Object();
exports.AuthObject["LID_ADMIN"]["user.js"] = new Object();
exports.AuthObject["LID_ADMIN"]["user.js"]['function'] = new Array();
exports.AuthObject["LID_ADMIN"]["user.js"]['function'] = [
    'pwd'
];
exports.AuthObject["LID_ADMIN"]["user.js"]['pwd'] = new Array();
exports.AuthObject["LID_ADMIN"]["user.js"]['function'] = [
    'list', 
    'add', 
    'del', 
    'pwd'
];
exports.AuthObject["LID_ADMIN"]["user.js"]['pwd'] = [
    'doChangepwdForm', 
    'doSelfChangepwdForm', 
    'doSelfChangepwd', 
    'doChangepwd'
];
exports.MenuBlock;
exports.MenuBlock = new Object();
exports.MenuBlock["LID_USER"] = 'menu-user-left';
exports.MenuBlock["LID_ADMIN"] = 'menu-admin-left';
exports.MenuOption;
exports.MenuOption = new Object();
exports.MenuOption = {
    'userManageClass': ''
};
exports.MenuOption['IncomeClass'] = '';
exports.MenuOption['PwdClass'] = '';
exports.MenuOption['userAddClass'] = '';
exports.MenuOption['ConsumeClass'] = '';

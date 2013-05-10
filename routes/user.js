
function list(req, res) {
    var datalistperpage = 15;
    var db = require("../model/db");
    var lib = require("../model/lib");
    var pageNation = require("../model/page");
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file = __filename;
    _file = _file.replace(__dirname + '/', "");
    if(!auth.checkAuthority(req, _file, arguments.callee)) {
        lib.doAlertReplaceRedir(res, '請先登入', req.protocol + "://" + req.get('host') + config['urlBase']);
        return;
    }
    var sess = req.session;
    var total = 0;
    var page = (typeof req.query.page === "undefined") ? 1 : req.query.page;
    db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
    db.useDB(config.AuthDBName);
    var getListHandle = function (result) {
        var html = '';
        var len, i, row;
        var permission = require("../model/permission");
        var moment = require('moment');
        var p = permission.permission;
        len = result.length;
        var loginDate;
        var form = '';
        var pwdform = '';
        for(i = 0; i < len; i++) {
            row = result[i];
            form = '<form class="form-inline" method="post" action="/users/del" enctype="multipart/form-data" class="form-vertical">';
            form += '<input type="hidden" name="mode" value="deluser"><input type="hidden" name="account" value="' + row['Account'] + '">';
            form += '<button type="submit" class="btn btn-danger"><i class="icon-trash"></i>刪除</button></p></form>';
            pwdform = '<form class="form-inline" method="post" action="/users/pwd" enctype="multipart/form-data" class="form-vertical">';
            pwdform += '<input type="hidden" name="mode" value="doChangepwdForm"><input type="hidden" name="account" value="' + row['Account'] + '">';
            pwdform += '<button type="submit" class="btn btn-info"><i class="icon-edit"></i>修改密碼</button></p></form>';
            loginDate = (row['LastLoginTimer'] > 0) ? moment(Math.abs(row['LastLoginTimer']) * 1000).format("YYYY-MM-DD HH:mm:ss") : '';
            html += '<tr><td>' + row['Account'] + '</td><td>' + row['Name'] + '</td><td>' + p[row['Identity']] + '</td><td>' + row['Note'] + '</td><td>' + loginDate + '</td><td>' + form + pwdform + '</td></tr>';
        }
        if(len == "0") {
            html += '<tr><td colspan="999" >沒有資料</td></tr>';
        }
        pageNation.seturl(req.protocol + "://" + req.get('host') + config['urlBase'] + '/users/list/');
        var pageHtml = pageNation.twitterpage(page, req.query, total, datalistperpage);
        var webroot = req.protocol + "://" + req.get('host') + config['urlBase'];
        var menufile = permission.MenuBlock["LID_IGS_USER"];
        if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity] !== "undefined") {
            menufile = permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
        }
        var menuoption = JSON.parse(JSON.stringify(permission.MenuOption));
        menuoption['webroot'] = webroot;
        menuoption['userManageClass'] = 'active';
        var menu = res.render(menufile, menuoption, function (err, menu) {
            res.render('user-list', {
                title: config.SiteTile,
                rows: html,
                pageNation: pageHtml,
                menu: menu
            });
        });
        db.end();
    };
    var getTotalRecordsHandle = function (result, nextcall) {
        total = result[0]['counts'];
        db.getSimpleQuery(config.AuthTable, datalistperpage, page, total, getListHandle);
    };
    var w = new Array();
    db.getTotalRecords(config.AuthTable, w, getTotalRecordsHandle);
}
exports.list = list;
;
function add(req, res) {
    var permission = require("../model/permission");
    var lib = require("../model/lib");
    var sess = req.session;
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file = __filename;
    _file = _file.replace(__dirname + '/', "");
    if(!auth.checkAuthority(req, _file, arguments.callee)) {
        lib.doAlertReplaceRedir(res, '請先登入', req.protocol + "://" + req.get('host') + config['urlBase']);
        return;
    }
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase'] + '/users/list/';
    var p = permission.permission;
    var SelIdentity = '<select name="identity" >';
    var k;
    for(k in p) {
        SelIdentity += '<option value="' + k + '">' + p[k] + '</option>';
    }
    SelIdentity += '</select>';
    var mode = (typeof req.body.mode !== "undefined") ? req.body.mode : '';
    var acc = (typeof req.body.account !== "undefined") ? req.body.account : '';
    var pwd = (typeof req.body.password !== "undefined") ? req.body.password : '';
    var contactName = (typeof req.body.contact_name !== "undefined") ? req.body.contact_name : '';
    var identity = (typeof req.body.identity !== "undefined") ? req.body.identity : '';
    var email = (typeof req.body.note !== "undefined") ? req.body.note : '';
    if(mode == 'adduser') {
        var db = require("../model/db");
        var config = require("../model/config");
        db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
        db.useDB(config.AuthDBName);
        var InsertHandler = function (result) {
            var affectrows = (result['affectedRows'] !== "undefined") ? result['affectedRows'] : 0;
            console.log(affectrows);
            if(affectrows >= 1) {
                lib.doAlertReplaceRedir(res, '新增完成', fullURL);
                return;
            }
            db.end();
        };
        var insertObj = new Object();
        insertObj['Account'] = acc;
        insertObj['Password'] = pwd;
        insertObj['Name'] = contactName;
        insertObj['Note'] = email;
        insertObj['Identity'] = identity;
        db.insertSimpleQuery(config.AuthTable, insertObj, InsertHandler);
    } else {
        var webroot = req.protocol + "://" + req.get('host') + config['urlBase'];
        var menufile = permission.MenuBlock["LID_IGS_USER"];
        if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity] !== "undefined") {
            menufile = permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
        }
        var menuoption = JSON.parse(JSON.stringify(permission.MenuOption));
        menuoption['webroot'] = webroot;
        menuoption['userAddClass'] = 'active';
        var menu = res.render(menufile, menuoption, function (err, menu) {
            res.render('user-add', {
                title: config.SiteTile,
                SelIdentity: '身份: ' + SelIdentity,
                menu: menu
            });
        });
    }
}
exports.add = add;
;
function del(req, res) {
    var permission = require("../model/permission");
    var lib = require("../model/lib");
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file = __filename;
    _file = _file.replace(__dirname + '/', "");
    if(!auth.checkAuthority(req, _file, arguments.callee)) {
        lib.doAlertReplaceRedir(res, '請先登入', req.protocol + "://" + req.get('host') + config['urlBase']);
        return;
    }
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase'] + '/users/list/';
    var mode = (typeof req.body.mode !== "undefined") ? req.body.mode : '';
    var acc = (typeof req.body.account !== "undefined") ? req.body.account : '';
    if(mode == 'deluser') {
        var db = require("../model/db");
        var config = require("../model/config");
        db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
        db.useDB(config.AuthDBName);
        var deleteHandler = function (result) {
            var affectrows = (result['affectedRows'] !== "undefined") ? result['affectedRows'] : 0;
            if(affectrows >= 1) {
                lib.doAlertReplaceRedir(res, '刪除完成', fullURL);
                return;
            } else {
                lib.doAlertReplaceRedir(res, 'oops! There is something wrong!', fullURL);
                return;
            }
            db.end();
        };
        var w = new Array();
        if(acc.length > 0) {
            w[w.length] = 'Account=' + db.mysqlEscape(acc);
            db.deletSimpleQuery(config.AuthTable, w, deleteHandler);
        }
    }
}
exports.del = del;
;
function pwd(req, res) {
    var permission = require("../model/permission");
    var lib = require("../model/lib");
    var mode = (typeof req.body.mode !== "undefined") ? req.body.mode : 'doSelfChangepwdForm';
    var acc = (typeof req.body.account !== "undefined") ? req.body.account : '';
    var pwd = (typeof req.body.password !== "undefined") ? req.body.password : '';
    var sess = req.session;
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file = __filename;
    _file = _file.replace(__dirname + '/', "");
    if(!auth.checkAuthority(req, _file, arguments.callee, mode)) {
        lib.doAlertReplaceRedir(res, '請先登入', req.protocol + "://" + req.get('host') + config['urlBase']);
        return;
    }
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase'] + '/users/list';
    var webroot = req.protocol + "://" + req.get('host') + config['urlBase'];
    var menufile = permission.MenuBlock["LID_IGS_USER"];
    if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity] !== "undefined") {
        menufile = permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
    }
    var menuoption = JSON.parse(JSON.stringify(permission.MenuOption));
    menuoption['webroot'] = webroot;
    menuoption['PwdClass'] = 'active';
    switch(mode) {
        case 'doChangepwdForm':
            var menu = res.render(menufile, menuoption, function (err, menu) {
                res.render('user-pwd', {
                    title: config.SiteTile,
                    acc: acc,
                    nextmode: 'doChangepwd',
                    menu: menu
                });
            });
            break;
        default:
        case 'doSelfChangepwdForm':
            var menu = res.render(menufile, menuoption, function (err, menu) {
                res.render('user-pwd', {
                    title: config.SiteTile,
                    acc: acc,
                    nextmode: 'doSelfChangepwd',
                    menu: menu
                });
            });
            break;
        case 'doSelfChangepwd':
            acc = sess.auth[config['SESSROOT']].Account;
            var db = require("../model/db");
            var config = require("../model/config");
            db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
            db.useDB(config.AuthDBName);
            var updateHandler = function (result) {
                var affectrows = (result['affectedRows'] !== "undefined") ? result['affectedRows'] : 0;
                if(affectrows >= 1) {
                    lib.doAlertReplaceRedir(res, '修改完成', webroot + '/users/pwd');
                    return;
                }
                db.end();
            };
            if(acc != '') {
                var updateObj = new Object();
                updateObj['Password'] = pwd;
                var w = new Array();
                w[w.length] = "Account=" + db.mysqlEscape(acc);
                db.updateSimpleQuery(config.AuthTable, updateObj, w, updateHandler);
            }
            break;
        case 'doChangepwd':
            var db = require("../model/db");
            var config = require("../model/config");
            db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
            db.useDB(config.AuthDBName);
            var updateHandler = function (result) {
                var affectrows = (result['affectedRows'] !== "undefined") ? result['affectedRows'] : 0;
                console.log(affectrows);
                if(affectrows >= 1) {
                    lib.doAlertReplaceRedir(res, '修改完成', fullURL);
                    return;
                }
                db.end();
            };
            var updateObj = new Object();
            updateObj['Password'] = pwd;
            var w = new Array();
            w[w.length] = "Account=" + db.mysqlEscape(acc);
            db.updateSimpleQuery(config.AuthTable, updateObj, w, updateHandler);
            break;
    }
}
exports.pwd = pwd;
;

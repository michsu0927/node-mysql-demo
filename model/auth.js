exports.errors;
exports.msg;
function doUserLogin(req, callback) {
    exports.errors = new Array();
    exports.msg = '';
    var db = require("../model/db");
    var config = require("../model/config");
    var lib = require("../model/lib");
    db.connect(config.AuthDBHost, config.AuthDBUser, config.AuthDBPass, config.AuthDBPort);
    db.useDB(config.AuthDBName);
    var acc = (typeof req.body.account !== "undefined") ? req.body.account : '';
    var pwd = (typeof req.body.password !== "undefined") ? req.body.password : '';
    var w = new Array();
    w[w.length] = "Account=" + db.mysqlEscape(acc);
    var getAuthHandler = function (results) {
        if(results.length == 0) {
            exports.msg = '帳號密碼錯誤';
            if(typeof callback === "function") {
                callback(0);
            }
            return;
        }
        if(pwd != results[0]['Password']) {
            exports.msg = '帳號密碼錯誤';
            if(typeof callback === "function") {
                callback(0);
            }
            return;
        }
        if((pwd == results[0]['Password']) && (acc == results[0]['Account'])) {
            var sess = req.session;
            sess.auth = new Object();
            sess.auth[config['SESSROOT']] = new Object();
            sess.auth[config['SESSROOT']] = {
                'Account': acc,
                'Identity': results[0]['Identity']
            };
            if(typeof callback === "function") {
                callback(1);
            }
            return;
        }
        exports.msg = '無法連接伺服器';
        if(typeof callback === "function") {
            callback(0);
        }
        return;
    };
    db.getSimpleQuery(config.AuthTable, 1, 1, 1, getAuthHandler, w);
}
exports.doUserLogin = doUserLogin;
function checkAuthority(req, _file, caller, mode) {
    if (typeof mode === "undefined") { mode = ''; }
    var config = require("./config");
    var permission = require("./permission");
    var lib = require("./lib");
    var sess = req.session;
    var authsess, Identity, _file;
    if(typeof sess.auth !== "undefined") {
        authsess = sess.auth[config['SESSROOT']];
        Identity = authsess.Identity;
        var funStr = caller.toString();
        var reg = /function ([^\(]*)/;
        var funcname = reg.exec(funStr)[1];
        if(!lib.in_array(funcname, permission.AuthObject[Identity][_file]['function'])) {
            return false;
        }
        if((mode != '') && (typeof permission.AuthObject[Identity][_file][funcname] === "object")) {
            if(!lib.in_array(mode, permission.AuthObject[Identity][_file][funcname])) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}
exports.checkAuthority = checkAuthority;
function doUserLogout(req, callback) {
    var sess = req.session;
    var lib = require("./lib");
    if(typeof sess.auth !== "undefined") {
        delete sess.auth;
        if(typeof callback === "function") {
            callback(1);
        }
        return true;
    }
    if(typeof callback === "function") {
        callback(1);
    }
    return true;
}
exports.doUserLogout = doUserLogout;

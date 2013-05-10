function index(req, res) {
    var lib = require("../model/lib");
    var config = require("../model/config");
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase'];
    var mode = (typeof req.body.mode !== "undefined") ? req.body.mode : '';
    var acc = (typeof req.body.account !== "undefined") ? req.body.account : '';
    var pwd = (typeof req.body.password !== "undefined") ? req.body.password : '';
    if(mode == 'login') {
        var AuthHandler = function (results) {
            if(results != 1) {
                lib.doAlertReplaceRedir(res, auth.msg, fullURL);
                return;
            } else {
                lib.doAlertReplaceRedir(res, '登入成功', fullURL + '/users/pwd');
                return;
            }
        };
        var auth = require("../model/auth");
        auth.doUserLogin(req, AuthHandler);
    } else {
        res.render('index', {
            title: config.SiteTile
        });
    }
}
exports.index = index;
;
function logout(req, res) {
    var lib = require("../model/lib");
    var config = require("../model/config");
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase'];
    var auth = require("../model/auth");
    var LogoutHandler = function (results) {
        lib.doAlertReplaceRedir(res, '登出成功', fullURL);
        return;
    };
    auth.doUserLogout(req, LogoutHandler);
}
exports.logout = logout;
;

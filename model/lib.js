function redirJS(res, redir_url) {
    if (typeof redir_url === "undefined") { redir_url = ''; }
    var html = '';
    html = '<script language="javascript" type="text/javascript">';
    html += (typeof redir_url === "string") ? 'window.location.href="' + redir_url + '";' : '';
    html += '</script>';
    res.send(html);
}
exports.redirJS = redirJS;
function getReplaceAlertJs(msg, redir_url) {
    if (typeof redir_url === "undefined") { redir_url = ''; }
    var html = '<script language="javascript" type="text/javascript">';
    html += 'alert("' + msg + '");';
    html += (typeof redir_url === "string") ? 'window.location.replace("' + redir_url + '");' : '';
    html += '</script>';
    return html;
}
exports.getReplaceAlertJs = getReplaceAlertJs;
function doAlertReplaceRedir(res, msg, redir_url) {
    if (typeof redir_url === "undefined") { redir_url = ''; }
    var html = '';
    html = '<html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" ></head><body>';
    html += this.getReplaceAlertJs(msg, redir_url);
    html += '<noscript><a href="' + redir_url + '">Your browser does not have JavaScript enabled.</a></noscript>';
    html += '</body></html>';
    res.send(html);
}
exports.doAlertReplaceRedir = doAlertReplaceRedir;
function ReplaceRedirJs(res, redir_url) {
    if (typeof redir_url === "undefined") { redir_url = ''; }
    var html = '<script language="javascript" type="text/javascript">    ';
    html += (typeof redir_url === "string") ? 'window.location.replace("' + redir_url + '");' : '';
    html += '</script>';
    res.send(html);
}
exports.ReplaceRedirJs = ReplaceRedirJs;
function in_array(needle, haystack, argStrict) {
    var key = '', strict = !!argStrict;
    if(strict) {
        for(key in haystack) {
            if(haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for(key in haystack) {
            if(haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}
exports.in_array = in_array;
var Foo = (function () {
    function Foo() { }
    Foo.prototype.setXY = function () {
        this.x = 1;
        this.y = 2;
    };
    Foo.prototype.getXY = function () {
        return {
            X: this.x,
            Y: this.y
        };
    };
    return Foo;
})();
exports.Foo = Foo;

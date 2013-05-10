var mysql = require('mysql');
var db;
function useDB(database) {
    var sql = "USE " + database;
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            return;
        }
    });
}
exports.useDB = useDB;
function dbQuery(sql, callback) {
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            return;
        }
        if(typeof callback === "function") {
            callback(results);
        }
    });
}
exports.dbQuery = dbQuery;
function getTotalRecords(TABLE, addWhere, callback) {
    var where = new Array();
    var s;
    if((typeof addWhere == 'object') && (addWhere.hasOwnProperty('length'))) {
        if(addWhere.length > 0) {
            where = where.concat(addWhere);
        }
    }
    var wherestr = (where.length > 0) ? '  WHERE  ' + where.join('  AND ') : '';
    var sql = "SELECT count(*) as counts  FROM  `" + TABLE + "` as TB1  " + wherestr + " ";
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            console.error(sql);
            return;
        }
        if(typeof callback === "function") {
            callback(results);
        }
    });
}
exports.getTotalRecords = getTotalRecords;
function getSimpleQuery(TABLE, recordperpage, page, totalrecords, callback, addWhere, addOrder, addFields, keyfield, distinct) {
    if(typeof keyfield === "undefined") {
        keyfield = '';
    }
    var where = new Array();
    var s;
    if((typeof addWhere == 'object') && (addWhere.hasOwnProperty('length'))) {
        if(addWhere.length > 0) {
            where = where.concat(addWhere);
        }
    }
    var wherestr = (where.length > 0) ? '  WHERE  ' + where.join('  AND ') : '';
    var order = new Array();
    s = '';
    if((typeof addOrder == 'object') && (addOrder.hasOwnProperty('length'))) {
        if(addOrder.length > 0) {
            order = order.concat(addOrder);
        }
    }
    var orderstr = (order.length > 0) ? '    ORDER BY    ' + order.join('  , ') : '';
    var afields = new Array();
    s = '';
    if((typeof addFields == 'object') && (addFields.hasOwnProperty('length'))) {
        if(addFields.length > 0) {
            afields = afields.concat(addFields);
        }
    }
    var fieldsstr = (afields.length > 0) ? 'TB1.' + afields.join(',TB1.') : ' TB1.* ';
    var re = new Array();
    if(totalrecords == 0) {
        callback(re);
    }
    recordperpage = (recordperpage == 'max') ? totalrecords : recordperpage;
    recordperpage = ((typeof recordperpage === "undefined") || (Math.abs(recordperpage) == 0)) ? 1 : Math.abs(recordperpage);
    var totalpage = Math.ceil(totalrecords / recordperpage);
    if(page > totalpage) {
        page = totalpage;
    }
    var limit_offset = (((page - 1) > 0) ? (page - 1) : 0) * recordperpage;
    var D = '';
    if(distinct == 1) {
        D = 'distinct';
    }
    var sql = "  SELECT  " + D + "  " + fieldsstr + "   FROM `" + TABLE + "`   as TB1  " + wherestr + "  " + orderstr + " LIMIT    " + limit_offset + " , " + recordperpage + " ";
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            console.error(sql);
            return;
        }
        if((keyfield != '') && (typeof keyfield === 'string')) {
            if(typeof results[0][keyfield] !== "undefined") {
                var len = 0;
                var i;
                len = results.length;
                var r = {
                };
                for(i = 0; i < len; i++) {
                    r[results[i][keyfield]] = {
                    };
                    r[results[i][keyfield]] = results[i];
                }
                if(typeof callback === "function") {
                    callback(r);
                    return;
                }
            }
        }
        if(typeof callback === "function") {
            callback(results);
            return;
        }
    });
}
exports.getSimpleQuery = getSimpleQuery;
function insertSimpleQuery(TABLE, InserObj, callback) {
    var k, v;
    var fieldarr = new Array();
    var valuearr = new Array();
    for(k in InserObj) {
        fieldarr[fieldarr.length] = k;
        valuearr[valuearr.length] = mysql.escape(InserObj[k]);
    }
    var sql = "INSERT INTO `" + TABLE + "` (`" + fieldarr.join("`,`") + "`) VALUES ( " + valuearr.join(",") + " ) ";
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            console.error(sql);
            return;
        }
        if(typeof callback === "function") {
            callback(results);
        }
    });
}
exports.insertSimpleQuery = insertSimpleQuery;
function updateSimpleQuery(TABLE, UpdateObj, addWhere, callback) {
    var k, v;
    var update = new Array();
    for(k in UpdateObj) {
        update[update.length] = "`" + k + "`=  " + mysql.escape(UpdateObj[k]) + " ";
    }
    var where = new Array();
    var s;
    if((typeof addWhere == 'object') && (addWhere.hasOwnProperty('length'))) {
        if(addWhere.length > 0) {
            where = where.concat(addWhere);
        }
    }
    var wherestr = (where.length > 0) ? '  WHERE  ' + where.join('  AND ') : '';
    var sql = "UPDATE `" + TABLE + "` SET " + update.join(",") + " " + wherestr;
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            console.error(sql);
            return;
        }
        if(typeof callback === "function") {
            callback(results);
        }
    });
}
exports.updateSimpleQuery = updateSimpleQuery;
function deletSimpleQuery(TABLE, addWhere, callback) {
    var where = new Array();
    var s;
    if((typeof addWhere == 'object') && (addWhere.hasOwnProperty('length'))) {
        if(addWhere.length > 0) {
            where = where.concat(addWhere);
        }
    }
    var wherestr = (where.length > 0) ? '  WHERE  ' + where.join('  AND ') : '';
    var sql = "DELETE FROM `" + TABLE + "` " + wherestr;
    db.query(sql, function (err, results, fields) {
        if(err) {
            console.error(err);
            console.error(sql);
            return;
        }
        if(typeof callback === "function") {
            callback(results);
        }
    });
}
exports.deletSimpleQuery = deletSimpleQuery;
function mysqlEscape(str) {
    return mysql.escape(str);
}
exports.mysqlEscape = mysqlEscape;
function end() {
    db.end();
}
exports.end = end;
function connect(host, user, password, port) {
    db = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        port: port
    });
    db.connect();
}
exports.connect = connect;

declare function require(name:string);
export var errors;
export var msg;

export function doUserLogin(req:any,callback: (results:any) => void){
	errors=new Array();
	msg='';
	var db = require("../model/db");
	var config = require("../model/config");
    var lib = require("../model/lib");
     //建立 db connect
    db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
    db.useDB(config.AuthDBName);
    var acc=(typeof req.body.account!=="undefined")?req.body.account:'';
    var pwd=(typeof req.body.password!=="undefined")?req.body.password:'';
    
    var w=new Array();
    w[w.length]="Account="+db.mysqlEscape(acc);

    var getAuthHandler=function(results:any){
    	//console.log(results.length);
    	if(results.length==0)
    	{
    		msg='帳號密碼錯誤';
    		if(typeof callback==="function"){callback(0);}
    		return;
    	}
    	
    	if(pwd!=results[0]['Password'])
    	{
    		msg='帳號密碼錯誤';
    		if(typeof callback==="function"){callback(0);}
    		return;
    	}

    	if((pwd==results[0]['Password'])&&(acc==results[0]['Account']))
    	{
    		var sess=req.session;
    		//console.log(sess);
    		sess.auth=new Object();
    		sess.auth[config['SESSROOT']]=new Object();
    		sess.auth[config['SESSROOT']]={'Account':acc,'Identity':results[0]['Identity']};
    		//{'Account':acc,'Identity':results[0]['Identity']}
    		//console.log(sess);
    		if(typeof callback==="function"){callback(1);}
    		return;
    	}

    	msg='無法連接伺服器';
    	if(typeof callback==="function"){callback(0);}
    	return;
    }

    db.getSimpleQuery(config.AuthTable,1,1,1,getAuthHandler,w);

}

//function to check login permission
export function checkAuthority(req:any,_file:string,caller:any,mode:string=''){
    var config = require("./config");
    var permission= require("./permission");
    var lib= require("./lib");
    //檢查登入權限
    var sess=req.session;
    //console.log(sess);
    var authsess,Identity,_file;
    if(typeof sess.auth!=="undefined")
    {
        authsess=sess.auth[config['SESSROOT']];
        Identity=authsess.Identity;
        //console.log(Identity);
        //console.log(permission.AuthObject[Identity]);
        var funStr = caller.toString()
        var reg=/function ([^\(]*)/;
        var funcname=reg.exec(funStr)[1];
        //console.log(funcname);
        if(!lib.in_array( funcname ,permission.AuthObject[Identity][_file]['function']))
        {
            return false;
        }

        if((mode!='')&&(typeof permission.AuthObject[Identity][_file][funcname]==="object"))
        {
            if(!lib.in_array( mode ,permission.AuthObject[Identity][_file][funcname]))
            {
                return false;
            }
        }
        
    }
    else
    {
        return false;
    }
    return true;
}

export function doUserLogout(req:any,callback: (results:any) => void){
    var sess=req.session;
    var lib= require("./lib");
    if(typeof sess.auth!=="undefined")
    {
        delete sess.auth;
        //console.log(sess);
        //console.log(callback);
        if(typeof callback==="function"){callback(1);}
        return true;
    }
    if(typeof callback==="function"){callback(1);}
    return true;
}
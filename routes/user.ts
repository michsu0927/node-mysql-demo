///<reference path='../node.d.ts' />
///<reference path='../express.d.ts' />
declare function require(name:string);
import express = module("express");

export function list(req: any, res: any){
    //每頁幾筆資料
    var datalistperpage=15;
    var db = require("../model/db");
    var lib = require("../model/lib");
    //分頁 model
    var pageNation=require("../model/page");

    //檢查登入權限
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file=__filename;
    _file=_file.replace(__dirname+'/',"");
    if(!auth.checkAuthority(req,_file,arguments.callee))
    {
        lib.doAlertReplaceRedir(res,'請先登入',req.protocol + "://" + req.get('host')+config['urlBase']);return;
    }

    //session
    var sess=req.session;
    //總筆數
    var total=0;
    //目前頁數
    var page=(typeof req.query.page==="undefined")?1:req.query.page;
    
    //建立 db connect
    db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
    db.useDB(config.AuthDBName);

    //取得資料 handle
    var getListHandle=function(result:any){
		var html='';
    	var len,i,row;
        var permission= require("../model/permission");
        var moment = require('moment');
        var p=permission.permission;
    	len=result.length;
        var loginDate;
        var form='';
        var pwdform='';
	    for (i=0;i<len;i++) {
	        row=result[i];
            form='<form class="form-inline" method="post" action="/users/del" enctype="multipart/form-data" class="form-vertical">';
            form+='<input type="hidden" name="mode" value="deluser"><input type="hidden" name="account" value="'+row['Account']+'">';
            form+='<button type="submit" class="btn btn-danger"><i class="icon-trash"></i>刪除</button></p></form>';
            pwdform='<form class="form-inline" method="post" action="/users/pwd" enctype="multipart/form-data" class="form-vertical">';
            pwdform+='<input type="hidden" name="mode" value="doChangepwdForm"><input type="hidden" name="account" value="'+row['Account']+'">';
            pwdform+='<button type="submit" class="btn btn-info"><i class="icon-edit"></i>修改密碼</button></p></form>';
            loginDate=(row['LastLoginTimer'] > 0)?moment(Math.abs(row['LastLoginTimer'])*1000).format("YYYY-MM-DD HH:mm:ss"):'';
	        html+='<tr><td>'+row['Account']+'</td><td>'+row['Name']+'</td><td>'+p[row['Identity']]+'</td><td>'+row['Note']+'</td><td>'+loginDate+'</td><td>'+form+pwdform+'</td></tr>';
	    }
        
        if(len=="0"){
            html+='<tr><td colspan="999" >沒有資料</td></tr>';
        }

        //產生分頁
        pageNation.seturl(req.protocol + "://" + req.get('host')+config['urlBase']+'/users/list/');
        var pageHtml=pageNation.twitterpage(page,req.query,total,datalistperpage);
        
        // render 網頁
        var webroot=req.protocol + "://" + req.get('host')+config['urlBase'];
        var menufile=permission.MenuBlock["LID_IGS_USER"];
        if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity]!=="undefined")
        {
            menufile=permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
        }
        var menuoption=JSON.parse(JSON.stringify(permission.MenuOption)); 
        menuoption['webroot']=webroot;
        menuoption['userManageClass']='active';
        //先產左邊的 menu 
        var menu= res.render(  menufile ,menuoption, function(err, menu) {
            //全部網頁
            res.render('user-list', { title: config.SiteTile , rows: html , pageNation:pageHtml , menu:menu });
        });
        //結束 db 連線
        db.end();
    };

    //get total record nums handler
    var getTotalRecordsHandle=function(result:any,nextcall:any){
    	total=result[0]['counts'];
        db.getSimpleQuery(config.AuthTable,datalistperpage,page,total,getListHandle);
    };

    //get data
    var w=new Array();
    db.getTotalRecords(config.AuthTable,w,getTotalRecordsHandle);
};

export function add(req: any, res: any){
    var permission= require("../model/permission");
    var lib= require("../model/lib");
    var sess=req.session;
    //檢查登入權限
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file=__filename;
    _file=_file.replace(__dirname+'/',"");
    if(!auth.checkAuthority(req,_file,arguments.callee))
    {
        lib.doAlertReplaceRedir(res,'請先登入',req.protocol + "://" + req.get('host')+config['urlBase']);return;
    }
    //新增完後要去的 url
    var fullURL = req.protocol + "://" + req.get('host') +config['urlBase']+ '/users/list/';
    
    var p=permission.permission;
    var SelIdentity='<select name="identity" >';
    var k;
    for ( k in p )
    {
        SelIdentity+='<option value="'+k+'">'+p[k]+'</option>';
    }
    SelIdentity+='</select>';
    var mode=(typeof req.body.mode!=="undefined")?req.body.mode:'';
    var acc=(typeof req.body.account!=="undefined")?req.body.account:'';
    var pwd=(typeof req.body.password!=="undefined")?req.body.password:'';
    var contactName=(typeof req.body.contact_name!=="undefined")?req.body.contact_name:'';
    var identity=(typeof req.body.identity!=="undefined")?req.body.identity:'';
    var email=(typeof req.body.note!=="undefined")?req.body.note:'';

    //如果有  post 新增資料
    if(mode=='adduser')
    {
        //新增資料
        var db = require("../model/db");
        var config=require("../model/config");
        //建立 db connect
        db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
        db.useDB(config.AuthDBName);
        var InsertHandler=function(result:any){
            var affectrows=(result['affectedRows']!=="undefined")?result['affectedRows']:0;
            console.log(affectrows);
            if(affectrows >= 1)
            {
                lib.doAlertReplaceRedir(res,'新增完成',fullURL);return;
            }
            //結束 db 連線
            db.end();
        };
        var insertObj=new Object();
        insertObj['Account']=acc;
        insertObj['Password']=pwd;
        insertObj['Name']=contactName;
        insertObj['Note']=email;
        insertObj['Identity']=identity;
        db.insertSimpleQuery(config.AuthTable,insertObj,InsertHandler);
    }
    else
    {
        //沒有  post 新增資料 呈現輸入資料表單
        // render 網頁
        var webroot=req.protocol + "://" + req.get('host')+config['urlBase'];
        var menufile=permission.MenuBlock["LID_IGS_USER"];
        if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity]!=="undefined")
        {
            menufile=permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
        }
        var menuoption=JSON.parse(JSON.stringify(permission.MenuOption)); 
        menuoption['webroot']=webroot;
        menuoption['userAddClass']='active';
        //先產左邊的 menu 
        var menu= res.render(  menufile ,menuoption, function(err, menu) {
            //全部網頁
            res.render('user-add', { title: config.SiteTile ,SelIdentity:'身份: '+SelIdentity , menu:menu });
        });
    }    
};

export function del(req: any, res: any){
    var permission= require("../model/permission");
    var lib= require("../model/lib");

    //檢查登入權限
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file=__filename;
    _file=_file.replace(__dirname+'/',"");
    if(!auth.checkAuthority(req,_file,arguments.callee))
    {
        lib.doAlertReplaceRedir(res,'請先登入',req.protocol + "://" + req.get('host')+config['urlBase']);return;
    }

    //刪除資料後要去的 url
    var fullURL = req.protocol + "://" + req.get('host')+config['urlBase']+'/users/list/';
    var mode=(typeof req.body.mode!=="undefined")?req.body.mode:'';
    var acc=(typeof req.body.account!=="undefined")?req.body.account:'';
    //如果有  post 刪除資料
    if(mode=='deluser')
    {
        //刪除資料
        var db = require("../model/db");
        var config=require("../model/config");
        //建立 db connect
        db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
        db.useDB(config.AuthDBName);
        var deleteHandler=function(result:any){
            var affectrows=(result['affectedRows']!=="undefined")?result['affectedRows']:0;
            if(affectrows >= 1)
            {
                lib.doAlertReplaceRedir(res,'刪除完成',fullURL);return;
            }
            else
            {
                lib.doAlertReplaceRedir(res,'oops! There is something wrong!',fullURL);return;
            }
            //結束 db 連線
            db.end();
        };
        var w=new Array();
        if(acc.length > 0)
        {
            w[w.length]='Account='+db.mysqlEscape(acc);
            db.deletSimpleQuery(config.AuthTable,w,deleteHandler);
        }
    }
};

export function pwd(req: any, res: any){
    var permission= require("../model/permission");
    var lib= require("../model/lib");
    var mode=(typeof req.body.mode!=="undefined")?req.body.mode:'doSelfChangepwdForm';
    var acc=(typeof req.body.account!=="undefined")?req.body.account:'';
    var pwd=(typeof req.body.password!=="undefined")?req.body.password:'';
    var sess=req.session;

    //檢查登入權限
    var config = require("../model/config");
    var auth = require("../model/auth");
    var _file;
    _file=__filename;
    _file=_file.replace(__dirname+'/',"");
    
    if(!auth.checkAuthority(req,_file,arguments.callee,mode))
    {
        lib.doAlertReplaceRedir(res,'請先登入',req.protocol + "://" + req.get('host')+config['urlBase']);return;
    }

    //修改後要去的 url
    var fullURL = req.protocol + "://" + req.get('host') + config['urlBase']+'/users/list';

    // render 網頁
    var webroot=req.protocol + "://" + req.get('host')+config['urlBase'];
    var menufile=permission.MenuBlock["LID_IGS_USER"];
    if(typeof permission.MenuBlock[sess.auth[config['SESSROOT']].Identity]!=="undefined")
    {
        menufile=permission.MenuBlock[sess.auth[config['SESSROOT']].Identity];
    }
    var menuoption=JSON.parse(JSON.stringify(permission.MenuOption)); 
    menuoption['webroot']=webroot;
    menuoption['PwdClass']='active';

    //依 post 來的資料做不同的事
    switch(mode)
    {
        //修改密碼表單
        case 'doChangepwdForm':
            //先產左邊的 menu 
            var menu= res.render(  menufile ,menuoption, function(err, menu) {
                //全部網頁
                res.render('user-pwd', { title: config.SiteTile ,acc:acc ,nextmode:'doChangepwd'  , menu:menu });
            });
        break;
        //修改自己密碼表單
        default :
        case 'doSelfChangepwdForm' :
            //先產左邊的 menu 
            var menu= res.render(  menufile ,menuoption, function(err, menu) {
                //全部網頁
                res.render('user-pwd', { title: config.SiteTile ,acc:acc ,nextmode:'doSelfChangepwd'  , menu:menu });
            });
        break;
        case 'doSelfChangepwd':
            //取得帳號
            acc=sess.auth[config['SESSROOT']].Account;
            //修改資料
            var db = require("../model/db");
            var config=require("../model/config");
            //建立 db connect
            db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
            db.useDB(config.AuthDBName);
            var updateHandler=function(result:any){
                var affectrows=(result['affectedRows']!=="undefined")?result['affectedRows']:0;
                //console.log(affectrows);
                if(affectrows >= 1)
                {
                    lib.doAlertReplaceRedir(res,'修改完成',webroot+'/users/pwd');return;
                }
                db.end();
            };
            if(acc!='')
            {
                var updateObj=new Object();
                updateObj['Password']=pwd;
                var w=new Array();
                w[w.length]="Account="+db.mysqlEscape(acc);
                db.updateSimpleQuery(config.AuthTable,updateObj,w,updateHandler);
            }
        break;
        case 'doChangepwd':
             //修改資料
            var db = require("../model/db");
            var config=require("../model/config");
            //建立 db connect
            db.connect(config.AuthDBHost,config.AuthDBUser,config.AuthDBPass,config.AuthDBPort);
            db.useDB(config.AuthDBName);
            var updateHandler=function(result:any){
                var affectrows=(result['affectedRows']!=="undefined")?result['affectedRows']:0;
                console.log(affectrows);
                if(affectrows >= 1)
                {
                    lib.doAlertReplaceRedir(res,'修改完成',fullURL);return;
                }
                db.end();
            };
            var updateObj=new Object();
            updateObj['Password']=pwd;
            var w=new Array();
            w[w.length]="Account="+db.mysqlEscape(acc);
            db.updateSimpleQuery(config.AuthTable,updateObj,w,updateHandler);
        break;
    }
};
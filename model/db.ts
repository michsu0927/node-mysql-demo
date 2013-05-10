declare function require(name:string);
var mysql = require('mysql');

var db;

export interface PurchaseLog {
    idx: number;
    uid: string;
    store: number;
    game_code: string;
    identifier: string;
    serial_no: number;
    item_name:string;
    price:number;
    result:number;
    id_receipt:string;
    status:string;
    raw_data:string;
    exchange_time:number;
    unit:string;
}

export function useDB(database:string){
	var sql="USE "+database;
	db.query(sql,function(err, results, fields){
	    
	    if(err)
	    { console.error(err); return; }

	});
}

export function dbQuery(sql:string,callback: (results:any) => void) {
    db.query(sql,function(err, results, fields){
	    
	    if(err)
	    { console.error(err); return; }

        if(typeof callback==="function")
        {
            callback(results);
        }
	});
}

export function getTotalRecords(TABLE:string,addWhere:any,callback: (results:any) => void) {
    var where=new Array();
    var s;
    if((typeof addWhere =='object')&&(addWhere.hasOwnProperty('length')))
    {
        if(addWhere.length>0)
        {
            where=where.concat(addWhere);
        }
    }
    var wherestr=(where.length>0)?'  WHERE  '+where.join('  AND '):'';

    var sql="SELECT count(*) as counts  FROM  `"+TABLE+"` as TB1  "+wherestr+" ";
    db.query(sql,function(err, results, fields){
        
        if(err)
        { console.error(err); console.error(sql);  return; }
        if(typeof callback==="function")
        {
            callback(results);
        }
        
    });
}

export function getSimpleQuery(TABLE:string,recordperpage:any,page:number,totalrecords:number,callback: (results:any) => void,addWhere:any,addOrder:any,addFields:any,keyfield:string,distinct:number) {
    if (typeof keyfield === "undefined") { keyfield = ''; }
    var where=new Array();
    var s;
    if((typeof addWhere =='object')&&(addWhere.hasOwnProperty('length')))
    {
        if(addWhere.length>0)
        {
            where=where.concat(addWhere);
        }
    }
    var wherestr=(where.length>0)?'  WHERE  '+where.join('  AND '):'';


    var order=new Array();
    s='';
    if((typeof addOrder =='object')&&(addOrder.hasOwnProperty('length')))
    {
        if(addOrder.length>0)
        {
            order=order.concat(addOrder);
        }
    }
    var orderstr=(order.length>0)?'    ORDER BY    '+order.join('  , '):'';

    var afields=new Array();
    s='';
    if((typeof addFields =='object')&&(addFields.hasOwnProperty('length')))
    {
        if(addFields.length>0)
        {
            afields=afields.concat(addFields);
        }
    }
    var fieldsstr=(afields.length>0)?'TB1.'+afields.join(',TB1.'):' TB1.* ';
    var re=new Array(); 
    if(totalrecords==0){  callback(re); }

    recordperpage=(recordperpage=='max')?totalrecords:recordperpage;

    recordperpage=((typeof recordperpage==="undefined")||(Math.abs(recordperpage)==0))?1 : Math.abs(recordperpage);

    

    var totalpage=Math.ceil( totalrecords / recordperpage );

    if( page > totalpage ) { page = totalpage; }
    var limit_offset = ((( page - 1 ) > 0)?( page - 1 ):0) * recordperpage;

    var D='';
        if(distinct==1)
        {
            D='distinct';
        }
    var sql="  SELECT  "+D+"  "+fieldsstr+"   FROM `"+TABLE+"`   as TB1  "+wherestr+"  "+orderstr+" LIMIT    "+limit_offset+" , "+recordperpage+" ";

    db.query(sql,function(err, results, fields){
        
        if(err)
        { console.error(err); console.error(sql);  return; }
        
        if((keyfield!='')&&(typeof keyfield==='string'))
        {
            if(typeof results[0][keyfield] !== "undefined" )
            {
                var len=0;var i;
                len=results.length;
                var r={};
                for(i=0;i<len;i++)
                {
                    r[results[i][keyfield]]={};
                    r[results[i][keyfield]]=results[i];
                }
                if(typeof callback === "function") {
                    callback(r);
                    return;
                }
            }
        }

        if(typeof callback==="function")
        {
            callback(results); return ;
        }

    });
}

export function insertSimpleQuery(TABLE:string,InserObj:any,callback: (results:any) => void){
    var k , v;
    var fieldarr=new Array();
    var valuearr=new Array();
    //console.log(InserObj);
    for( k in InserObj)
    {
        fieldarr[fieldarr.length]=k;
        //mysql.escape will add '' !!
        valuearr[valuearr.length]=mysql.escape(InserObj[k]);
    }
    //console.log(valuearr);
    var sql="INSERT INTO `"+TABLE+"` (`"+fieldarr.join("`,`")+"`) VALUES ( "+valuearr.join(",")+" ) ";
    //console.log( sql );
    db.query(sql,function(err, results, fields){
        
        if(err)
        { console.error(err); console.error(sql);  return; }

        if(typeof callback==="function")
        {
            callback(results);
        }
    });
}


export function updateSimpleQuery(TABLE:string,UpdateObj:any,addWhere:any,callback: (results:any) => void){
    var k , v ;
    var update=new Array();
    //mysql.escape will add '' !!
    for(k in UpdateObj)
    {
        update[update.length]="`"+k+"`=  "+mysql.escape(UpdateObj[k])+" ";
    }
    
    var where=new Array();
    var s;
    if((typeof addWhere =='object')&&(addWhere.hasOwnProperty('length')))
    {
        if(addWhere.length>0)
        {
            where=where.concat(addWhere);
        }
    }
    var wherestr=(where.length>0)?'  WHERE  '+where.join('  AND '):'';

    var sql="UPDATE `"+TABLE+"` SET "+update.join(",")+" "+wherestr;
    db.query(sql,function(err, results, fields){
        
        if(err)
        { console.error(err); console.error(sql);  return; }

        if(typeof callback==="function")
        {
            callback(results);
        }
    });
}


export function deletSimpleQuery(TABLE:string,addWhere:any,callback: (results:any) => void){
    
    var where=new Array();
    var s;

    if((typeof addWhere =='object')&&(addWhere.hasOwnProperty('length')))
    {
        if(addWhere.length>0)
        {
            where=where.concat(addWhere);
        }
    }

    var wherestr=(where.length>0)?'  WHERE  '+where.join('  AND '):'';

    var sql="DELETE FROM `"+TABLE+"` "+wherestr;

    db.query(sql,function(err, results, fields){
        
        if(err)
        { console.error(err); console.error(sql);  return; }

        if(typeof callback==="function")
        {
            callback(results);
        }
    });
}

export function mysqlEscape(str:string)
{
    return mysql.escape(str);
}

export function end(){
    db.end();
}
/*
        host:'mysqlhost',
        user: 'mysqluser',
        password: 'mysqlpwd',
        port:mysqlhostport
*/
export function connect(host:string,user:string,password:string,port:number){
    db=mysql.createConnection({
        host:host,
        user: user,
        password: password,
        port:port
    });

    db.connect(); 
}
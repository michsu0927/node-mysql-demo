var CFG=new Object();

CFG["LID_ADMIN"]='最高管理者';
CFG["LID_BOSS"]='主管使用者';
CFG["LID_USER"]='一般使用者';

export var permission=CFG;

export var  AuthObject:any;
AuthObject=new Object();
AuthObject["LID_USER"]=new Object();
AuthObject["LID_USER"]["user.js"]=new Object();
AuthObject["LID_USER"]["user.js"]['function']=new Array();
AuthObject["LID_USER"]["user.js"]['function']=['pwd'];
AuthObject["LID_USER"]["user.js"]['pwd']=new Array();
AuthObject["LID_USER"]["user.js"]['pwd']=['doSelfChangepwdForm','doSelfChangepwd'];

AuthObject["LID_ADMIN"]=new Object();
AuthObject["LID_ADMIN"]=new Object();
AuthObject["LID_ADMIN"]["user.js"]=new Object();
AuthObject["LID_ADMIN"]["user.js"]['function']=new Array();
AuthObject["LID_ADMIN"]["user.js"]['function']=['pwd'];
AuthObject["LID_ADMIN"]["user.js"]['pwd']=new Array();

AuthObject["LID_ADMIN"]["user.js"]['function']=['list','add','del','pwd'];
AuthObject["LID_ADMIN"]["user.js"]['pwd']=['doChangepwdForm','doSelfChangepwdForm','doSelfChangepwd','doChangepwd'];

export var MenuBlock;
MenuBlock=new Object();

MenuBlock["LID_USER"]='menu-user-left';
MenuBlock["LID_ADMIN"]='menu-admin-left';

export var MenuOption;
MenuOption=new Object();
MenuOption={'userManageClass':''};
MenuOption['IncomeClass']='';
MenuOption['PwdClass']='';
MenuOption['userAddClass']='';
MenuOption['ConsumeClass']='';

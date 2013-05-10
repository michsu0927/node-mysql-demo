/***********************************************************************
 * @filename            : inc/common.js
 * @author              : Ken Wang,Michael Hsu
 * @description         : javascript
 * @created             : 2012-05-22
 * @modified            : 2012-05-22
 * @requires            : inc/common.js
 ***********************************************************************/

/***** Detect Browser Capabilities *****/
var isDom = (document.getElementById) ? true:false;

/***** Generic Functions *****/
/* string manipulation */
function trim( String ) 
{
    if ( String == null )
    {
        return (false);
    }
    return String.replace( /(^\s+)|(\s+$)/g,"" );
}

/* jsCSS : mixed */
/*
swap, add, remove, check
http://www.onlinetools.org/articles/unobtrusivejavascript/cssjsseparation.html
*/
function jsCSS( action, obj, class1, class2 )
{
    switch( action )
    {
        case 'swap': // i.e. toggle
            obj.className = !jsCSS('check',obj,class1) ? 
                obj.className.replace( class2, class1 ) :
                obj.className.replace( class1, class2 );
            break;
        
        case 'add':
            if( !jsCSS('check',obj,class1) )
            { obj.className += obj.className ? ' '+class1 : class1; }
            break;
        
        case 'remove':
            var rep = obj.className.match(' '+class1) ? ' '+class1 : class1;
            obj.className = obj.className.replace( rep, '' );
            break;
        
        case 'check':
            return new RegExp('\\b'+class1+'\\b').test(obj.className);
            break;
    }   // end switch
}   // end jsCSS


/* Multiple Onloads */
/*
usage:
    addLoadEvent( nameOfSomeFunctionToRunOnPageLoad );
    addLoadEvent( function() { // more code to run on page load } );
*/
function addLoadEvent(func) 
{
    var oldonload = window.onload;
    if ( typeof window.onload != 'function' ) 
    {
        window.onload = func;
    } 
    else 
    {
        window.onload = function() 
        {
            oldonload();
            func();
        }
    }
}

/* multiple onsubmits for <form>s */
function addOnSubmitEvent(formObj, func)
{
    var oldonsubmit = formObj.onsubmit;
    if( typeof formObj.onsubmit != 'function' )
    {
        formObj.onsubmit = func;
    }
    else
    {
        form.obj.onsubmit = function()
        {
            oldonsubmit();
            func();
        }
    }
}


/* popup window */
function popWin( url, winame, wintype, override_extras ) 
{
    if( typeof wintype != "string" ) { wintype = ""; }
    switch( wintype )
    {
        case 'playMovie': extras = 'scrollbars=no,resizable=no,width=640,height=480,left=20,top=20,status=yes'; break;
        case 'doVote': extras = 'scrollbars=no,resizable=no,width=600,height=560,left=20,top=20,status=yes'; break;
        case 'doForward': extras = 'scrollbars=no,resizable=no,width=600,height=720,left=20,top=20,status=yes'; break;
        case 'showNote': extras = 'scrollbars=no,resizable=no,width=680,height=630,left=20,top=20,status=yes'; break;
        case 'playMusic': extras = 'scrollbars=no,resizable=no,width=240,height=100,status=yes'; break;
        case 'info': extras = 'scrollbars=no,resizable=no,width=600,height=580,status=yes'; break;
		case 'imagebrowser': extras = 'scrollbars=yes,resizable=no,width=705,height=500,status=yes'; break;
        case 'override': extras = override_extras; break;
        default: extras = 'scrollbars=yes,width=620,height=420,resizable=yes,status=yes';
    }
    var myPop = window.open( url, winame, extras );
	var ieversion,msie;
	msie=0;
	ieversion=0;
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		ieversion=new Number(RegExp.$1); // capture x.x portion and store as a number
		msie=1;
	}
	
	if((msie==0)||(ieversion>6))
	{
		myPop.focus();
	}
}


/* confirm action */
function confirmAction( url, msg )
{
    if( typeof msg != "string" )
    { msg = "Are you sure you want to proceed?"; }
    if( confirm( msg ) )
    { window.location = url; }
}


/***** Pagination *****/
function gotoPage( page_id, form_name )
{
    var formObj = document.forms[form_name];
    formObj.page.value = page_id;
    formObj.submit();
}
function orderPage( field, sort_dir, form_name )
{
    var formObj = document.forms[form_name];
    formObj.sort_dir.value = sort_dir;
    formObj.order_by.value = field;
    formObj.page.value = '1'; // always go back to page 1 upon sort/order
    formObj.submit();
}


/***** pre-select a Select Obj *****/
function preSelectByVal( selObj, val )
{
	var selOptionsCount = selObj.options.length;
	for( var i=0; i<selOptionsCount; i++ )
	{
		if( selObj.options[i].value == val )
		{ 
			selObj.options[i].selected = true;
			break;
		}
	}
}


/***** pre-check a Radio Obj *****/
function preCheckByVal( radioObj, val )
{
    for( var i=0; i<radioObj.length; i++ )
    { 
        if( radioObj[i].value == val ) 
        {
            radioObj[i].checked = true;
            break;
        }
    }
}


/***** Validator class *****/
var Validator = new Object();

/* regular expressions */
Validator.RE = new Object();
Validator.RE.email = /^[_\.0-9A-Za-z-]+@([0-9A-Za-z][0-9A-Za-z-]+\.)+[A-Za-z]{2,6}$/;
Validator.RE.tel = /^[0-9 \(\)\-]{6,16}$/;
Validator.RE.img_ext = /(\.jpg|\.JPG|\.gif|\.GIF|\.jpeg|\.JPEG)$/;
Validator.RE.audio_ext = /(\.wav|\.WAV|\.mp3|\.MP3)$/;

/* checkString : boolean */
Validator.checkString = function( str, min_len, max_len, chktype )
{
    if( typeof chktype != "string" ) { chktype = ""; }
    if( typeof str != "string" )
    { alert( "Validator.checkString error: non-string provided" ); return false; }
    // trim the string!
    str = trim( str );
    if( min_len == 0 && str.length == 0 ) { return true; }
    if( str.length < min_len ) { return false; }
    if( str.length > max_len ) { return false; }
    switch( chktype )
    {
        case 'email':
            return Validator.RE.email.test(str);
            break;
        
        case 'safe-ascii': // ascii chars except non-printing ones
            for( var i=0; i<str.length; i++ )
            { if( str.charCodeAt(i)>125 || str.charCodeAt(i)<32 ) return false; }
            break;
        
        case 'non-english':
            for( var i=0; i<str.length; i++ )
            { if( str.charCodeAt(i)<128 ) return false; }
            break;
            
        case 'tw-pid': // Personal ID (Taiwan)
            var c, n, i;
            var t = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
            var s = str;
            c = s.substring(0,1);
            c = t.indexOf(c.toUpperCase());
            if ((s.length!= 10) || (c<0)) return false;
            n = parseInt(c/10)+ c%10*9+ 1;
            for (var i=1; i<9; i++) n = n + parseInt(s.substring(i,i+1))* (9-i);
            n = (10- (n% 10))% 10;
            if (n != parseInt(s.substring(9,10))) return false;
            break;
        case 'time':
            var arr=str.splite(':');
            var numcheck = /\d/;
            i,j,k;
            if(arr.length != 2)
            {
                return false;
            }
            for(i=0;i<2;i++)
            {
                if(!arr[i].test(numcheck))
                {
                    return false;
                }
            }
        break;
        default: // only check length, which is done above
            break;
    }   // end switch
    return true;
}   // end Validator.checkString()

/* checkNumber : boolean */
Validator.checkNumber = function( num, min, max, chktype )
{
    if( isNaN(num) ) { return false; }
    switch( chktype )
    {
        case 'float':
            return ( num >= min && num <= max ); 
            break;
            
        case 'int':
        default:
            if( !(/^[0-9]+$/.test(num) ) ) { return false; }
            else { return ( num >= min && num <= max ); }
            break;
    }
    return true;
}


/***** Form Validation *****/
/*
grabs values from the "required" hidden field
*/
Validator.genericFormChecker = function( formObj )
{
    if( !isDom ) { return true; }
    // no "required" field specified
    if( !formObj.required ) return true;
    var warnings = "";
    // sample "required" field value="username,??,3,24|gender,?批|city|email,E-mail,10,128,email"
    var req_fields_arr = formObj.required.value.split("|");
    for( var i=0; i<req_fields_arr.length; i++ )
    {
        var field_params_arr = req_fields_arr[i].split(",");
        var field_name = field_params_arr[0];
        var field_label = (field_params_arr[1]) ? field_params_arr[1] : field_name;
        if( !formObj.elements[field_name] )
        { alert("Validator.genericFormChecker Error:\nNot a form element: "+field_name); }
        var ele = formObj.elements[field_name];
        // alert( field_name + " is of type: " + ele.type +", with "+ele.length+" sub elements." );
        // do things according to field type
        switch( ele.type )
        {
            case 'text':
            case 'textarea':
                var min_len = (field_params_arr[2]) ? field_params_arr[2] : 0;
                // max length is optional and will be derviced from "required" param, maxlength attribute or hard coded (216)
                var max_len = (field_params_arr[3]) ? field_params_arr[3] : (ele.maxLength) ? ele.maxLength : 216;
                var chktype = (field_params_arr[4]) ? field_params_arr[4] : ""; // eg. "email"
                if( chktype == "int" || chktype == "float" )
                {
                    if( !Validator.checkNumber( ele.value, min_len, max_len, chktype ) )
                    { warnings += "\n- " + field_label; }
                }
                else if( !Validator.checkString( ele.value, min_len, max_len, chktype ) )
                { warnings += "\n- " + field_label; }
                break;
            
            case 'select-one':
                // just check if selected value is empty or not
                // due to IE's inability to automatically fill-in "text" as the value when
                // none has been specified
                if( ele.options[ele.selectedIndex].value == "" && ele.selectedIndex == 0 )
                { warnings += "\n- " + field_label; }
                break;
            
            case 'select-multiple':
                // not sure what to check for just yet
                break;
            
            case 'checkbox':
                // if specified, must be checked
                if( !ele.checked )
                { warnings += "\n- " + field_label }
                break;
            
            case 'file':
                if( ele.value == "" )
                { warnings += "\n- " + field_label; }
                break;
            
            case 'password': // only check for length
                var min_len = (field_params_arr[2]) ? field_params_arr[2] : 0;
                // max length is optional and will be derviced from "required" param, maxlength attribute or hard coded (216)
                var max_len = (field_params_arr[3]) ? field_params_arr[3] : (ele.maxLength) ? ele.maxLength : 216;
                var chktype = (field_params_arr[4]) ? field_params_arr[4] : ""; // eg. "email"
                if( !Validator.checkString( ele.value, min_len, max_len, chktype ) )
                { warnings += "\n- " + field_label; }
                break;
            
            default: // most likely radio group
                // determine whether this is a group of radio buttons
                if( typeof ele.length != "undefined" && ele[0].type == "radio" )
                {   // there's more than one
                    var radio_checked = 0;
                    for( var j=0; j<ele.length; j++ )
                    { if( ele[j].checked ) { radio_checked++; } }
                    if( radio_checked < 1 )
                    { warnings += "\n- " + field_label; }
                }
        }   // end switch
    
    }   // end for
    if( warnings.length > 1 )
    {
        alert( "Please make sure the following fields are correct:\n" + warnings );
        return false;
    }
    return confirm( "Are you sure you wish to proceed?" );
    
}

/*
attach form checkers
according to the "name" attribute specified
*/
Validator.attachFormCheckers = function()
{
    if( !isDom ) return;
    var formObjs = document.getElementsByTagName( "form" );
    for( var i=0; i<formObjs.length; i++ )
    {
        switch( formObjs[i].name )
        {
            /*
            case 'dashboardIssueListForm':
                addOnSubmitEvent( formObjs[i], function(){this.page.value=''; return Dashboard.listIssues(this)} );
                break;
            */
            default: // attach generic form checker
                if( formObjs[i].elements['required'] )
                { addOnSubmitEvent( formObjs[i], function(){return Validator.genericFormChecker(this)} ); }
                break;
        }
    }
}


/***** checkMovieUploadForm *****/
// public void (submits form on success)
function checkMovieUploadForm()
{
    var formObj = document.forms['movieUploadForm'];
    var warn = new Array();
    
    // prevent twitchy fingers from double sending
    if( typeof uploading == 'boolean' )
    {
        var time_now = new Date();
        var time_elapsed = upload_started - time_now; // milliseconds
        if( uploading == true && time_elapsed < 10000 ) // 10 sec
        { alert('傳送中，請稍後。'); return; }
    }
    
    
    if( !Validator.checkString( formObj.user_nickname.value, 2, 8 ) )
    { warn[warn.length] = "自己的暱稱"; }
    //if( !Validator.checkString( formObj.user_nickname_mum.value, 2, 8 ) )
    //{ warn[warn.length] = "媽咪的暱稱"; }
    if( !Validator.checkString( formObj.movie_title.value, 2, 20 ) )
    { warn[warn.length] = "創意風格標題"; }
    if( !Validator.checkString( formObj.movie_msg.value, 10, 600 ) )
    { warn[warn.length] = "文章內容(10-600字)"; }
    
    if( warn.length > 0 )
    {
        alert( '請修正下列欄位:\n\n- ' + warn.join("\n- ") );
        return false; 
    }
    
    // movie settings
    if( formObj.movie_mode_switch[0].checked )
    {   // preset movies
        if( !(formObj.movie_mode[0].checked) && !(formObj.movie_mode[1].checked) )
        { alert( '請選擇一個預設的風格小電影。' ); return; }
    }
    else if( formObj.movie_mode_switch[1].checked )
    {   // custom made movie
        if( !Validator.checkString( formObj.movie_custom_title.value, 2, 20 ) )
        { alert( '請填寫小電影標題。' ); return; }
        // pics must be gif/jpg and first 3 must be filled
        for( var i=1; i<=5; i++ )
        {
            if( !Validator.RE.img_ext.test( formObj.elements['pic_'+i].value ) )
            {
                if( i<=3 )
                { alert( '至少要上傳三張圖檔哦！' ); return; }
                else if( formObj.elements['pic_'+i].value != '' )
                { alert( '只接受 GIF 或 JPG 圖檔喔！' ); return; }
            }
            else
            {   // image file selected, check if caption is valid
                if( formObj.elements['caption_'+i].value == default_caption )
                { alert( '每張圖都要填寫創意風格文字分享哦！' ); return; }
            }
        }
        // music
       if( !formObj.movie_music[0].checked && 
           !formObj.movie_music[1].checked &&
            !formObj.movie_music[2].checked &&
            !formObj.movie_music[3].checked &&
            !formObj.movie_music[4].checked )
        { alert( '請選擇配樂' ); return; }
       // upload audio file
        //if( formObj.music_file.value != '' && !Validator.RE.audio_ext.test(formObj.music_file.value) )
       // {   // trying to upload invalid audio file
        //    alert( '只接受 WAV 或 MP3 的聲音檔案哦！' ); return;
       // }
    }
    else
    {   // didn't pick a movie_mode, bad boy
        alert('請選擇分享創意風格的方式。');
        return;
    }
    
    // personal details
    if( !Validator.checkString( formObj.user_name.value, 2, 8 ) )
    { warn[warn.length] = "姓名"; }
    if( !formObj.user_gender[0].checked && !formObj.user_gender[1].checked )
    { warn[warn.length] = "性別"; }
    if( formObj.user_birthday_y.selectedIndex == 0 ||
        formObj.user_birthday_m.selectedIndex == 0 ||
        formObj.user_birthday_d.selectedIndex == 0 )
    { warn[warn.length] = "出生年月日"; }
    if( formObj.user_job.selectedIndex == 0 )
    { warn[warn.length] = "職業"; }
    if( formObj.user_income.selectedIndex == 0 )
    { warn[warn.length] = "平均月收入"; }
    if( !Validator.checkString( formObj.user_email.value, 10, 128, 'email' ) )
    { warn[warn.length] = "E-Mail"; }
    if( !Validator.RE.tel.test( formObj.user_tel.value ) )
    { warn[warn.length] = "主要聯絡電話 (限半形數字)"; }
    if( !Validator.RE.tel.test( formObj.user_tel2.value ) )
    { warn[warn.length] = "備用聯絡電話 (限半形數字)"; }
    if( !Validator.checkString( formObj.user_address.value, 5, 64 ) )
    { warn[warn.length] = "地址"; }
    if( formObj.refer_info.selectedIndex == 0 )
    { warn[warn.length] = "您從何得知此活動"; }
   
    if( warn.length > 0 )
    {
        alert( '請修正下列欄位:\n\n- ' + warn.join("\n- ") );
        return false; 
    }
    
    if( confirm("確定要送出資料?\n(請注意:上傳圖片需要一段時間，請勿重複送出或中止傳輸，謝謝)") ) 
    {   // set uploading boolean value and upload_started time
        uploading = true;
        upload_started = new Date();
        // change submit_button src
        if( typeof submit_uploading_img == 'object' )
        { document.getElementById('submit_button').src = submit_uploading_img.src; }
        formObj.submit();
    }
}   // end checkMovieUploadForm



/***** checkForward *****/
// public void (submits form on success)
function checkForward()
{
    var formObj = document.forms['forwardForm'];
    var warnings = "";
    if( !Validator.checkString( formObj.sender_name.value, 1, 8 ) )
    { warnings+= "\n- 我的名字"; }
    if( !Validator.checkString( formObj.sender_email.value, 10, 128, 'email' ) )
    { warnings+= "\n- 我的E-Mail"; }
    
    if( warnings.length > 0 )
    { alert( "請正確填寫下列欄位:\n"+warnings ); return; }
    
    var valid_friends = 0;
    for( var i=1; i<=5; i++ )
    {
        var fNameObj = formObj.elements['friend_name_'+i];
        var fEmailObj = formObj.elements['friend_email_'+i];
        
        if( fNameObj.value.length == 0 ) continue;
        if( !Validator.checkString( fEmailObj.value, 10, 128, 'email' ) )
        { warnings+= "\n- 第"+i+"位朋友的 E-Mail 格式錯了哦~!"; }
        else { valid_friends++; }
    }
    if( warnings.length > 0 )
    { alert( "請正確填寫下列欄位:\n"+warnings ); return; }
    
    if( valid_friends == 0 )
    { alert( "至少要填寫一位朋友的名字與 E-Mail 哦~" ); return; }
    
    if( confirm("確定要送出資料?") ) formObj.submit();
}   // end checkForward


/***** XML HTTP Requests (AJAX) *****/
var XHR = new Object();
XHR.constants = new Object();
XHR.constants.target = "xmlhttprequest.php";
XHR.requester = null;
/* 
public boolean
initialises XML-HTTP-Request
*/
XHR.init = function()
{
    try
    {
        XHR.requester = new XMLHttpRequest();
    }
    catch (error)
    {
        try
        {
            XHR.requester = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (error)
        {
            return false;
        }
    }
    return true;
}

/*
public void
stop running connections
*/
XHR.halt = function()
{
    if( XHR.requester != null &&
        XHR.requester.readState != 0 &&
        XHR.requester.readyState != 4 )
    { XHR.requester.abort(); }
}

/***** admin:toggleSendtest *****/
XHR.toggleConsiderTeam = function( checkboxObj )
{
    XHR.halt();
    if( !XHR.init() )
    { alert("無法啟用 XML HTTP Request"); return; }
    var mode = checkboxObj.checked ? 'consider_team':'ignore_team';
    XHR.requester.open( "GET", "admin.php?mode="+mode+"&team_id="+checkboxObj.value );
    XHR.requester.send( null );
    XHR.requester.onreadystatechange = function()
    {
        if( XHR.requester.readyState == 4 )
        {
            //alert( "XHR.requester.status: " + XHR.requester.status);
            if( XHR.requester.status == 200 )
            {   // success
                var trObj =  document.getElementById('tr_team_'+checkboxObj.value );
                var trObj2 = document.getElementById('tr_team_'+checkboxObj.value+'b' );
                if( trObj )
                { 
                    var css_action = (mode=='consider_team') ? 'add':'remove';
                    jsCSS( css_action, trObj, 'consider-team' );
                    jsCSS( css_action, trObj2, 'consider-team' );
                    alert( XHR.requester.responseText );
                }
                else
                { alert( "怪怪的哦... 找不到顯示結果的欄位(sendtest_"+checkboxObj.value+")!" ); }
                return;
            }
            else
            {   // failed
                alert( "錯誤: 無法執行!" );
                return;
            }
        }
    }
}

function addFlashObj( s_src, i_width, i_height, a_params )
{
    var new_params = new Array();
    var new_embed_params = new Array();
    if( typeof a_params != "undefined" )
    {
        for( var i=0; i<a_params.length; i++ )
        {
            var param_bits = a_params[i].split('|');
            var param_name = param_bits[0];
            var param_value = param_bits[1];
            new_params[new_params.length] = '<param name="' +param_name+ '" value="' +param_value+ '" />';
            new_embed_params[new_embed_params.length] = param_name+'="' +param_value+ '"';
        }
    }
    var obj_html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="' +i_width+ '" height="' +i_height+ '">'+
    '<param name="movie" value="' +s_src+ '" />'+ 
    new_params.join('') +
    '<embed src="' +s_src+ '" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="' +i_width+ '" height="' +i_height+ '" ' +new_embed_params.join(' ')+ '></embed>'+
    '</object>';
    document.write( obj_html );
}


// sample call: addMediaPlayerObj( 'some.mp3', 200, 100, ['autoStart|1',''], 'musicObj' );
// for more params: http://www.mioplanet.com/rsc/embed_mediaplayer.htm
function addMediaPlayerObj( s_src, i_width, i_height, a_params, s_id )
{
    var new_params = new Array();
    var new_embed_params = new Array();
    if( typeof a_params != "undefined" )
    {
        for( var i=0; i<a_params.length; i++ )
        {
            var param_bits = a_params[i].split('|');
            var param_name = param_bits[0];
            var param_value = param_bits[1];
            new_params[new_params.length] = '<param name="' +param_name+ '" value="' +param_value+ '" />';
            new_embed_params[new_embed_params.length] = param_name+'="' +param_value+ '"';
        }
    }
    var obj_html = '<object id="'+s_id+'" width="'+i_width+'" height="'+i_height+'" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6">'+
    '<param name="URL" value="' +s_src+ '" />'+
    new_params.join('') +
    '<embed src="' +s_src+ '" type="video/x-ms-wmv" width="'+i_width+'" height="'+i_height+'" '+new_embed_params.join(' ')+'></embed>'+
    '</object>';
    document.write( obj_html );
}


/*****  *****/
Content_Ary = new Array("A", "B", "C", "D", "E");
Content_sub_Ary = new Array(5);
//A
Content_sub_Ary[0] = new Array("1A","2A","3A","4A","5A","6A");
//B
Content_sub_Ary[1] = new Array("1B","2B","3B","4B");
//C
Content_sub_Ary[2] = new Array("1C","2C","3C","4C","5C");
//D
Content_sub_Ary[3] = new Array("1D","2D","3D","4D","5D","6D");
//E
Content_sub_Ary[4] = new Array("1E","2E");


Reply_Ary = new Array(5);
//A
Reply_Ary[0] = new Array("1A-------\r\n\r\n-------1A"
						,"2A-------\r\n\r\n-------2A"
						,"3A-------\r\n\r\n-------3A"
						,"4A-------\r\n\r\n-------4A"
						,"5A-------\r\n\r\n-------5A"
						,"6A-------\r\n\r\n-------6A");
//B
Reply_Ary[1] = new Array("1B-------\r\n\r\n-------1B"
						,"2B-------\r\n\r\n-------2B"
						,"3B-------\r\n\r\n-------3B"
						,"4B-------\r\n\r\n-------4B");
//C                                        
Reply_Ary[2] = new Array("1C-------\r\n\r\n-------1C"
						,"2C-------\r\n\r\n-------2C"
						,"3C-------\r\n\r\n-------3C"
						,"4C-------\r\n\r\n-------4C"
						,"5C-------\r\n\r\n-------5C");
//D
Reply_Ary[3] = new Array("1D-------\r\n\r\n-------1D"
						,"2D-------\r\n\r\n-------2D"
						,"3D-------\r\n\r\n-------3D"
						,"4D-------\r\n\r\n-------4D"
						,"5D-------\r\n\r\n-------5D"
						,"6D-------\r\n\r\n-------6D");
//E
Reply_Ary[4] = new Array("1E-------\r\n\r\n-------1E"
						,"1E-------\r\n\r\n-------2E");
                             

function Init_Content(ContentInput)
{
	ContentInput.length = Content_Ary.length;
	var inxdnumber = 0;
	for (i = 0; i < Content_Ary.length; i++) 
	{
		ContentInput.options[i].value = Content_Ary[i];
		ContentInput.options[i].text = Content_Ary[i];
	}
	ContentInput.selectedIndex = inxdnumber;
}

function Change_Sub(ContentInput, SubInput, ReplyOutput) 
{
	selectedContentIndex = ContentInput.selectedIndex;

	SubInput.length = Content_sub_Ary[selectedContentIndex].length;
	for (i = 0; i < Content_sub_Ary[selectedContentIndex].length; i++) 
	{
		SubInput.options[i].value = Content_sub_Ary[selectedContentIndex][i];
		SubInput.options[i].text = Content_sub_Ary[selectedContentIndex][i];
		if (SubInput.options[i].text == "")
			SubInput.options[i].selected = true;
	}
	SubInput.selectedIndex = 0;	

	Output_Reply(ContentInput, SubInput, ReplyOutput);
}

function Output_Reply(ContentInput, SubInput, ReplyOutput)
{
	ReplyOutput.value = Reply_Ary[ContentInput.selectedIndex][SubInput.selectedIndex];
}

function Initiate_R(ContentInput, SubInput, ReplyOutput)
{ 	
	Init_Content(ContentInput);
	Change_Sub(ContentInput, SubInput, ReplyOutput);
}
/*
function DefaultSelected_R(ContentText,SubText,ContentInput,SubInput,ReplyOutput){
	var ContentInputIndex,SubInputIndex;
	for(i=0;i<Content_Ary.length;i++){
		if (Content_Ary[i] == ContentText ){
			ContentInputIndex = i ;
			break;
		}
	}
	ContentInput.selectedIndex = ContentInputIndex;
	Change_Sub(ContentInput, SubInput, ReplyOutput);
	for(j=0;j<Content_sub_Ary[CityInputIndex].length;j++){
		if (Content_sub_Ary[SubInput][j] == SubText ){
			SubInputIndex = j ;
			break;
		}
	}	
	SubInput.selectedIndex = SubInputIndex;
	Output_ZipCode(ContentInput, SubInput, ReplyOutput);
}
*/

/*****  *****/
City_Ary =new Array("------","臺北市", "基隆市", "臺北縣", "宜蘭縣", "新竹市", "新竹縣", 
                     "桃園縣", "苗栗縣", "臺中市", "臺中縣", "彰化縣", "南投縣", 
                     "嘉義市", "嘉義縣", "雲林縣", "臺南市", "臺南縣", "高雄市",
                     "高雄縣", "澎湖縣", "屏東縣", "臺東縣", "花蓮縣", "金門縣",
                     "連江縣");
Canton_Ary =new Array();

Canton_Ary[0]=new Array("-------");
//臺北市
Canton_Ary[1] =  new Array("臺北市全區","中正區","大同區","中山區","松山區","大安區","萬華區","信義區",
                          "士林區","北投區","內湖區","南港區","文山區(木柵)","文山區(景美)");
//基隆市
Canton_Ary[2] =  new Array("基隆市全區","仁愛區","信義區","中正區","中山區","安樂區","暖暖區","七堵區");
//臺北縣
Canton_Ary[3] =  new Array("臺北縣全區","萬里鄉","金山鄉","板橋市","汐止鎮","深坑鄉","石碇鄉","瑞芳鎮",
                          "平溪鄉","雙溪鄉","貢寮鄉","新店市","坪林鄉","烏來鄉","永和市",
                          "中和市","土城市","三峽鎮","樹林市","鶯歌鎮","三重市","新莊市",
                          "泰山鄉","林口鄉","蘆洲市","五股鄉","八里鄉","淡水鎮","三芝鄉",
                          "石門鄉");
//宜蘭縣
Canton_Ary[4] =  new Array("宜蘭縣全區","宜蘭市","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","羅東鎮","三星鄉",
                          "大同鄉","五結鄉","冬山鄉","蘇澳鎮","南澳鄉");
//新竹市
Canton_Ary[5] =  new Array("新竹市全區");
//新竹縣
Canton_Ary[6] =  new Array("新竹縣全區","竹北市","湖口鄉","新豐鄉","新埔鄉","關西鎮","芎林鄉","寶山鄉",
                          "竹東鎮","五峰鄉","橫山鄉","尖石鄉","北埔鄉","峨嵋鄉");
//桃園縣
Canton_Ary[7] =  new Array("桃園縣全區","中壢市","平鎮","龍潭鄉","楊梅鎮","新屋鄉","觀音鄉","桃園市",
                          "龜山鄉","八德市","大溪鎮","復興鄉","大園鄉","蘆竹鄉");
//苗栗縣
Canton_Ary[8] =  new Array("苗栗縣全區","竹南鎮","頭份鎮","三灣鄉","南庄鄉","獅潭鄉","後龍鎮","通霄鎮",
                          "苑裡鎮","苗栗市","造橋鄉","頭屋鄉","公館鄉","大湖鄉","泰安鄉",
                          "鉰鑼鄉","三義鄉","西湖鄉","卓蘭鄉");
//臺中市
Canton_Ary[9] =  new Array("臺中市全區","中區","東區","南區","西區","北區","北屯區","西屯區","南屯區");
//臺中縣
Canton_Ary[10] =  new Array("臺中縣全區","太平市","大里市","霧峰鄉","烏日鄉","豐原市","后里鄉","石岡鄉",
                          "東勢鎮","和平鄉","新社鄉","潭子鄉","大雅鄉","神岡鄉","大肚鄉",
                          "沙鹿鎮","龍井鄉","梧棲鎮","清水鎮","大甲鎮","外圃鄉","大安鄉");
//彰化縣
Canton_Ary[11] =  new Array("彰化縣全區","彰化市","芬園鄉","花壇鄉","秀水鄉","鹿港鎮","福興鄉","線西鄉",
                           "和美鎮","伸港鄉","員林鎮","社頭鄉","永靖鄉","埔心鄉","溪湖鎮",
                           "大村鄉","埔鹽鄉","田中鎮","北斗鎮","田尾鄉","埤頭鄉","溪州鄉",
                           "竹塘鄉","二林鎮","大城鄉","芳苑鄉","二水鄉");
//南投縣
Canton_Ary[12] =  new Array("南投縣全區","南投市","中寮鄉","草屯鎮","國姓鄉","埔里鎮","仁愛鄉","名間鄉",
                           "集集鄉","水里鄉","魚池鄉","信義鄉","竹山鎮","鹿谷鄉");
//嘉義市
Canton_Ary[13] =  new Array("嘉義市全區");
//嘉義縣
Canton_Ary[14] =  new Array("嘉義縣全區","番路鄉","梅山鄉","竹崎鄉","阿里山鄉","中埔鄉","大埔鄉","水上鄉",
                           "鹿草鄉","太保市","朴子市","東石鄉","六腳鄉","新港鄉","民雄鄉",
                           "大林鎮","漢口鄉","義竹鄉","布袋鎮");
//雲林縣
Canton_Ary[15] =  new Array("雲林縣全區","斗南市","大埤鄉","虎尾鎮","土庫鎮","褒忠鄉","東勢鄉","臺西鄉",
                           "崙背鄉","麥寮鄉","斗六市","林內鄉","古坑鄉","莿桐鄉","西螺鎮",
                           "二崙鄉","北港鎮","水林鄉","口湖鄉","四湖鄉","元長鄉");
//臺南市
Canton_Ary[16] =  new Array("臺南市全區","中區","東區","南區","西區","北區","安平區","安南區");
//臺南縣
Canton_Ary[17] =  new Array("臺南縣全區","永康市","歸仁鄉","新化鎮","左鎮鄉","玉井鄉","楠西鄉","南化鄉",
                           "仁德鄉","關廟鄉","龍崎鄉","官田鄉","麻豆鎮","佳里鎮","西港鄉",
                           "七股鄉","將軍鄉","學甲鎮","北門鄉","新營市","後壁鄉","白河鎮",
                           "東山鄉","六甲鄉","下營鄉","柳營鄉","鹽水鎮","善化鎮","大內鄉",
                           "山上鄉","新市鄉","安定鄉");
//高雄市
Canton_Ary[18] =  new Array("高雄市全區","新興區","前金區","苓雅區","鹽埕區","鼓山區","旗津區","前鎮區",
                           "三民區","楠梓區","小港區","左營區");
//高雄縣
Canton_Ary[19] =  new Array("高雄縣全區","仁武鄉","大社鄉","岡山鎮","路竹鄉","阿蓮鄉","田寮鄉","燕巢鄉",
                           "橋頭鄉","梓官鄉","彌陀鄉","永安鄉","湖內鄉","鳳山市","大寮鄉",
                           "林園鄉","鳥松鄉","大樹鄉","旗山鎮","美濃鎮","六龜鄉","內門鄉",
                           "杉林鄉","甲仙鄉","桃源鄉","三民鄉","茂林鄉","茄萣鄉");
//澎湖縣
Canton_Ary[20] =  new Array("澎湖縣全區","馬公市","西嶼鄉","望安鄉","七美鄉","白沙鄉","湖西鄉");
//屏東縣
Canton_Ary[21] =  new Array("屏東縣全區","屏東市","三地門鄉","霧臺鄉","瑪家鄉","九如鄉","里港鄉","高樹鄉",
                           "鹽埔鄉","長治鄉","麟洛鄉","竹田鄉","內埔鄉","萬丹鄉","潮州鎮",
                           "泰武鄉","來義鄉","萬巒鄉","嵌頂鄉","新埤鄉","南州鄉","林邊鄉",
                           "東港鎮","琉球鄉","佳冬鄉","新園鄉","枋寮鄉", "枋山鄉","春日鄉",
                           "獅子鄉","車城鄉","牡丹鄉","恆春鎮","滿州鄉");
//臺東縣
Canton_Ary[22] =  new Array("臺東縣全區","臺東市","綠島鄉","蘭嶼鄉","延平鄉","卑南鄉","鹿野鄉","關山鎮",
                           "海端鄉","池上鄉","東河鄉","成功鎮","長濱鄉","太麻里鄉","金峰鄉",
                           "大武鄉","達仁鄉");
//花蓮縣
Canton_Ary[23] =  new Array("花蓮縣全區","花蓮市","新城鄉","秀林鄉","吉安鄉","壽豐鄉","鳳林鎮","光復鄉",
                           "豐濱鄉","瑞穗鄉","萬榮鄉","玉里鎮","卓溪鄉","富里鄉");
//金門縣
Canton_Ary[24] =  new Array("金門縣全區","金沙鎮","金湖鎮","金寧鄉","金城鎮","烈嶼鄉","烏坵鄉");
//連江縣
Canton_Ary[25] =  new Array("連江縣全區","南竿鄉","北竿鄉","莒光鄉","東引");

ZipCode_Ary =new Array();

ZipCode_Ary[0]=new Array("");
//?箏?撣?
ZipCode_Ary[1]=new Array("All1","100","103","104","105","106","108","110","111","112","114","115"
					,"116","117"
					);

//?粹?撣?
ZipCode_Ary[2]=new Array("All2","200","201","202","203","204","205","206"
						);

//?箏?蝮?
ZipCode_Ary[3]=new Array("All3","207","208","220","221","222","223","224","226"
						,"227","228","231","232","233","234","235","236","237"
						,"238","239","241","242","243","244","247","248","249"
						,"251","252","253"
						);

//摰蝮?
ZipCode_Ary[4]=new Array("All4","260","261","262","263","264","265","266","267","268"
					,"269","270","272");

//?啁姘撣?
ZipCode_Ary[5]=new Array("300");

//?啁姘蝮?
ZipCode_Ary[6]=new Array("All6","302","303","304","305","306","307","308","310","311"
					,"312","313","314","315");


//獢?蝮?
ZipCode_Ary[7]=new Array("All7","320","324","325","326","327","328","330","333","334"
					,"335","336","337","338");


//??蝮?
ZipCode_Ary[8]=new Array("All8","350","351","352","353","354","356","357","358","360"
					,"361","362","363","364","365","366","367","368","369"
					);

//?箔葉撣?
ZipCode_Ary[9]=new Array("All9","400","401","402","403","404","406","407","408");

//?箔葉蝮?
ZipCode_Ary[10]=new Array("All10","411","412","413","414","420","421","422","423","424"
					,"426","427","428","429","432","433","434","435","436","437","438","439");



//敶啣?蝮?
ZipCode_Ary[11]=new Array("All11","500","502","503","504","505","506","507","508","509"
					,"510","511","512","513","514","515","516","520","521","522"
					,"523","524","525","526","527","528","530");

//??蝮?
ZipCode_Ary[12]=new Array("All12","540","541","542","544","545","546","551","552","553"
					,"555","556","557","558");

//?儔撣?
ZipCode_Ary[13] =  new Array("600");

//?儔蝮?
ZipCode_Ary[14]=new Array("All14","602","603","604","605","606","607","608","611","612"
				,"613","614","615","616","621","622","623","624","625");


//?脫?蝮?
ZipCode_Ary[15]=new Array("All15","630","631","632","633","634","635","636","637","638"
					,"640","643","646","647","648","649","651","652","653","654"
					,"655");

//?箏?撣?
ZipCode_Ary[16]=new Array("All16","700","701","702","703","704","708","709");

//?箏?蝮?
ZipCode_Ary[17]=new Array("All17","710","711","712","713","714","715","716","717","718"
					,"719","720","721","722","723","724","725","726","727","730"
					,"731","732","733","734","735","736","737","741","742","743"
					,"744","745");



//擃?撣?
ZipCode_Ary[18]=new Array("All18","800","801","802","803","804","805","806","807","811","812","813");


//擃?蝮?
ZipCode_Ary[19]=new Array("All19","814","815","820","821","822","823","824","825","826","827"
					,"828","829","830","831","832","833","840","842","843","844","845"
					,"846","847","848","849","851","852");




//瞉?蝮?
ZipCode_Ary[20]=new Array("All20","880","881","882","883","884","885");


//撅蝮?
ZipCode_Ary[21]=new Array("All21","900","901","902","903","904","905","906","907","908","909"
					,"911","912","913","920","921","922","923","924","925","926"
					,"927","928","929","931","932","940","941","942","943","944","945"
					,"946","947");





//?箸蝮?
ZipCode_Ary[22]=new Array("All22","950","951","952","953","954","955","956","957","958"
					,"959","961","962","963","964","965","966"
					);



//?梯蝮?
ZipCode_Ary[23]=new Array("All23","970","971","972","973","974","975","976","977","978"
					,"979","981","982","983");




//??蝮?
ZipCode_Ary[24]=new Array("All24","890","891","892","893","894","896");

//???蝮?
ZipCode_Ary[25]=new Array("All25","209","210","211","212");

function Init_City(CityInput)
{
	CityInput.length = City_Ary.length;
	var inxdnumber = 0;
	for (i = 0; i < City_Ary.length; i++) 
	{
		CityInput.options[i].value = City_Ary[i];
		CityInput.options[i].text = City_Ary[i];
	}
	CityInput.selectedIndex = inxdnumber;
}

function Change_Canton(CityInput, CantonInput, ZipcodeOutput) 
{
	selectedCountyIndex = CityInput.selectedIndex;

	CantonInput.length = Canton_Ary[selectedCountyIndex].length;
	for (i = 0; i < Canton_Ary[selectedCountyIndex].length; i++) 
	{
		CantonInput.options[i].value = Canton_Ary[selectedCountyIndex][i];
		CantonInput.options[i].text = Canton_Ary[selectedCountyIndex][i];
		if (CantonInput.options[i].text == "")
			CantonInput.options[i].selected = true;
	}
	CantonInput.selectedIndex = 0;	

	Output_ZipCode(CityInput, CantonInput, ZipcodeOutput);
}
function Change_Canton0(CityInput, CantonInput) 
{
	selectedCountyIndex = CityInput.selectedIndex;

	CantonInput.length = Canton_Ary[selectedCountyIndex].length;
	for (i = 0; i < Canton_Ary[selectedCountyIndex].length; i++) 
	{
		CantonInput.options[i].value = Canton_Ary[selectedCountyIndex][i];
		CantonInput.options[i].text = Canton_Ary[selectedCountyIndex][i];
		if (CantonInput.options[i].text == "")
			CantonInput.options[i].selected = true;
	}
	CantonInput.selectedIndex = 0;	

	//Output_ZipCode(CityInput, CantonInput, ZipcodeOutput);
}
function Output_ZipCode(CityInput, CantonInput, ZipcodeOutput) 
{
	ZipcodeOutput.value = ZipCode_Ary[CityInput.selectedIndex][CantonInput.selectedIndex];
}

function Initiate(CityInput, CantonInput, ZipcodeOutput)
{ 	
	Init_City(CityInput);
	Change_Canton(CityInput, CantonInput, ZipcodeOutput);
}
function Initiate0(CityInput, CantonInput)
{ 	
	Init_City(CityInput);
	Change_Canton0(CityInput, CantonInput);
}

function DefaultSelected(CityText,CantonText,CityInput,CantonInput,ZipcodeOutput){
	var CityInputIndex,CantonInputIndex;
	for(i=0;i<City_Ary.length;i++){
		if (City_Ary[i] == CityText ){
			CityInputIndex = i ;
			break;
		}
	}
	CityInput.selectedIndex = CityInputIndex;
	Change_Canton(CityInput, CantonInput, ZipcodeOutput);
	for(j=0;j<Canton_Ary[CityInputIndex].length;j++){
		if (Canton_Ary[CityInputIndex][j] == CantonText ){
			CantonInputIndex = j ;
			break;
		}
	}	
	CantonInput.selectedIndex = CantonInputIndex;
	Output_ZipCode(CityInput, CantonInput, ZipcodeOutput);
}



function ChangeMozOpacity(imageObj,num)
{
	var browser=navigator.appName;
	if (browser =='Netscape')
	{
		imageObj.style.MozOpacity = (num / 100);
	}
	else
	{
		imageObj.filters.alpha.opacity=num;
	}
}

function getElementsByClassName(className, tag, elm){
	var testClass = new RegExp("(^|\\\\s)" + className + "(\\\\s|$)");
	var tag = tag || "*";
	var elm = elm || document;
	var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
	var returnElements = [];
	var current;
	var length = elements.length;
	for(var i=0; i<length; i++){
		current = elements[i];
		if(testClass.test(current.className)){
			returnElements.push(current);
		}
	}
	return returnElements;
}

function preload_images() {
	var preloaded = new Array();
	    var hbody=document.getElementsByTagName("body");
	    //alert(hbody[0]);
	    for (var i = 0; i < arguments.length; i++){
	        preloaded[i] = document.createElement('img');
	        preloaded[i].setAttribute('src',arguments[i]);
	        preloaded[i].setAttribute('height',0);
	        preloaded[i].setAttribute('width',0);
	        preloaded[i].setAttribute('border',0);
	        preloaded[i].setAttribute('padding',0);        
	        preloaded[i].setAttribute('margin',0);
            preloaded[i].setAttribute('style','width:0px;height:0px;border:0px;margin:0px;padding:0px;display:block;');
	    };
	    var len=preloaded.length;
	    for (i=0;i<len;i++)
	    {
	        hbody[0].appendChild(preloaded[i]);
	    }
}
	
/***** Codes to run on body onload *****/
//addLoadEvent( Validator.attachFormCheckers );


/***** Codes to run on body onload *****/
//addLoadEvent( Validator.attachFormCheckers );


//javascript js set cookie
function setCookie(n,str)
{
   var now=new Date( );
   now.setTime( now.getTime( ) + 1000 * 60 * 10 );
   document.cookie=n+"="+encodeURI(str)+";expires=" + now.toGMTString( )
}

//javascript js unset cookie
function unsetCookie(n,str)
{
	var now=new Date( );
	now.setTime( now.getTime( ) - 1000 * 60 * 10 );
	document.cookie=n+"="+encodeURI(str)+";expires=" + now.toGMTString( )
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
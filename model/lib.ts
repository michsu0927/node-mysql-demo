declare function require(name:string);
export function redirJS(res:any,redir_url:string=''){
	var html='';
	html = '<script language="javascript" type="text/javascript">';
    html +=(typeof redir_url==="string") ? 'window.location.href="'+redir_url+'";':'';
    html +='</script>';
	res.send(html);
}

export function getReplaceAlertJs(msg:string,redir_url:string=''){
	var html = '<script language="javascript" type="text/javascript">';
    html += 'alert("'+msg+'");';
    html += (typeof redir_url==="string") ? 'window.location.replace("'+redir_url+'");':'';
    html += '</script>';
    return html;
}

export function doAlertReplaceRedir( res:any,msg:string,redir_url:string='' ){
	var html='';
	html='<html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" ></head><body>';
    html+=this.getReplaceAlertJs( msg, redir_url );
    html+='<noscript><a href="' +redir_url+'">Your browser does not have JavaScript enabled.</a></noscript>';
    html+='</body></html>';
	res.send(html);
}

export function ReplaceRedirJs(  res:any,redir_url:string=''  )
{
    var html = '<script language="javascript" type="text/javascript">    ';
    html += (typeof redir_url==="string") ? 'window.location.replace("' +redir_url+'");':'';
    html += '</script>';
    res.send(html);
}

//from php.js
export function in_array (needle:string, haystack:any, argStrict:any) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: vlado houba
  // +   input by: Billy
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: true
  // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
  // *     returns 2: false
  // *     example 3: in_array(1, ['1', '2', '3']);
  // *     returns 3: true
  // *     example 3: in_array(1, ['1', '2', '3'], false);
  // *     returns 3: true
  // *     example 4: in_array(1, ['1', '2', '3'], true);
  // *     returns 4: false
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
}

// class example
// class need to be init when use, ex : new xxx.Foo();
export class Foo {
	x:number;
	y:number;
	public setXY(){
		this.x=1;
		this.y=2;
	}
	public getXY(){
		return {X:this.x,Y:this.y};
	}
}
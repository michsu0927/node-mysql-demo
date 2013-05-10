
	
export function twitterpage(current_page_id=1,query_arr=Object(),totalrecords=1,recordperpage=15,anchor=''){
	var html = '<div style="width:100%;text-align:center"><div class="pagination">';
	var total_pages = Math.ceil( totalrecords / recordperpage );
	var bool_simplify = ( total_pages > 10 ) ? true : false;
	current_page_id = ( current_page_id < 0 || current_page_id > total_pages) ? 1 : current_page_id;
	var links = new Array();
	if(typeof query_arr.page!=="undefined")
	{
		delete query_arr.page;
	}
	var query_bits = new Array();
	for(var k in query_arr)
	{
		if((typeof k !== "undefined")&&(typeof query_arr[k] !== "undefined")&&(k!='')&&(query_arr[k]!=''))
		{
			query_bits[query_bits.length]= k+'='+query_arr[k];
		}
	}
	var querystr=query_bits.join('&');

	var select="第<select style="+'"width:50px;"'+" id="+'"PageSelect"'+" onchange="+'"window.location.href='+"'"+this.url+'?'+querystr+"&amp;&page='+this.value+'"+anchor+"'"+'"'+" >";	    
	var prev_page_id = (current_page_id<=1)?1: current_page_id - 1;
	anchor=(anchor=='')?'':'#'+anchor;
	links[links.length]=( current_page_id == 1)?'<a class="disabled" style="border-left-width:1px;" >第一頁</a><a class="disabled">上一頁</a>':'<a style="border-left-width:1px;" href="'+this.url+'?'+querystr+'&amp;&page=1'+anchor+'" >第一頁</a><a href="'+this.url+'?'+querystr+'&amp;&page='+prev_page_id+anchor+'">上一頁</a>';
	var i;
	for(i=1;i<=total_pages;i++)
	{
		if(current_page_id != i)
		{
			select+="<option>"+i+"</option>";
		}
		else
		{
			select+="<option selected >"+i+"</option>";
		}
		if( bool_simplify==true && i > 3 && i < (total_pages-3) && ( i < (current_page_id-1) || i > (current_page_id+1) ) )
    	{ 
			if( links[(links.length-1)] != '<a>...</a>' ) 
			{ 
				links[links.length] = '<a>...</a>'; 
			} 
			continue; 
		}
		if(current_page_id != i)
		{
			links[links.length] = '<a href="'+this.url+'?'+querystr+'&amp;&page='+i+anchor+'">'+i+'</a>';
		}
		else
		{		
			links[links.length] = '<a class="active" style="color:#0000FF;background:#F2D646;font-size:14px;" >'+i+'</a>';
		}
	}
	var next_page_id = (current_page_id>=total_pages)?total_pages:(Math.abs(current_page_id) + 1);
	links[links.length] = ( current_page_id == total_pages) ?'<a class="disabled">下一頁</a><a class="disabled">最終頁</a>' :'<a href="'+this.url+'?'+querystr+'&amp;&page='+next_page_id+anchor+'">下一頁</a><a href="'+this.url+'?' +querystr+'&amp;&page=' +total_pages+anchor+'">最終頁</a>';
	select+="</select>頁";
	html+= select+''+links.join('&nbsp;');
	html+= '</div></div>';
	return html;
}

export function seturl(seturl){
	this.url=seturl;
}

export var url;
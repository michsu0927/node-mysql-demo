function addplaceHolder(){
    $('input[type="text"]');
    $('input[type="text"]').each(function(){
        var placeholder=$(this).attr('placeholder');
        if(placeholder!='')
        {
            $(this).attr('value',placeholder);
            $(this).focus(function (){
                if($(this).attr('value')==placeholder)
                {
                    $(this).attr('value','');
                }
            });
            $(this).blur(function (){
            if($(this).attr('value')=='')
            {
                $(this).attr('value',placeholder);
            }
        });
        }
    });
}
addLoadEvent(addplaceHolder);
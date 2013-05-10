<!--//
function loadDatepicker(){
    // $('input.dateinput').datetimepicker({
    //     showSecond: true,
    //     timeFormat: 'hh:mm:ss',
    //     dateFormat: 'yy-mm-dd',
    //     currentText:'現在',
    //     closeText:'確認',
    //     onSelect: function(dateText, inst){
    //         $(this).val(dateText);
    //         //if(window.console)
    //         //    console.log(dateText);
    //     },
    //     showButtonPanel:false
    // });
    $( "input.dateinput" ).datepicker({dateFormat: 'yy-mm-dd'});
}

addLoadEvent(loadDatepicker);
//-->
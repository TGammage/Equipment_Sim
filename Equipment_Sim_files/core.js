$(document).ready(function(e){
	var windowWidth=$(window).outerWidth(true);

	erase_confirm();

	popup_close();
	popup_message_center(windowWidth);

	centerElements();

	$(window).resize(function(){
		windowWidth=$(window).outerWidth(true);

		if( $('div.popup_container').hasClass("hidden") === false )
		{
			popup_message_center(windowWidth);			
		}

		centerElements();
	});
});
/*
*	Sets up classes used for blocks
*/
function popup_close(){
	$("#popup_close").click(function(){
		$(".popup_partition, .popup_container").css("display","none").addClass('hidden');
	});
}
function popup_message_center(w){
	var cont=$('div.popup_container');
	var message_w=cont.outerWidth();
	var math=parseInt((w/2)-(message_w/2));
	cont.css("left",math);
}
function erase_confirm(){
	$('a[href="erase_records.php"]').click(function(){
		return confirm("Are you sure you want to ERASE the records?");
	});
}

// UCFirst
String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function centerElements()
{
	$('.center').each( function(){
		var parent		= $(this).parent();
		var parentWidth	= parent.outerWidth();
		var elWidth		= $(this).outerWidth();

		var elMargin	= ( parentWidth - elWidth ) / 2;

		if( elMargin < 0 ) elMargin = 0;

		$(this).css( 'margin-left', elMargin );
	});
}
function initMarquee()
{
	initToggleMarquee();
	initOptions();
}

function initOptions()
{
	initOverwrite();
	initRename();
	initSave();
	initDelete();
	initCopyURL();
}

function initToggleMarquee()
{
	$("ul.marquee-pills a.nav-link").on('click', function(e)
	{
		e.preventDefault();

		// Toggle crystal to adjust
		var marquee		= $('#marquee');
		var id			= $(this).attr( 'id' );
		var tab			= $(this).parent();

		// On Open
		if( !tab.hasClass( 'active' ) )
		{
			// Active tab
			$("ul.marquee-pills li.active").removeClass( 'active' );
			tab.addClass( 'active' );

			if( !marquee.hasClass( 'open' ) )
			{
				// Open Marquee
				marquee.addClass( "open" );

				marquee.animate({
					'height'	: '380px',
					'opacity'	: 1
				});
			}

			if( id === 'assessment' )
			{
				$('.loadouts').css( 'display', 'none' );
				$('.assessment').css( 'display', 'block' );
			}

			if( id === 'loadouts' )
			{
				$('.assessment').css( 'display', 'none' );
				$('.loadouts').css( 'display', 'block' );
			}
		}
		// On Close
		else {
			// Active tab
			tab.removeClass( 'active' );

			// Close Marquee
			marquee.removeClass( "open" );

			marquee.animate({
				'height'	: '0',
				'opacity'	: 0
			});
		}
	});

	$("#marquee .closer").on('click', function()
	{
		var marquee = $('#marquee');

		// Active tab
		$( '.marquee-pills li.nav-item.active' ).removeClass( 'active' );

		// Close Marquee
		marquee.removeClass( "open" );

		marquee.animate({
			'height'	: '0',
			'opacity'	: 0
		});
	});
}

function initOverwrite()
{
	$('.overwrite').off( 'click' ).on( 'click', function( e )
	{
		e.preventDefault();

		var anchor	= $(this);
		var name	= anchor.parents( '.loadout_options' ).siblings( 'input[name="loadout_name"]' ).val();

		var i		= 0;
		var URL		= '';

		// Confirm Overwrite
		if( confirm( "Are you sure you wish to overwrite loadout : " + name + "?" ) )
		{
			// Grab Items and Crystals
			for( var gear in base_stats )
			{
				var lowercase	= gear.toLowerCase();
				var item		= $('select[name="' + lowercase + '"]').find( ':selected' ).val();

				if( item !== 'none' )
				{
					// Organize Info in URL form
					var item_URLready	= item.replace( / /g, '%20' );
					var prepend			= i > 0 ? '&' : '?';

					URL		+= prepend + gear + '=' + item_URLready;

					var j 	= 0;

					$('input.' + lowercase).each(function()
					{
						var value = $(this).val();

						if( value !== 'none' )
						{
							URL += j > 0 ? '|' : ':' ;
							URL += crystalAbbr( value );
							j++;
						}
					});
				}
				i++; 
			}

			var url_key			= $('input[name="unique"]').val();
			var var_key			= $('input[name="unique2"]').val();

			var handler	= 'http://' + window.location.hostname + '/war/loadout.php?unique=' + url_key;

			// Ajax out to replace
			$.post({
				url			: handler,
				data		: {
					'unique'	: var_key,
					'action'	: 'overwrite',
					'name'		: name,
					'loadout'	: URL
				},
				success		: function( data )
				{
					if( data.success === true )
					{
						anchor.html( 'Overwrite <i class="fa fa-check-circle green"></i>' );
					} else {
						anchor.html( 'Overwrite <i class="fa fa-times-circle red"></i>' );
					}
				},
				error		: function( e )
				{
					console.log( e.responseText );
				},
				dataType	: 'json'
			});
		}
	});
}

function initRename()
{
	$('.rename').off( 'click' ).on( 'click', function( e )
	{
		e.preventDefault();

		var anchor		= $(this);
		var name		= anchor.parents( '.loadout_options' ).siblings( 'input[name="loadout_name"]' ).val();
		var name_div	= anchor.parents( '.loadout_options' ).siblings( '.loadout_name' );

		var html		= "<div class='input-group mx-auto'><div class='input-group-addon'>Rename</div>";
			html		+= "<input type='text' class='form-control' name='rename' max-length='25' placeholder='" + name + "' /></div>";
			html		+= "<input class ='my-1 rename' type='button' value='Save' />";

		name_div.html( html );
		name_div.find( 'input[name="rename"]' ).focus();

		renameLoadout();
	});
}

function renameLoadout()
{
	$('input.rename').off( 'click' ).on( 'click', function(e)
	{
		e.preventDefault();

		var save_button		= $(this);
		var input_old_name	= save_button.parents( '.loadout_name ' ).siblings( 'input[name="loadout_name"]' );
		var old_name		= input_old_name.val();
		var new_name		= save_button.siblings( '.input-group' ).find( 'input[name="rename"]' ).val();

		if( confirm( 'Are you sure you want to rename "' + old_name + '" to "' + new_name + '"?' ) )
		{
			var url_key			= $('input[name="unique"]').val();
			var var_key			= $('input[name="unique2"]').val();

			var handler	= 'http://' + window.location.hostname + '/war/loadout.php?unique=' + url_key;

			// Ajax out to replace
			$.post({
				url			: handler,
				data		: {
					'unique'	: var_key,
					'action'	: 'rename',
					'name'		: old_name,
					'rename'	: new_name
				},
				success		: function( data )
				{
					if( data.success === true )
					{
						save_button.parent().html( new_name + ' <i class="fa fa-check-circle green"></i>' );
						input_old_name.val( new_name );
						
					} else {
						save_button.parent().html( name + ' <i class="fa fa-times-circle red"></i>' );
					}
				},
				error		: function( e )
				{
					console.log( e.responseText );
				},
				dataType	: 'json'
			});
		}
	});
}

function initSave()
{
	$('#save').off( 'click' ).on( 'click', function(e)
	{
		e.preventDefault();

		saveNewLoadout();
	});

	$('input[name="name"]').off( 'keypress' ).keyup( function(e)
	{
		e.preventDefault();

		if( e.keyCode == 13 )
		{
			saveNewLoadout();
		}
	});
}

function saveNewLoadout()
{
	var i		= 0;
	var URL		= '';

	// Grab Items and Crystals
	for( var gear in base_stats )
	{
		var lowercase	= gear.toLowerCase();
		var item		= $('select[name="' + lowercase + '"]').find( ':selected' ).val();

		if( item !== 'none' )
		{
			// Organize Info in URL form
			var item_URLready	= item.replace( / /g, '%20' );
			var prepend			= i > 0 ? '&' : '?';

			URL		+= prepend + gear + '=' + item_URLready;

			var j 	= 0;

			$('input.' + lowercase).each(function()
			{
				var value = $(this).val();

				if( value !== 'none' )
				{
					URL += j > 0 ? '|' : ':' ;
					URL += crystalAbbr( value );
					j++;
				}
			});
			i++; 
		}
	}

	var url_key		= $('input[name="unique"]').val();
	var var_key		= $('input[name="unique2"]').val();
	var name		= $('input[name="name"]').val();

	var handler	= 'http://' + window.location.hostname + '/war/loadout.php?unique=' + url_key;

	// Ajax out to replace
	$.post({
		url			: handler,
		data		: {
			'unique'	: var_key,
			'action'	: 'save',
			'name'		: name,
			'loadout'	: URL
		},
		success		: function( data )
		{
			$('.loadout_container').append( data.html );
			$('input[name="name"]').val( '' );

			initOptions();
		},
		error		: function( e )
		{
			console.log( e.responseText );
		},
		dataType	: 'json'
	});
}

function initDelete()
{
	$('.delete').off( 'click' ).on( 'click', function( e )
	{
		e.preventDefault();

		var anchor		= $(this);
		var name		= anchor.parents( '.loadout_options' ).siblings( 'input[name="loadout_name"]' ).val();

		if( confirm( 'Are you sure you want to delete "' + name + '"' ) )
		{
			var url_key		= $('input[name="unique"]').val();
			var var_key		= $('input[name="unique2"]').val();

			var handler	= 'http://' + window.location.hostname + '/war/loadout.php?unique=' + url_key;

			// Ajax out to replace
			$.post({
				url			: handler,
				data		: {
					'unique'	: var_key,
					'action'	: 'delete',
					'name'		: name
				},
				success		: function( data )
				{
					if( data.success === true )
					{
						anchor.html( 'Delete <i class="fa fa-check-circle green"></i>' );
					} else {
						anchor.html( 'Delete <i class="fa fa-times-circle red"></i>' );
					}
				},
				error		: function( e )
				{
					console.log( e.responseText );
				},
				dataType	: 'json'
			});
		}
	});
}

function initCopyURL()
{
	$('.copy_url').off( 'click' ).on( 'click', function(e)
	{
		e.preventDefault();

		var anchor = $(this);

		var copied = anchor.parent().siblings( 'td.loadout_url' ).children( 'a' ).attr( 'href' );

		var clipboard = new Clipboard( '.copy_url', {
			text	: function()
			{
				return copied;
			}
		});

		clipboard.on( 'success', function()
		{
			anchor.html( 'Copy URL <i class="fa fa-check-circle green"></i>' );
		});
	});
}
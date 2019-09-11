
var base_stats		= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon1'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	},
	adjusted_stats	= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon2'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	},
	crystal_adjust	= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon2'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	},
	shard_count		= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon1'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	},
	overall_stats	= {
		'armor'			: 0,
		'damage_low'	: 0,
		'damage_high'	: 0,
		'accuracy'		: 0,
		'dodge'			: 0,
		'd_skill'		: 0,
		'm_skill'		: 0,
		'g_skill'		: 0,
		'p_skill'		: 0,
		'speed'			: 0
	};

function buildArithmetic()
{
	getItemStats();

	getCrystalStats();

	applyCrystalMath();

	countCrystalShards();

	getOverallStats();
	//console.log( "Base Stats" );		console.log(base_stats);
	//console.log( "Adjusted Stats" );	console.log(adjusted_stats);
	//console.log( "Crystal Adjusts" );	console.log(crystal_adjust);
	//console.log( "Shard Counts" );	console.log(shard_count);
	//console.log( "Overall Stats" );		;console.log(overall_stats);
}

function getItemStats()
{
	var armor_stats		= item( $("select[name='armor']").find( ':selected' ).val() );
	var wep1_stats		= item( $("select[name='weapon1']").find( ':selected' ).val() );
	var wep2_stats		= item( $("select[name='weapon2']").find( ':selected' ).val() );
	var misc1_stats		= item( $("select[name='misc1']").find( ':selected' ).val() );
	var misc2_stats		= item( $("select[name='misc2']").find( ':selected' ).val() );

	base_stats['Armor']			= armor_stats;
	base_stats['Weapon1']		= wep1_stats;
	base_stats['Weapon2']		= wep2_stats;
	base_stats['Misc1']			= misc1_stats;
	base_stats['Misc2']			= misc2_stats;

	adjusted_stats = jQuery.extend( true, {}, base_stats );
}

function getCrystalStats()
{
	crystal_adjust	= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon2'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	};

	// Focus on item
	var focus = "Armor";

	// Loop through every crystal
	for( i = 0; i < 20; i++ )
	{
		// Refocus item
		if( i == 4 )	focus	= "Weapon1";
		if( i == 8 )	focus	= "Weapon2";
		if( i == 12 )	focus	= "Misc1";
		if( i == 16 )	focus	= "Misc2";

		var crystalID	= $('input#crystal' + i);
		var name		= crystalID.val();

		var empty = {
			'damage'	: null,
			'armor'		: null,
			'accuracy'	: null,
			'dodge' 	: null,
			'd_skill'	: null,
			'm_skill'	: null,
			'g_skill'	: null,
			'p_skill'	: null,
			'speed'		: null
		};

		// Skip 'none'
		if( name !== 'none' )
		{
			// Get stat for this crystal
			var stats = crystal( name );

			// Find if this item has prior crystals
			if( jQuery.isEmptyObject( crystal_adjust[focus] ) )
			{
				// Add crystal stats to crystal_adjust first time
				crystal_adjust[focus] = jQuery.extend( true, {}, empty );
			}

			var positiveEffect = false;

			// Add crystal stats to crystal_adjust
			for( var val in stats )
			{
				// Skip if stat is null
				if( stats[val] !== null )
				{
					// Determine if prior crystals have adjusted this stat
					if( crystal_adjust[focus][val] === null )
					{
						// Add for first time
						crystal_adjust[focus][val] = stats[val];
					} else {
						// Add to prior
						crystal_adjust[focus][val] += stats[val];
					}


					// Correct damage
					if( val === 'damage' )
					{
						val += '_low';
					}

					// Determine if crystal has a positive effect on item
					if( base_stats[focus][val] !== null )
					{
						// No positive effect on negative stats
						if( base_stats[focus][val] > 0)
						{
							positiveEffect = true;
						}
					}
				}
			}

			if( positiveEffect )
			{
				crystalID.siblings( 'img.crystalimg' ).removeClass( 'glow_red' ).addClass( 'glow_green' );
				
			} else {
				crystalID.siblings( 'img.crystalimg' ).removeClass( 'glow_green' ).addClass( 'glow_red' );
			}
		} else {
			crystalID.siblings( 'img.crystalimg' ).removeClass( 'glow_green glow_red' );
		}
	}
}

function applyCrystalMath()
{
	// Loop through all gear
	for( var gear in adjusted_stats )
	{
		// Skip empty gear
		if( !jQuery.isEmptyObject( adjusted_stats[ gear ] ) && !jQuery.isEmptyObject( crystal_adjust[ gear ] ) )
		{
			// Loop through stats
			for( var stat in adjusted_stats[ gear ] )
			{
				// Skip empty stats
				if( adjusted_stats[ gear ][ stat ] !== null )
				{
					// Skip negative stats
					if( base_stats[ gear ][ stat ] > 0 )
					{
						var crystalStat = stat;

						// Damage Stat Fix
						if( crystalStat === 'damage_low' || crystalStat === 'damage_high' )
						{
							crystalStat = 'damage';
						}

						if( crystal_adjust[ gear ][ crystalStat ] !== null )
						{
							var adjustment = adjusted_stats[ gear ][ stat ] * ( 1 + ( crystal_adjust[ gear ][ crystalStat ] / 100 ) );

							adjusted_stats[ gear ][ stat ] = Math.ceil( adjustment );
						}
					}
				}
			}
		}
	}
}

function countCrystalShards()
{
	// Reset Counts
	shard_count		= {
		'Armor'		: {},
		'Weapon1'	: {},
		'Weapon1'	: {},
		'Misc1'		: {},
		'Misc2'		: {}
	};

	// Focus on item
	var focus = "Armor";

	// Loop through every crystal
	for( i = 0; i < 20; i++ )
	{
		// Refocus item
		if( i == 4 )	focus	= "Weapon1";
		if( i == 8 )	focus	= "Weapon2";
		if( i == 12 )	focus	= "Misc1";
		if( i == 16 )	focus	= "Misc2";

		var name = $('input#crystal' + i).val();

		// Skip 'none'
		if( name !== 'none' )
		{
			// Pattern Match for regular crystal
			if( name.match( /Small|Medium|Large|Giant|Perfect/ ) )
			{
				var count;
				var tmp = name.replace( ' Crystal', '' ).split( ' ' );

				switch( tmp[0] )
				{
					case 'Small':		count = 2;		break;
					case 'Medium':		count = 4;		break;
					case 'Large':		count = 8;		break;
					case 'Giant':		count = 16;		break;
					case 'Perfect':		count = 32;		break;
				}

				if( jQuery.isEmptyObject( shard_count[ focus ] ) )
				{
					// First Crystal added to collection
					shard_count[ focus ] = { [ tmp[1] ] : count };

				} else {
					// Adding to existing collection
					if( typeof shard_count[ focus ][ tmp[1] ] === 'undefined' )
					{
						// First crystal of this type
						shard_count[ focus ][ tmp[1] ] = count;
					} else {
						// Add to established crystal type
						shard_count[ focus ][ tmp[1] ] += count;
					}
				}
			}
		}
	}
}

function getOverallStats()
{
	// Stat Reset
	overall_stats	= {
		'armor'			: 0,
		'damage_low'	: 0,
		'damage_high'	: 0,
		'accuracy'		: 0,
		'dodge'			: 0,
		'd_skill'		: 0,
		'm_skill'		: 0,
		'g_skill'		: 0,
		'p_skill'		: 0,
		'speed'			: 0
	};

	// Loop through gear
	for( var gear in adjusted_stats	)
	{
		if( !jQuery.isEmptyObject( adjusted_stats[ gear ] ) )
		{
			// Loop through stats
			for( var stat in adjusted_stats[ gear ] )
			{
				overall_stats[ stat ] += adjusted_stats[ gear ][ stat ];
			}
		}
		
	}

	mixedWeapon();

	// Add Fist Damage if needed
	if( overall_stats[ 'damage_low' ] == 0 )	overall_stats[ 'damage_low' ]	= 1;
	if( overall_stats[ 'damage_high' ] == 0 )	overall_stats[ 'damage_high' ]	= 2;

}

function mixedWeapon()
{
	var melee		= false,
		gun			= false,
		projectile	= false;

	if( !jQuery.isEmptyObject( adjusted_stats[ 'Weapon1' ] ) && !jQuery.isEmptyObject( adjusted_stats[ 'Weapon2' ] ) )
	{
		// Weapon 1 Type
		melee		= $("select[name='weapon1']").find( ':selected' ).hasClass( 'Melee' )		? true : false;
		gun			= $("select[name='weapon1']").find( ':selected' ).hasClass( 'Gun' )			? true : false;
		projectile	= $("select[name='weapon1']").find( ':selected' ).hasClass( 'Projectile' )	? true : false;

		if( gun )
		{
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Melee' ) )
			{
				overall_stats[ 'g_skill' ] += adjusted_stats[ 'Weapon1' ][ 'g_skill' ];
				overall_stats[ 'm_skill' ] += adjusted_stats[ 'Weapon2' ][ 'm_skill' ];
			}
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Projectile' ) )
			{
				overall_stats[ 'g_skill' ] += adjusted_stats[ 'weapon1' ][ 'g_skill' ];
				overall_stats[ 'p_skill' ] += adjusted_stats[ 'Weapon2' ][ 'p_skill' ];
			}
		}
		if( melee )
		{
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Gun' ) )
			{
				overall_stats[ 'm_skill' ] += adjusted_stats[ 'Weapon1' ][ 'm_skill' ];
				overall_stats[ 'g_skill' ] += adjusted_stats[ 'Weapon2' ][ 'g_skill' ];
			}
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Projectile' ) )
			{
				overall_stats[ 'm_skill' ] += adjusted_stats[ 'Weapon1' ][ 'm_skill' ];
				overall_stats[ 'p_skill' ] += adjusted_stats[ 'Weapon2' ][ 'p_skill' ];
			}
		}
		if( projectile )
		{
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Melee' ) )
			{
				overall_stats[ 'p_skill' ] += adjusted_stats[ 'Weapon1' ][ 'p_skill' ];
				overall_stats[ 'm_skill' ] += adjusted_stats[ 'Weapon2' ][ 'm_skill' ];
			}
			if( $("select[name='weapon2']").find( ':selected' ).hasClass( 'Gun' ) )
			{
				overall_stats[ 'p_skill' ] += adjusted_stats[ 'Weapon1' ][ 'p_skill' ];
				overall_stats[ 'g_skill' ] += adjusted_stats[ 'Weapon2' ][ 'g_skill' ];
			}
		}
	}
}
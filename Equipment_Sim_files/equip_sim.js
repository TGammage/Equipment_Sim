$(document).ready(function() {
	initCrystalPanel();
	initItemChange();
	initMarquee();
	initMods();

	sizeUp();

	$(window).resize(function() {
		sizeUp();
	});

	// Update
	updateBuild();
});

function sizeUp() {
	var width = $(".item").outerWidth();

	$(".mod_holder").css("width", width + "px");
}

function initItemChange() {
	$("select.item").on("change", function() {
		// Item Image Update
		var url = "./Equipment_Sim_files/items/";
		var option = $(this);
		var name = option.val();
		var src = url + name.replace(/ /g, "%20") + ".png";

		option
			.parent()
			.siblings(".img_holder")
			.children(".item_img")
			.attr({ src: src, title: name });

		// Add mods if available
		if (option.find(":selected").hasClass("modifiable")) {
			toggleModifiers(option, name);
		} else {
			$(this)
				.parent()
				.siblings(".mod_tab_sleeve")
				.find(".tab_1, .tab_2")
				.css("display", "none");
		}

		// Update
		updateBuild();
	});
}

function toggleModifiers(selector, item = false) {
	var mods = modifiable(item),
		mod_2 = mods.slot_2_mod !== null,
		tabs = ".tab_1";
	tabs += mod_2 ? ", .tab_2" : "";

	selector
		.parent()
		.siblings(".mod_tab_sleeve")
		.children(tabs)
		.css("display", "block");
}

function initMods() {
	$(".mod_tab").click(function() {
		// Close Crystal Panel
		var CP = $(this)
			.parents(".item")
			.find(".crystalPicker");

		var id = CP.attr("id");

		toggleCrystalPanel(id, "close");

		// Open Mod Panel
		var width = $(this)
			.parent()
			.siblings(".mod_sleeve")
			.children(".mod_holder")
			.outerWidth();

		$(this)
			.parent()
			.siblings(".mod_sleeve")
			.animate({ width: width + "px" }, 550)
			.addClass("active");
	});

	$(".mod_holder > .title").click(function() {
		$(this)
			.parents(".mod_sleeve")
			.animate({ width: 0 }, 550)
			.removeClass("active");
	});
}

/*
#####################################
*/

function updateBuild() {
	// Commence Arthimetic
	buildArithmetic();

	// HTML Changes
	updateHTML();
}

function updateHTML() {
	updateShardTables();
	updateStatsTables();
	updateRatingsTable();
	updateOverallStatsTable();
}

function updateShardTables() {
	var url = "./Equipment_Sim_files/items/crystals/shard%20";

	for (var gear in base_stats) {
		var html = "";

		// Skip empty items
		if (!jQuery.isEmptyObject(base_stats[gear])) {
			html +=
				"<tr><td colspan='4' class='title'>Shard Count</td></tr><tr>";

			// Skip empty crystals
			if (!jQuery.isEmptyObject(shard_count[gear])) {
				for (var type in shard_count[gear]) {
					var crystalURL = url + type.toLowerCase() + ".png";

					html +=
						'<td class="count"><img src="' +
						crystalURL +
						'" /><br>x' +
						shard_count[gear][type] +
						"<br>" +
						type +
						"</td>";
				}
			} else {
				html += "<td class='noShards'>No Shards Used</td>";
			}

			html += "</tr>";
		}

		$("table.shard." + gear.toLowerCase()).html(html);
	}
}

function updateStatsTables() {
	for (var gear in base_stats) {
		var html = "";

		// Skip empty items
		if (!jQuery.isEmptyObject(base_stats[gear])) {
			html =
				'<tr class="head"><td>Stat</td><td>|</td><td>Amount</td><td>|</td><td>Bonus</td></tr>';

			for (var stat in adjusted_stats[gear]) {
				if (
					stat === "damage_low" &&
					adjusted_stats[gear][stat] !== null
				) {
					var amount =
						adjusted_stats[gear]["damage_low"] +
						"-" +
						adjusted_stats[gear]["damage_high"];

					var difference_low =
						adjusted_stats[gear]["damage_low"] -
						base_stats[gear]["damage_low"];
					var difference_high =
						adjusted_stats[gear]["damage_high"] -
						base_stats[gear]["damage_high"];

					var bonus = difference_low + "-" + difference_high;

					var color = difference_high > 0 ? ' class="gold"' : "";

					html +=
						"<tr><td>DMG</td><td>|</td><td>" +
						amount +
						"</td><td>|</td><td" +
						color +
						">+" +
						bonus +
						"</td></tr>";
				} else {
					if (
						stat !== "damage_high" &&
						adjusted_stats[gear][stat] !== null
					) {
						var abbr;

						switch (stat) {
							case "accuracy":
								abbr = "ACC";
								break;
							case "dodge":
								abbr = "DGE";
								break;
							case "armor":
								abbr = "ARM";
								break;
							case "d_skill":
								abbr = "DSK";
								break;
							case "m_skill":
								abbr = "MSK";
								break;
							case "g_skill":
								abbr = "GSK";
								break;
							case "p_skill":
								abbr = "PSK";
								break;
							case "speed":
								abbr = "SPD";
								break;
						}

						var amount = adjusted_stats[gear][stat];

						var difference =
							adjusted_stats[gear][stat] - base_stats[gear][stat];

						var color = difference > 0 ? ' class="gold"' : "";

						html +=
							"<tr><td>" +
							abbr +
							"</td><td>|</td><td>" +
							amount +
							"</td><td>|</td><td" +
							color +
							">+" +
							difference +
							"</td></tr>";
					}
				}

				//html += '<td></td>';
			}
		}
		$("table.stats." + gear.toLowerCase()).html(html);
	}
}

function updateRatingsTable() {
	for (var stat in overall_stats) {
		var percent = (overall_stats[stat] / rate(stat)) * 100;
		var f_percent = Math.round(percent);

		if (f_percent === 100) f_percent = 99;

		$("#bar_" + stat).css("width", percent + "%");
		$("#rating_" + stat).html(f_percent);
	}
}

function updateOverallStatsTable() {
	for (var stat in overall_stats) {
		$("#stat_" + stat).html(overall_stats[stat]);
		$("#max_" + stat).html(rate(stat));
	}
}

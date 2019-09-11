function initCrystalPanel() {
	initToggleCrystalPanel();
	initAdjustCrystal();
	init_draggable();
}

function initToggleCrystalPanel() {
	$("li.crystal").on("click", function() {
		// Toggle crystal to adjust
		var img = $(this).children("img.crystalimg");
		var input = $(this).children("input[type='hidden']");
		var id = $(this)
			.parents(".well")
			.attr("id");

		// On Open
		if (!img.hasClass("selected") && !input.hasClass("listen")) {
			// Deselect Any Crystals
			$("#" + id)
				.find("img.crystalimg.selected")
				.removeClass("selected")
				.addClass("unselected");
			$("#" + id)
				.find("input.listen[type='hidden']")
				.removeClass("listen");

			// Select Crystal
			img.removeClass("unselected").addClass("selected");
			input.addClass("listen");

			// Toggle Open Crystal Panel

			toggleCrystalPanel(id);
		}
		// On Close
		else {
			// Deselect Crystals
			img.removeClass("selected").addClass("unselected");
			input.removeClass("listen");

			// Toggle Close Crystal Panel
			toggleCrystalPanel(id, "close");
		}
	});

	$(".crystalPicker .title").on("click", function() {
		// Toggle Close Crystal Panel
		var id = $(this)
			.parents(".well")
			.attr("id");

		toggleCrystalPanel(id, "close");

		// Deselect Crystal
		$("#" + id)
			.find("img.crystalimg.selected")
			.removeClass("selected")
			.addClass("unselected");
		$("#" + id)
			.find("input.listen[type='hidden']")
			.removeClass("listen");
	});
}

function toggleCrystalPanel(id, toggleDirection = "open") {
	// ID string corrections
	var id_len = id.length;

	if (id.substring(id_len, id_len - 2) === "CP") {
		id = id.substring(0, id_len - 2);
	}

	// Panel
	var panel = $("#" + id + "CP");

	// Open Crystal Panel
	if (!panel.hasClass("open") && toggleDirection === "open") {
		// Close Mods
		panel
			.parents(".item")
			.find(".mod_holder > .title")
			.click();

		panel
			.stop(true)
			.animate(
				{
					opacity: 1,
					height: "130px",
				},
				550
			)
			.addClass("open");
	}

	var item = $("#" + id);

	// Adjust to correct crystal
	if (toggleDirection === "open") {
		var tmp = item.find("input.listen[type='hidden']").val();
		var name = tmp.replace(" Crystal", "");

		// Enable Select Size
		item.find("select.size").attr("disabled", false);

		if (name === "none") {
			item.find('select.size > option[value="none"]').prop(
				"selected",
				true
			);
			item.find('select.type > option[value="none"]').prop(
				"selected",
				true
			);
		} else {
			// For Normal Crystals
			if (name.match(/Small|Medium|Large|Giant|Perfect/)) {
				var contents = name.split(" ");
				var size = contents[0];
				var type = contents[1];

				item.find('select.size option[value="' + size + '"]').prop(
					"selected",
					true
				);
				item.find('select.type option[value="' + type + '"]').prop(
					"selected",
					true
				);
			}
			// For Unique Crystals
			else {
				item.find('select.size option[value="none"]').prop(
					"selected",
					true
				);
				item.find('select.type option[value="' + name + '"]').prop(
					"selected",
					true
				);

				// Disable Select Size
				item.find("select.size").attr("disabled", true);
			}
		}
	}

	// Close Crystal Panel
	if (panel.hasClass("open") && toggleDirection === "close") {
		panel
			.stop(true)
			.animate(
				{
					opacity: 0,
					height: "1px",
				},
				550
			)
			.removeClass("open");

		// Deselect Any Crystals
		item.find("img.crystalimg.selected")
			.removeClass("selected")
			.addClass("unselected");
		item.find("input.listen[type='hidden']").removeClass("listen");
	}
}

function initAdjustCrystal() {
	$(".well select").on("change", function() {
		var url = "./Equipment_Sim_files/items/crystals/";
		var well = $(this).parents(".well");

		var input = well.find("input.listen[type='hidden']");
		var image = well.find("img.selected");

		var option_size = well.find("select.size").find(":selected");
		var option_type = well.find("select.type").find(":selected");

		var size = option_size.val();
		var type = option_type.val();

		// Enable Size Pics
		well.find("select.size").attr("disabled", false);

		// No Crystal Selected (none && none)
		if (size === "none" && type === "none") {
			// Change input
			input.val("none");

			// Change image
			image.attr("src", url + "none.png");
		}

		// No Crystal type chosen, with size
		if (
			!option_type.hasClass("unique") &&
			size !== "none" &&
			type === "none"
		) {
			// Change input
			input.val("none");

			// Change image
			image.attr("src", url + "none.png");
		}

		// Normal Crystal type chosen, no size
		if (!option_type.hasClass("unique") && size === "none") {
			// Change input
			input.val("none");

			// Change image
			image.attr("src", url + "none.png");
		}

		// Normal Crystal type chosen, with size
		if (
			!option_type.hasClass("unique") &&
			size !== "none" &&
			type !== "none"
		) {
			// Change input
			input.val(size + " " + type + " Crystal");

			// Change image
			image.attr(
				"src",
				url + size.toLowerCase() + "%20" + type.toLowerCase() + ".png"
			);
		}

		// Unique Crystal chosen
		if (option_type.hasClass("unique")) {
			// Change input
			input.val(type + " Crystal");

			// Change image
			image.attr("src", url + type.toLowerCase() + ".png");

			// Disable Size Pics
			well.find("select.size")
				.attr("disabled", true)
				.val("none");
		}

		// Update
		updateBuild();
	});
}

function init_draggable() {
	// INIT : Drag
	$(".crystal")
		.draggable({
			helper: "clone",
			zIndex: 5,
			// INIT : Drop
		})
		.droppable({
			drop: function(e, ui) {
				var incoming = ui.draggable;
				var landing = $(this);

				// Confirm we are receiving the correct drop
				if (landing !== incoming) {
					// Source
					var incoming_img_src = incoming.children("img").attr("src");
					var incoming_input_val = incoming
						.children("input[type='hidden']")
						.val();
					var landing_img = landing.children("img.crystalimg");

					// Change Input
					landing
						.children("input[type='hidden']")
						.val(incoming_input_val);

					// Change Image
					landing_img.attr("src", incoming_img_src);

					var id = landing.parents(".well").attr("id");

					if (landing_img.hasClass("selected")) {
						toggleCrystalPanel(id);
					} else {
						$("#" + id + "CP")
							.parents(".item")
							.find(".mod_holder > .title")
							.click();
						toggleCrystalPanel(id, "close");
					}
				}

				// Update
				updateBuild();
			},
		});
}

'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$(".project").click(function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		expandProject(id);
	});
}

function expandProject(id) {
	var elem = $("#" + id + ".description");
	elem.toggle(400);
}

function collapseProjects() {
	var elem = $(".description");
	elem.fadeOut();
}
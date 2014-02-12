'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$(".detail-button").click(function (e) {
		e.stopPropagation();
		var id = $(this).attr('id');
		document.location.href='/projects/' + id;
	});
	$(".project").click(function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		toggleProject(id);
	});
}

function toggleProject(id) {
	var elem = $("#" + id + ".more_info");
	elem.toggle(400);
}

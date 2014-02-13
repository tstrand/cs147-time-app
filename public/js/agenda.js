'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$(".todo-card").click(function(e) {
		e.preventDefault();
		console.log(this.id);

		$("#detail" + this.id).toggle(400);
	});

	$(".detail-button").click(function (e) {
		e.stopPropagation();
		var id = $(this).attr('id');
		document.location.href='/projects/' + id;
	});

	$(".subtask_checkbox").click(function(e) {
		e.stopPropagation();

		var subtask = $("#subtask" + this.id);
		if(this.checked) {
			subtask.css("text-decoration", "line-through");
		} else {
			subtask.css("text-decoration", "none");
		}
	});

	$("#task-box-button").click(function(e) {
		e.preventDefault();
		$("#task-box").toggle(400);
		if ($("#task-box-button").html() == "collapse") {
			$("#task-box-button").html("expand");
		} else {
			$("#task-box-button").html("collapse");
		}
	});

	$("#meeting-box-button").click(function(e) {
		e.preventDefault();
		$("#meeting-box").toggle(400);
		if ($("#meeting-box-button").html() == "collapse") {
			$("#meeting-box-button").html("expand");
		} else {
			$("#meeting-box-button").html("collapse");
		}
	});


}
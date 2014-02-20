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

	$(".task-button").click(function (e) {
		e.stopPropagation();
		var id = $(this).attr('id');
		document.location.href='/projects/' + id;
	});

	$(".subtask_line").click(toggleSubtask);
	$(".task-name").click(toggleSubtask);

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

	$("#completed-box-button").click(function(e) {
		e.preventDefault();
		$("#completed-box").toggle(400);
		if ($("#completed-box-button").html() == "collapse") {
			$("#completed-box-button").html("expand");
		} else {
			$("#completed-box-button").html("collapse");
		}
	});

}

function toggleSubtask(e) {
	e.stopPropagation();

	var subtask = $("#subtask" + this.id);
	var checkbox = $("#checkbox" + this.id);
	if(!checkbox.prop('checked')) {
		subtask.css("text-decoration", "line-through");
		checkbox.prop('checked', true);
		$.get("/subtasks/" + this.id + "/1", callback)
	} else {
		subtask.css("text-decoration", "none");
		checkbox.prop('checked', false);
		$.get("/subtasks/" + this.id + "/0", callback)
	}
}

function callback(response) {
	console.log(response);
	var progress = $("#progress_line" + response[0]);
	console.log(response[0]);
	progress.html(response[1] + "% complete");
	if(response[1] == 100) {
		var task = $("#task" + response[0]);
		var html = task.html();
		task.fadeOut("slow");
		console.log(html);
	}
}

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
	$.get("/api/get_users", function (result) {
		$("#members_input").autocomplete({
			source: result,
		});
	});

	$("#add_member_btn").click(function (e) {
		var user = $("#members_input").val();
		var url = "/api/valid/" + user;
		$.get(url, function (result) {
			if (result["result"]) {
				// valid username
				$("#members_list").append('<li><span style="margin-right:10px">' + 
					user + '</span><a class="remove_member" onclick="removeMember(this);">X</a></li>');
				$("#members_input").val("");
				formatMemberString();
			} else {
				alert("not a valid username");
			}
		});
	});

	$(".todo-card").click(cardClick);
	$(".detail-button").click(detailClick);
	$(".task-button").click(taskClick);
	$(".subtask_line").click(toggleSubtask);

	$("#description-button").click(function(e) {
		e.preventDefault();
		$("#project-description").toggle(400);
		if ($("#description-button").html() == "collapse") {
			$("#description-button").html("show");
		} else {
			$("#description-button").html("hide");
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

function cardClick(e) {
	e.preventDefault();
	$("#detail" + this.id).toggle(400);
}

function detailClick(e) {
	e.stopPropagation();
	var id = $(this).attr('id');
	document.location.href='/projects/' + id;
}

function taskClick(e) {
	e.stopPropagation();
	var id = $(this).attr('id');
	document.location.href='/projects/' + id;
}

function toggleSubtask(e) {
	e.stopPropagation();
	var subtask = $("#subtask" + this.id);
	var checkbox = $("#checkbox" + this.id);
	if ($(e.target).is("input")) {
		if(checkbox.prop('checked')) {
			subtask.css("text-decoration", "line-through");
			$.get("/subtasks/" + this.id + "/1", callback)
		} else {
			subtask.css("text-decoration", "none");
			$.get("/subtasks/" + this.id + "/0", callback)
		}
	} else {
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
}

function callback(response) {
	var task_id = response[0];
	var progress = $("#progress_line" + task_id);
	progress.html(response[1] + "% complete");
	if(response[1] == 100) {
		var task = $("#task" + task_id);
		var html = "<div class='todo-card completed' id='task" + task_id + "''>";
		html += task.html();
		html += "</div>";
		task.fadeOut("slow");
		//$(html).prependTo("#completed-box");
	}
}

function toggleProject(id) {
	var elem = $("#" + id + ".more_info");
	elem.toggle(400);
}

function removeMember(obj) {
	$(obj).parent().remove();
	formatMemberString();
}

function formatMemberString() {
	var usrString = "";
	$("#members_list").children().each(function() {
		usrString += $(this).find("span").text() + ",";
		console.log($(this).find("span").text());
	});
	if (usrString[usrString.length - 1] == ",") {
		usrString = usrString.slice(0, usrString.length - 1);
	}
	$("#members").val(usrString);
}

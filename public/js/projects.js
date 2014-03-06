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
		e.preventDefault();
		var id = $(this).attr('id');
		toggleProject(id);
	});
	$.get("/api/get_users", function (result) {
		if ($("#members_input").length) {
			$("#members_input").autocomplete({
				source: result,
			});
		}
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
	$(".link-button").click(linkClick);
	$(".subtask_line").click(toggleSubtask);
	$(".project_title").click(linkClick);
	$(".project_title_clickable").click(linkClick);
	$(".btn-primary").click(linkClick);
	
	$("#description-button").click(function(e) {
		e.preventDefault();
		$("#project-description").toggle(400);
		if ($("#description-button").html() == "hide") {
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

	$("#completed-box-button").click(function(e) {
		e.preventDefault();
		$("#completed-box").toggle(400);
		if ($("#completed-box-button").html() == "hide") {
			$("#completed-box-button").html("show");
		} else {
			$("#completed-box-button").html("hide");
		}
	});

	var anchor = $(".hidden_anchor");
	//console.log(anchor);
	if(anchor.length) {
		var task = $('#task' + anchor.attr('id'));
		$("#detailtask" + anchor.attr('id')).toggle(300);
		setTimeout(function() {
			$("html, body").animate({ scrollTop: (task.offset().top - 55)}, 500);
		}, 300);
		task.css("border", "2px solid orange");
	}

	// for delete project
	$(".delete-project-btn").click(function(e) {
		e.preventDefault();
		var r = confirm("Are you sure?");
		if (r == true) {
			var data = {"id":this.id};
			$.post("/delete/project", data).done(function (response) {
				if (response["result"]) {
					alert("Deleted!");
					var cururl = document.URL;
					var url = cururl.split("/");
					var p_id = url[url.length - 2];
					document.location.href = '/projects/';
				}
			});
		} 
	});

	// deal with checkboxes, can only checkoff yours
	var username = $("#username").text();
	$(".tasks").each(function(i,o) {
		var checkbox = $(o).find("input")[0];
		var n = $(o).next()[0];
		var nn = $(n).children()[1];
		var members = $(nn).text();
		var names = members.split(" ");
		names = names[names.length - 1];
		console.log(names.split(","));
		if (names.indexOf(username) == -1) {
			if (!$(o).hasClass("completed_subtask")) {
				//console.log(checkbox.id);
				//$(checkbox).parent().parent().prepend("<td><a class='btn-default btn-sm' style='margin-right:5px'>mine</a></td>");
				//$(checkbox).parent().remove();
				$(checkbox).remove();
			} else {
				$(checkbox).remove();
			}
			
		}
	});
}

function cardClick(e) {
	e.preventDefault();
	$("#detail" + this.id).toggle(400);
	// this.css("border", "none");
}

function linkClick(e) {
	e.stopPropagation();
	var id = $(this).attr('id');
	document.location.href = id;
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
	progress.html(response[1].toFixed(0) + "% complete");
	if(response[1] == 100) {
		var task = $("#task" + task_id);
		$(task).removeClass("task");
		$(task).addClass("completed");
	} else {
		var task = $("#task" + task_id);
		$(task).removeClass("completed");
		$(task).addClass("task");
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

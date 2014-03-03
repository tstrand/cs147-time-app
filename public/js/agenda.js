'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#sign-up-button").click(function() {
    	$("#sign_in_page").toggle();
    	$("#sign_up_page").toggle();
  	});

  	$("#sign-in-button").click(function() {
    	$("#sign_in_page").toggle();
    	$("#sign_up_page").toggle();
  	});

  	$("#sign-up-btn").click(function() {
    	$("#sign_in_page").toggle();
   		$("#sign_up_page").toggle();
  	});

	$(".todo-card").click(cardClick);
	$(".link-button").click(linkClick);
	$(".subtask-wrapper").click(toggleSubtaskAgenda);
	$(".btn-primary").click(linkClick);
	// $("#task-box-button").click(function(e) {
	// 	e.preventDefault();
	// 	$("#task-box").toggle(400);
	// 	if ($("#task-box-button").html() == "collapse") {
	// 		$("#task-box-button").html("expand");
	// 	} else {
	// 		$("#task-box-button").html("collapse");
	// 	}
	// });

	// $("#meeting-box-button").click(function(e) {
	// 	e.preventDefault();
	// 	$("#meeting-box").toggle(400);
	// 	if ($("#meeting-box-button").html() == "collapse") {
	// 		$("#meeting-box-button").html("expand");
	// 	} else {
	// 		$("#meeting-box-button").html("collapse");
	// 	}
	// });

	$("#completed-box-button").click(function(e) {
		e.preventDefault();
		$("#completed-box").toggle(400);
		if ($("#completed-box-button").html() == "hide") {
			$("#completed-box-button").html("show");
		} else {
			$("#completed-box-button").html("hide");
		}
	});

	/* google analytics code */
	$("#navbar-create-project").click(function(e) {
		ga('send','event','navbar', 'navbar button');
	});
	$(".original-btn").click(function(e) {
		ga('send','event','button','agenda page');
	});

}

function cardClick(e) {
	e.preventDefault();
	$("#detail" + this.id).toggle(400);
}

function linkClick(e) {
	e.stopPropagation();
	var id = $(this).attr('id');
	document.location.href = id;
}

function toggleSubtaskAgenda(e) {
	e.stopPropagation();
	var subtask = $("#subtask-name" + this.id);
	var checkbox = $("#subtask-checkbox" + this.id);
	console.log("hello");
	if ($(e.target).is("input")) {
		if(checkbox.prop('checked')) {
			subtask.css("text-decoration", "line-through");
			$.get("/subtasks/" + this.id + "/1", callbackAgenda)
		} else {
			subtask.css("text-decoration", "none");
			$.get("/subtasks/" + this.id + "/0", callbackAgenda)
		}
	} else {
		console.log(checkbox);
		if(!checkbox.prop('checked')) {
			subtask.css("text-decoration", "line-through");
			checkbox.prop('checked', true);
			$.get("/subtasks/" + this.id + "/1", callbackAgenda)
		} else {
			subtask.css("text-decoration", "none");
			checkbox.prop('checked', false);
			$.get("/subtasks/" + this.id + "/0", callbackAgenda)
		}
	}
}

function callbackAgenda(response) {
	var subtask_id = response[3];
	var bool = response[2];
	if(bool == 1) {
		var subtask = $("#task" + subtask_id);
		// subtask.fadeOut("slow", function () {
		// 	$(subtask).removeClass("task");
		// 	$(subtask).addClass("completed");
		// 	$(subtask).prependTo("#completed-box").fadeIn("slow");
		// });
		$(subtask).removeClass("subtask");
		$(subtask).addClass("completed");
	} else {
		var subtask = $("#task" + subtask_id);
		$(subtask).removeClass("completed");
		$(subtask).addClass("subtask");
	}
}


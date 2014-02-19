'use strict';
var numItem = 1;
var maxNumItem = 5;

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	// when task radio is selected
	$("#taskRadio").change(function() {
		$("#createMeeting").hide();
		$("#createTask").show();
	});
	$("#meetingRadio").change(function() {
		$("#createTask").hide();
		$("#createMeeting").show();
	});

	$("#add_item").click(function() {
		if (numItem < maxNumItem) {
			numItem++;
			$("#st" + numItem).show();
		} else {
			alert("Sorry, Can't add more item");
		}
	});
	$("#rmv_item").click(function() {
		if (numItem > 1) {
			$("#subtask" + numItem).val("");
			$("#assigned" + numItem).val("");
			$(".assignee_checkbox" + numItem).each(function() {
				this.checked = false;
			})
			$("#st" + numItem).hide();
			numItem--;
		} else {
			alert("Need at least one item to do");
		}
	});

	for (var i=1; i<maxNumItem + 1; i++) {
		(function(i) {
			$(".assignee_checkbox" + i).click(function() {
				var usr_string = "";
				$(".assignee_checkbox" + i).each(function() {
					if (this.checked) {
						usr_string += this.value + ","
					}
				})
				if (usr_string[usr_string.length - 1] == ",") {
					usr_string = usr_string.slice(0, usr_string.length - 1);
				}
				$("#assigned" + i).val(usr_string);
			});
		})(i);
	}
	$(".attendee_checkbox").click(function() {
		var usr_string = "";
		$(".attendee_checkbox").each(function() {
			if (this.checked) {
				usr_string += this.value + ","
			}
		})
		if (usr_string[usr_string.length - 1] == ",") {
			usr_string = usr_string.slice(0, usr_string.length - 1);
		}
		$("#attendees").val(usr_string);
	})
}
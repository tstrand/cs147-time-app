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

'use strict';

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
}
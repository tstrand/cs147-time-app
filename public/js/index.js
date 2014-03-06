/* Javascript file for the index page */

$(document).ready(function() {
  $("#sign-up-button").click(function() {
    $("#sign_in_page").toggle();
    $("#sign_up_page").toggle();
  });

  $("#sign-up-btn").click(function() {
    $("#sign_in_page").toggle();
    $("#sign_up_page").toggle();
    console.log("hihi");
  });

  $("#sign-in-button").click(function() {
    $("#sign_in_page").toggle();
    $("#sign_up_page").toggle();
  });
});
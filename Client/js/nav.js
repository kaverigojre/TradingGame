$(document).ready(function () {
  var user = null;
  if (localStorage.getItem("loggedInUser")) {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
    $("#dashboardbtn").attr("href", "index.html");
  } else if (localStorage.getItem("loggedInOrganiser")) {
    user = JSON.parse(localStorage.getItem("loggedInOrganiser"));
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
    $("#dashboardbtn").attr("href", "organiser.html");
    $("#profilename").html(user.name);
    $("#profileemail").html(user.email);
  } else {
    $("#loginbtn").removeClass("none");
    $("#profilebtn").addClass("none");
  }
});

import backendurl from "./backendurl.js";
let curUser = "user";

var user = null;
if (localStorage.getItem("loggedInUser")) {
  window.location.href = "index.html";
  user = JSON.parse(localStorage.getItem("loggedInUser"));
  $("#profilebtn").removeClass("none");
  $("#loginbtn").addClass("none");
  $("#dashboardbtn").attr("href", "userDashboard.html");
} else if (localStorage.getItem("loggedInOrganiser")) {
  window.location.href = "index.html";
  user = JSON.parse(localStorage.getItem("loggedInOrganiser"));
  $("#profilebtn").removeClass("none");
  $("#loginbtn").addClass("none");
  $("#dashboardbtn").attr("href", "organiser.html");
} else {
  $("#loginbtn").removeClass("none");
  $("#profilebtn").addClass("none");
}
$("#createnewuser").click(function () {
  window.location.href = "signup.html";
});
$("#createneworganiser").click(function () {
  window.location.href = "signup.html";
});
$("#userbtn").click(function () {
  $("#orgbtn").removeClass("active");
  $("#userbtn").addClass("active");
  $("#googlebtn").removeClass("none");
  // $(".createNewRestaurant").hide();
  curUser = "user";
});
$("#orgbtn").click(function () {
  $("#googlebtn").addClass("none");
  $("#userbtn").removeClass("active");
  $("#orgbtn").addClass("active");
  // $(".createNewUser").hide();
  curUser = "organiser";
});

$("#login").click(() => {
  let curemail = document.getElementById("username").value;
  let pass = document.getElementById("userpass").value;
  if (curemail == "") {
    alert("Please enter email");
    return;
  } else if (pass == "") {
    alert("Please enter password");
    return;
  }
  let obj = {
    email: curemail,
    password: pass,
  };
  if (curUser === "user") {
    $.ajax({
      type: "post",
      url: backendurl + "login/signin",
      contentType: "application/json",
      data: JSON.stringify(obj),
      xhrFields: { withCredentials: false },
      headers: {},
      success: function (data) {
        localStorage.removeItem("loggedInOrganiser");
        const parse = JSON.parse(data);

        if (parse.name === "admin") {
          window.location.href = "./Admin/html/index.html";
        } else {
          localStorage.setItem("loggedInUser", data);

          data = JSON.parse(data);
          localStorage.setItem("token", data.token);

          window.location.href = "index.html";
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInOrganiser");
        alert(xhr.responseText);
      },
    });
  } else {
    $.ajax({
      type: "post",
      url: backendurl + "login/signinOrganiser",
      contentType: "application/json",
      data: JSON.stringify(obj),
      xhrFields: { withCredentials: false },
      headers: {},
      success: function (data) {
        console.log("Success");
        console.log(typeof data);
        localStorage.removeItem("loggedInUser");
        localStorage.setItem("loggedInOrganiser", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      },
      error: function (xhr, ajaxOptions, thrownError) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInOrganiser");
        alert(xhr.responseText);
      },
    });
  }
  // localStorage.setItem('loggedInUser', curIndex);
});

import backendurl from "./backendurl.js";
let sigUser = "user";

$("#userbtn").click(function () {
  $("#orgbtn").removeClass("active");
  $("#userbtn").addClass("active");
  // $(".createNewRestaurant").hide();
  sigUser = "user";
});
$("#orgbtn").click(function () {
  $("#userbtn").removeClass("active");
  $("#orgbtn").addClass("active");
  // $(".createNewUser").hide();
  sigUser = "organiser";
});

$("#register").click(function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let password_repeat = document.getElementById("password-repeat").value;
  if (name == "") {
    alert("Please enter your name");

    return;
  }
  if (email == "") {
    alert("Please enter your email");
    return;
  }
  if (password == "") {
    alert("Please enter your password");
    return;
  }
  if (password_repeat == "") {
    alert("Please repeat your password");
    return;
  }
  if (password != password_repeat) {
    alert("Passwords do not match");
    return;
  }
  // let ind=-1;

  let curuser = {
    name: name,
    email: email,
    password: password,
    // isAdmin: false,
  };
  // curuser = JSON.stringify(curuser);
  // $.post(
  //   backendurl+"signup",
  //   curuser,
  //   function (xhr, status, responseText) {
  //     console.log("data", responseText);
  //     console.log("success", status);
  //   }
  // );
  console.log(curuser);
  if (sigUser === "user") {
    $.ajax({
      type: "post",
      url: backendurl + "register/signup",
      contentType: "application/json",
      data: JSON.stringify(curuser),
      xhrFields: { withCredentials: false },
      headers: {},
      success: function (data) {
        console.log("Success");
        // console.log(data);
        //   data = JSON.stringify(data);
        //localStorage.setItem("loggedInUser", data);
        alert("Registration successful");
        window.location.href = "signin.html";
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("got some error");
        alert(xhr.responseText);
      },
    });
  } else {
    $.ajax({
      type: "post",
      url: backendurl + "register/signupOrganiser",
      contentType: "application/json",
      data: JSON.stringify(curuser),
      xhrFields: { withCredentials: false },
      headers: {},
      success: function (data) {
        console.log("Success");
        // console.log(data);

        alert("Registration successful");
        window.location.href = "signin.html";
      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
      },
    });
  }
});

import backendurl from "./backendurl.js";
$(document).ready(async function () {
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("token", localStorage.getItem("token"));
    },
  });
 
  var user = null,
    usertype;
  if (localStorage.getItem("loggedInUser")) {
    usertype = "user";
    user = JSON.parse(localStorage.getItem("loggedInUser"));
     $("#navprofileimg").attr("src", user.img);
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
    $("#dashboardbtn").attr("href", "userDashboard.html");
  } else if (localStorage.getItem("loggedInOrganiser")) {
    usertype = "organiser";
    user = JSON.parse(localStorage.getItem("loggedInOrganiser"));
     $("#navprofileimg").attr("src", user.img);
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
    $("#dashboardbtn").attr("href", "organiser.html");
    $("#profilename").html(user.name);
    $("#profileemail").html(user.email);
  } else {
    $("#loginbtn").removeClass("none");
    $("#profilebtn").addClass("none");
  }
  var contests = $("#contests-container");

  var usercontests = new Map();

  var timer = 0;

  const processTimer = async (res, type) => {
    for (let i = 0; i < res.length; i++) {
      if (type == "Active") {
        var time = new Date(res[i].endTime) - Date.now();

        var timediff = new Date(res[i].endTime) - new Date(res[i].startTime);
        var timetillnow = Date.now() - new Date(res[i].startTime);
        var progress = Math.floor((timetillnow / timediff) * 100);
        progress = progress.toString();
        progress += "%";
        document.getElementById(res[i]._id + "progress").style.width = progress;
      } else {
        var time = new Date(res[i].startTime) - Date.now();
      }

      if (time > 0) {
        var temp1 = new Date(res[i].endTime);
        var temp2 = new Date(res[i].startTime);
        // console.log(res[i].name,temp1,temp2);
        var delta = Math.abs(time) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        var seconds = Math.floor(delta % 60);

        var showtime = "";
        showtime += days > 0 ? days + "days " : "";
        showtime += hours > 0 ? hours + " hours " : "";
        showtime += minutes > 0 ? minutes + " minutes " : "";
        showtime += seconds + " seconds";
        // console.log(res[i]._id+type)
        document.getElementById(res[i]._id).innerHTML = showtime;
      }
    }
  };
  // API call to get contests in which user participated

  const fetchContestdata = async (type) => {
    $.ajax({
      type: "get",
      url: backendurl + "contest/getcontests?status=" + type + "&limit=" + 3,
      contentType: "application/json",

      xhrFields: {
        withCredentials: false,
      },
      headers: {},
      success: function (res) {
        contests.empty();
        var timers = new Array(res.length);
        for (let i = 0; i < res.length; i++) {
          var prize = res[i].prize,
            id = res[i]._id,
            endtime = new Date(res[i].endTime),
            name = res[i].name;
          var cardbtn =
            type == "Pending"
              ? `<span><button id="` +
                res[i]._id +
                `" class="btn btn-outline-primary cardbtn participatebtn" >Participate</button></span>`
              : `<span>
               <a href="leaderboard.html#` +
                res[i]._id +
                `"><button class="btn btn-outline-primary cardbtn">
                 Leaderboard
               </button></a>
             </span>`;
          if (type == "Pending" && usercontests.has(res[i]._id)) {
            cardbtn =
              `<span><button id="` +
              res[i]._id +
              `" class="btn btn-outline-success cardbtn participatebtn" >Participated</button></span>`;
          }
          if (type == "Active" && usercontests.has(res[i]._id))
            cardbtn =
              `<span><a href="contest.html#` +
              res[i]._id +
              `"><button class="btn btn-outline-primary cardbtn">Enter</button></span></a>`;

          var endstart = type == "Active" ? "Ends In" : "Starts On";
          if (type == "Completed") endstart = "";

          var badgestyle = type == "Active" ? "badge-active" : "badge-upcoming";
          if (type == "Completed") badgestyle = "badge-completed";
          var item =
            `   <div class="col-md-4 mt-3" id="` +
            name +
            `">
              <div class="card p-3 mb-2">
                <div class="d-flex justify-content-between">
                  <div class="d-flex flex-row align-items-center">
                    <div class="ms-2 c-details">
                      <h6 class="mb-0">Prize</h6>
                      <span class="prize">` +
            prize +
            `</span>
                    </div>
                  </div>
                  <div class="badge ` +
            badgestyle +
            `"><span>` +
            type +
            `</span></div>
                </div>
                <div class="mt-5">
                  <h3 class="heading name">` +
            name +
            `</h3>
                  <div class="mt-5">
                    <div class="progress">
                      <div
                      id="` +
            id +
            `progress"
                        class="progress-bar"
                        role="progressbar"
                        style="width: 100%"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div class="mt-3">
                      <span class="text1"
                        >` +
            endstart +
            ` <span class="text2" id="` +
            id +
            `"></span></span
                      >` +
            cardbtn +
            `
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
          contests.append(item);
        }

        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(() => {
          processTimer(res, type);
        }, 1000);
        $(".participatebtn").click(function () {
          console.log(this.id);

          $.ajax({
            type: "post",
            url: backendurl + "participate/add",
            contentType: "application/json",
            data: JSON.stringify({ contestId: this.id, userId: user.userid }),
            xhrFields: {
              withCredentials: false,
            },
            headers: {},
            success: function (res) {
              console.log("Entered Successfully");
            },
            error: function (err) {
              console.log(err.responseText);
            },
          });
        });
      },
      error: function () {
        console.log(
          "We are sorry but our servers are having an issue right now"
        );
      },
    });
  };

  const getUsercontests = async () => {
    var obj = {
      _id: user.userid,
    };
    $.ajax({
      type: "post",
      url: backendurl + "contest/getusercontests",
      contentType: "application/json",
      data: JSON.stringify(obj),
      xhrFields: {
        withCredentials: false,
      },
      headers: {},
      success: function (res) {
        for (let i = 0; i < res.length; i++) {
          usercontests.set(res[i], 1);
        }
        fetchContestdata("Active");
      },
      error: function () {
        console.log(
          "We are sorry but our servers are having an issue right now" + re
        );
      },
    });
  };

  if (usertype === "user") getUsercontests();
  if (usertype != "user") fetchContestdata("Active");
  $("#logoutbtn").click(() => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInOrganiser");
    localStorage.removeItem("token");
    window.location.href = "signin.html";
  });
});

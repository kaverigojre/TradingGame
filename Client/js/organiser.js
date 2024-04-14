import backendurl from "./backendurl.js";
$(document).ready(async function () {
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("token", localStorage.getItem("token"));
    },
  });
  var user = null;
  if (localStorage.getItem("loggedInUser")) {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
     $("#navprofileimg").attr("src", user.img);
   
    $("#dashboardbtn").attr("href", "userDashboard.html");
  } else if (localStorage.getItem("loggedInOrganiser")) {
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
  $("#logoutbtn").click(() => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInOrganiser");

    localStorage.removeItem("token");
    window.location.href = "signin.html";
  });
  $("#profileimg").click(() => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      let files = Array.from(input.files);
      console.log(files);
      var fd = new FormData();

      fd.append("image", files[0]);

      $.ajax({
        type: "post",
        url: backendurl + "upload/uploadimg",
        contentType: false,
        processData: false,
        data: fd,
        xhrFields: {
          withCredentials: false,
        },
        headers: {},
        success: function (res) {
          console.log(res);
          $.ajax({
            type: "post",
            url: backendurl + "organiser/organiserprofilechange",
            contentType: "application/json",
            headers: {},
            data: JSON.stringify({ id: user.userid, img: res }),
            xhrFields: {
              withCredentials: false,
            },
            headers: {},
            success: function (res) {
              console.log(res);
              window.location.reload();
            },
            error: function (err) {
              console.log(
                "We are sorry but our servers are having an issue right now" +
                  err.responseText
              );
            },
          });
        },
        error: function () {
          console.log(
            "We are sorry but our servers are having an issue right now"
          );
        },
      });
    };
    input.click();
  });

  $.ajax({
    type: "post",
    url: backendurl + "organiser/getorganiser",
    contentType: "application/json",
    data: JSON.stringify({ organiserId: user.userid }),
    xhrFields: {
      withCredentials: false,
    },
    headers: {},
    success: function (res) {
      //Bar Chart
      const ctx = document.getElementById("barChart");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: res.barchartlabels,
          datasets: [
            {
              label: "Participants",
              data: res.barchartdata,
              borderWidth: 1,
            },
          ],
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      });

      // Line Chart
      const ctx1 = document.getElementById("lineChart");

      new Chart(ctx1, {
        type: "line",
        data: {
          labels: res.linechartlabels,
          datasets: [
            {
              label: "Earned",
              data: res.linechartdata1,
              fill: false,
              borderColor: "rgb(0, 255, 0)",
              tension: 0.1,
            },
            {
              label: "Spent",
              data: res.linechartdata2,
              fill: false,
              borderColor: "rgb(255, 0, 0)",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
            },
          },
        },
      });
      $("#profileimg").attr("src", res.img);
      $("#wallet").html("$" + res.wallet);
      $("#totalprize").html("$" + res.totalspent);
      $("#totalearned").html("$" + res.totalearned);
      $("#contestscount").html(+res.contestscount);
    },
    error: function (err) {
      console.log(
        "We are sorry but our servers are having an issue right now",
        err.responseText
      );
    },
  });

  var activebtn = $("#activebtn"),
    pastbtn = $("#pastbtn"),
    upcomingbtn = $("#upcomingbtn"),
    contests = $("#contests-container"),
    contesttype = $("#contesttype");

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
      type: "post",
      url: backendurl + "contest/getorganisercontests",
      contentType: "application/json",
      data: JSON.stringify({ _id: user.userid, status: type }),
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
              ? ""
              : `<span>
               <a href="leaderboard.html#` +
                res[i]._id +
                `"><button class="btn btn-outline-primary cardbtn">
                 Leaderboard
               </button></a>
             </span>`;

            var delbtn =  type=="Pending"?`<button id="d`+id+`" class="btn btn-danger deletebtn " style="width: 40%">
                 Delete
               </button>`:'';

          var endstart = type == "Active" ? "Ends In" : "Starts On";
          if (type == "Completed") endstart = "";

          var badgestyle = type == "Active" ? "badge-active" : "badge-upcoming";
          if (type == "Completed") badgestyle = "badge-completed";
          var item =
            `   <div class="col-md-4 mt-3">
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
                  <h3 class="heading">` +
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
                        style="width: 0%"
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
            `"></span><br/></span
                      >` +
            cardbtn +
            delbtn+
            `` +
            `
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
          contests.append(item);
        }
        $(".deletebtn").click(function(){
          console.log(this);
            $.ajax({
              type: "post",
              url: backendurl + "contest/delete",
              contentType: "application/json",
              data: JSON.stringify({
               id:this.id.substring(1)
              }),
              xhrFields: {
                withCredentials: false,
              },
              headers: {},
              success: function (res) {
                console.log(res);
                window.location.reload();
              },
              error: function (res) {
                console.log(res.responseText);
              },
            });
          
        })

        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(() => {
          processTimer(res, type);
        }, 1000);
      },
      error: function () {
        console.log(
          "We are sorry but our servers are having an issue right now"
        );
      },
    });
  };
  fetchContestdata("Active");
  activebtn.click(() => {
    activebtn.addClass("active");
    pastbtn.removeClass("active");
    upcomingbtn.removeClass("active");
    contesttype.html("ACTIVE");
    contests.empty();

    fetchContestdata("Active");
  });
  pastbtn.click(() => {
    activebtn.removeClass("active");
    pastbtn.addClass("active");
    upcomingbtn.removeClass("active");
    contesttype.html("PAST");
    contests.empty();
    fetchContestdata("Completed");
  });

  upcomingbtn.click(() => {
    activebtn.removeClass("active");
    pastbtn.removeClass("active");
    upcomingbtn.addClass("active");
    contesttype.html("UPCOMING");
    contests.empty();
    fetchContestdata("Pending");
  });

  $("#passwordbtn").click(() => {
    var in1 = $("#password1"),
      in2 = $("#password2");
    if (in1.val() && in2.val() && in1.val() == in2.val()) {
      $.ajax({
        type: "post",
        url: backendurl + "login/changepassword",
        contentType: "application/json",
        data: JSON.stringify({
          id: user.userid,
          type: "organiser",
          changePassword: in1.val(),
        }),
        xhrFields: {
          withCredentials: false,
        },
        headers: {},
        success: function (res) {
          console.log(res);
        },
        error: function (res) {
          console.log(res.responseText);
        },
      });
    } else {
      alert("Passwords doesn't match or Empty");
    }
  });

  $("#addwalletbtn").click(() => {
    var in1 = $("#walletamount");

    if (in1.val()) {
      $.ajax({
        type: "post",
        url: backendurl + "organiser/addwalletorganiser",
        contentType: "application/json",
        data: JSON.stringify({
          id: user.userid,
          price: in1.val(),
        }),
        xhrFields: {
          withCredentials: false,
        },
        headers: {},
        success: function (res) {
          window.location.href = "organiser.html";
        },
        error: function (res) {
          console.log(res.responseText);
        },
      });
    } else {
      alert("Passwords doesn't match or Empty");
    }
  });

  $(".openorderModal").click(function () {
    $("#buyModal").modal({ show: true });
  });

  $(".openchangepasswordModal").click(function () {
    $("#passwordModal").modal({ show: true });
  });
  $(".openwalletModal").click(function () {
    $("#walletModal").modal({ show: true });
  });

  $("#addcontestbtn").click(function () {
    var name = $("#contestname").val(),
      prize = $("#prize").val(),
      entryfee = $("#entryfee").val(),
      balance = $("#balance").val(),
      startTime = $("#startTime").val(),
      endTime = $("#endTime").val();
    if (!name || !prize || !entryfee || !startTime || !endTime || !balance) {
      console.log("Something went Wrong");
    } else {
      var obj = {
        name: name,
        prize: prize,
        fees: entryfee,
        organisedBy: user.userid,
        startTime: startTime,
        endTime: endTime,
        balance: balance,
      };

      $.ajax({
        type: "post",
        url: backendurl + "contest/create",
        contentType: "application/json",
        data: JSON.stringify(obj),
        xhrFields: {
          withCredentials: false,
        },
        headers: {},
        success: function (res) {
          console.log(res);
          window.location.reload();
        },
        error: function (res) {
          console.log(res);
        },
      });
    }
  });
});

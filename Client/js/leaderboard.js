import backendurl from "./backendurl.js";

var user = null;
if (localStorage.getItem("loggedInUser")) {
  user = JSON.parse(localStorage.getItem("loggedInUser"));
  $("#navprofileimg").attr("src", user.img);
  $("#profilebtn").removeClass("none");
  $("#loginbtn").addClass("none");
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
  window.location.href = "signin.html";
});
var leaderBoardid = window.location.hash.substring(1);

const obj = {
  contestId: leaderBoardid,
};

$.ajax({
  type: "POST",
  url: backendurl + "contest/getContestParticipant",
  contentType: "application/json",
  data: JSON.stringify({ contestId: leaderBoardid, userId: user.userid }),
  xhrFields: { withCredentials: false },

  success: function (data) {
    $("#contestname").html(data.contest.name);
    $("#organisername").html(data.contest.organisedBy.name);
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

$.ajax({
  type: "POST",
  url: backendurl + "contest/leaderBoard",
  contentType: "application/json",
  data: JSON.stringify(obj),
  xhrFields: { withCredentials: false },

  success: function (data) {
    $(document).ready(function () {
      if (data.length >= 3) {
        const card =
          `<div class="col-sm-4">
					<div class="leaderboard-card ` +
          first +
          `">
						<div class="leaderboard-card__top">
							<h3 class="text-center">$` +
          data[1].totalBalance +
          `</h3>
						</div>
						<div class="leaderboard-card__body">
							<div class="text-center">
								<img src="` +
          data[1].img +
          `" class="circle-img mb-2" alt="User Img">
								<h5 class="mb-0">` +
          data[1].name +
          `</h5>
								
								<hr>
								
							</div>
						</div>
					</div>
				</div>
          `;
        $("#topgainers").append(card);

        for (let i = 0; i < 3 && i < data.length; i++) {
          var first = " leaderboard-card--first";
          if (i != 0) first = "";
          if (i != 1) {
            const card =
              `<div class="col-sm-4">
					<div class="leaderboard-card ` +
              first +
              `">
						<div class="leaderboard-card__top">
							<h3 class="text-center">$` +
              data[i].totalBalance +
              `</h3>
						</div>
						<div class="leaderboard-card__body">
							<div class="text-center">
								<img src="` +
              data[i].img +
              `" class="circle-img mb-2" alt="User Img">
								<h5 class="mb-0">` +
              data[i].name +
              `</h5>
								
								<hr>
								
							</div>
						</div>
					</div>
				</div>
          `;
            $("#topgainers").append(card);
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        const item =
          `<tr>
						<td>
							<div class="d-flex align-items-baseline">
								<h4 class="mr-1">` +
          (i + 1) +
          `</h4>
							</div>
						</td>
						<td>
							<div class="d-flex align-items-center">
								<div class="user-info__basic">
									<h5 class="mb-0">` +
          data[i].name +
          `</h5>
									
								</div>
							</div>
						</td>
						<td>
							<div class=" align-items-baseline text-primary">
								<h4 class="mr-1">` +
          data[i].totalBalance +
          `</h4>
							</div>
						</td>
					
					</tr>`;

        $("#leaderboardtable").append(item);
      }
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

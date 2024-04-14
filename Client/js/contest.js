import backendurl from "./backendurl.js";
$(document).ready(function () {
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("token", localStorage.getItem("token"));
    },
  });
  let contestId = window.location.hash.substring(1);
  let activeAccordion = "stocks";

  var user = null,
    usertype;
  if (localStorage.getItem("loggedInUser")) {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
    usertype = "user";
    $("#profilebtn").removeClass("none");
    $("#loginbtn").addClass("none");
    $("#dashboardbtn").attr("href", "userDashboard.html");
    $("#navprofileimg").attr("src", user.img);
  } else if (localStorage.getItem("loggedInOrganiser")) {
    user = JSON.parse(localStorage.getItem("loggedInOrganiser"));
    usertype = "organiser";
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

  let selectedDialog = -1;
  let radioValue = "limit";
  let newStockPriceRender = (id, curprice) => {
    let priceString = $(`#${id}`).find(".curprice").html();
    let oldprice = parseFloat(priceString.substring(1));
    // console.log(oldprice);
    if (oldprice != curprice) {
      let percChange = (((curprice - oldprice) * 100) / oldprice).toFixed(3);
      if (percChange > 0) {
        $(`#${id}`).find(".priceMovements").removeClass("priceUp");
        $(`#${id}`).find(".priceMovements").removeClass("priceDown");
        $(`#${id}`).find(".priceMovements").addClass("priceUp");
      } else {
        $(`#${id}`).find(".priceMovements").removeClass("priceDown");
        $(`#${id}`).find(".priceMovements").removeClass("priceUp");
        $(`#${id}`).find(".priceMovements").addClass("priceDown");
      }
      // console.log("PERC", percChange);
      $(`#${id}`).find(".curprice").html(`&#8377;${curprice}`);
      $(`#${id}`).find(".percChange").html(`${percChange}`);
    }
  };
  let portfolioChangeRender = (id, oldprice, curprice) => {
    // let oldprice = $(`#stock${id}`).find(".curprice").html();
    // console.log(id,oldprice);
    oldprice = parseFloat(oldprice.substring(1));
    let percChange = (((curprice - oldprice) * 100) / oldprice).toFixed(3);
    if (percChange > 0) {
      $(`#stock${id}`).find(".percMovements").removeClass("priceUp");
      $(`#stock${id}`).find(".percMovements").removeClass("priceDown");
      $(`#stock${id}`).find(".percMovements").addClass("priceUp");
    } else {
      $(`#stock${id}`).find(".percMovements").removeClass("priceDown");
      $(`#stock${id}`).find(".percMovements").removeClass("priceUp");
      $(`#stock${id}`).find(".percMovements").addClass("priceDown");
    }
    $(`#stock${id}`).find(".percChange").html(`${percChange}%`);
  };
  const socket = io("ws://localhost:3007");//"wss://socket.tradebattle.in");
  socket.on("connection", function (msg) {
    console.log(msg);
    // socket.emit("newUser", "Hello darling");
    //   socket.emit("newUser", { name: curname, id: id }, "Hello darling");
  });

  socket.on("priceChange", function (data) {
    console.log(data);
    if (activeAccordion === "stocks") {
      // console.log(data);
      newStockPriceRender(data.stock, parseFloat(data.price.$numberDecimal));
    } else if (activeAccordion === "portfolio") {
      // let oldprice = $(`#stock${data.stock}`).find(".curprice").html();
      let oldprice = $(`#buyprice${data.stock}`).html();
      // console.log("OLD:", oldprice, data);
      if (oldprice)
        portfolioChangeRender(
          data.stock,
          oldprice,
          parseFloat(data.price.$numberDecimal)
        );
    }
  });

  $("#leaderboardbtn").attr("href", "leaderboard.html#" + contestId);

  let contest, participant;
  let stockData;
  let fetchPortfolio = () => {
    activeAccordion = "portfolio";
    $.ajax({
      type: "POST",
      url: backendurl + "participate/portfolio",
      contentType: "application/json",
      data: JSON.stringify({
        contestId: contestId,
        userId: user.userid,
      }),
      xhrFields: { withCredentials: false },
      headers: {
        // token: "" + token,
        // email: "" + user.email,
      },
      success: function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let stock = data[i];
          $("#stockList").append(`<div class="col-md-12 stockitem" id="stock${
            stock._id
          }">
            <div class="course mx-auto">
              <div class="course-preview " style="text-align: center">
                <img  class="mt-3" src="${stock.img}" style="width:70px;">
              </div>
              <div
                class="course-info row justify-content-between"
                style="text-align: center"
              >
                <div class="col-12 col-md-3">
                  <h6>${stock.name}</h6>
                </div>
                <div class="col-12 col-md-2">
                <h6>QTY :<span class="fwt-700">${stock.qty}</span></h6>
              </div>
                <div class="col-12 col-md-3 priceMovements ">
                  <h4 class="fwt-700 curprice" id="buyprice${
                    stock._id
                  }">&#8377;${stock.buyprice.$numberDecimal}</h4>
                </div>
                <div class="col-12 col-md-3 percMovements priceUp">
                <h5 class="fwt-700 percChange" id="percChange${stock._id}">${(
            ((stock.curprice.$numberDecimal - stock.buyprice.$numberDecimal) *
              100) /
            stock.buyprice.$numberDecimal
          ).toFixed(3)}%</h5>
              </div>
                </div>
              </div>
            </div>
            </div>
            `);
          // let curPercChange = (
          //   ((stock.curprice.$numberDecimal - stock.buyprice.$numberDecimal) *
          //     100) /
          //   stock.buyprice.$numberDecimal
          // ).toFixed(3);
          // if(curPercChange<0){

          // }
          portfolioChangeRender(
            stock._id,
            "R" + stock.buyprice.$numberDecimal,
            stock.curprice.$numberDecimal
          );
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {},
    });
  };
  $.ajax({
    type: "POST",
    url: backendurl + "contest/getContestParticipant",
    contentType: "application/json",
    data: JSON.stringify({
      contestId: contestId,
      userId: user.userid,
    }),
    xhrFields: { withCredentials: false },
    headers: {
      // token: "" + token,
      // email: "" + user.email,
    },
    success: function (data) {
      console.log(data);
      contest = data.contest;
      participant = data.participant;
      if (!contest) {
        window.location.href = "/Client/contests.html";
      }
      var balance = parseFloat(participant.balance.$numberDecimal);
      balance = Math.round((balance + Number.EPSILON) * 100) / 100;
      const showtime = () => {
        var time = new Date(contest.endTime) - Date.now();

        if (time > 0) {
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
          showtime += days > 0 ? days + "D " : "";
          showtime += hours > 0 ? hours + "H " : "";
          showtime += minutes > 0 ? minutes + "M " : "";
          showtime += seconds > 0 ? seconds + "S " : "";
          if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            window.location.href = "contests.html";
          }
        }
        $("#time").html(showtime);
      };
      setInterval(() => {
        showtime();
      }, 1000);
      $("#balance").html(balance);
      $("#ContestName").html(contest.name);
      $("#UserCount").html(contest.participant.length);
      $("#prize").html("&#8377;" + contest.prize);
      $("#organiser").html(contest.organisedBy.name);
      if (participant) {
        fetchStocksData();
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // console.log(xhr.responseText);
      window.location.href = "/Client/contests.html";
    },
  });

  let fetchStocksData = () => {
    activeAccordion = "stocks";
    $.get(backendurl + "stocks/", function (obj, status) {
      if (status === "success") {
        console.log(obj, status);
        for (let i = 0; i < obj.length; i++) {
          let stock = obj[i];
          stockData = obj;
          $("#stockList")
            .append(`<div class="col-md-12 stockitem" id="${stock._id}">
              <div class="course mx-auto">
                <div class="course-preview " style="text-align: center">
                  <img  class="mt-3" src="${stock.img}" style="width:70px;">
                </div>
                <div
                  class="course-info row justify-content-between"
                  style="text-align: center"
                >
                  <div class="col-12 col-md-3">
                    <h6>${stock.name}</h6>
                  </div>
                  
                  <div class="col-12 col-md-3 priceMovements priceUp">
                    <h4 class="fwt-700 curprice">&#8377;${stock.curprice.$numberDecimal}</h4>
                    <h6 class="fwt-700 percChange">+1.25%</h6>
                  </div>
                  <div class="col-12 col-md-3">
                    <div>
                      <button class="btn btn-outline-primary openorderModal" id="openorderModal${i}" style="">Order</button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              `);
        }
        //opening Order modal
        $(".openorderModal").click(function () {
          console.log(this.id);
          selectedDialog = parseInt(this.id.substr(14));
          console.log(selectedDialog);
          $("#OrderModal").html(
            "Place Order for " + stockData[selectedDialog].name
          );
          $("#buyModal").modal({ show: true });
          radioValue = $("input[name='OrderType']:checked").val();
          console.log(radioValue);
        });
        //on closing Order Modal
        $("#buyModal").on("hidden.bs.modal", function (e) {
          selectedDialog = -1;
          console.log(selectedDialog);
          $("#orderQty").val("");
          $("#reqPrice").val("");
        });

        // Change order type
        $("input[type='radio']").click(function () {
          radioValue = $("input[name='OrderType']:checked").val();
          if (radioValue) {
            console.log(radioValue);
          }
          if (radioValue === "market") {
            $("#reqPrice").prop("disabled", true);
          } else {
            $("#reqPrice").prop("disabled", false);
          }
        });

        $(".orderbtn")
          .unbind("click")
          .bind("click", function (e) {
            e.preventDefault();
            // console.log(backendurl);
            // console.log("Order Bought");
            let orderType = this.id;
            console.log(orderType);
            let qty = $("#orderQty").val();
            let reqPrice = $("#reqPrice").val();
            console.log(qty, reqPrice);
            if (radioValue === "market" && qty) {
              console.log("market");
              orderType = orderType === "buyOrder" ? "BUY" : "SELL";
              console.log(orderType);
              let orderObj = {
                contestId: contestId,
                userId: user.userid,
                stocks: [
                  {
                    ticker: stockData[selectedDialog].ticker,
                    qty: qty,
                  },
                ],
              };
              console.log(orderObj);
              if (orderType === "SELL") {
                console.log("HELLO");
                $.ajax({
                  type: "post",
                  url: backendurl + "participate/sellStocks",
                  contentType: "application/json",
                  data: JSON.stringify(orderObj),
                  xhrFields: {
                    withCredentials: false,
                  },
                  headers: {},
                  success: function (res) {
                    console.log(res);
                    window.location.reload();
                  },
                  error: function (err) {
                    alert(err.responseText);
                    console.log(err);
                    console.log(
                      "We are sorry but our servers are having an issue right now"
                    );
                  },
                });
              } else {
                $.ajax({
                  type: "post",
                  url: backendurl + "participate/buyStocks",
                  contentType: "application/json",
                  data: JSON.stringify(orderObj),
                  xhrFields: {
                    withCredentials: false,
                  },
                  headers: {},
                  success: function (res) {
                    console.log(res);
                    window.location.reload();
                  },
                  error: function (err) {
                    alert(err.responseText);
                    console.log(err);
                    console.log(
                      "We are sorry but our servers are having an issue right now"
                    );
                  },
                });
              }
            } else if (radioValue === "limit" && qty && reqPrice) {
              console.log("limit");

              orderType = orderType === "buyOrder" ? "BUY" : "SELL";
              console.log(orderType);
              let orderObj = {
                contestId: contestId,
                userId: user.userid,

                stocks: [
                  { ticker: stockData[selectedDialog].ticker, qty: qty },
                ],
                transactiontype: orderType,
                required_price: reqPrice,
              };
              console.log(orderObj);
              $.ajax({
                type: "post",
                url: backendurl + "participate/putorder",
                contentType: "application/json",
                data: JSON.stringify(orderObj),
                xhrFields: {
                  withCredentials: false,
                },
                headers: {},
                success: function (res) {
                  console.log(res);
                  window.location.reload();
                },
                error: function (err) {
                  alert(err.responseText);
                  // console.log(err);
                  console.log(
                    "We are sorry but our servers are having an issue right now"
                  );
                },
              });
            } else {
              console.log("Check your input");
            }
          });
        // $("#sellOrder").click(function () {
        //   console.log("Order Sold");
        //   console.log(stockData[selectedDialog].name);
        // });
      }
    });
  };

  let fetchOrderHistory = (contestId, userid) => {
    $.ajax({
      type: "post",
      url: backendurl + "participate/orderHistory",
      contentType: "application/json",
      data: JSON.stringify({
        contestId: contestId,
        userId: user.userid,
      }),
      xhrFields: {
        withCredentials: false,
      },
      headers: {},
      success: function (res) {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          let order = res[i];
          $("#stockList")
            .append(`<div class="col-md-12 orderitem" id="${order._id}">
            <div class="course mx-auto">
              <div class="course-preview " style="text-align: center">
                <img  class="mt-3" src="${order.ticker.img}" style="width:70px;">
              </div>
              <div
                class="course-info row justify-content-between"
                style="text-align: center"
              >
                <div class="col-12 col-md-2">
                  <h6>${order.ticker.name}</h6>
                </div>
                <div class="col-12 col-md-2">
                  <h6>QTY :<span class="fwt-700">${order.qty}</span></h6>
                </div>
                <div class="col-12 col-md-2">
                  <h6>Type :<span class="fwt-700">${order.transactiontype}</span></h6>
                </div>
                <div class="col-12 col-md-2 ">
                  <h4 class="fwt-700 curprice">&#8377;${order.required_price.$numberDecimal}</h4>
                </div>
                <div class="col-12 col-md-2 orderStatus">
                  <div id="orderStatus${i}">
                  </div>
                </div>
              </div>
            </div>
            </div>
            `);
          if (order.status === "Pending") {
            $(`#orderStatus${i}`).append(`
            <button class="btn btn-outline-primary cancelorderModal" id="cancelorderModal${i}" style="">Cancel</button>
            `);
          } else {
            $(`#orderStatus${i}`).append(`
            <h3><span class="badge badge-info">${order.status}</span></h3>
            `);
          }
        }
        $(".cancelorderModal").click(function () {
          // console.log(this.id);
          let ind = parseInt(this.id.substr(16));
          let id = res[ind]._id;
          // console.log(ind);
          // console.log(res[ind]._id);
          $.ajax({
            type: "post",
            url: backendurl + "order/cancel",
            contentType: "application/json",
            data: JSON.stringify({
              id: id,
            }),
            xhrFields: {
              withCredentials: false,
            },
            headers: {},
            success: function (res) {
              console.log("QQQQQQ", res);
              window.location.reload();
            },
            error: function (err) {
              console.log(err);
            },
          });
        });
      },
      error: function (err) {
        console.log(err);
        console.log(
          "We are sorry but our servers are having an issue right now"
        );
      },
    });
  };
  let portfoliobtn = $("#portfoliobtn");
  let stocksbtn = $("#stocksbtn");
  let historybtn = $("#historybtn");
  let contesttype = $("#contesttype");
  let stocks = $("#stockList");
  portfoliobtn.click(() => {
    portfoliobtn.addClass("active");
    stocksbtn.removeClass("active");
    historybtn.removeClass("active");
    contesttype.html("PORT<span class='fwt-700'>FOLIO</span>");
    stocks.empty();
    fetchPortfolio();
  });
  stocksbtn.click(() => {
    portfoliobtn.removeClass("active");
    stocksbtn.addClass("active");
    historybtn.removeClass("active");
    contesttype.html("ALL <span class='fwt-700'>STOCKS</span>");
    stocks.empty();
    fetchStocksData();
  });

  historybtn.click(() => {
    portfoliobtn.removeClass("active");
    stocksbtn.removeClass("active");
    historybtn.addClass("active");
    contesttype.html("ORDER <span class='fwt-700'>HISTORY</span>");
    stocks.empty();
    fetchOrderHistory(contestId, user.userid);
  });

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
});

/* <div class="col-md-12 stockitem">
<div class="course mx-auto">
  <div class="course-preview bg-primary" style="text-align: center">
    <h6 class="ticker">AAPL</h6>
  </div>
  <div
    class="course-info row justify-content-between"
    style="text-align: center"
  >
    <div class="col-12 col-md-3">
      <h6>Apple Inc.</h6>
    </div>
    <div class="col-12 col-md-3">
      <h6>QTY :<span class="fwt-700">91</span></h6>
    </div>
    <div class="col-12 col-md-3">
      <h4 class="fwt-700" style="color: rgb(230, 52, 12)">
        $1191.47
      </h4>
      <h6 class="fwt-700" style="color: rgb(230, 52, 12)">+1.25%</h6>
    </div>
    <div class="col-12 col-md-3">
      <div>
        <button class="btn btn-outline-primary" style="">Buy</button>
        <button class="btn btn-outline-danger" style="">Sell</button>
      </div>
    </div>
  </div>
</div>
</div> */

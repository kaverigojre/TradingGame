/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/

import backendurl from "../../../../../js/backendurl.js";

$.ajax({
  type: "POST",
  url: backendurl+"admin/chartOrganiser",
  contentType: "application/json",
  xhrFields: { withCredentials: false },
  success: function (data) {
    var xValues = [];
    var yValues = [];
    for (let i = 0; i < data.length; i++) {
      xValues.push(data[i][0]);
      yValues.push(data[i][1]);
    }
    var barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("barchart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Organiser Vs Number of Contest",

            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
          text: "World Wine Production 2018",
        },
      },
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

$.ajax({
  type: "POST",
  url: backendurl+"admin/lineChart",
  contentType: "application/json",
  xhrFields: { withCredentials: false },
  success: function (data) {
    console.log(data);

    var xValues = [];
    var yValues = [];
    for (let i = 0; i < data.length; i++) {
      xValues.push(+data[i]._id);
      yValues.push(+data[i].count);
    }

    new Chart("line", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            fill: false,
            lineTension: 0,
            label: "Number of contest per Day",
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { min: 6, max: 16 } }],
        },
      },
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

$.ajax({
  type: "POST",
  url: backendurl+"admin/pieChart",
  contentType: "application/json",
  xhrFields: { withCredentials: false },
  success: function (data) {
    console.log(data);

    var xValues = [];
    var yValues = [];
    for (let i = 1; i < data.length; i++) {
      xValues.push(data[i]._id);
      yValues.push(data[i].count);
    }
    const ctx = document.getElementById("pieChart");

    new Chart(ctx, {
      type: "doughnut",
      radius: "1%",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Number of Contest",
            data: yValues,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      },
    });

    // var barColors = [
    //   "#b91d47",
    //   "#00aba9",
    //   "#2b5797",
    //   "#e8c3b9",
    //   "#1e7145"
    // ];

    // new Chart("pieChart", {
    //   type: "pie",
    //   data: {
    //     labels: xValues,
    //     datasets: [{
    //       backgroundColor: barColors,
    //       data: yValues
    //     }]
    //   },
    //   options: {

    //     title: {
    //       display: true,
    //       text: "World Wide Wine Production 2018"
    //     },

    //     maintainAspectRatio: false
    //   }
    // });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

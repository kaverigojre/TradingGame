import backendurl from "../../../js/backendurl.js";
$.ajax({
  type: "POST",
  url: backendurl + "admin/getOrganisers",
  contentType: "application/json",
  // data: JSON.stringify(obj),
  xhrFields: { withCredentials: false },
  headers: {},
  success: function (data) {
    $(document).ready(function () {
      var table = $("#dynamicTable").DataTable({
        data: data,

        columns: [
          { data: "_id", title: "#id" },
          { data: "name", title: "Name" },

          { data: "email", title: "Email" },
          { data: "wallet.$numberDecimal", title: "Wallet" },

          {
            data: function (row) {
              const id = row._id;
              return (
                `<button class="btn btn-danger" onclick=remove('` +
                id +
                `')>remove</button>`
              );
            },
            title: "action",
          },
        ],
      });
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
  },
});

function remove(id) {
  const obj = {
    id: id,
  };
  console.log;

  $.ajax({
    type: "POST",
    url: backendurl + "admin/removeOrganiser",
    contentType: "application/json",
    data: JSON.stringify(obj),
    xhrFields: { withCredentials: false },
    headers: {},
    success: function (data) {
      console.log(data);
      window.location.reload();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.responseText);
    },
  });
}

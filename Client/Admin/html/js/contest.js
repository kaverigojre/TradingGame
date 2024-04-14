import backendurl from "../../../js/backendurl.js";
$.ajax({
  type: "POST",
  url: backendurl + "admin/getcontests",
  contentType: "application/json",

  xhrFields: { withCredentials: false },
  headers: {},
  success: function (data) {
    $(document).ready(function () {
      console.log(data);

      $("#dynamicTable").DataTable({
        data: data,

        columns: [
          { data: "_id", title: "#id" },
          { data: "name", title: "Name" },
          { data: "organisedBy.name", title: "OrganiserName" },
          { data: "fees", title: "Fee" },
          { data: "prize", title: "Prize" },
          { data: "status", title: "Status" },

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

  $.ajax({
    type: "POST",
    url: backendurl + "admin/removeContest",
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

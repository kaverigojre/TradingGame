
import backendurl from "./backendurl.js";
$(document).ready(async function () {

    var token = window.location.hash.substring(1);
  

     $.ajax({
       type: "post",
       url: backendurl+"login/authlogin",
       contentType: "application/json",
       data: JSON.stringify({token:token}),
       xhrFields: { withCredentials: false },
       headers: {},
       success: function (data) {
        localStorage.setItem("loggedInUser",JSON.stringify(data));
        localStorage.setItem("token",token);
        window.location.href="index.html"
       },
       error: function (xhr, ajaxOptions, thrownError) {
        
       },
     });
});

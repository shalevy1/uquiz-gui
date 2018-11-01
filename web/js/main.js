
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  var fileupload = document.getElementById("inputfile");
  var openbtn = document.querySelector(".control-open");

  openbtn.addEventListener("click", function(e) {
    fileupload.click();
  });

});

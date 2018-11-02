
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  window.quizObject = {
    name: "",
    author: "",
    date: "",
    questions: []
  };

  var fileupload = document.getElementById("inputfile");

  fileupload.addEventListener('input', function (evt) {
    console.log(this.files);

    if (this.files[0].type !== "application/json" ||
        this.files[0].type !== "text/plain") {
      
    }
  });

  var openbtn   = document.querySelector(".control-open");
  var savebtn   = document.querySelector(".control-save");
  var newbtn    = document.querySelector(".control-new");
  var uploadbtn = document.querySelector(".control-upload");
 
  openbtn.addEventListener("click", function(e) {
    fileupload.click();
  });

  savebtn.addEventListener("click", function(e) {
    alert("save!");
  });

  newbtn.addEventListener("click", function(e) {
    alert("new!");
  });

  uploadbtn.addEventListener("click", function(e) {
    alert("upload!");
  });
});

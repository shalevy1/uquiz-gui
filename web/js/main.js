document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  window.quizFile = "";

  window.quizObject = {
    name: "",
    author: "",
    date: "",
    questions: []
  };

  var fileupload = document.getElementById("inputfile");

  fileupload.addEventListener("input", function(e) {
    if (this.files[0].size > 3e6) {
      modal.error("Files must be under 3MB");
      return;
    } else if (
      this.files[0].type !== "application/json" &&
      this.files[0].type !== "text/plain"
    ) {
      modal.error("Not a valid JSON or text file");
      return;
    }

    var reader = new FileReader();

    reader.onload = function() {
      var text = reader.result;

      window.quizObject = JSON.parse(text);
      console.log(window.quizObject);

      create.fromJSON(window.quizObject);
    };

    reader.readAsText(this.files[0]);
  });

  var openbtn = document.querySelector(".control-open");
  var savebtn = document.querySelector(".control-save");
  var newbtn = document.querySelector(".control-new");
  var uploadbtn = document.querySelector(".control-upload");

  openbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    fileupload.click();
  });

  savebtn.addEventListener("click", function(e) {
    var a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(
      new Blob([JSON.stringify(window.quizObject)], {type: "application/json"})
    );

    a.download = window.quizObject.name + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  newbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    alert("new!");
  });

  uploadbtn.addEventListener("click", function(e) {
    e.stopPropagation();
    e.preventDefault();

    alert("upload!");
  });
});

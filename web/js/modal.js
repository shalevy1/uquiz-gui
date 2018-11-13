function removeModalFromBtn(e) {
  e.stopPropagation();
  e.preventDefault();

  e.target.removeEventListener("click", removeModalFromBtn);
  e.target.parentNode.parentNode.outerHTML = "";
}

class Modal {
  constructor() {}

  error(msg) {
    let template = `<div class="modalBackground">
                    <div class="modal errorModal">
                         <div class="modalIcon">
                             <img src="/icon/alert-circle-outline.svg" alt="error"/>
                         </div>
                         <div class="modalContent">${msg}</div>

                         <button class="modalBtn">OK</button>
                    </div>
                    </div>`;

    document.body.insertAdjacentHTML("beforeend", template);

    let button = document.querySelector(".modalBtn");

    button.addEventListener("click", removeModalFromBtn);
  }

  confirmDelete(msg, questionId, callback, callbackReference) {
    let question = window.quizObject.questions[questionId].text;

    if (!question) {
      question = "New Question";
    }

    let template = `<div class="modalBackground">
                    <div class="modal errorModal">
                         <div class="modalIcon">
                             <img src="/icon/alert.svg" alt="error"/>
                         </div>

                         <div class="modalContent">
                             <p>${msg}</p>
                             <p>${question}</p>
                         </div>

                         <button class="modalBtn modalBtnYes">Delete</button>
                         <button class="modalBtn modalBtnNo">Cancel</button>
                    </div>
                    </div>`;

    document.body.insertAdjacentHTML("beforeend", template);

    let buttonNo = document.querySelector(".modalBtnNo");
    buttonNo.addEventListener("click", removeModalFromBtn);

    let buttonYes = document.querySelector(".modalBtnYes");

    buttonYes.addEventListener("click", function(e) {
      callback(callbackReference, questionId);
      removeModalFromBtn(e);
    });
  }
}

var modal = new Modal();

function findParentFromClass(el, className) {
  if (el.parentNode === null || el.parentNode === undefined) {
    return null;
  }

  if (
    el.parentNode.classList === undefined ||
    !el.parentNode.classList.contains(className)
  ) {
    return this.findParentFromClass(el.parentNode, className);
  } else {
    return el.parentNode;
  }
}

function removeModalFromBtn(e) {
  e.stopPropagation();
  e.preventDefault();

  let modalBackground = self.findParentFromClass(e.target, "modalBackground");

  e.target.removeEventListener("click", removeModalFromBtn);
  modalBackground.outerHTML = "";
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

  confirmNew(msg, quizName, newCallback, saveCallback) {
    let template = `<div class="modalBackground">
                    <div class="modal errorModal">
                         <div class="modalIcon">
                             <img src="/icon/alert.svg" alt="error"/>
                         </div>

                         <div class="modalContent">
                             <p>${msg}</p>
                             <p>${quizName}</p>
                         </div>

                         <button class="modalBtn modalBtnNew">Create New</button>
                         <button class="modalBtn modalBtnSave">Save & Create New</button>
                         <button class="modalBtn modalBtnCancel">Cancel</button>
                    </div>
                    </div>`;

    document.body.insertAdjacentHTML("beforeend", template);

    let buttonCancel = document.querySelector(".modalBtnCancel");
    buttonCancel.addEventListener("click", removeModalFromBtn);

    let buttonNew = document.querySelector(".modalBtnNew");

    buttonNew.addEventListener("click", function(e) {
      newCallback();
      removeModalFromBtn(e);
    });

    let buttonSave = document.querySelector(".modalBtnSave");

    buttonSave.addEventListener("click", function(e) {
      saveCallback();
      removeModalFromBtn(e);
    });
  }

  programModal() {
    let template = `

<div class="modalBackground">
<div class="programModal">
  <div class="programContent">
    <div id="topControlContainer">
      <button class="modalBtn">Scan</button>
      <button class="modalBtn">Check</button>
      <select id="deviceSelect" name="Choose device...">
      </select>

      <div class="hfill"></div>

      <button id="exitButton">
        <img src="/icon/close.svg" alt="Close Modal"/>
      </button>
    </div>

    <div class="quizList">
      <div class="quizListItem">
        <div class="nameSection">
          <div class="nameSectionTitle">Best Quiz</div>
          <div class="nameSectionAuthor">argarak</div>
          <div class="nameSectionDate">19/11/18</div>
        </div>

        <div class="quizListControls">
          <button class="quizListDeleteBtn">
            <img src="/icon/delete.svg" alt="Delete"/>
          </button>
        </div>
      </div>
    </div>

    <div id="bottomControlContainer">
      <div id="spaceLeftContainer">
        <div class="spaceLeft">3kB Left</div>
        <progress value="22" max="100"></progress>
      </div>

      <button class="modalBtn programBtn">
        Program
      </button>
    </div>
  </div>
</div>
</div>`;

    document.body.insertAdjacentHTML("beforeend", template);

    let exitButton = document.getElementById("exitButton");

    exitButton.addEventListener("click", function(e) {
      removeModalFromBtn(e);
    });
  }
}

var modal = new Modal();

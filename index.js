// Parent element to store cards
const taskContainer = document.querySelector(".task__container");

// Global Store
let globalStore = [];

const newCard = ({
  id,
  imageUrl,
  taskTitle,
  taskDescription,
  taskType,
}) => ` <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
<div class="card shadow-sm task__card">
  <div
    class="card-header d-flex justify-content-end task__card__header"
  >
    <button type="button" class="btn btn-outline-info mr-2" id=${id} onclick="editTask.apply(this, arguments)">
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button type="button" class="btn btn-outline-danger" id=${id} onclick="deleteCard.apply(this, arguments)">
      <i class="fas fa-trash-alt" id=${id}></i>
    </button>
  </div>
  <div class="card-body">
  ${
    imageUrl &&
    `          <img width="100%" src=${imageUrl} alt="Card image cap" class="card-img-top mb-3 rounded-lg">
  `
  }
    <h4 class="task__card__title">${taskTitle}</h4>
    <p class="description trim-3-lines text-muted" data-gramm_editor="false">
     ${taskDescription}
    </p>
    <div class="tags text-white d-flex flex-wrap">
      <span class="badge bg-primary m-1">${taskType}</span>
    </div>
  </div>
  <div class="card-footer">
    <button
      type="button"
      class="btn btn-outline-primary float-right"
      data-bs-toggle="modal"
      data-bs-target="#showTask"
      onclick="openTask.apply(this, arguments)"
      id=${id}
    >
      Open Task
    </button>
  </div>
</div>
</div>`;

const loadInitialTaskCards = () => {
  // access localstorage
  const getInitialData = localStorage.getItem("tasky"); // null
  if (!getInitialData) return;

  // convert stringified-object to object
  const { cards } = JSON.parse(getInitialData);

  // map around the array to generate HTML card and inject it to DOM
  cards.map((cardObject) => {
    const createNewCard = newCard(cardObject);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(cardObject);
  });
};

const updateLocalStorage = () =>
  localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`, // unique number for card id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("taskdescription").value,
  };

  // HTML code
  const createNewCard = newCard(taskData);

  taskContainer.insertAdjacentHTML("beforeend", createNewCard);
  globalStore.push(taskData);

  // add to localstorage
  updateLocalStorage();
};

const deleteCard = (event) => {
  // id
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName; // BUTTON

  // search the globalStore, remove the object which matches with the id
  globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);

  updateLocalStorage();

  // access DOM to remove them

  if (tagname === "BUTTON") {
    // task__container
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode // col-lg-4
    );
  }

  // task__container
  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
  );
}; 

//edit buitton
const editTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.id;
  const type = e.target.tagName;
  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  submitButton = parentNode.childNodes[5].childNodes[1];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};





const saveEdit = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const submitButton = parentNode.childNodes[5].childNodes[1];
  const taskType = parentNode.childNodes[3].childNodes[7];
  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };
  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};


const searchTask = (e) => {
  if (!e) e = window.event;
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.includes(e.target.value)
  );

  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};



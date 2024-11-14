let form = document.getElementById("form");
let inputTask = document.getElementById("inputTask");
let inputDate = document.getElementById("inputDate");
let textarea = document.getElementById("textarea");
let errormsg = document.getElementById("errormsg");
let tasks = document.getElementById("tasks");
let deletedTasks = document.getElementById("deletedTasks");
let modifiedTasks = document.getElementById("modifiedTasks");
let deletedRecordsSection = document.getElementById("deletedRecordsSection");
let modifiedRecordsSection = document.getElementById("modifiedRecordsSection");
let add = document.getElementById("add");

let data = JSON.parse(localStorage.getItem("data")) || [];
let modifiedRecords = JSON.parse(localStorage.getItem("modifiedRecords")) || [];
let isEdit = false;
let editIndex = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (inputTask.value === "") {
    errormsg.innerHTML = "Task cannot be blank";
  } else {
    errormsg.innerHTML = "";
    isEdit ? updateTask() : addTask();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    (() => add.setAttribute("data-bs-dismiss", ""))();
  }
};

let addTask = () => {
  let newTask = {
    text: inputTask.value,
    date: inputDate.value,
    description: textarea.value,
    status: "active",
    modified: false, // New field to track if a task has been modified
  };
  data.push(newTask);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.forEach((task, index) => {
    if (task.status === "active") {
      tasks.innerHTML += `
        <div id="${index}">
          <span class="fw-bold">${task.text}</span>
          <span class="small text-secondary">${task.date}</span>
          <p>${task.description}</p>
          <span class="options">
            <i onClick="editTask(${index})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick="deleteTask(${index})" class="fas fa-trash-alt"></i>
          </span>
        </div>`;
    }
  });
  resetForm();
};

let editTask = (index) => {
  let task = data[index];
  inputTask.value = task.text;
  inputDate.value = task.date;
  textarea.value = task.description;
  isEdit = true;
  editIndex = index;
};

let updateTask = () => {
  data[editIndex].modified = true; // Mark the task as modified
  modifiedRecords.push({ ...data[editIndex] }); // Save the original version to modified records
  localStorage.setItem("modifiedRecords", JSON.stringify(modifiedRecords));

  data[editIndex] = {
    text: inputTask.value,
    date: inputDate.value,
    description: textarea.value,
    status: "active",
    modified: true,
  };
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
  isEdit = false;
  editIndex = null;
};

let deleteTask = (index) => {
  data[index].status = "deleted";
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let toggleDeleted = () => {
  deletedRecordsSection.style.display =
    deletedRecordsSection.style.display === "none" ? "block" : "none";
  if (deletedRecordsSection.style.display === "block") {
    showDeleted();
  }
};

let toggleModified = () => {
  modifiedRecordsSection.style.display =
    modifiedRecordsSection.style.display === "none" ? "block" : "none";
  if (modifiedRecordsSection.style.display === "block") {
    showModified();
  }
};

let showDeleted = () => {
  deletedTasks.innerHTML = "";
  data.forEach((task) => {
    if (task.status === "deleted") {
      deletedTasks.innerHTML += `
        <div>
          <span class="fw-bold">${task.text}</span>
          <span class="small text-secondary">${task.date}</span>
          <p>${task.description}</p>
        </div>`;
    }
  });
};

let showModified = () => {
  modifiedTasks.innerHTML = "";
  modifiedRecords.forEach((task, index) => {
    modifiedTasks.innerHTML += `
      <div>
        <p>Record ${index + 1}</p>
        <span class="fw-bold">${task.text}</span>
        <span class="small text-secondary">${task.date}</span>
        <p>${task.description}</p>
      </div>`;
  });
};

let resetForm = () => {
  inputTask.value = "";
  inputDate.value = "";
  textarea.value = "";
};

(() => {
  createTasks();
})();

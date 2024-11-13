let form = document.getElementById("form");
let inputTask = document.getElementById("inputTask");
let inputDate = document.getElementById("inputDate");
let textarea = document.getElementById("textarea");
let errormsg = document.getElementById("errormsg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// Data structure including a history array
let data = JSON.parse(localStorage.getItem("data")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (inputTask.value === "") {
    console.log("Failed");
    errormsg.innerHTML = "Task cannot be blank";
  } else {
    console.log("Success");
    errormsg.innerHTML = "";
    addTask();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    (() => add.setAttribute("data-bs-dismiss", ""))();
  }
};

// Add a task with active status
let addTask = () => {
  let newTask = {
    text: inputTask.value,
    date: inputDate.value,
    description: textarea.value,
    status: "active", // new field to track status
  };
  data.push(newTask);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

// Create tasks and display based on their status
let createTasks = () => {
  tasks.innerHTML = "";
  data.forEach((task, index) => {
    if (task.status === "active") { // Only show active tasks
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

// Edit a task and save previous version to history
let editTask = (index) => {
  let task = data[index];
  inputTask.value = task.text;
  inputDate.value = task.date;
  textarea.value = task.description;

  // Store the original task in the history before modification
  let modifiedTask = { ...task };
  history.push(modifiedTask);
  localStorage.setItem("history", JSON.stringify(history));

  // Remove the task before adding the edited version
  deleteTask(index);
};

// Mark a task as deleted and save to data
let deleteTask = (index) => {
  data[index].status = "deleted"; // mark as deleted instead of removing
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let resetForm = () => {
  inputTask.value = "";
  inputDate.value = "";
  textarea.value = "";
};

// Initial loading of data and task creation
(() => {
  createTasks();
})();

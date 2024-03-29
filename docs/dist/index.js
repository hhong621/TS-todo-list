import {v4 as uuidV4} from "../_snowpack/pkg/uuid.js";
import $ from "../_snowpack/pkg/jquery.js";
const list = document.querySelector("#list");
const form = document.getElementById("new-task-form");
const filters = document.getElementById("filters");
const input = document.querySelector("#new-task-title");
const tasks = loadTasks();
let dragStartIndex;
let trailDetect = false;
createList();
function createList() {
  tasks.forEach(addListItem);
  tasks.forEach(checkCompleted);
  tasks.forEach(checkFavorite);
}
function dragStart() {
  dragStartIndex = $(this.closest("li")).index();
}
function dragEnter() {
  this.classList.add("over");
}
function dragEnterTrailing() {
  this.classList.add("over");
  trailDetect = true;
}
function dragLeave() {
  this.classList.remove("over");
}
function dragLeaveTrailing() {
  this.classList.remove("over");
  trailDetect = false;
}
function dragOver(e) {
  e.preventDefault();
}
function dragDrop() {
  let dragEndIndex;
  if (trailDetect) {
    dragEndIndex = tasks.length;
    trailDetect = false;
  } else {
    dragEndIndex = $(this).index();
  }
  reorderItem(dragStartIndex, dragEndIndex);
  this.classList.remove("over");
}
function reorderItem(fromIndex, toIndex) {
  const item = tasks[fromIndex];
  tasks.splice(toIndex, 0, item);
  if (fromIndex > toIndex)
    fromIndex++;
  tasks.splice(fromIndex, 1);
  saveTasks();
  location.reload();
}
function addDragEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const listItems = document.querySelectorAll("#list li");
  const trailing = document.querySelectorAll("#trailing");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });
  listItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
  trailing.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnterTrailing);
    item.addEventListener("dragleave", dragLeaveTrailing);
  });
}
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input?.value == "" || input?.value == null)
    return;
  const newTask = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
    favorite: false
  };
  tasks.push(newTask);
  addListItem(newTask);
  input.value = "";
});
filters?.addEventListener("change", filterBy);
function filterBy() {
  const selectValue = filters?.value;
  console.log(selectValue);
  if (selectValue == "all") {
    tasks.forEach(filterAll);
  } else if (selectValue == "favorites") {
    tasks.forEach(filterFav);
  }
}
function filterFav(task) {
  const id = task.id;
  const item = document.getElementById(id)?.parentElement;
  if (!task.favorite) {
    item.classList.add("hidden");
  }
}
function filterAll(task) {
  const id = task.id;
  const item = document.getElementById(id)?.parentElement;
  item.classList.remove("hidden");
}
function addListItem(task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const removeBtn = document.createElement("span");
  const star = document.createElement("span");
  item.setAttribute("draggable", "true");
  item.classList.add("draggable");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    checkCompleted(task);
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  removeBtn.classList.add("material-symbols-outlined", "remove");
  removeBtn.innerHTML = "delete";
  removeBtn.addEventListener("click", () => {
    removeTask(task);
  });
  star.classList.add("material-symbols-outlined", "star");
  star.innerHTML = "star";
  star.addEventListener("click", () => {
    favoriteTask(task);
  });
  label.id = task.id;
  label.append(checkbox, task.title);
  item.append(label, removeBtn, star);
  list?.append(item);
  saveTasks();
  addDragEventListeners();
}
function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
function loadTasks() {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null)
    return [];
  return JSON.parse(taskJSON);
}
function checkCompleted(task) {
  const id = task.id;
  const label = document.getElementById(id);
  if (task.completed) {
    label.classList.add("completed");
  } else {
    label.classList.remove("completed");
  }
}
function removeTask(task) {
  const id = task.id;
  tasks.forEach((value, index) => {
    if (tasks[index].id == id) {
      tasks.splice(index, 1);
    }
  });
  saveTasks();
  $("#list").empty();
  createList();
}
function favoriteTask(task) {
  const id = task.id;
  const label = document.getElementById(id);
  if (task.favorite) {
    task.favorite = false;
    label.classList.remove("favorite");
  } else {
    task.favorite = true;
    label.classList.add("favorite");
  }
  saveTasks();
}
function checkFavorite(task) {
  const id = task.id;
  const label = document.getElementById(id);
  if (task.favorite) {
    label.classList.add("favorite");
  } else {
    label.classList.remove("favorite");
  }
}

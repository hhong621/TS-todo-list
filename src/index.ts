/*
TS Todo List

Known issues:

Upcoming features:
- Star to favorite
- Task groups

*/

import { v4 as uuidV4 } from "uuid"
import $ from "jquery";

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")
const tasks: Task[] = loadTasks()
let dragStartIndex: number
let trailDetect = false
createList()

function createList() {
  tasks.forEach(addListItem)
  tasks.forEach(checkCompleted)
}

function dragStart(this: any) {
  //console.log("Event: ", "dragstart")
  dragStartIndex = $(this.closest("li")).index()
  //console.log("start: " + dragStartIndex)
}

function dragEnter(this: any) {
  //console.log("Event: ", "dragenter")
  this.classList.add("over")
}

function dragEnterTrailing(this: any) {
  this.classList.add("over")
  trailDetect = true
}

function dragLeave(this: any) {
  //console.log("Event: ", "dragleave")
  this.classList.remove("over")
}

function dragLeaveTrailing(this: any) {
  this.classList.remove("over")
  trailDetect = false
}

function dragOver(e: any) {
  //console.log("Event: ", "dragover")
  e.preventDefault()
}

function dragDrop(this: any) {
  //console.log("Event: ", "drop")
  let dragEndIndex: number
  if (trailDetect) { //moving to last position
    dragEndIndex = tasks.length
    trailDetect = false
  } else {
    dragEndIndex = $(this).index()
  }
  //console.log("end: " + dragEndIndex)
  reorderItem(dragStartIndex, dragEndIndex)
  this.classList.remove("over")
}

function reorderItem(fromIndex: number, toIndex: number) {
  const item = tasks[fromIndex]

  tasks.splice(toIndex, 0, item)
  if (fromIndex > toIndex) fromIndex++ //moving up
  tasks.splice(fromIndex, 1)
  saveTasks()
  location.reload()
}

function addDragEventListeners() {
  const draggables = document.querySelectorAll(".draggable")
  const listItems = document.querySelectorAll("#list li")
  const trailing = document.querySelectorAll("#trailing")

  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", dragStart)
  })

  listItems.forEach(item => {
    item.addEventListener("dragover", dragOver)
    item.addEventListener("drop", dragDrop)
    item.addEventListener("dragenter", dragEnter)
    item.addEventListener("dragleave", dragLeave)
  })

  trailing.forEach(item => {
    item.addEventListener("dragover", dragOver)
    item.addEventListener("drop", dragDrop)
    item.addEventListener("dragenter", dragEnterTrailing)
    item.addEventListener("dragleave", dragLeaveTrailing)
  })
}

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  const removeBtn = document.createElement("span")
  item.setAttribute("draggable", "true")  
  item.classList.add("draggable")
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked

    checkCompleted(task)

    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  removeBtn.classList.add("material-symbols-outlined", "remove")
  removeBtn.innerHTML = "delete"
  removeBtn.addEventListener("click", () => {
    removeTask(task)
  })
  label.id = task.id
  label.append(checkbox, task.title)
  item.append(label, removeBtn)
  list?.append(item)
  saveTasks()
  addDragEventListeners()
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}

function checkCompleted(task: Task) {
  const id:string = task.id
  const label = document.getElementById(id) as HTMLLabelElement
  if (task.completed) {
    label.classList.add("completed")
  } else {
    label.classList.remove("completed")
  }
}

function removeTask(task: Task) {
  const id:string = task.id
  tasks.forEach((value, index) => {
    if(tasks[index].id == id) {
      tasks.splice(index, 1)
      //console.log("Item index at " + index + " was removed.")
    }
  })
  saveTasks()
  //console.log(tasks)
  location.reload()
}
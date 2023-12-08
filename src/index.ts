import { v4 as uuidV4 } from "uuid"

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
tasks.forEach(addListItem)
tasks.forEach(checkCompleted)

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
  label.append(checkbox, task.title, removeBtn)
  item.append(label)
  list?.append(item)
  saveTasks()
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
      console.log("Item index at " + index + " was removed.")
    }
  })
  saveTasks()
  location.reload()
}
import { app } from "./app.js";
import { VNode } from "../overreact/overReact.js";

const newTodo = app.getNVodeById("newTodo");
const main = app.getNVodeById("main");
const footer = app.getNVodeById("footer");
const todoList = app.getNVodeById("todoList");

console.log(newTodo);

newTodo.listenEvent("onkeypress", addTodo);

function addTodo(e) {
  if (e.key === "Enter") {
    console.log("Add todo: ", e.target.value);
  }
}

// function handleNewTodo(e) {
//   if (e.key === "Enter") {
//     console.log("Add todo");
//     app.state.count++;
//     app.state.active++;
//     updateTodoCount();
//     main.show();
//     footer.show();

//     const toggle = new VNode("input", {
//       class: "toggle",
//       type: "checkbox",
//     });
//     const label = new VNode("label", { innerText: e.target.value });
//     const destroy = new VNode("button", { class: "destroy" });
//     const view = new VNode("div", {
//       attrs: { class: "view" },
//       children: [toggle, label, destroy],
//     });
//     const edit = new VNode("input", {
//       className: "edit",
//       value: this.value,
//     });
//     const listItem = new VNode("li", { children: [view, edit] });
//     todoList.prepend(listItem);
//   }

//   destroy.listenEvent("click", function () {
//     // Remove the todo item from the DOM
//     removeTodo(listItem);

//     // Hide the .main and .footer sections if there are no todos left
//     if (app.state.total === 0 && app.state.active === 0) {
//       main.hide();
//       footer.hide();
//     }
//   });
// }

// function removeTodo(todo) {
//   todo.remove();
//   if (!todo.classList.contains("completed")) {
//     count--;
//     updateTodoCount();
//   }

//   if (document.querySelectorAll(".todo-list li").length === 0) {
//     mainSection.style.display = "none";
//     footerSection.style.display = "none";
//   }
// }

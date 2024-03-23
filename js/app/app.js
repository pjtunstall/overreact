import { makeTodoApp } from "./components/todoapp.js";
import { App, VNode } from "../overreact/overReact.js";

const state = {
  total: 0,
  active: 0,
};

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target);
app.setState(state);

console.log(vApp);
const todoList = app.getVNodeById("todoList");
const newTodo = app.getVNodeById("newTodo");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");

newTodo.listenEvent("onkeypress", addTodo);

function addTodo(e) {
  if (e.key === "Enter") {
    // Do we need to prevent page refresh?
    // e.preventDefault();
    console.log("Add todo");
    app.state.count++;
    app.state.active++;
    // updateTodoCount();
    main.show();
    footer.show();

    const toggle = new VNode("input", {
      class: "toggle",
      type: "checkbox",
    });
    const label = new VNode("label", { innerText: e.target.value });
    const destroy = new VNode("button", { class: "destroy" });
    const view = new VNode("div", {
      attrs: { class: "view" },
      children: [toggle, label, destroy],
    });
    const edit = new VNode("input", {
      className: "edit",
      value: e.target.value,
    });
    const listItem = new VNode("li", { children: [view, edit] });
    todoList.prepend(listItem);
  }

  // destroy.listenEvent("click", function () {
  //   // Remove the todo item from the DOM
  //   removeTodo(listItem);

  //   // Hide the .main and .footer sections if there are no todos left
  //   if (app.state.total === 0 && app.state.active === 0) {
  //     main.hide();
  //     footer.hide();
  //   }
  // });
}

function update() {
  app.update();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

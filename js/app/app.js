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
const inputToggleAll = app.getVNodeById("inputToggleAll");

newTodo.listenEvent("onkeypress", addTodo);

function addTodo(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    app.state.count++;
    app.state.active++;
    // updateTodoCount();
    main.show();
    footer.show();

    const toggle = new VNode("input", {
      attrs: {
        class: "toggle",
        type: "checkbox",
      },
    });
    const label = new VNode("label", {
      attrs: { id: "label" },
      children: [e.target.value],
    });
    const destroy = new VNode("button", {
      attrs: { id: "destroy", class: "destroy" },
    });
    const view = new VNode("div", {
      attrs: { id: "view", class: "view" },
      children: [toggle, label, destroy],
    });
    const edit = new VNode("input", {
      attrs: {
        id: "edit",
        class: "edit",
        value: e.target.value,
      },
    });
    const listItem = new VNode("li", { children: [view, edit] });

    // Add event listener to the destroy button
    destroy.listenEvent("onclick", function () {
      // Remove the todo item from the DOM
      removeTodo(listItem);

      // Hide the .main and .footer sections if there are no todos left
      if (app.state.total === 0 && app.state.active === 0) {
        main.hide();
        footer.hide();
      }
    });

    inputToggleAll.listenEvent("onclick", function () {
      const todos = document.querySelectorAll(".todo-list li");
      const allCompleted = Array.from(todos).every(
        (todo) => todo.querySelector(".toggle").checked
      );

      if (allCompleted) {
        count = 0;
        todos.forEach((todo) => {
          todo.removeClass("completed");
          todo.querySelector(".toggle").checked = false;
          count++;
        });
      } else {
        clearCompleted.show();
        todos.forEach((todo) => {
          const toggle = todo.querySelector(".toggle");
          if (!toggle.checked) {
            toggle.checked = true;
            todo.addClass("completed");
            count--;
          }
        });
      }

      updateTodoCount();
    });

    // clearCompleted.listenEvent("onclick", function () {
    //   const todos = todoList.children;
    //   todos.forEach((todo) => {
    //     // if (todo.querySelector(".toggle").checked) {
    //     //   removeTodo(todo);
    //     // }
    //   });

    //   if (todos.length === 0) {
    //     main.hide();
    //     footer.hide();
    //   }

    //   clearCompleted.hide();
    // });

    // Add event listener to the checkbox
    toggle.listenEvent("onchange", function () {
      if (e.target.checked) {
        clearCompleted.show();
        app.state.active--;
        listItem.addClass("completed");
      } else {
        app.state.active++;
        listItem.removeClass("completed");
      }
      updateTodoCount();
    });

    // Add event listener for double click
    listItem.listenEvent("ondblclick", function () {
      listItem.addClass("editing");
      // Somehow communicate that the $node should be focused
      // edit.focus();
    });

    // Add event listener for 'Enter' keypress on edit field
    edit.listenEvent("onkeypress", function (e) {
      if (e.key === "Enter") {
        // Update label text and remove 'editing' class
        label.children = [e.target.value];
        listItem.removeClass("editing");
      }
    });

    // Add event listener for 'blur' event on edit field
    edit.listenEvent("onblur", function (e) {
      // Update label text and remove 'editing' class
      label.children = [e.target.value];
      listItem.removeClass("editing");
    });

    todoList.prepend(listItem);

    // Clear the input field
    e.target.value = "";
  }
}

function updateTodoCount() {
  todoCount.children = count + (count === 1 ? " item left!" : " items left!");
  const someCompleted = app.state.active < app.state.total;
  if (someCompleted) {
    clearCompleted.show();
  } else {
    clearCompleted.hide();
  }
}

function update() {
  app.update();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

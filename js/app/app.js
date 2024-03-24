import { makeTodoApp } from "./components/todoapp.js";
import { App, VNode } from "../overreact/overReact.js";
import { vNodeToHtml as h } from "../overreact/vNodeToHtml.js";
import { render } from "../overreact/render.js";

const state = {
  total: 0,
  active: 0,
};

export let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target);
app.setState(state);

// console.log(vApp);
const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const newTodo = app.getVNodeById("newTodo");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

newTodo.listenEvent("onkeypress", addTodo);
let editCount = 0;
let toggleCount = 0;
let labelCount = 0;
let destroyCount = 0;
let viewCount = 0;
let listItemCount = 0;

function addTodo(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    app.state.count++;
    app.state.active++;
    updateTodoCount();
    main.show();
    footer.show();

    const toggle = new VNode("input", {
      attrs: {
        id: `toggle-${toggleCount}`,
        class: "toggle",
        type: "checkbox",
      },
    });
    const label = new VNode("label", {
      attrs: { id: `label-${labelCount++}`, for: `toggle-${toggleCount++}` },
      children: [e.target.value],
    });
    const destroy = new VNode("button", {
      attrs: { id: `destroy-${destroyCount++}`, class: "destroy" },
    });
    const view = new VNode("div", {
      attrs: { id: `view-${viewCount++}`, class: "view" },
      children: [toggle, label, destroy],
    });
    const edit = new VNode("input", {
      attrs: {
        id: `edit-${editCount++}`,
        class: "edit",
        value: e.target.value,
      },
    });
    const listItem = new VNode("li", {
      attrs: { id: `listItem-${listItemCount++}` },
      children: [view, edit],
    });

    // Add event listener to the destroy button
    destroy.listenEvent("onclick", (e) => {
      const listItem = app.nodeVNodeMap.get(e.target.closest("li"));
      app.remove(listItem);
      app.state.total--;
      if (!listItem.hasClass("completed")) {
        app.state.active--;
        updateTodoCount();
      }

      // Hide the .main and .footer sections if there are no todos left
      if (app.state.total === 0 && app.state.active === 0) {
        main.hide();
        footer.hide();
      }
    });

    inputToggleAll.listenEvent("onclick", () => {
      const todos = todoList.children;
      const allCompleted = Array.from(todos).every(
        (todo) => (todo.attrs.checked = "true")
      );

      if (allCompleted) {
        count = 0;
        todos.forEach((todo) => {
          todo.removeClass("completed");
          todo.attrs.checked = "false";
          app.state.active++;
        });
      } else {
        clearCompleted.show();
        todos.forEach((todo) => {
          const toggle = todo.querySelector(".toggle");
          if (!toggle.checked) {
            toggle.checked = true;
            todo.addClass("completed");
            app.state.active--;
          }
        });
      }

      updateTodoCount();
    });

    clearCompleted.listenEvent("onclick", () => {
      const todos = todoList.children;
      todos.forEach((todo) => {
        if (todo.hasClass("completed")) {
          app.remove(todo);
        }
        // if (todo.querySelector(".toggle").checked) {
        //   removeTodo(todo);
        // }
      });

      if (todos.length === 0) {
        main.hide();
        footer.hide();
      }

      clearCompleted.hide();
    });

    // Add event listener to the checkbox
    toggle.listenEvent("onchange", (e) => {
      const listItem = app.nodeVNodeMap.get(e.target.closest("li"));
      if (e.target.checked) {
        clearCompleted.show();
        app.state.active--;
        listItem.addClass("completed");
        listItem.attrs.checked = true;
      } else {
        app.state.active++;
        listItem.removeClass("completed");
        listItem.attrs.checked = false;
      }
      updateTodoCount();
    });

    // // Add event listener for double click
    // listItem.listenEvent("ondblclick", () => {
    //   listItem.addClass("editing");
    //   // Somehow communicate that the $node should be focused
    //   // edit.focus();
    // });

    // // Add event listener for 'Enter' keypress on edit field
    // edit.listenEvent("onkeypress", (e) => {
    //   if (e.key === "Enter") {
    //     // Update label text and remove 'editing' class
    //     label.children = [e.target.value];
    //     listItem.removeClass("editing");
    //   }
    // });

    // // Add event listener for 'blur' event on edit field
    // edit.listenEvent("onblur", (e) => {
    //   // Update label text and remove 'editing' class
    //   label.children = [e.target.value];
    //   listItem.removeClass("editing");
    // });

    todoList.append(listItem);

    // Clear the input field
    e.target.value = "";
  }
}

function updateTodoCount() {
  todoCount.children = [
    app.state.active +
      (app.state.active === 1 ? " item left!" : " items left!"),
  ];
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

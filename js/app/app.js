import { app } from "./init.js";
import "./routes.js";
import { toggleAllHandler, toggleHandler } from "./events.js";

import { VNode } from "../overreact/overReact.js";
import { nodeVNodeMap, vNodeNodeMap } from "../overreact/render.js";

const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const newTodo = app.getVNodeById("newTodo");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

let enterPressed = false;
let currentlyEditing = null;

newTodo.listenEvent("onkeypress", addTodo);

function* counterMaker() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const counter = counterMaker();

function addTodo(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (e.target.value === "") {
      return;
    }
    app.state.total++;
    app.state.active++;
    updateTodoCount();
    main.show();
    footer.show();

    const count = counter.next().value;

    const toggle = new VNode("input", {
      attrs: {
        id: `toggle-${count}`,
        class: "toggle",
        type: "checkbox",
      },
    });
    const label = new VNode("label", {
      attrs: { id: `label-${count}` },
      children: [e.target.value],
    });
    const destroy = new VNode("button", {
      attrs: { id: `destroy-${count}`, class: "destroy" },
    });
    const view = new VNode("div", {
      attrs: { id: `view-${count}`, class: "view" },
      children: [toggle, label, destroy],
    });
    const edit = new VNode("input", {
      attrs: {
        id: `edit-${count}`,
        class: "edit",
        // style: "display: none",
        value: e.target.value,
      },
    });
    const listItem = new VNode("li", {
      attrs: { id: `listItem-${count}` },
      children: [view, edit],
    });

    const hash = window.location.hash.slice(2);
    const parts = hash.split("/");
    const route = parts[0];
    if (route === "completed") {
      listItem.hide();
    }

    destroy.listenEvent("onclick", (e) => {
      const $todo = e.target.closest("li");
      const listItemId = app.nodeVNodeMap.get($todo.id);
      const listItem = app.getVNodeById(listItemId);

      if (--app.state.total === 0) {
        main.hide();
        footer.hide();
      }
      if (!listItem.hasClass("completed")) {
        app.state.active--;
        updateTodoCount();
      }

      if (app.state.active === app.state.total) {
        clearCompleted.hide();
      }

      app.remove(listItem);
    });

    toggle.listenEvent("onchange", toggleHandler);

    inputToggleAll.listenEvent("onclick", toggleAllHandler);

    clearCompleted.listenEvent("onclick", () => {
      const completed = todoList.children.filter((todo) =>
        todo.hasClass("completed")
      );
      completed.forEach((todo) => {
        app.remove(todo);
      });
      app.state.total -= completed.length;

      if (app.state.total === 0) {
        main.hide();
        footer.hide();
      }

      clearCompleted.hide();
    });

    label.listenEvent("ondblclick", (e) => {
      console.log("Double click");
      todoList.children.forEach((todo) => {
        todo.removeClass("editing");
      });

      const $edit = e.target;
      $edit.focus();
      const $todo = $edit.closest("li");
      const todoId = nodeVNodeMap.get($todo.id);
      const todo = app.getVNodeById(todoId);
      todo.addClass("editing");
      currentlyEditing = $todo.querySelector(".edit");

      app.update();
    });

    edit.listenEvent("onkeypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        enterPressed = true;

        if (e.target.value === "") {
          const $todo = e.target.closest("li");
          const listItemId = app.nodeVNodeMap.get($todo.id);
          const listItem = app.getVNodeById(listItemId);

          if (--app.state.total === 0) {
            main.hide();
            footer.hide();
          }
          if (!listItem.hasClass("completed")) {
            app.state.active--;
            updateTodoCount();
          }

          if (app.state.active === app.state.total) {
            clearCompleted.hide();
          }

          app.remove(listItem);
        } else {
          label.children = [e.target.value];
          listItem.removeClass("editing");
        }

        currentlyEditing = null;

        app.update();
      }
    });

    edit.listenEvent("onblur", (e) => {
      if (enterPressed) {
        enterPressed = false;
        return;
      }

      if (e.target.value === "") {
        const $todo = e.target.closest("li");
        const listItemId = app.nodeVNodeMap.get($todo.id);
        const listItem = app.getVNodeById(listItemId);

        if (--app.state.total === 0) {
          main.hide();
          footer.hide();
        }
        if (!listItem.hasClass("completed")) {
          app.state.active--;
          updateTodoCount();
        }

        if (app.state.active === app.state.total) {
          clearCompleted.hide();
        }

        app.remove(listItem);
      } else {
        label.children = [e.target.value];
        listItem.removeClass("editing");
      }

      currentlyEditing = null;

      app.update();
    });

    todoList.append(listItem);

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

// Necessary to step outside of the virtual event handling system here to deal with the case where the user potentially clicks outside of the app
document.addEventListener("click", function (event) {
  if (currentlyEditing && !currentlyEditing.contains(event.target)) {
    currentlyEditing.dispatchEvent(new Event("blur"));
    currentlyEditing = null;
  }
});

// Initial update to render the event listeners
app.update();

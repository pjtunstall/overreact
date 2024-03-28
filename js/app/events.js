import { app } from "./init.js";

import { VNode } from "../overreact/overReact.js";
import { $NodeToVNodeMap, VNodeTo$NodeMap } from "../overreact/render.js";

const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

let enterPressed = false;
let currentlyEditing = null;

// Necessary to step outside of the virtual event handling system here to deal with the case where the user potentially clicks outside of the app
document.addEventListener("click", function (event) {
  if (currentlyEditing && !currentlyEditing.contains(event.target)) {
    currentlyEditing.dispatchEvent(new Event("blur"));
    currentlyEditing = null;
  }
});

function* counterMaker() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const counter = counterMaker();

export function addTodo(e) {
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

    const hash = location.hash.slice(2);
    const parts = hash.split("/");
    const route = parts[0];
    if (route === "completed") {
      listItem.hide();
    }

    destroy.listenEvent("onclick", destroyHandler);
    toggle.listenEvent("onchange", toggleHandler);
    inputToggleAll.listenEvent("onclick", toggleAllHandler);
    clearCompleted.listenEvent("onclick", clearCompletedHandler);
    label.listenEvent("ondblclick", startEditingHandler);
    edit.listenEvent("onkeypress", finishEditingByEnterHandler);
    edit.listenEvent("onblur", finishEditingByBlurHandler);

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

export function destroyHandler(e) {
  const $todo = e.target.closest("li");
  const listItemId = app.$NodeToVNodeMap.get($todo.id);
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
}

export function clearCompletedHandler() {
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
}

export function startEditingHandler(e) {
  console.log("Double click");
  todoList.children.forEach((todo) => {
    todo.removeClass("editing");
  });

  const $edit = e.target;
  $edit.focus();
  const $todo = $edit.closest("li");
  const todoId = $NodeToVNodeMap.get($todo.id);
  const todo = app.getVNodeById(todoId);
  todo.addClass("editing");
  currentlyEditing = $todo.querySelector(".edit");

  app.update();
}

export function finishEditingByEnterHandler(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    enterPressed = true;

    if (e.target.value === "") {
      const $todo = e.target.closest("li");
      const listItemId = app.$NodeToVNodeMap.get($todo.id);
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
}

export function finishEditingByBlurHandler(e) {
  if (enterPressed) {
    enterPressed = false;
    return;
  }

  const $todo = e.target.closest("li");
  const listItemId = app.$NodeToVNodeMap.get($todo.id);
  const listItem = app.getVNodeById(listItemId);
  const labelId = app.VNodeTo$NodeMap.get(e.target.id);
  const label = app.getVNodeById(labelId);

  if (e.target.value === "") {
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

export function toggleHandler(e) {
  const listItemId = app.$NodeToVNodeMap.get(e.target.closest("li").id);
  const listItem = app.getVNodeById(listItemId);
  const toggle = listItem.children[0].children[0];
  if (e.target.checked) {
    app.state.active--;
    listItem.addClass("completed");
    toggle.attrs.checked = "";
    clearCompleted.show();
  } else {
    app.state.active++;
    listItem.removeClass("completed");
    delete toggle.attrs.checked;
    if (app.state.active === app.state.total) {
      clearCompleted.hide();
    }
  }
  updateTodoCount();
}

export function toggleAllHandler() {
  const todos = todoList.children;

  if (app.state.active === 0) {
    const completed = todos.filter((todo) => todo.hasClass("completed"));
    const $completed = [];
    completed.forEach((todo) => {
      const toggle = todo.children[0].children[0];
      const $completedId = VNodeTo$NodeMap.get(toggle.attrs.id);
      const $completedItem = document.getElementById($completedId);
      $completed.push($completedItem);
    });
    check($completed);
    app.state.active = app.state.total;
    completed.forEach((todo) => {
      const toggle = todo.children[0].children[0];
      delete toggle.attrs.checked;
    });
    app.state.active = app.state.total;
    clearCompleted.hide();
  } else {
    const active = todos.filter((todo) => !todo.hasClass("completed"));
    const $active = [];
    active.forEach((todo) => {
      const toggle = todo.children[0].children[0];
      const $activeId = VNodeTo$NodeMap.get(toggle.attrs.id);
      const $activeItem = document.getElementById($activeId);
      $active.push($activeItem);
      toggle.attrs.checked = "";
    });
    check($active);
    app.state.active = 0;
    clearCompleted.show();
  }

  updateTodoCount();
}

function check(checkboxes) {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !checkbox.checked;
    const event = new Event("change", {
      bubbles: true,
      cancelable: true,
    });
    checkbox.dispatchEvent(event);
  });
}

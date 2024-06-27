import { VNode } from "../overreact/over-react.js";

import { app } from "./init.js";

const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

let enterPressed = false;
let escapePressed = false;
let currentlyEditing = null;

// We step outside of the virtual event handling system here to deal with the case where the user potentially clicks outside of the app
document.addEventListener("click", function (event) {
  if (currentlyEditing && !currentlyEditing.contains(event.target)) {
    currentlyEditing.dispatchEvent(new Event("blur"));
    currentlyEditing = null;
  }
});

// To make unique ids for each todo item
function* counterMaker() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const counter = counterMaker();

// Update the indicator of how many todos are left
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

// Helper function to check or uncheck a list of checkboxes
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

// The event handlers themselves
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

    const toggle = new VNode(
      "input",
      {
        attrs: {
          id: `toggle-${count}`,
          class: "toggle",
          type: "checkbox",
        },
      },
      app
    );

    const label = new VNode(
      "label",
      {
        attrs: { id: `label-${count}` },
        children: [e.target.value],
      },
      app
    );

    const destroy = new VNode(
      "button",
      {
        attrs: { id: `destroy-${count}`, class: "destroy" },
      },
      app
    );

    const view = new VNode(
      "div",
      {
        attrs: { id: `view-${count}`, class: "view" },
        children: [toggle, label, destroy],
      },
      app
    );

    const edit = new VNode(
      "input",
      {
        attrs: {
          id: `edit-${count}`,
          class: "edit",
          value: e.target.value,
          autocomplete: "off",
        },
      },
      app
    );

    const listItem = new VNode(
      "li",
      {
        attrs: { id: `listItem-${count}` },
        children: [view, edit],
      },
      app
    );

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
    edit.listenEvent("onkeydown", finishEditingByEnterHandler);
    edit.listenEvent("onblur", finishEditingByBlurHandler);

    todoList.append(listItem);

    e.target.value = "";
  }
}

export function destroyHandler(e) {
  const listItem = app.getVNodeById(e.target.closest("li").id);

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

export function toggleHandler(e) {
  const listItem = app.getVNodeById(e.target.closest("li").id);
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
      const $completedItem = document.getElementById(toggle.attrs.id);
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
      const $activeItem = document.getElementById(toggle.attrs.id);
      $active.push($activeItem);
      toggle.attrs.checked = "";
    });

    check($active);
    app.state.active = 0;
    clearCompleted.show();
  }

  updateTodoCount();
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
  todoList.children.forEach((todo) => {
    todo.removeClass("editing");
  });

  const $label = e.target;

  const $listItem = $label.closest("li");
  const listItem = app.getVNodeById($listItem.id);
  listItem.addClass("editing");
  const $edit = $listItem.querySelector(".edit");
  currentlyEditing = $edit;
  const len = $edit.value.length;
  $edit.setSelectionRange(len, len);

  app.update();

  // Needs to come after update, otherwise focus will be lost in re-render
  $edit.focus();
}

export function finishEditingByEnterHandler(e) {
  if (e.key !== "Escape" && e.key !== "Enter") {
    return;
  }

  const listItem = app.getVNodeById(e.target.closest("li").id);

  if (e.key === "Escape") {
    e.target.value = "";
    listItem.removeClass("editing");
    currentlyEditing = null;
    escapePressed = true;
    e.target.blur();
    app.update();
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    enterPressed = true;

    e.target.value = e.target.value.trim();

    const label = listItem.children[0].children[1];

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
}

export function finishEditingByBlurHandler(e) {
  if (enterPressed) {
    enterPressed = false;
    return;
  }

  if (escapePressed) {
    escapePressed = false;
    return;
  }

  e.target.value = e.target.value.trim();

  const listItem = app.getVNodeById(e.target.closest("li").id);
  const label = listItem.children[0].children[1];

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

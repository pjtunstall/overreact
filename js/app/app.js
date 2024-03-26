import { makeTodoApp } from "./components/todoapp.js";
import { App, VNode } from "../overreact/overReact.js";
import { nodeVNodeMap, vNodeNodeMap } from "../overreact/render.js";
import { aAll, aActive, aCompleted } from "./components/footer.js";

const state = {
  total: 1,
  active: 0,
};

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state, onChange);

const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const newTodo = app.getVNodeById("newTodo");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

let enterPressed = false;

const routes = {
  "": function () {
    aAll.addClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");
    todoList.children.forEach((todo) => {
      todo.show();
    });
  },
  active: function () {
    aAll.removeClass("selected");
    aActive.addClass("selected");
    aCompleted.removeClass("selected");

    todoList.children.forEach((todo) => {
      if (todo.hasClass("completed")) {
        todo.hide();
      } else {
        todo.show();
      }
    });
  },
  completed: function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.addClass("selected");
    todoList.children.forEach((todo) => {
      if (todo.hasClass("completed")) {
        todo.show();
      } else {
        todo.hide();
      }
    });
  },
};

app.setRoutes(routes);

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

    // Add event listener to the destroy button
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

    // Add event listener to the checkbox
    // Must use addClass and removeClass instead of class = "" and class = "completed" here, but in the toggle all function, I can't do anything to the class attribute or it breaks.
    toggle.listenEvent("onchange", (e) => {
      const listItemId = app.nodeVNodeMap.get(e.target.closest("li").id);
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
    });

    inputToggleAll.listenEvent("onclick", () => {
      const todos = todoList.children;

      if (app.state.active === 0) {
        const completed = todos.filter((todo) => todo.hasClass("completed"));
        const $completed = [];
        completed.forEach((todo) => {
          const toggle = todo.children[0].children[0];
          const $completedId = vNodeNodeMap.get(toggle.attrs.id);
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
          const $activeId = vNodeNodeMap.get(toggle.attrs.id);
          const $activeItem = document.getElementById($activeId);
          $active.push($activeItem);
          toggle.attrs.checked = "";
        });
        check($active);
        app.state.active = 0;
        clearCompleted.show();
      }

      updateTodoCount();
    });

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
      const $edit = e.target;
      $edit.focus();
      const $todo = $edit.closest("li");
      const todoId = nodeVNodeMap.get($todo.id);
      const todo = app.getVNodeById(todoId);
      todo.addClass("editing");
    });

    edit.listenEvent("onkeypress", (e) => {
      e.preventDefault();
      if (e.key === "Enter") {
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
    });

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

function onChange() {
  const checkedOld = document.querySelectorAll(".toggle");
  const checkedIds = [];
  checkedOld.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedIds.push(checkbox.id);
    }
  });

  app.update();

  const checkedNew = document.querySelectorAll(".toggle");
  checkedNew.forEach((checkbox) => {
    if (checkedIds.includes(checkbox.id)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  });

  requestAnimationFrame(onChange);
}

requestAnimationFrame(onChange);

import { makeTodoApp } from "./components/todoapp.js";
import { App, VNode } from "../overreact/overReact.js";
import { vNodeNodeMap } from "../overreact/render.js";
import { aAll, aActive, aCompleted } from "./components/footer.js";

const state = {
  total: 0,
  active: 0,
};

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target);
app.setState(state);

const todoList = app.getVNodeById("todoList");
const todoCount = app.getVNodeById("todoCount");
const newTodo = app.getVNodeById("newTodo");
const main = app.getVNodeById("main");
const footer = app.getVNodeById("footer");
const inputToggleAll = app.getVNodeById("inputToggleAll");
const clearCompleted = app.getVNodeById("clearCompleted");

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
      attrs: { id: `label-${count}`, for: `toggle-${count}` },
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
      app.state.total--;
      const listItemId = app.nodeVNodeMap.get(e.target.closest("li").id);
      const listItem = app.getVNodeById(listItemId);
      // const listItem = app.nodeVNodeMap.get(e.target.closest("li"));
      app.remove(listItem);
      if (!listItem.hasClass("completed")) {
        app.state.active--;
        updateTodoCount();
      }

      if (app.state.total === 0) {
        main.hide();
        footer.hide();
      }

      if (app.state.active === app.state.total) {
        clearCompleted.hide();
      }
    });

    // Add event listener to the checkbox
    // Must use addClass and removeClass instead of class = "" and class = "completed",
    // but in the toggle all function, I mustn't do anything to the class or it breaks.
    toggle.listenEvent("onchange", (e) => {
      const listItemId = app.nodeVNodeMap.get(e.target.closest("li").id);
      const listItem = app.getVNodeById(listItemId);
      // const listItem = app.nodeVNodeMap.get(e.target.closest("li"));
      const toggle = listItem.children[0].children[0];
      if (e.target.checked) {
        app.state.active--;
        listItem.addClass("completed");
        // listItem.class = "completed";
        toggle.attrs.checked = "";
        clearCompleted.show();
      } else {
        app.state.active++;
        listItem.removeClass("completed");
        // listItem.class = "";
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
          $completed.push(vNodeNodeMap.get(toggle));
        });
        check($completed);
        app.state.active = app.state.total;
        completed.forEach((todo) => {
          const toggle = todo.children[0].children[0];
          delete toggle.attrs.checked;
          // All but ineffectual attempts to remove the 'completed' class
          // break it.
        });
        app.state.active = app.state.total;
        clearCompleted.hide();
      } else {
        const active = todos.filter((todo) => !todo.hasClass("completed"));
        const $active = [];
        active.forEach((todo) => {
          const toggle = todo.children[0].children[0];
          $active.push(vNodeNodeMap.get(toggle));
          toggle.attrs.checked = "";
          // All but ineffectual attempts to add the 'completed' class
          // break it.
        });
        check($active);
        app.state.active = 0;
        clearCompleted.show();
      }

      updateTodoCount();
    });

    clearCompleted.listenEvent("onclick", () => {
      const todos = todoList.children;
      todos.forEach((todo) => {
        if (todo.hasClass("completed")) {
          app.remove(todo);
          app.state.total--;
        }
      });

      if (app.state.total === 0) {
        main.hide();
        footer.hide();
      }

      clearCompleted.hide();
    });

    // // Add event listener for double click
    // listItem.listenEvent("ondblclick", (e) => {
    //   listItem.addClass("editing");
    //   const $edit = e.target.closest("li").querySelector(".edit");
    //   $edit.focus();
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

import { makeTodoApp } from "./components/todoapp.js";
import { makeVNode } from "../overreact/makeVNode.js";
import { nest } from "../overreact/nest.js";
import { makeRouter } from "../overreact/router.js";
import { listenEvent } from "../overreact/view.js";
import { render } from "../overreact/render.js";
import { mount } from "../overreact/mount.js";
import { diff } from "../overreact/diff.js";

let state = {
  total: 0,
  active: 0,
};

let vApp = makeTodoApp();
let vAppOld = JSON.parse(JSON.stringify(vApp));
console.log(vApp);

let app = render(vApp);
mount(app, document.getElementsByClassName("todoapp")[0]);

const allFilter = document.querySelector('a[href="#/"]');
const activeFilter = document.querySelector('a[href="#/active"]');
const completedFilter = document.querySelector('a[href="#/completed"]');

const routes = {
  "": function () {
    const selectedFilters = document.querySelectorAll(".filters .selected");
    selectedFilters.forEach((filter) => filter.classList.remove("selected"));
    allFilter.classList.add("selected");
    const todos = document.querySelectorAll(".todo-list li");
    todos.forEach((todo) => {
      todo.style.display = "";
    });
  },
  active: function () {
    const selectedFilters = document.querySelectorAll(".filters .selected");
    selectedFilters.forEach((filter) => filter.classList.remove("selected"));
    activeFilter.classList.add("selected");
    const todos = document.querySelectorAll(".todo-list li");
    todos.forEach((todo) => {
      const isCompleted = todo.querySelector(".toggle").checked;
      todo.style.display = isCompleted ? "none" : "";
    });
  },
  completed: function () {
    const selectedFilters = document.querySelectorAll(".filters .selected");
    selectedFilters.forEach((filter) => filter.classList.remove("selected"));
    completedFilter.classList.add("selected");
    const todos = document.querySelectorAll(".todo-list li");
    todos.forEach((todo) => {
      const isCompleted = todo.querySelector(".toggle").checked;
      todo.style.display = isCompleted ? "" : "none";
    });
  },
};

const router = makeRouter(routes);
listenEvent(window, "hashchange", router);
router();

// So far so good. Now added event handlers.

// We'll only know if this is working after event handlers have been added.
function update() {
  const patch = diff(vAppOld, vApp);
  app = patch(app);
  vAppOld = JSON.parse(JSON.stringify(vApp));

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

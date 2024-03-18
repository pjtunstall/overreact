import { makeRouter } from "../../overreact/router.js";
import { listenEvent } from "../../overreact/view.js";

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

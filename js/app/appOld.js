import makeRouter from "../overreact/router.js";
import { makeVNode, listenEvent } from "../overreact/view.js";

let count = 0;

const allFilter = document.querySelector('a[href="#/"]');
const activeFilter = document.querySelector('a[href="#/active"]');
const completedFilter = document.querySelector('a[href="#/completed"]');

const mainSection = document.querySelector(".main");
const footerSection = document.querySelector(".footer");
const inputField = document.querySelector(".new-todo");
const toggleAll = document.querySelector(".toggle-all");
const clearCompleted = document.querySelector(".clear-completed");

mainSection.style.display = "none";
footerSection.style.display = "none";
clearCompleted.style.display = "none";

// Define routes
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

// Create the router
const router = makeRouter(routes);

// Call the router function whenever the hash changes
listenEvent(window, "hashchange", router);

// Call the router function initially to handle the current hash
router();

function updateTodoCount() {
  const todoCount = document.querySelector(".todo-count");
  todoCount.textContent =
    count + (count === 1 ? " item left!" : " items left!");

  const todos = document.querySelectorAll(".todo-list li");
  const someCompleted = Array.from(todos).some(
    (todo) => todo.querySelector(".toggle").checked
  );
  if (someCompleted) {
    clearCompleted.style.display = "block";
  } else {
    clearCompleted.style.display = "none";
  }
}

function removeTodo(todo) {
  todo.remove();
  if (!todo.classList.contains("completed")) {
    count--;
    updateTodoCount();
  }

  if (document.querySelectorAll(".todo-list li").length === 0) {
    mainSection.style.display = "none";
    footerSection.style.display = "none";
  }
}

listenEvent(inputField, "keypress", function (e) {
  if (e.key === "Enter") {
    count++;
    updateTodoCount();
    mainSection.style.display = "block";
    footerSection.style.display = "block";

    // Create the elements
    const toggle = makeVNode("input", {
      className: "toggle",
      type: "checkbox",
    });
    const label = makeVNode("label", { innerText: this.value });
    const destroy = makeVNode("button", { className: "destroy" });
    const view = makeVNode(
      "div",
      { className: "view" },
      toggle,
      label,
      destroy
    );
    const edit = makeVNode("input", {
      className: "edit",
      value: this.value,
    });
    const listItem = makeVNode("li", {}, view, edit);

    // Add event listener to the destroy button
    listenEvent(destroy, "click", function () {
      // Remove the todo item from the DOM
      removeTodo(listItem);

      // Hide the .main and .footer sections if there are no todos left
      if (document.querySelectorAll(".todo-list li").length === 0) {
        mainSection.style.display = "none";
        footerSection.style.display = "none";
      }
    });

    listenEvent(toggleAll, "click", function () {
      const todos = document.querySelectorAll(".todo-list li");
      const allCompleted = Array.from(todos).every(
        (todo) => todo.querySelector(".toggle").checked
      );

      if (allCompleted) {
        count = 0;
        todos.forEach((todo) => {
          todo.classList.remove("completed");
          todo.querySelector(".toggle").checked = false;
          count++;
        });
      } else {
        clearCompleted.style.display = "block";
        todos.forEach((todo) => {
          const toggle = todo.querySelector(".toggle");
          if (!toggle.checked) {
            toggle.checked = true;
            todo.classList.add("completed");
            count--;
          }
        });
      }

      updateTodoCount();
    });

    listenEvent(clearCompleted, "click", function () {
      const todos = document.querySelectorAll(".todo-list li");
      todos.forEach((todo) => {
        if (todo.querySelector(".toggle").checked) {
          removeTodo(todo);
        }
      });

      if (document.querySelectorAll(".todo-list li").length === 0) {
        mainSection.style.display = "none";
        footerSection.style.display = "none";
      }

      clearCompleted.style.display = "none";
    });

    // Add event listener to the checkbox
    listenEvent(toggle, "change", function () {
      if (this.checked) {
        clearCompleted.style.display = "block";
        count--;
      } else {
        count++;
      }
      updateTodoCount();
      listItem.classList.toggle("completed");
    });

    // Add event listener for double click
    listenEvent(listItem, "dblclick", function () {
      listItem.classList.add("editing");
      edit.focus();
    });

    // Add event listener for 'Enter' keypress on edit field
    listenEvent(edit, "keypress", function (e) {
      if (e.key === "Enter") {
        // Update label text and remove 'editing' class
        label.innerText = this.value;
        listItem.classList.remove("editing");
      }
    });

    // Add event listener for 'blur' event on edit field
    listenEvent(edit, "blur", function () {
      // Update label text and remove 'editing' class
      label.innerText = this.value;
      listItem.classList.remove("editing");
    });

    // Append the new todo item to the list
    const list = document.querySelector(".todo-list");
    list.prepend(listItem);

    // Clear the input field
    this.value = "";
  }
});

// setInterval(() => {
//   const vNewApp = createVApp(count);
//   const patch = diff(vApp, vNewApp);
//   $rootEl = patch($rootEl);
//   vApp = vNewApp;
// }, 1000);

// import { app } from "./app.js";

// const aAll = app.getVNodeById("aAll");
// const aActive = app.getVNodeById("aActive");
// const aCompleted = app.getVNodeById("aCompleted");

// const todoList = app.getVNodeById("todoList");
// const todos = todoList.children;

// export const routes = {
//   "": function () {
//     console.log("all");
//     aAll.addClass("selected");
//     aActive.removeClass("selected");
//     aCompleted.removeClass("selected");
//     todos.forEach((todo) => {
//       todo.show();
//     });
//   },
//   active: function () {
//     console.log("active");
//     aAll.removeClass("selected");
//     aActive.addClass("selected");
//     aCompleted.removeClass("selected");

//     todos.forEach((todo) => {
//       if (todo.hasClass("completed")) {
//         todo.hide();
//       } else {
//         todo.show();
//       }
//     });
//   },
//   completed: function () {
//     console.log("completed");
//     aAll.removeClass("selected");
//     aActive.removeClass("selected");
//     aCompleted.addClass("selected");
//     todos.forEach((todo) => {
//       if (todo.hasClass("completed")) {
//         todo.show();
//       } else {
//         todo.hide();
//       }
//     });
//   },
// };

// app.setRoutes(routes);

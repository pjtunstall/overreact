// import { aAll, aActive, aCompleted } from "./components/footer.js";
// import { todoList } from "./components/main.js";

// const todos = todoList.children;

// export const routes = {
//   "": function () {
//     aAll.addClass("selected");
//     aActive.removeClass("selected");
//     aCompleted.removeClass("selected");
//     todos.forEach((todo) => {
//       todo.show();
//     });
//   },
//   active: function () {
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

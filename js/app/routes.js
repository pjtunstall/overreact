import { aAll, aActive, aCompleted } from "./components/footer.js";
import { todoList } from "./components/main.js";
import { app } from "./init.js";

const routes = {
  "": function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");

    aAll.addClass("selected");
    setTimeout(() => {
      document.getElementById("aAll").blur();
    }, 32);

    todoList.children.forEach((todo) => {
      todo.show();
    });
  },
  active: function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");

    aActive.addClass("selected");
    setTimeout(() => {
      document.getElementById("aActive").blur();
    }, 32);

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
    aCompleted.removeClass("selected");

    aCompleted.addClass("selected");
    setTimeout(() => {
      document.getElementById("aCompleted").blur();
    }, 32);

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

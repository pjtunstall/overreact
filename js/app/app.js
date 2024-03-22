import { makeTodoApp } from "./components/todoapp.js";
import { App } from "../overreact/overReact.js";

const state = {
  total: 0,
  active: 0,
};

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target);
app.setState(state);

function update() {
  app.update();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

import { App } from "../overreact/over-react.js";

import { makeTodoApp } from "./components/todoapp.js";

let app;

const state = {
  total: 0,
  active: 0,
};

const vApp = makeTodoApp();
const $target = document.getElementsByClassName("todoapp")[0];

app = new App(vApp, $target, state);

export { app };

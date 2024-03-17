import makeHeader from "./header.js";
import makeMain from "./main.js";
import makeFooter from "./footer.js";

import makeVNode from "../../overreact/makeVNode.js";
import nest from "../../overreact/nest.js";

let state;

function makeTodoApp() {
  let todoApp = makeVNode("section", { class: "todoapp" });

  let header = makeHeader();
  let main = makeMain();
  let footer = makeFooter();

  nest(todoApp, header, main, footer);

  return todoApp;
}

state = {
  total: 0,
  active: 0,
};

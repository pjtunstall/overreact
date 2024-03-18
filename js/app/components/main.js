import { makeVNode } from "../../overreact/makeVNode.js";
import { nest } from "../../overreact/nest.js";

let main;
let inputToggleAll, labelToggleAll, ulTodoList;

export function makeMain() {
  nest(main, inputToggleAll, labelToggleAll, ulTodoList);

  return main;
}

// child of todoApp
main = makeVNode("section", {
  attrs: {
    class: "main",
    style: "display: none",
  },
});

// child of main
inputToggleAll = makeVNode("input", {
  attrs: {
    id: "toggle-all",
    class: "toggle-all",
    type: "checkbox",
  },
});

// child of main
labelToggleAll = makeVNode("label", {
  attrs: {
    for: "toggle-all",
  },
  children: ["Mark all as complete"],
});

// child of main
ulTodoList = makeVNode("ul", {
  attrs: {
    class: "todo-list",
  },
});

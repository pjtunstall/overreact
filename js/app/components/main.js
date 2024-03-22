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
    id: "main",
    class: "main",
    style: "display: none",
  },
});

// child of main
inputToggleAll = makeVNode("input", {
  attrs: {
    id: "inputToggleAll",
    class: "toggle-all",
    type: "checkbox",
  },
});

// child of main
labelToggleAll = makeVNode("label", {
  attrs: {
    for: "inputToggleAll",
  },
  children: ["Mark all as complete"],
});

// child of main
ulTodoList = makeVNode("ul", {
  attrs: {
    id: "ulToDoList",
    class: "todo-list",
  },
});

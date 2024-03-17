import makeVNode from "../../overreact/makeVNode.js";
import nest from "../../overreact/nest.js";

let main;
let inputToggleAll, labelToggleAll, ulTodoList;

export function makeMain() {
  nest(main, inputToggleAll, labelToggleAll, ulTodoList);

  return main;
}

// child of todoApp
main = makeVNode({
  tagName: "section",
  attrs: {
    class: "main",
    style: "display: none",
  },
});

// child of main
inputToggleAll = makeVNode({
  tagName: "input",
  attrs: {
    id: "toggle-all",
    class: "toggle-all",
    type: "checkbox",
  },
});

// child of main
labelToggleAll = makeVNode({
  tagName: "label",
  attrs: {
    for: "toggle-all",
  },
  children: ["Mark all as complete"],
});

// child of main
ulTodoList = makeVNode({
  tagName: "ul",
  attrs: {
    class: "todo-list",
  },
});

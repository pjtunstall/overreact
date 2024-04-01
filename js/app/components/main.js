import { VNode } from "../../overreact/over-react.js";

let main;
let inputToggleAll, labelToggleAll;
export let todoList;

export function makeMain() {
  main.append(inputToggleAll, labelToggleAll, todoList);

  return main;
}

// child of todoApp
main = new VNode("section", {
  attrs: {
    id: "main",
    class: "main",
    style: "display: none",
  },
});

// child of main
inputToggleAll = new VNode("input", {
  attrs: {
    id: "inputToggleAll",
    class: "toggle-all",
    type: "checkbox",
  },
});

// child of main
labelToggleAll = new VNode("label", {
  attrs: {
    for: "inputToggleAll",
  },
  children: ["Mark all as complete"],
});

// child of main
todoList = new VNode("ul", {
  attrs: {
    id: "todoList",
    class: "todo-list",
  },
});

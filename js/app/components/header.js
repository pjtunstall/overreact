import { makeVNode } from "../../overreact/makeVNode.js";
import { nest } from "../../overreact/nest.js";

let header;
let h1, input;

export function makeHeader() {
  header = nest(header, h1, input);
  return header;
}

// child of todoApp
header = makeVNode("header", { attrs: { class: "header" } });

// child of header
h1 = makeVNode("h1", { attrs: { class: "h1" }, children: ["todos"] });

// child of header
input = makeVNode("input", {
  attrs: {
    name: "newTodo",
    class: "new-todo",
    placeholder: "What needs to be done?",
    autofocus: "",
    onkeypress: addTodo,
  },
});

function addTodo(e) {
  if (e.key === "Enter") {
    console.log("Add todo");
  }
}

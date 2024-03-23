import { VNode } from "../../overreact/overReact.js";

let header;
let h1, input;

export function makeHeader() {
  header.append(h1, input);
  return header;
}

// child of todoApp
header = new VNode("header", { attrs: { id: "header", class: "header" } });

// child of header
h1 = new VNode("h1", {
  attrs: { id: "h1", class: "h1" },
  children: ["todos"],
});

// child of header
input = new VNode("input", {
  attrs: {
    id: "newTodo",
    name: "newTodo",
    class: "new-todo",
    placeholder: "What needs to be done?",
    autofocus: "",
    // onkeypress: addTodo,
  },
});

// function addTodo(e) {
//   if (e.key === "Enter") {
//     console.log("Add todo: ", e.target.value);
//   }
// }

// function handleNewTodo(e) {
//   if (e.key === "Enter") {
//     console.log("Add todo");
//     app.state.total++;
//     app.state.active++;
//     updateTodoCount();
//     main.show();
//     footer.show();

//     const toggle = new VNode("input", {
//       class: "toggle",
//       type: "checkbox",
//     });
//     const label = new VNode("label", { innerText: this.value });
//     const destroy = new VNode("button", { class: "destroy" });
//     const view = new VNode("div", {
//       attrs: { class: "view" },
//       children: [toggle, label, destroy],
//     });
//     const edit = new VNode("input", {
//       className: "edit",
//       value: this.value,
//     });
//     const listItem = new VNode("li", { children: [view, edit] });
//     todoList.prepend(listItem);
//   }

//   //   destroy.listenEvent("click", function () {
//   //     // Remove the todo item from the DOM
//   //     removeTodo(listItem);

//   //     // Hide the .main and .footer sections if there are no todos left
//   //     if (app.state.total === 0 && app.state.active === 0) {
//   //       main.hide();
//   //       footer.hide();
//   //     }
//   //   });
// }

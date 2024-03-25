import { VNode } from "../../overreact/overReact.js";

let footer;
let todoCount, ulFilters, clearCompleted;
let todoCountNumber, todoCountText;
export let aAll, aActive, aCompleted;
let liAll, liActive, liCompleted;

export function makeFooter() {
  footer.append(todoCount, ulFilters, clearCompleted);

  todoCount.append(todoCountNumber, todoCountText);
  ulFilters.append(liAll, liActive, liCompleted);

  liAll.append(aAll);
  liActive.append(aActive);
  liCompleted.append(aCompleted);

  return footer;
}

// child of todoApp
footer = new VNode("footer", {
  attrs: { id: "footer", class: "footer", style: "display: none;" },
});

// child of footer
todoCount = new VNode("span", {
  attrs: { id: "todoCount", class: "todo-count" },
});

// child of footer
ulFilters = new VNode("ul", { attrs: { id: "ulFilters", class: "filters" } });

// child of footer
clearCompleted = new VNode("button", {
  attrs: {
    id: "clearCompleted",
    class: "clear-completed",
    style: "display: none;",
  },
  children: ["Clear completed"],
});

// child of todoCount
todoCountNumber = new VNode("strong", {
  attrs: { id: "todoCountNumber" },
  children: ["0"],
});

// child of todoCount
todoCountText = " items left!";

// child of ulFilters
liAll = new VNode("li", { attrs: { id: "liAll" }, children: [] });

// child of liAll
aAll = new VNode("a", {
  attrs: { id: "aAll", href: "#/", class: "selected" },
  children: ["All"],
});

// child of ulFilters
liActive = new VNode("li", { attrs: { id: "liActive" }, children: [] });

// child of liActive
aActive = new VNode("a", {
  attrs: { id: "aActive", href: "#/active" },
  children: ["Active"],
});

// child of ulFilters
liCompleted = new VNode("li", { attrs: { id: "liCompleted" }, children: [] });

// child of liCompleted
aCompleted = new VNode("a", {
  attrs: { id: "aCompleted", href: "#/completed" },
  children: ["Completed"],
});

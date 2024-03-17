import makeVNode from "../../overreact/makeVNode.js";
import nest from "../../overreact/nest.js";

let footer;
let todoCount, ulFilters, clearCompleted;
let todoCountNumber, todoCountText;
let liAll, aAll, liActive, aActive, liCompleted, aCompleted;

export function makeFooter() {
  nest(footer, todoCount, ulFilters, clearCompleted);

  nest(todoCount, todoCountNumber, todoCountText);
  nest(ulFilters, liAll, liActive, liCompleted);

  nest(liAll, aAll);
  nest(liActive, aActive);
  nest(liCompleted, aCompleted);

  return footer;
}

// child of todoApp
footer = makeVNode("footer", {
  attrs: { class: "footer", style: `display: none;` },
});

// child of footer
todoCount = makeVNode("span", { attrs: { class: "todo-count" } });

// child of footer
ulFilters = makeVNode("ul", { attrs: { class: "filters" } });

// child of footer
clearCompleted = makeVNode("button", {
  attrs: { class: "clear-completed", style: "display: none;" },
  children: ["Clear completed"],
});

// child of todoCount
todoCountNumber = makeVNode("strong", { children: ["0"] });

// child of todoCount
todoCountText = " items left!";

// child of ulFilters
liAll = makeVNode("li", { children: [] });

// child of liAll
aAll = makeVNode("a", { attrs: { href: "#/" }, children: ["All"] });

// child of ulFilters
liActive = makeVNode("li", { children: [] });

// child of liActive
aActive = makeVNode("a", {
  attrs: { href: "#/active" },
  children: ["Active"],
});

// child of ulFilters
liCompleted = makeVNode("li", { children: [] });

// child of liCompleted
aCompleted = makeVNode("a", {
  attrs: { href: "#/completed" },
  children: ["Completed"],
});

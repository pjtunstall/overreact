// Distribute these into files todoapp-template.js etc., or just keep them in one file? They could be expressed like this and imported from modules of their own, or they could be fetched as JSON. The file structure could reflect the nesting hierarchy.

// todoapp
let todoapp = {
  tagName: "section",
  attrs: {
    class: "todoapp",
  },
  children: [{}, {}, {}],
};

export default todoapp;

// header, child of todoapp
let header = {
  tagName: "header",
  attrs: {
    class: "header",
  },
  children: [{}, {}],
};

// child of header
let h1 = {
  tagName: "h1",
  children: ["todos"],
};

// child of header
let input = {
  tagName: "input",
  attrs: {
    class: "new-todo",
    placeholder: "What needs to be done?",
    autofocus: "",
  },
};

// main, child of todoapp
let main = {
  tagName: "section",
  attrs: {
    class: "main",
  },
  children: [{}, {}, {}],
};

// child of main
let inputToggleAll = {
  tagName: "input",
  attrs: {
    id: "toggle-all",
    class: "toggle-all",
    type: "checkbox",
  },
};

// child of main
let labelToggleAll = {
  tagName: "label",
  attrs: {
    for: "toggle-all",
  },
  children: ["Mark all as complete"],
};

// child of main
let ulTodoList = {
  tagName: "ul",
  attrs: {
    class: "todo-list",
  },
};

// footer, child of todoapp
let footer = {
  tagName: "footer",
  attrs: {
    class: "footer",
  },
  children: [{}, {}, {}],
};

// child of footer
let todoCount = {
  tagName: "span",
  attrs: {
    class: "todo-count",
  },
  children: [{}, {}],
};

// child of todoCount
let todoCountNumber = {
  tagName: "strong",
  children: ["0"],
};

// child of todoCount
let todoCountText = " items left!";

// child of footer
let ulFilters = {
  tagName: "ul",
  attrs: {
    class: "filters",
  },
  children: [{}, {}, {}],
};

// child of ulFilters
let liAll = {
  tagName: "li",
  children: [],
};

// child of liAll
let aAll = {
  tagName: "a",
  attrs: {
    href: "#/",
  },
  children: ["All"],
};

// child of ulFilters
let liActive = {
  tagName: "li",
  children: [],
};

// child of liActive
let aActive = {
  tagName: "a",
  attrs: {
    href: "#/active",
  },
  children: ["Active"],
};

// child of ulFilters
let liCompleted = {
  tagName: "li",
  children: [],
};

// child of liCompleted
let aCompleted = {
  tagName: "a",
  attrs: {
    href: "#/completed",
  },
  children: ["Completed"],
};

// child of footer
let buttonClearCompleted = {
  tagName: "button",
  attrs: {
    class: "clear-completed",
  },
  children: ["Clear completed"],
};

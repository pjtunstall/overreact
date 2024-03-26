# Overreact: a framework for tense times

## Todo

- Update when state changes, either using a custom event, or setting app.state equal to a proxy object, or by adding a call to onChange in the central event handler. I'm having no luck yet with proxies.

- Checkbox mysteries. Can we do better than hack?

- Appending new items is ok (their framework examples do it), but also figure out how to prepend (as in their JS example).

- I see their JS example uses a data-id attribute.

## Getting started

Clone this repo and install the dependencies with [npm](https://npmjs.com) by running: `npm install`.

## Usage

To create an element, first make a new virtual node. Pass an array of children to the constructor or nest with the `append` method. For example, to create a virtual node `header` with tagName "header", and nest children `h1` and `input`:

```import { VNode } from "../../overreact/overReact.js";

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
    autocomplete: "off",
    required: "",
  },
});
```

To build a virtual node from a string of HTML, you can use the tag function `htmlToVNode(strings, ...values)`, which works like a virtual DOMParser:

```const hello = "Hello";
const vnode = htmlToVNode`<div class="my-div">${hello}, <span>world!</span></div>`;
console.log(vnode);
```

Nest to your heart's content:

```const hello = "Hello";
const vnode = htmlToVNode`<div class="my-div" id="main-div"><p style="color: red;">${hello}, <span class="highlight" style="background-color: yellow;">world!</span></p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;
console.log(vnode);
```

Add attributes with the `addAttribute` method:

```input.addAttribute("placeholder", "Really?");

```

Create an event:

```newTodo.listenEvent("onkeypress", addTodo);

```

Initialize state as an object:

```const state = {
  total: 0,
  active: 0,
};
```

Build a whole virtual DOM representation of your add, then pass its root node and the placeholder actual DOM node that you want to replace to the App constructor, together with initial state an an update function:

```let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state, onChange);
```

Your update function (called `onChange` in this example) should call `app.update()` to compare the virtual DOM with how it was the last time it was rendered, and update the actual DOM with any changes.

Set some routes for a single page application:

```const routes = {
  "": function () {
    aAll.addClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");
    todoList.children.forEach((todo) => {
      todo.show();
    });
  },
  active: function () {
    aAll.removeClass("selected");
    aActive.addClass("selected");
    aCompleted.removeClass("selected");

    todoList.children.forEach((todo) => {
      if (todo.hasClass("completed")) {
        todo.hide();
      } else {
        todo.show();
      }
    });
  },
  completed: function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.addClass("selected");
    todoList.children.forEach((todo) => {
      if (todo.hasClass("completed")) {
        todo.show();
      } else {
        todo.hide();
      }
    });
  },
};

app.setRoutes(routes);
```

Enjoy!

## Resources

Thanks to Jason Yu for his presentation [Building a Simple Virtual DOM from Scratch](https://www.youtube.com/watch?v=85gJMUEcnkc).

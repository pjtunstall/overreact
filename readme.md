# Overreact: a framework for tense times

## 0. Context

The [mini-framework](https://learn.01founders.co/git/root/public/src/branch/master/subjects/mini-framework) project for 01Founders, part of the 01 Edu network of coding bootcamps.

## 1. Getting started

Clone this repo and install the dependencies with [npm](https://npmjs.com) by running: `npm install`.

## 2. Features

- Virtual DOM: diffing and patching
- Routing system: build a single-page application
- State management: choose your own update schedule
- Event handling: central event handler
- Templating: HTML to virtual nodes, virtual nodes to HTML

## 3. How it works

### Abstracting the DOM

You build a tree of virtual DOM nodes, representing the structure of your app. The framework renders it into actual HTML elements and appends the root to the actual HTML element of your choice.

### Routing system

Give the framework an object associating hashes with functions for how your page should change when passing to a new hash. The

### State management

Tell the framework the initial state of your app. The framework creates a proxy object which triggers an update when the state changes. It supplies the logic for how to compare the virtual DOM with how it was on the last update, then renders and attaches anything that's new.

### Event handling

Events are handled through one central event handler. This is more efficient than having many listeners, scattered through the DOM, listening for the same type of event. To regain what might otherwise be lost in terms of readability, the framework offers some syntactic sugar. It lets you attach events to individual nodes as you would normally. Under the hood, though, it instead maintains one event listener on the root node for each event type that you need. These all refer to the same collective handler function, which captures the target. The central event handler looks up the virtual node corresponding to the target, then calls your specific event handler after locating it in a database that links event handlers, types, and potential targets.

## 4. Usage

### Creating and nesting elements

To create an element, first make a new virtual node. Be sure to give it a unique id. Pass an array of children to the constructor or nest with the `append` method. For example, to create a virtual node `header` with tagName "header", and nest children `h1` and `input`:

```
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
    autocomplete: "off",
    required: "",
  },
});
```

### Templating

To build a virtual node from a string of HTML, you can use the tag function `htmlToVNode(strings, ...values)`, which works like a virtual DOMParser:

```
const hello = "Hello";
const vnode = htmlToVNode`<div class="my-div">${hello}, <span>world!</span></div>`;
console.log(vnode);
```

Nest to your heart's content:

```
const hello = "Hello";
const vnode = htmlToVNode`<div class="my-div" id="main-div"><p style="color: red;">${hello}, <span class="highlight" style="background-color: yellow;">world!</span></p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;
console.log(vnode);
```

### Add an attribute

Add attributes with the `addAttribute` method:

```
input.addAttribute("placeholder", "Really?");

```

### Create an event

Create an event:

```
newTodo.listenEvent("onkeypress", addTodo);

```

### Initialize state

Initialize state as an object:

```
const state = {
  total: 0,
  active: 0,
};
```

### Build and mount an app

Build a whole virtual DOM representation of your add, then pass its root node and the placeholder actual DOM node that you want to replace to the App constructor, together with initial state an an update function:

```
let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state, onChange);
```

### Updates

Your update function (called `onChange` in this example) should call `app.update()` to compare the virtual DOM with how it was the last time it was rendered, and update the actual DOM with any changes.

### Routes

Set some routes for a single page application:

```
const routes = {
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

# Overreact: a framework for tense times

[0. Context](#0-context)

[1. Getting started](#1-getting-started)

[2. Features](#2-features)

[3. How it works](#3-how-it-works)

[4. Usage](#4-usage)

[5. Resources](#resources)

## 0. Context

The [mini-framework](https://learn.01founders.co/git/root/public/src/branch/master/subjects/mini-framework) project for 01Founders, part of the 01 Edu network of coding bootcamps. It consists of making a mini framework with certain features and using it to make a [TodoMVC](https://todomvc.com/)--that is, a simple todo-list app of a standard design that can be used to compare how different frameworks accomplish the same task.

## 1. Getting started

Clone this repo and install the dependencies with [npm](https://npmjs.com) by running: `npm install`.

## 2. Features

- Virtual DOM: diffing and patching
- Routing system: single-page application
- State management: updates on change of state
- Event handling: events delegated to a central event handler
- Templating: HTML to virtual nodes, virtual nodes to HTML

## 3. How it works

### Abstracting the DOM

You build a tree of virtual DOM nodes, representing the structure of your app. The framework renders it into actual HTML elements and appends the root to the actual HTML element of your choice.

(Note on notation: a virtual node is an instance of the class `VNode`. Where we think it might help to avoid confusion, we follow the convention of prefixing nodes of the actual DOM with a dollar sign, thus `$Node` for the type, and `$node` versus `vNode` for instances of actual and virtual nodes respectively. In our todo-list app, we use the name `app` for an instance of the framework's `App` class, which encapsulates the whole structure. It has fields `app.vApp` and `app.$app` for the root nodes of its virtual and actual DOMs. See, for example, [Build and mount an app](#build-and-mount-an-app).)

### Routing system

A routing system handles changes of route, aka hash. Give the framework an object associating hashes, i.e. the part of the URL after a `#` symbol, with functions. These functions tell your page how to change when passing to a new hash. The framework will register each one to be called on the event that the hash changes to the value specified. To change hash when the user clicks on an element, give it a `href` value of `#/myHash`. You can make the key an empty string for the default value `#/`. Any event handlers you add can also access the hash to tailor the appearance and behavior of your app to the URL, allowing you to make a single-page application.

### State management

Tell the framework the initial state of your app. The framework creates a proxy object which triggers an update when the state changes. It supplies the logic for how to compare the virtual DOM with how it was on the last update, then renders and attaches anything that's new.

In more detail: updates of the actual DOM happen automatically on change of state; that is, when the value of any property of your state object changes. A `diff` function compares the current virtual DOM with how it was on the last update. It returns a `patch` function that tells the actual DOM what to change. Assuming your app is called `app`, the `app.update` method passes your actual root node to the resulting `patch`, which performs the sync, rendering what needs to be rendered and mounting it at at the appropriate place.

### Event handling

Events are handled through one central event handler. This is more efficient than having many listeners, scattered through the DOM, listening for the same type of event.

To regain what might otherwise be lost in terms of readability, the framework offers some syntactic sugar. It lets you attach events to individual nodes as you would normally. Under the hood, though, it instead maintains one event listener on the root node for each event type that you need. These all refer to the same collective handler function, which captures the target. The central event handler looks up the virtual node corresponding to the target, then calls your specific event handler after locating it in a database that links event handlers, types, and potential targets.

## 4. Usage

### Creating and nesting elements

To create an element, first make a new virtual node:

```javascript
import { VNode } from "../../overreact/overReact.js";

const myVNode = new VNode("div");
```

The first argument is a tag name. The optional second argument is an object with two properties, `attrs` (attributes) and `children`, either of which can be omitted. Chilren can be element nodes or text nodes. If you want the child to be a text node, make it a string.

```javascript
const myVNode = new VNode("div", {
  attrs: {
    id: "VNode-1"
    class: "item",
  },
  children: [
    "Hello world!",
    selfDestructButton
  ]
});

```

To ensure the smooth operation of your app, give each virtual node a unique id.

```javascript
const myVNode = new VNode("div", { attrs: { id: "VNode-1" } });
```

You can pass an array of children to the constructor ...

```javascript
const childVNode1 = new VNode("p", { attrs: { id: "childVNode-1" } });
const childVNode2 = new VNode("p", { attrs: { id: "childVNode-2" } });

const myVNode = new VNode("div", {
  attrs: { id: "VNode-1" },
  children: [childVNode1, childVNode2],
});
```

... or nest with the `append` method:

```javascript
myNode.append(childVNode1, childVNode2);
```

Here's a more elaborate example of a function that creates a virtual node `header` with tagName "header", and nests children `h1` and `input`. It can be imported and used as a component of another virtual node.

```javascript
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

```javascript
const hello = "Hello";

const vNode = htmlToVNode`
<div class="my-div">
  ${hello}, <span>world!</span>
</div>
`;

console.log(vnode);
```

Nest to your heart's content:

```javascript
const hello = "Hello";

const vNode = htmlToVNode`
<div class="my-div"
  id="main-div">
    <p style="color: red;">
      ${hello}, <span class="highlight" style="background-color: yellow;">world!</span>
    </p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
</div>
`;

console.log(vNode);
```

The inverse is `VNodeToHtml`.

### Add an attribute

Add attributes with the `addAttribute` method:

```javascript
input.addAttribute("placeholder", "What's on your mind?");
```

### Create an event

Create an event:

```javascript
newTodo.listenEvent("onkeypress", addTodo);
```

The first argument is the event type, prefixed with `on`. The second argument is your event handler. Write it just as you would a normal event handler. The framework takes care of the rest.

(Please note that, when the node is rendered, this does not attach on old-fashioned on-event listener. Rather, it skips rendering such an attribute and instead adds your event listener to a register that maps event types to maps from virtual nodes to event handlers. When the state changes, it triggers an update, which, as well as syncing the actual DOM with the virtual one, updates event listeners on the a actual root node, adding any new ones and removing unused ones. The central event handler remains unchanged. It always simply refers events to the relevant individual event handler, which it locates in the register.)

### Initialize state

Initialize state as an object:

```javascript
const state = {
  total: 0,
  active: 0,
};
```

### Build and mount an app

Build a whole virtual DOM representation of your add, then pass its root node and the placeholder actual DOM node that you want to replace to the App constructor, together with initial state an an update function:

```javascript
let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state);
```

### Routes

Set some routes for a single page application:

```javascript
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

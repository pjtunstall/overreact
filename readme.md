# ☢verReact:<br>&nbsp;because<br>&nbsp;&nbsp;if a thing's worth doing,<br>&nbsp;&nbsp;&nbsp;it's worth overdoing

[0. Context](#0-context)

[1. Getting started](#1-getting-started)

[2. Features](#2-features)

[3. How it works](#3-how-it-works)

- [Abstracting the DOM](#abstracting-the-dom)
- [Routing system](#routing-system)
- [State management](#state-management)
- [Event handling](#event-handling)

[4. Usage](#4-usage)

- [Create and nest elements](#create-and-nest-elements)
- [Convert HTML to a `VNode` and vice versa](#convert-html-to-a-vnode-and-vice-versa)
- [Add an attribute](#add-an-attribute)
- [Create an event](#create-an-event)
- [Initialize state](#initialize-state)
- [Build and mount an app](#build-and-mount-an-app)
- [Find a node](#find-a-node)
- [Remove a node](#remove-a-node)
- [Traverse](#traverse)
- [Set routes](#set-routes)

[5. Further](#5-further)

- [Extras](#extras)
- [Components](#components)
- [Templating](#templating)
- [Sensorium](#sensorium)

[6. Resources](#6-resources)

## 0. Context

The [mini-framework](https://learn.01founders.co/git/root/public/src/branch/master/subjects/mini-framework) project for 01Founders, part of the 01 Edu network of coding bootcamps. It consists of making a mini framework with certain features and using it to make a [TodoMVC](https://todomvc.com/)--that is, a simple todo-list app of a standard design that can be used to compare how different frameworks accomplish the same task.

## 1. Getting started

Clone this repo and install the dependencies with [npm](https://npmjs.com) by running `npm install`.

## 2. Features

- Virtual DOM: diffing and patching
- Routing system: single-page application
- State management: updates on change of state
- Event handling: events delegated to a central event handler
- Templating: HTML to virtual nodes, virtual nodes to HTML

## 3. How it works

### Abstracting the DOM

You build a tree of virtual DOM nodes, representing the structure of your app. The framework renders it into actual HTML elements and appends the root to the actual HTML element of your choice.

(Note on notation: a virtual node is an instance of the class `VNode`. Where we think it might help to avoid confusion, we follow the convention of prefixing nodes of the actual DOM with a dollar sign, thus `$node` versus `vNode` for instances of actual and virtual nodes respectively. In our todo-list app, we use the name `app` for an instance of the framework's `App` class, which encapsulates the whole structure. It has fields `app.vApp` and `app.$app` for the root nodes of its virtual and actual DOMs. See, for example, [Build and mount an app](#build-and-mount-an-app).)

### Routing system

A routing system handles changes of route, aka hash. That is to say, the part of the URL after a `#` symbol. Give the framework an object associating hashes with functions. These functions tell your page how to change when passing to a new hash. The framework will register each function to be called on the event that the hash changes to the value specified. To change hash when the user clicks on an element, give it a `href` value of the form `#/myHash`. You can make the key an empty string for the default value, equivalent to `#/`. Any event handlers you add can also access the hash to tailor the appearance and behavior of your app to the URL, allowing you to make a single-page application.

### State management

Tell the framework the initial state of your app. The framework creates a proxy object which triggers an update when the state changes. It supplies the logic for how to compare the virtual DOM with how it was on the last update, then renders and attaches anything that's new.

In more detail: updates of the actual DOM happen automatically on change of state; that is, when the value of any property of your state object changes. A `diff` function compares the current virtual DOM with how it was on the last update. It returns a `patch` function that tells the actual DOM what to change. Assuming your `App` is called `app`, the `app.update` method passes your actual root node to the resulting `patch`, which performs the sync, rendering what needs to be rendered and mounting it at at the appropriate place.

### Event handling

Events are handled through one central event handler. This is more efficient than having many listeners, scattered throughout the DOM, listening for the same type of event.

To regain what might otherwise be lost in terms of readability, the framework offers some syntactic sugar. It lets you attach virtual event listeners to individual nodes as you would normally. Under the hood, though, it maintains just one event listener on the root node for each type of event that you need.

All these root event listeners refer to the same, unchanging collective handler function. This central handler captures the target and looks up the corresponding virtual node, then calls your specific event handler after locating it in a database that links event types, targets, and specific handlers.

When you add a new virtual event listener, there is a check to see if the root node is listening for this type of event. If not, such a listener is added to the actual root.

When you remove a virtual event listener, there is a check to see if ANY node has a virtual event listener for such an event type. If not, the actual root event listener corresponding to this event type is removed.

Either way, the central event handler remains unchanged. It always just refers events to the relevant individual event handler, which it locates in the register.

## 4. Usage

### Create and nest elements

To create an element, first make a new virtual node.

```javascript
import { overReact } from "../../overreact/over-react.js";

const myVNode = new overReact.VNode("div");
```

Or, more succinctly,

```javascript
import { VNode } from "../../overreact/over-react.js";

const myVNode = new VNode("div");
```

(The exact path to the module will depend on your file structure.)

The first argument is a tag name. The optional second argument is an object with two properties, `attrs` (attributes) and `children`, either of which can be omitted. Children can be element nodes or text nodes. If you want the child to be a text node, make it a string.

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

Be sure to give each virtual node a unique id.

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

... or nest them later with the `append` method.

```javascript
myNode.append(childVNode1, childVNode2);
```

Important! There is a third and final argument to the `VNode` constructor, representing the app that you want your `VNode` to belong to. This argument is syntactically optional. It's meaningless till you've instantiated an instance of the `App` class, but should definitely be included from that point on. See [below](#build-and-mount-an-app).

Here's a more elaborate example of a function that creates a virtual node `header` with tagName "header", and nests children `h1` and `input`. It can be imported and used as a component of another virtual node.

```javascript
import { overReact } from "../../overreact/over-react.js";

let header;
let h1, input;

export function makeHeader() {
  header.append(h1, input);
  return header;
}

// child of todoApp
header = new VNode("header", {
  attrs: { id: "header", class: "header" },
});

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

Child nodes can also be removed with the `removeChild` method.

### Convert HTML to a `VNode` and vice versa

To build a virtual node from a string of HTML, you can use the tag function `HTMLToVNode(strings, ...values)`, which works like a virtual DOMParser.

```javascript
import { HTMLToVNode as h } from "../../overreact/over-react.js";

const hello = "Hello";

const vNode = h`
<div class="my-div">
  ${hello}, <span>world!</span>
</div>
`;
```

Nest at will, commander!

```javascript
const hello = "Hello";

const vNode = h`
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

The inverse is `VNodeToHTML`, also available as a `VNode` method, `vNode.toHTML`.

### Add an attribute

Add attributes to an existing `VNode` with the `addAttribute` method.

```javascript
input.addAttribute("placeholder", "What's on your mind?");
```

The `class` and `style` attributes can be manipulated with more specific methods: `addClass`, `removeClass`, `hasClass`; `addStyle`, `removeStyle`. The `hide` and `show` methods add and remove the `"display: none"` style.

### Create an event

After [building and initializing](#build-and-mount-an-app) a new app, say you want to an event handler called `addTodo` to be called when a `keypress` event occurs at a node called `newTodo`. The syntax is as follows:

```javascript
const newTodo = app.getVNodeById("newTodo");
newTodo.listenEvent("onkeypress", addTodo);
```

The first argument is the event type, prefixed with `on`. The second argument is your event handler. Write it just as you would a normal event handler. The framework takes care of the rest.

(Please note that, under the hood, when the node is rendered, `listenEvent` does not attach on old-fashioned on-event listener. Rather, it skips rendering such an attribute and instead adds your event listener to a register that maps event types to maps from node ids to specific event handlers such as `addTodo`.)

You can also `unlistenEvent`, or `clearEvents` if you want to remove all event handlers from a node.

### Initialize state

Initialize state as an object.

```javascript
const state = {
  total: 0,
  active: 0,
};
```

### Build and mount an app

A component function, `makeMyVNode`, is a function you write that returns a new virtual node. It calls the `VNode` constructor and nests the resulting `VNode` with `VNode`s you made earlier. You can build up components in this way till you've made the root node of your virtual DOM.

Suppose `makeTodoApp` is your root component function, i.e. a function that returns this virtual root node. Suppose `$target` is the placeholder node in the actual DOM that you want to swap for your own app's actual root node. Then you can create a new `App` like so:

```javascript
import { App } from "../overreact/over-react.js";

import { makeTodoApp } from "./components/todoapp.js";

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state);
```

The `App` constructor renders your virtual DOM into a tree of actual `HTMLElement`s and attaches the result to the actual DOM. It creates a new proxy object from the state argument, which will automatically call `app.update()` when in response to any change of state.

It also initializes a central event register and traverses your virtual DOM to give each `VNode` a reference to it, so that it can be accessed by `VNode` methods such as `listenEvent`.

This is where the third and final argument of the `VNode` constructor comes in. If you make a new `VNode` AFTER initializing your app, be sure to pass `app` to the constructor here. This will give your new `VNode` access to the event register.

### Find a node

Call `app.getVNodeById` to find a node in your virtual DOM.

### Remove a node

Call `app.remove(vNode)` to remove a node from your virtual DOM. Say you do this in a function `f`. If you change state before `f` returns, the removal will automatically be rendered. Otherwise, call `app.update`.

### Traverse

The `App` class also provides a method to traverse the virtual DOM, starting at a node of your choice and running a callback function on every node: `app.traverse(v.Node, callback)`.

### Set routes

Set some routes for a single page application. Assuming `aAll` etc. are virtual anchor tags and that you've created an `App` called `app`,

```javascript
location.hash = "";

const routes = {
  "": function () {
    aAll.addClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");
    todoList.children.forEach((todo) => {
      todo.show();
    });
    app.update();
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
    app.update();
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
    app.update();
  },
};

app.setRoutes(routes);
```

Note the calls to `app.update`! These is needed because `setRoutes` has to register an `onhashchange` event listener on the global object, `window`. Since `window` is outside of your app, it can't use the in-app [event delegation system](#event-handling).

You can access the hash at any time with `location.hash`, for example to tailor the behavior of event handlers.

```javascript
const hash = location.hash.slice(2);
const parts = hash.split("/");
const route = parts[0];
if (route === "completed") {
  listItem.hide();
}
```

Enjoy!

## 5. Further

### Extras

It would be convenient for users of the framework to have access to more functions, such as the various selection methods available through the DOM API, and a `prepend` to complement `append` for nesting elements. Error handling could be more thorough. Another exercise would be to write tests to ensure that each feature continues to work as extras are added.

### Components

Much of this document is about the raw details of the implementation, where the key players are `VNode`s and the tree they belong to. A more sophisticated approach might encapsulate the nuts and bolts better, and let users think more in terms of whole UI components, and perhaps also abstract, structural components that group together features scattered across the DOM.

### Templating

At present, this just consists of a function to write a `VNode` using HTML, with the option to embed JavaScript expressions in string literals, and a function to convert a `VNode` into HTML. But it could be developed further into a true DSL (domain-specific language) like JSX, with extra logic to interpret non-standard HTML syntax, making it easier to create and nest components.

### Sensorium<sup>[1](#f1)</sup>

In our crude system, a global diff is called every time any state property changes. One could imagine a system where components can be selective about which properties they're sensitive to, allowing for a more focused diff. By analogy with event delegation, a sensory register could keep track of what sort of update is required by whom, when which aspect of state changes.

## 6. Resources

Thanks to Jason Yu for his presentation [Building a Simple Virtual DOM from Scratch](https://www.youtube.com/watch?v=85gJMUEcnkc).

<span id="f1">1</span>: I'd call it Sensorium, this ideal version. Its S would be its logo: two snakes, argent and sable, ouroborée, eyes yin-yangée, as a figure 8 or Infinity Rampant. Probably, on its home page, it would be animated, ripples in the one reflected in the other, as if to suggest the responsiveness of actual to virtual DOM. [↩](#a1)

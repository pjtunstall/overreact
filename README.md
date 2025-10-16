# ☢verReact

> If a thing's worth doing, it's worth overdoing.

[1. Context](#1-context)

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
- [Listen for an event](#listen-for-an-event)
- [Initialize state](#initialize-state)
- [Build and mount an app](#build-and-mount-an-app)
- [Find a node](#find-a-node)
- [Remove a node](#remove-a-node)
- [Traverse](#traverse)
- [Set routes](#set-routes)
- [Sample structure](#sample-structure)

[5. Deviations](#5-deviations)

[6. Further](#6-further)

- [Extras](#extras)
- [Storage](#storage)
- [Routing](#routing)
- [Components](#components)
- [Templating](#templating)
- [Events](#events)
- [Sensorium](#sensorium)

[7. Resources](#7-resources)

## 1. Context

This is my take on the [mini-framework](https://github.com/01-edu/public/tree/master/subjects/mini-framework) project for 01Founders, part of the [01 Edu](https://01-edu.org/) network of coding bootcamps. The exercise is to design a miniature frontend framework, with features as listed in the next section, and use it to make a [TodoMVC](https://todomvc.com/)--that is, a simple todo-list app of a standard design that can be used to compare how different frameworks accomplish the same task.

## 2. Features

- Virtual DOM: diffing and patching
- Routing system: single-page application
- State management: updates on change of state
- Event handling: events delegated to a central event handler
- Templating: HTML to virtual nodes, virtual nodes to HTML

## 3. How it works

### Abstracting the DOM

You build a tree of virtual DOM nodes, representing the structure of your app. The framework renders<sup id="ref-f1">[1](#f1)</sup> it into actual HTML elements and appends the root to the actual HTML element of your choice.

A note on notation: a virtual node is an instance of the class `VNode`. Where I think it might help to avoid confusion, I follow the convention of prefixing nodes of the actual DOM with a dollar sign, thus `$node` versus `vNode` for instances of actual and virtual nodes respectively. In my todo-list app, I use the name `app` for an instance of the framework's `App` class, which encapsulates the whole structure. It has fields `app.vApp` and `app.$app` for the root nodes of its virtual and actual DOMs. See, for example, [Build and mount an app](#build-and-mount-an-app).

### Routing system

The routing system handles changes of route, aka hash or hash fragment. That is to say, the part of the URL after a `#` symbol. Give the framework an object associating hashes with functions. These functions tell your page how to change when passing to a new hash. The framework will register each function to be called on the event that the hash changes to the value specified. To change hash when the user clicks on an element, give it a `href` value of the form `#/myHash`. You can make the key an empty string for the default value, equivalent to `#/`. Any event handlers you add can also access the hash to tailor the appearance and behavior of your app to the URL, allowing you to make a single-page application.

### State management

Tell the framework the initial state of your app. The framework creates a proxy object which triggers an update when the state changes. It supplies the logic for how to compare the virtual DOM with how it was on the last update, then renders and attaches anything that's new.

In more detail: updates of the actual DOM happen automatically on change of state; that is, when the value of any property of your state object changes. A `diff` function compares the current virtual DOM with how it was on the last update. It returns a `patch` function that tells the actual DOM what to change. Assuming your `App` is called `app`, the `app.update` method passes your actual root node to the resulting `patch`, which performs the sync, rendering what needs to be rendered and mounting it at the appropriate place.

A nuance is that, in the interests of efficiency, updates are batched to happen at most once per frame using `requestAnimationFrame`.<sup id="ref-f2">[2](#f2)</sup>

### Event handling

Events are handled through one central event handler. This is more efficient than having many listeners, scattered throughout the DOM, listening for the same type of event.

To regain what might otherwise be lost in terms of readability, the framework offers some syntactic sugar. It lets you attach virtual event listeners to individual nodes as you would normally. Under the hood, though, it maintains just one event listener on the root node for each type of event that you need.

All these root event listeners share one unchanging, collective handler. When an event occurs, it's intercepted at the root during the capturing phase of propagation and the collective handler is called. This central event handler looks up the virtual node corresponding to the target, then calls your specific event handler after locating it in a register that links event types, targets, and specific handlers.

When you add a new virtual event listener, there's a check to see if the root node is listening for this type of event. If not, such a listener is added to the actual root.

When you remove a virtual event listener, there's a check to see if ANY node has a virtual event listener for such an event type. If not, the actual root event listener corresponding to this event type is removed.

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

Important! There is a third and final argument to the `VNode` constructor, representing the app that you want your `VNode` to belong to. This argument is syntactically optional. It's meaningless till you've made an instance of the `App` class, but should definitely be included from that point on. See [below](#build-and-mount-an-app).

Here's a more elaborate example of a function that creates a virtual node `header` with tagName "header", and nests children `h1` and `input`. It can be imported and nested in another virtual node.

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
```

The inverse is `VNodeToHTML`, also available as a `VNode` method, `vNode.toHTML`.

### Add an attribute

Add attributes to an existing `VNode` with the `addAttribute` method.

```javascript
input.addAttribute("placeholder", "What's on your mind?");
```

The `class` and `style` attributes can be manipulated with more specific methods: `addClass`, `removeClass`, `hasClass`; `addStyle`, `removeStyle`. The `hide` and `show` methods add and remove the `"display: none"` style.

### Listen for an event

After [building and initializing](#build-and-mount-an-app) a new app, say you want an event handler called `addTodo` to be called when a `keypress` event occurs at a node called `newTodo`. The syntax is as follows:

```javascript
const newTodo = app.getVNodeById("newTodo");
newTodo.listenEvent("onkeypress", addTodo);
```

The first argument is the event type, prefixed with `on`. The second argument is your event handler. Write it just as you would a normal event handler. The framework takes care of the rest.

(Note that, under the hood, when the node is rendered, `listenEvent` does not attach on old-fashioned on-event listener. Rather, it skips rendering such an attribute and instead adds your event listener to a register that maps event types to maps from node ids to specific event handlers such as `addTodo`.)

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

A component function, `makeMyVNode`, is a function you write that returns a new virtual node. It calls the `VNode` constructor and nests the resulting `VNode` with `VNode`s you made earlier. You can build up components in this way till you've made the root node of your virtual DOM. (Regarding the term 'component', see [below](#components).)

Suppose `makeTodoApp` is your root component function, i.e. a function that returns the virtual root node of your app. Suppose `$target` is the placeholder node in the actual DOM that you want to swap for your own app's actual root node. Then you can create a new `App` like so:

```javascript
import { App } from "../overreact/over-react.js";

import { makeTodoApp } from "./components/todoapp.js";

let vApp = makeTodoApp();
let $target = document.getElementsByClassName("todoapp")[0];
let app = new App(vApp, $target, state);
```

The `App` constructor renders your virtual DOM into a tree of actual `HTMLElement`s and attaches the result to the actual DOM. It creates a new proxy object from the state argument, which will automatically call `app.update()` in response to any change of state.

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
const routes = {
  "": function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");

    aAll.addClass("selected");
    setTimeout(() => {
      document.getElementById("aAll").blur(); // See Focus on filters, below
    }, 32);

    todoList.children.forEach((todo) => {
      todo.show();
    });
  },
  active: function () {
    aAll.removeClass("selected");
    aActive.removeClass("selected");
    aCompleted.removeClass("selected");

    aActive.addClass("selected");
    setTimeout(() => {
      document.getElementById("aActive").blur();
    }, 32);

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
    aCompleted.removeClass("selected");

    aCompleted.addClass("selected");
    setTimeout(() => {
      document.getElementById("aCompleted").blur();
    }, 32);

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

You can access the hash at any time with `location.hash`, for example to tailor the behavior of event handlers.

```javascript
const hash = location.hash.slice(2);
const parts = hash.split("/");
const route = parts[0];
if (route === "completed") {
  listItem.hide();
}
```

Note that `setRoutes` has to register its `hashchange` event listener on the global object, `window`. Since `window` is outside of your app, it can't use the in-app [event delegation system](#event-handling).

Note also the call to `app.update` in the `router` function in `app.setRoutes`, which is necessary to sync the actual DOM to these changes in the virtual DOM, given that they don't automatically trigger an update via a change of state:<sup id="ref-f3">[3](#f3)</sup>

```javascript
setRoutes(routes) {
    const router = () => {
      const path = window.location.hash.slice(2);
      if (routes[path]) {
        routes[path]();
        this.update();
      } else {
        console.log(`Route ${path} not found`);
      }
    };

    window.addEventListener("hashchange", router);
    this.router = router;
    this.router();
  }
```

### Sample structure

```
app
├──components
|  ├──footer.js
|  ├──header.js
|  ├──main.js
|  └──todoapp.js
|
├──app.js
├──events.js
├──init.js
└──routes.js
```

For the TodoMVC app, I define three principle subcomponents--`footer`, `header`, and `main`--in modules of their own. These are imported into `todoapp`, where they're used to define the root component of the virtual DOM. `init` imports this root and defines the state object. It then passes root and state to the `App` constructor along with a reference to the actual DOM element whose place will be taken by the rendered root.

The top-level module `app` imports the resulting instance of `App` from `init`. Next, `app` performs a side-effect import of the `routes` module. This is so that `routes` can specify functions to instruct the UI on how to change in response to each change of route.

Finally, `app` imports the `addTodo` event handler from `events` and sets it as callback for a virtual `onkeypress` event listener on the `newTodo` form. (Other virtual event listeners are nested in `appTodo`.)

## 5. Deviations

### Persistence

The TodoMVC spec says that the todo items should be persisted in local storage or whatever other means of storage your framework has. Although easy to implement, I chose not to do this to avoid the inconvenience of having to continually clear local storage while testing, and because few, if any, of the examples do so.

### Focus of filters

I chose to blur (unfocus) a filter button after it's clicked on. Otherwise it retains the thick red box-shadow supplied by the focus pseudo-class till something else is clicked on. Although many examples on TodoMVC do allow the box-shadow to remain, I guessed that this was not the intention of the projects' creators, or that they perhaps didn't anticipate the anomaly seen when the user changes filter by navigating with back or forward buttons and it stays focused even though a different filter is now highlighted by the "selected" class.

Of all the examples labeled "new" on TodoMVC, only Backbone and jQuery take my approach. The majority allow the anomaly. (Old examples have a quite different style and so can't be compared.) That said, the spec does recommend Backbone as a reference implementation.

### Quotes

The spec advocates single quotes in JavaScript, but I chose to stick to my normal default double quotes.

## 6. Further

### Extras

It would be convenient for users of the framework to have available more functions, such as a `prepend` to complement `append` for nesting elements. Virtual parallels to the various selection methods available through the DOM API would further reduce the need for actual DOM access.

The style attribute really should be broken down into an object so that it's easier to add, remove, and modify CSS properties individually.

More error handling would be good. Another exercise would be to write tests to ensure that each feature continues to work as extras are added.

It would be neat to add automatic batching of style reads before writes, in the mannner of [`fastDOM`](https://github.com/wilsonpage/fastdom), to prevent [layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing).

### Storage

At present, I ask users to give items a unique id (so that they play a role similar to keys in React), but if items were persisted, I'd really need some extra logic to ensure distinct ids for each item, either by switching to UUIDs or by saving the current value of an iterator. This value would then constitute a hidden aspect of state: governing internal structure, although it wouldn't need to trigger any update itself, given that an update is already triggered by a change in the total number of items.

### Routing

I used the simplest form of routing for a single-page application, hash-based. Indeed the TodoMVC project includes hash symbols in their URLs, which made this a natural choice.

Now, hash-based routing is somewhat of a hack since the hash fragment is really intended as a link to a specific part of the page. The browser would normally scroll to an element whose id was equal to the hash, if such an element existed.

More robust and versatile is history-based routing, which uses the browser's [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to associate a state object of your choice with a URL. This is better for SEO and server-side rendering, but requires server-side coordination to redirect the client if they arrive at the site via a deep link or refresh the page while on one.

For the future, an even better choice will likely be the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API), still experimental as of April 2024. (Supported in Chrome, but not yet Firefox or Safari.)

### Components

The key players in my framework are `VNode`s. The obvious next step would be to integrate components as a third type of node in the virtual DOM along with element nodes and text nodes. Rather than letting event handlers modify the virtual DOM directly, I could restrict event handlers to modifying state variables (whether global or local to a component). A change in a state variable, could trigger components that rely on it to be called and the `VNode` that each returns to be appended.

In my TodoMVC, event handlers were defined all in one `events` module, but it might be more readable to define event handlers together with the relevant component.

Dependence on state could be built into component definitions. (See below, [Sensorium](#sensorium)).

### Templating

At present, I have just a nod towards templating in the form of a function to write a `VNode` using HTML, with the option to embed JavaScript expressions in string literals; along with a function to perform the inverse operation of converting a `VNode` into HTML. But these ideas could be developed further into a true DSL (domain-specific language) like JSX, with extra logic to interpret non-standard HTML syntax, making it easier to create and nest components. Interesting reading in this regard is Rahul Sharma's article [How to create JSX template engine from scratch](https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08) and Rodrigo Pombo's [Build your own React](https://pomb.us/build-your-own-react/), which shows how to use Babel to transpile actual JSX into your own `createElement` function.

### Events

As yet, I only handle one event type per node, like the old `onchange`, `onclick` etc. property of Vanilla JS. More syntactic sugar could be added to simulate the way one can attach multiple event listeners to the same node for the same event type with `addEventListener`.

Simulated propagation could be implemented to offer more flexibility.

<div id="sensorium">

### Sensorium<sup id="ref-f4">[4](#f4)</sup>

</div>

As I currently have it, event handlers play multiple roles: they modify virtual nodes, set state properties, and make new virtual nodes, as well as setting further event listeners. Greater separation of concerns could be achieved if even the effect of event handlers on the virtual DOM was mediated through state.<sup id="ref-f5">[5](#f5)</sup>

React itself has various ways of managing state, principly `useState` (which creates variables local to a component, that can be accessed there and mutated to trigger a re-render), and `useContext` (for global state variables). The Preact library also allows use of signals, a slicker approach, discussed further below.

My framework calls an actual update (with a diff of the whole virtual DOM) every frame in which a state property changes, albeit the only virtual nodes that cause changes in actual nodes are those that have changed since the previous update. The obvious next step would be a system where components can be selective about which properties they're sensitive to, and where diffing is restricted to the relevant subtrees.

Alternatively, by analogy with event delegation, a sensory register could keep track of what sort of update is required by whom, in response to a change in which aspect of state. I gather React uses this technique in some cases as an optimization, although it mainly stores dependency data in the components themselves. Signals offer a neat take on this idea whereby components are registered automatically when they access a signal value.

TodoMVC has a really simple state with just two properties. My approach could be generalized, in various ways, to handle more complex states. For nested state objects, I could make nested proxies recursively. If one knows the structure of the state object won't change, this could be done once at the outset. But if even the structure of state is dynamic, nested proxies might have to be built in response to structural changes. In either case, performance might benefit from lazy initialization: those nested proxies could be created on-the-fly as the relevant properties are accessed through the getters of parent objects. How useful such nesting would be, though, I don't know.

JavaScript offers other trap methods on [proxy objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy), besides `get` and `set`, which could be useful here, such as `defineProperty` and `deleteProperty`, `has`, and `ownKeys`.

Finally, it would be interesting to explore signals-based reactivity. Signals are a technique for sharing state, simpler and more performant than React hooks (Web Dev Simplified: [Why Signals Are Better Than React Hooks](https://www.youtube.com/watch?v=SO8lBVWF2Y8)). Signals fall into two types: state signals, which are like the basic state properties discussed above, and computed signals, whose value depends on that of one or more other signals. Each signal has, associated with it, a value and functions to be called when the value changes. In frameworks like Solid, changes propagate through a dependency graph of signals, modifying the UI directly without a virtual DOM. The result is often called "fine-grained reactivity", because it can target specific DOM elements.

Here's a simple implementation of signals, based on Academind's video [Understanding Signals](https://www.youtube.com/watch?v=t18Kzj9S8-M). The choice of computed signals to exemplify comes from [JavaScript Signals standard proposal](https://github.com/tc39/proposal-signals) by Daniel Ehrenberg et al. While this basic example achieves a kind of implicit subscription on accessing the observed value via `effect` (a nice feature associated with signals), it should ideally be refined with lazy evaluation on `get` (rather than immediately on `set`) and caching logic to support this.

Note that, although the syntax of `const [count, setCount] = createSignal(0);` resembles React's `useState`, the first element of this returned array, `count`, is a actually function.

```javascript
let current;

function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = [];

  function set(newValue) {
    value = newValue;
    subscribers.forEach((subscriber) => subscriber(value));
  }

  function get() {
    if (current) {
      subscribers.push(current);
    }
    return value;
  }

  return [get, set];
}

function createComputedSignal(getter) {
  let value = getter();
  const subscribers = [];

  function get() {
    if (current) {
      subscribers.push(current);
    }
    return value;
  }

  effect(() => {
    const newValue = getter();
    if (newValue !== value) {
      value = newValue;
      subscribers.forEach((subscriber) => subscriber(value));
    }
  });

  return get;
}

function effect(callback) {
  current = callback;
  callback();
  current = null;
}

const [count, setCount] = createSignal(0);
const isEven = createComputedSignal(() => (count() & 1) === 0);
const parity = createComputedSignal(() => (isEven() ? "even" : "odd"));

effect(() => {
  console.log(`Count: ${count()}\n`);
});

effect(() => {
  console.log(`Parity: ${parity()}`);
});

setInterval(() => setCount(count() + 1), 1000);
```

## 7. Resources

Thanks to Jason Yu for his presentation [Building a Simple Virtual DOM from Scratch](https://www.youtube.com/watch?v=85gJMUEcnkc). My `diff`, `render`, and `VNode`-creation functions are closely based on this.

I didn't know about this till after the project was finished in its present form, but Rodrigo Pombo's article [Build your own React](https://pomb.us/build-your-own-react/) would have been really useful. He shows how to use a fiber tree, which is modern React's take on the idea of a virtual DOM, how to perform updates asynchronously (using `requestIdleCallback`), how to manage state with a React-style `useState`, and how to transpile JSX into your own code using Babel.

David Greenspan has a good explanation of event propagation: [Browser events: bubbling, capturing, and delegation](https://blog.meteor.com/browser-events-bubbling-capturing-and-delegation-14db28e924ae).

Ratiu5 offers an introduction to the idea of signals in [Implementing Signals from Scratch](https://dev.to/ratiu5/implementing-signals-from-scratch-3e4c). For a much more in-depth discussion, not tied to any specific framework, see the [JavaScript Signals standard proposal](https://github.com/tc39/proposal-signals) by Daniel Ehrenberg et al. or Rakesh Purohit's overview, [How to Implement Signals in JavaScript for Efficient Event Handling](https://www.dhiwise.com/post/how-to-implement-signals-in-javascript-for-event-handling).

<a id="f1" href="#ref-f1">1</a>: Following Jason Yu's terminology, in the talk listed in [Resources](#resources), above, I adopted the word "render" to mean the act of turning virtual DOM elements into actual DOM. Since then, I've learnt that React uses "render" to mean recreating a virtual DOM node and its descendents. In a React context, the process of matching actual DOM to virtual is called "reconciliation". [↩](#ref-f1)

<a id="f2" href="#ref-f2">2</a>: In fact, making the update function an asynchronous callback in this way serves a double purpose. It also ensures that whatever event handler caused the change of state finishes running, and hence finishes its modifications to the virtual DOM before the actual DOM is adjusted to match it. This was necessary because I chose to call updates via a proxy object, representing state, and trap methods of proxy objects are called synchronously. [↩](#ref-f2)

<a id="f3" href="#ref-f3">3</a>: Alternatively, I could have left it to the framework user to pass a state variable, representing the filter, to the `App` constructor, but I chose to make it automatic. [↩](#ref-f3)

<a id="f4" href="#ref-f4">4</a>: This is what I'd call the framework that might arise out of these ideas. Its S would be its [emblem](https://en.wikipedia.org/wiki/Blazon): two snakes, argent and sable, ouroborée, eyes yin-yangée, as a figure 8 or Infinity Rampant. Most like, on its home page, it'd be animated, ripples in the one reflected in the other, as if to echo the echoing of the virtual by the actual DOM. It's arch-rivals, of course, would be R☠ (Adverse, aka Bad React) and Reflux (logo not shown for obvious reasons). [↩](#ref-f4)

<a id="f5" href="#ref-f5">5</a>: An unanticipated effect of this practice of directly modifying the virtual DOM inside of event handlers was that, when I first introduced state management via a proxy object, I wouldn't see all changes I expected till the following user interaction, leading to accumulating inconsistencies. On AI advice, I placed the update function, with its diff and reconciliation, in a `requestAnimationFrame` callback, and that worked, but it wasn't till much later that I discovered the reason. It turns out that proxy traps are called synchronously! (I'd assumed they were asynchronous.) To see why this caused the issue, consider an event handler that first modifies a state variable, then the virtual DOM, and then returns without any more changes of state variables. With synchronous updates, the diff and reconciliation process happens immediately, as soon as the state variable changes, so it can't include the subsequent changes made to the virtual DOM. These won't show up till the next state change, which will only be triggered by further user interaction. [↩](#ref-f5)

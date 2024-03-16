# Overreact: A framework for Tense Times

## The state of play

We have a functioning, but very basic framework (in `router.js` and `view.js`), and have used it to make a complete TodoMVC app. How sophisticated the framework should be is not clear from the instructions, but it would be good to improve on some points.

Specifically, I'd like to rewrite it as follows. The virtual DOM will be remodeled on Jason Yu's [Building a Simple Virtual DOM from Scratch](https://www.youtube.com/watch?v=85gJMUEcnkc), using a slightly modified terminology.

The TodoMVC app will be remodeled to consist of a function `makeVApp` that will build a virtual DOM instance, using a hierarchy of component functions (which in their turn will be built using the framework's `createVNode` and `nestVNode` functions), based on the current state (total number of items, and number of items left) and return its root `vNode` (virtual node, i.e. node of the virtual DOM).

Let's call an instance of the virtual DOM a vApp. `requestAnimationFrame` or `setInterval` will be called to schedule `eventLoop`. The latter function will make a new vApp based on the current state, then update the DOM by calling a `patch` function on DOM Node that is the root of the `app`. A `patch` is the type of function returned by `diff`. `diff` defines a particular `patch` recursively based on old and new values of `vApp`. The `patch` function makes use of `render` and `mount` to turn a vNode into a Node and attach it to the actual DOM.

The components will register event listeners and handlers that will tell the vNode returned by the component how to change in response to user input, given the current state, and change the state if needed. Depending on needs and taste, a developer can choose to have event handlers do more of the work of changing the vNode directly, or set up a more complex state and let the event handlers affect vNodes indirectly via makeVApp. I suppose the former is simpler when the change affects the vNode itself, and the latter when the change affects other vNodes.

## Todo

- Separate app into modules and MVC folder structure.

- Use Jason Yu's virtual DOM functions for more thorough virtual DOM, then use it to update the real DOM at frequent intervals according to the virtual DOM. I've transcribed them from his YouTube video. They're in the other files in `overreact`. Look at how he actually uses it in his create app function, and compare how React does it on the TodoMVC site. He makes his updates every second, but we'd want it to be more often. It wouldn't feel resonsive if you had to wait a second to see the effect of clicking on something.

- Incorporate `mount` into `diff`.

- GitHub Copilot suggestsimplementing a more sophisticated state management, e.g.,

```let state = {
    count: 0,
    remaining: 0,
    // other state properties...
};

function getState(key) {
    return state[key];
}

function setState(key, value) {
    state[key] = value;
}
```

Then use `getState('count')` and `setState('count', newValue)` to get and set the count. If you want to persist the state across page reloads, you could use the Web Storage API (localStorage or sessionStorage) to store the state.

However, since this is barely more sophisticated, and might be a needless complication since these are the only relevant variables. The idea of storing in the browser might also be not what we want, since it makes it less reactive.

## Getting started

- Clone this repo and install the dependencies with [npm](https://npmjs.com) by running: `npm install`.

## Usage

To create elements, next existing elements, and to create events:

```import { createElement, createEvent, nestElements, addAttributes } from "./view.js";

const div = createElement('div');
const span = createElement('span', { innerText: 'Hello, world!' });
nestElements(div, span);
addAttributes(div, { id: 'my-div' });

document.body.append(div);

const event = createEvent('my-event', { message: 'Hello, world!' });
div.dispatchEvent(event);
```

To nest elements as they're created:

```const listItem = createElement('li', {},
createElement('div', { className: 'view' },
createElement('input', { className: 'toggle', type: 'checkbox' }),
createElement('label', { innerText: 'New todo item' }),
createElement('button', { className: 'destroy' })
),
createElement('input', { className: 'edit', value: 'New todo item' })
);
```

To create routes:

```// Define routes
const routes = {
	"": function () {
		// Switch to route ""
	},
	active: function () {
		// Switch to route "active"
	},
	completed: function () {
		// Switch to route "completed"
	},
};

// Create the router
const router = createRouter(routes);

// Call the router function whenever the hash changes
listenEvent(window, "hashchange", router);

// Call the router function initially to handle the current hash
router();
```

## Resources

Thanks to Jason Yu for his presentation [Building a Simple Virtual DOM from Scratch](https://www.youtube.com/watch?v=85gJMUEcnkc).

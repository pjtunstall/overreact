# Overreact: A framework for Tense Times

## Todo

- Move routes into their own module. Import the already-made vApp from makeVApp before importing routes.

- Event handlers.

- Functions to edit style: add, remove, clear. Parsing and unparsing as needed.

- Consider module structure.

- Incorporate `mount` into `diff`.

- Import from Overreact in a way that I prefix names of imports with Overreact?

- REJECTED: Separate app into modules and MVC folder structure.

- REJECTED: GitHub Copilot suggestsimplementing a more sophisticated state management, e.g.,

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

```import { makeVNode, createEvent, nestElements, addAttributes } from "./view.js";

const div = makeVNode('div');
const span = makeVNode('span', { innerText: 'Hello, world!' });
nestElements(div, span);
addAttributes(div, { id: 'my-div' });

document.body.append(div);

const event = createEvent('my-event', { message: 'Hello, world!' });
div.dispatchEvent(event);
```

To nest elements as they're created:

```const listItem = makeVNode('li', {},
makeVNode('div', { className: 'view' },
makeVNode('input', { className: 'toggle', type: 'checkbox' }),
makeVNode('label', { innerText: 'New todo item' }),
makeVNode('button', { className: 'destroy' })
),
makeVNode('input', { className: 'edit', value: 'New todo item' })
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

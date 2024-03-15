# Overreact: A framework for Tense Times

## Todo

- Separate app into modules and MVC folder structure.

- Implement a more sophisticated state management, e.g.,

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

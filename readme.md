# Overreact: a framework for tense times

## Todo

- Event handlers: switch to using ids in maps to avoid problem of actual DOM re-using references.

- All, active, and completed visibilities should depend on state, not transition to state.

- Edit.

- The require mystery.

- Toggle class mystery.

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

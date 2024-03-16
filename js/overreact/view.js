// Create an element
export function createElement(type, props = {}, ...children) {
  const element = document.createElement(type);
  Object.assign(element, props);
  element.append(
    ...children.map((child) =>
      typeof child === "string" ? document.createTextNode(child) : child
    )
  );
  return element;
}

// Create an event
export function createEvent(name, detail = {}) {
  return new CustomEvent(name, { detail });
}

// Listen for an event
export function listenEvent(element, eventName, handler) {
  element.addEventListener(eventName, handler);
}

// Nest elements
export function nestElements(parent, ...children) {
  parent.append(...children);
  return parent;
}

// Add attributes to an element
export function addAttributes(element, attributes) {
  Object.assign(element, attributes);
  return element;
}

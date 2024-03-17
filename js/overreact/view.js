// Create an element
export function makeVNode(type, props = {}, ...children) {
  const element = document.makeVNode(type);
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

// Add attributes to an element
export function addAttributes(element, attributes) {
  Object.assign(element, attributes);
  return element;
}

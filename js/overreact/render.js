import { eventHandlersRecord } from "../overreact/events.js";

export const nodeVNodeMap = new Map();

export function render(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }
  return renderElement(vNode);
}

function renderElement(vNode) {
  const { tagName, attrs, children } = vNode;
  const $node = document.createElement(tagName);

  nodeVNodeMap.set($node, vNode);

  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("on")) {
      // Create a new Map for this event type if it doesn't exist
      if (!eventHandlersRecord.has(k)) {
        eventHandlersRecord.set(k, new Map());
      }
      // Set the handler for this vNode in the Map for this event type
      eventHandlersRecord.get(k).set(vNode, v);
    } else {
      $node.setAttribute(k, v);
    }
  }
  for (const child of children) {
    $node.append(render(child));
  }
  return $node;
}

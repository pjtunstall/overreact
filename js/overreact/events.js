import { nodeVNodeMap } from "./render.js";

export const eventHandlersRecord = new Map();
const rootEventTypes = new Set();

export function listenEvent(vNode, eventType, handler) {
  if (!eventHandlersRecord.has(eventType)) {
    eventHandlersRecord.set(eventType, new Map());
  }
  vNode.attrs[eventType] = handler;
  eventHandlersRecord.get(eventType).set(vNode, handler);
}

export function unlistenEvent(vNode, eventType) {
  if (!vNode.attrs) {
    console.log("No attributes found for vNode", vNode);
    return;
  }
  delete vNode.attrs[eventType];
  eventHandlersRecord.get(eventType).delete(vNode);
  removeEventListenersKeyIfNone(eventType);
}

function removeEventListenersKeyIfNone(eventType) {
  if (
    eventHandlersRecord.has(eventType) &&
    eventHandlersRecord.get(eventType).size === 0
  ) {
    eventHandlersRecord.delete(eventType);
  }
}

export function clearEventHandlers(vNode) {
  for (const [k, v] of Object.entries(vNode.attrs)) {
    if (k.startsWith("on")) {
      eventHandlersRecord.get(k).delete(vNode);
    }
  }
}

export function updateEventListenersOnRootNode($root) {
  // Add new event listeners and update rootEventTypes
  eventHandlersRecord.forEach((handlers, eventType) => {
    if (!rootEventTypes.has(eventType)) {
      $root.addEventListener(eventType.slice(2), centralEventHandler, true);
      rootEventTypes.add(eventType);
    }
  });

  // Remove old event listeners
  rootEventTypes.forEach((eventType) => {
    if (!eventHandlersRecord.has(eventType)) {
      $root.removeEventListener(eventType.slice(2), centralEventHandler);
      rootEventTypes.delete(eventType);
    }
  });
}

function centralEventHandler(event) {
  const eventType = "on" + event.type;
  const vNode = nodeVNodeMap.get(event.target);
  const handlersForType = eventHandlersRecord.get(eventType);
  if (handlersForType && handlersForType.has(vNode)) {
    const handler = handlersForType.get(vNode);
    if (typeof handler === "function") {
      handler(event);
    }
  }
}

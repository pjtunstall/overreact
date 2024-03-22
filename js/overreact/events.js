export const eventHandlersRecord = new Map();

export function listenEvent(vNode, eventType, handler) {
  if (!eventHandlersRecord.has(eventType)) {
    eventHandlersRecord.set(eventType, new Map());
  }
  vNode.attrs["on" + eventType] = handler;
}

export function unlistenEvent(vNode, eventType) {
  if (!vNode.attrs) {
    console.log("No attributes found for vNode", vNode);
    return;
  }
  delete vNode.attrs["on" + eventType];
  eventHandlersRecord.get(eventType).delete(vNode);
  removeEventListenersKeyIfNone(eventType);
}

function removeEventListenersKeyIfNone(eventType) {
  // Check if there are no more handlers for this event type
  if (
    eventHandlersRecord.has(eventType) &&
    eventHandlersRecord.get(eventType).size === 0
  ) {
    eventHandlersRecord.delete(eventType);
  }
}

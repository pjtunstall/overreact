import { eventHandlersRecord, unlistenEvent } from "./events.js";

export function addAttribute(vNode, attribute, value) {
  if (attribute.startsWith("on") && eventHandlersRecord.has(attribute)) {
    eventHandlersRecord.get(attribute).set(vNode, value);
  } else {
    vNode.attrs[attribute] = value;
  }
  return vNode;
}

export function removeAttribute(vNode, attribute) {
  if (vNode.attrs[attribute] === undefined) {
    console.log("No attribute found for", attribute, "on", vNode);
    return vNode;
  }
  if (attribute.startsWith("on")) {
    if (
      eventHandlersRecord.has(attribute) &&
      eventHandlersRecord.get(attribute).has(vNode)
    ) {
      unlistenEvent(vNode, attribute.slice(2));
      return vNode;
    } else {
      console.log("No event handler found for", attribute, "on", vNode);
      return vNode;
    }
  }
  delete vNode.attrs[attribute];
  return vNode;
}

export function updateEventAttribuesOnRootVNOde(vNode) {
  for (const eventType in eventHandlersRecord) {
    vNode.attrs["on" + eventType] = centralEventHandler;
  }
  for (const attribute in vNode.attrs) {
    if (attribute.startsWith("on") && !eventHandlersRecord.has(attribute)) {
      delete vNode.attrs[attribute];
    }
  }
}

function centralEventHandler(event) {
  eventHandlersRecord.forEach(eventType).forEach((vNode) => {
    eventHandlersRecord.get(eventType).get(vNode)(event);
  });
}

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
  if (attribute.startsWith("on")) {
    if (
      eventHandlersRecord.has(attribute) &&
      eventHandlersRecord.get(attribute).has(vNode)
    ) {
      unlistenEvent(vNode, attribute);
      return vNode;
    } else {
      console.log("No event handler found for", attribute, vNode);
      return vNode;
    }
  }
  if (vNode.attrs[attribute] === undefined) {
    console.log("No attribute found for", attribute, vNode);
    return vNode;
  }
  delete vNode.attrs[attribute];
  return vNode;
}

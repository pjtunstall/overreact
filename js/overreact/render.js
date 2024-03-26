import { eventHandlersRecord } from "../overreact/events.js";

export const nodeVNodeMap = new Map();
export const vNodeNodeMap = new Map();

export function render(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }
  return renderElement(vNode);
}

function renderElement(vNode) {
  const { tagName, attrs, children } = vNode;
  const $node = document.createElement(tagName);

  for (const [k, v] of Object.entries(attrs)) {
    if (!k.startsWith("on")) {
      $node.setAttribute(k, v);
    }
  }

  for (const child of children) {
    $node.append(render(child));
  }

  nodeVNodeMap.set($node, vNode);
  vNodeNodeMap.set(vNode, $node);

  let id = vNode.attrs.id;
  let $id = $node.id;
  if (typeof vNode === "string") {
    id = vNode;
  }
  if (typeof $node === "string") {
    $id = $node;
  }

  nodeVNodeMap.set($id, id);
  vNodeNodeMap.set(id, id);

  return $node;
}

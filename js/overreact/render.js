export const $NodeToVNodeMap = new Map();
export const VNodeTo$NodeMap = new Map();

export function render(vNode) {
  if (typeof vNode === "string") {
    $NodeToVNodeMap.set(vNode, vNode);
    VNodeTo$NodeMap.set(vNode, vNode);
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

  // Original way of mapping vNode to $node and vice versa. For most purposes, we've switched to using the id attribute because that makes it easier to keep the link between elements as the page changes, but the original remains for now, as it's still used by the central event handler.
  $NodeToVNodeMap.set($node, vNode);
  VNodeTo$NodeMap.set(vNode, $node);

  const id = vNode.attrs.id;
  const $id = $node.id;

  $NodeToVNodeMap.set($id, id);
  VNodeTo$NodeMap.set(id, $id);

  return $node;
}

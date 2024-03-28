export const $NodeToVNodeMap = new Map();
export const VNodeTo$NodeMap = new Map();

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

  $NodeToVNodeMap.set($node, vNode);
  VNodeTo$NodeMap.set(vNode, $node);

  let id = vNode.attrs.id;
  let $id = $node.id;
  if (typeof vNode === "string") {
    id = vNode;
  }
  if (typeof $node === "string") {
    $id = $node;
  }

  $NodeToVNodeMap.set($id, id);
  VNodeTo$NodeMap.set(id, id);

  return $node;
}

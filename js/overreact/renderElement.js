export default ({ tagName, attrs, children }) => {
  const $el = document.createElement(tagName);
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v);
  }
  for (const child of children) {
    $el.append(render(child));
  }
  return $el;
};

const render = (vNode) => {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }
  return renderElement(vNode);
};

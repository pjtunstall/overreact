export function nestElements(parent, ...children) {
  parent.append(...children);
  return parent;
}

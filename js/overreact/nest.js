export function nest(parent, ...children) {
  parent.children = children;
  return parent;
}

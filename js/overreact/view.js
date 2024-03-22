export function hide(vNode) {
  if (vNode.style) {
    vNode.attrs.style += " display: none;";
  } else {
    vNode.attrs.style = "display: none;";
  }
}

export function show(vNode) {
  if (vNode.style) {
    vNode.attrs.style += " display: block;";
  } else {
    vNode.attrs.style = "display: block;";
  }
}

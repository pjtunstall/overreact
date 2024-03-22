export function hide(vNode) {
  if (vNode.attrs.style) {
    vNode.attrs.style = vNode.attrs.style.replace(
      /display: [^;]*;?/g,
      "display: none;"
    );
  } else {
    vNode.attrs.style = "display: none;";
  }
}

export function show(vNode) {
  if (vNode.attrs.style) {
    vNode.attrs.style = vNode.attrs.style.replace(
      /display: [^;]*;?/g,
      "display: block;"
    );
  } else {
    vNode.attrs.style = "display: block;";
  }
}

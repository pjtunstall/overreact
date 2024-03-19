export function htmlToVNode(strings, ...values) {
  // Combine the strings and values to create the HTML string
  const htmlString = strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");

  // Create a new DOM parser and parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const root = doc.body.firstChild;

  // Recursive function to create the vnode
  function createVNode(node) {
    // Create the vnode object
    const vnode = {
      tagName: node.tagName.toLowerCase(),
      attrs: {},
      children: [],
    };

    // Add attributes
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      vnode.attrs[attr.name] = attr.value;
    }

    // Add children
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        vnode.children.push(createVNode(childNode));
      } else if (
        childNode.nodeType === Node.TEXT_NODE &&
        childNode.textContent.trim() !== ""
      ) {
        vnode.children.push(childNode.textContent.trim());
      }
    }

    return vnode;
  }

  // Create and return the root vnode
  return createVNode(root);
}

// // Usage:
// const hello = "Hello";
// const vnode = htmlToVNode`<div class="my-div">${hello}, <span>world!</span></div>`;
// console.log(vnode);

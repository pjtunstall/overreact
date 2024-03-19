export function htmlToVNode(strings, ...values) {
  // Combine the strings and values to create the HTML string
  const htmlString = strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");

  // Split the HTML string into tags and text nodes
  const parts = htmlString.split(/(<[^>]+>)/g).filter(Boolean);

  // Create a stack to keep track of the current parent node
  const stack = [];
  let rootNode = null;

  // Process each part
  for (let part of parts) {
    if (part.startsWith("<")) {
      // This part is a tag
      const isClosingTag = part.startsWith("</");
      const isSelfClosingTag = part.endsWith("/>");
      const tagName = part.match(/<\/?(\w+)/)[1];

      if (isClosingTag) {
        stack.pop();
      } else {
        // This part is an opening tag, so create a new node
        const node = { tagName, attrs: {}, children: [] };

        // Parse attributes
        const attrString = part.match(/<\w+([^>]*)>/)[1];
        const attrArray = attrString.match(
          /(\w+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g
        );
        if (attrArray) {
          for (let attr of attrArray) {
            const [name, value] = attr.split("=");
            node.attrs[name] = value.replace(/["']/g, "");
          }
        }

        if (stack.length > 0) {
          // If there's a parent node, add this node to its children
          const parentNode = stack[stack.length - 1];
          parentNode.children.push(node);
        } else {
          rootNode = node;
        }

        if (!isSelfClosingTag) {
          // Add this node to the stack
          stack.push(node);
        }
      }
    } else {
      // This part is a text node, so add it to the current node's children
      const parentNode = stack[stack.length - 1];
      if (parentNode) {
        parentNode.children.push(part.trim());
      }
    }
  }

  return rootNode;
}

// // Usage:
// const hello = "Hello";
// const vnode = htmlToVNode`<div class="my-div">${hello}, <span>world!</span></div>`;
// console.log(vnode);

// // Usage:
// const hello = "Hello";
// const vnode = htmlToVNode`<div class="my-div" id="main-div"><p style="color: red;">${hello}, <span class="highlight" style="background-color: yellow;">world!</span></p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;
// console.log(vnode);

// // Old version that used  the DOMParser API.
// export function htmlToVNode(strings, ...values) {
//   // Combine the strings and values to create the HTML string
//   const htmlString = strings.reduce((result, string, i) => {
//     return result + string + (values[i] || "");
//   }, "");

//   // Create a new DOM parser and parse the HTML string
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, "text/html");
//   const root = doc.body.firstChild;

//   // Recursive function to create the vnode
//   function createVNode(node) {
//     // Create the vnode object
//     const vnode = {
//       tagName: node.tagName.toLowerCase(),
//       attrs: {},
//       children: [],
//     };

//     // Add attributes
//     for (let i = 0; i < node.attributes.length; i++) {
//       const attr = node.attributes[i];
//       vnode.attrs[attr.name] = attr.value;
//     }

//     // Add children
//     for (let i = 0; i < node.childNodes.length; i++) {
//       const childNode = node.childNodes[i];
//       if (childNode.nodeType === Node.ELEMENT_NODE) {
//         vnode.children.push(createVNode(childNode));
//       } else if (
//         childNode.nodeType === Node.TEXT_NODE &&
//         childNode.textContent.trim() !== ""
//       ) {
//         vnode.children.push(childNode.textContent.trim());
//       }
//     }

//     return vnode;
//   }

//   // Create and return the root vnode
//   return createVNode(root);
// }

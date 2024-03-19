export function htmlToVNode(strings, ...values) {
  // Combine the strings and values to create the HTML string
  const htmlString = strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");

  console.log("HTML string:", htmlString); // Add logging here

  // Split the HTML string into tags and text nodes
  const parts = htmlString.split(/(<[^>]+>)/g).filter(Boolean);

  console.log("Parts:", parts); // Add logging here

  // Create a stack to keep track of the current parent node
  const stack = [];
  let rootNode = null;

  // Process each part
  for (let [i, part] of parts.entries()) {
    console.log(i);
    console.log("Processing part:", part); // Add logging here
    console.log("Stack:", stack); // Add logging here
    console.log(parts[parts.length - i - 1]); // Add logging here
    if (part.startsWith("<")) {
      // This part is a tag
      const isClosingTag = part.startsWith("</");
      const tagName = part.match(/<\/?(\w+)/)[1];

      console.log("Processing tag:", tagName, "Is closing tag:", isClosingTag); // Add logging here

      if (isClosingTag) {
        // This is a closing tag, so pop the current node off the stack
        // Add atributes to the current node
        const currentNode = stack.pop();
        if (currentNode) {
          const array = parts[parts.length - i - 1]
            .replaceAll("<", "")
            .replaceAll(">", "")
            .trimStart()
            .split(" ");
          array.shift();
          console.log(array); // Add logging here
          if (array) {
            for (let i = 1; i < array.length; i++) {
              const attr = array[i];
              const [name, value] = attr.split("=");
              currentNode.attrs[name] = value?.replace(/["']/g, "");
            }
          }
        }
      } else {
        // This is an opening tag, so create a new node and push it onto the stack
        const node = { tagName, attrs: {}, children: [] };
        if (stack.length > 0) {
          // If there's a parent node, add this node to its children
          const parentNode = stack[stack.length - 1];
          parentNode.children.push(node);
        } else {
          rootNode = node;
        }
        stack.push(node);
      }
    } else {
      // This part is a text node, so add it to the current node's children
      const parentNode = stack[stack.length - 1];
      if (parentNode) {
        parentNode.children.push(part.trim());
      }
    }
  } // Add logging here

  return rootNode;
}

// // Rewrite to not use the DOMParser API. Make our own parser.
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

// // Usage:
// const hello = "Hello";
// const vnode = htmlToVNode`<div class="my-div">${hello}, <span>world!</span></div>`;
// console.log(vnode);

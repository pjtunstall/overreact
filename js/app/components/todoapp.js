import { makeHeader } from "./header.js";
import { makeMain } from "./main.js";
import { makeFooter } from "./footer.js";

import { render } from "../../overreact/render.js";
import { makeVNode } from "../../overreact/makeVNode.js";
import { nest } from "../../overreact/nest.js";
import { mount } from "../../overreact/mount.js";

function makeTodoApp() {
  let todoApp = makeVNode("section", { attrs: { class: "todoapp" } });

  let header = makeHeader();
  let main = makeMain();
  let footer = makeFooter();

  nest(todoApp, header, main, footer);

  return todoApp;
}

// Encapsulate some of this logic in the framework:
// pass vApp to a framework function and let it handle the rest,
// including updating the root node with event handlers.
const vApp = makeTodoApp();
const app = render(vApp);
mount(app, document.getElementsByClassName("todoapp")[0]);

export { vApp, app };

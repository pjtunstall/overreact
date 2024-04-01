import { makeHeader } from "./header.js";
import { makeMain } from "./main.js";
import { makeFooter } from "./footer.js";

import { VNode } from "../../overreact/over-react.js";

export function makeTodoApp() {
  let todoApp = new VNode("section", {
    attrs: { id: "todoapp", class: "todoapp" },
  });

  let header = makeHeader();
  let main = makeMain();
  let footer = makeFooter();

  todoApp.append(header, main, footer);

  return todoApp;
}

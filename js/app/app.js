import { vApp, app } from "./components/todoapp.js";
import "./routes.js";
import { diff } from "../overreact/diff.js";
import { eventHandlersRecord, listenEvent } from "../overreact/events.js";
import { nodeVNodeMap } from "../overreact/render.js";
import { updateEventListenersOnRootNode } from "../overreact/events.js";

let state = {
  total: 0,
  active: 0,
};

let vAppOld = JSON.parse(JSON.stringify(vApp));
let $app = app;

updateEventListenersOnRootNode($app);

console.log(vApp);
console.log($app);

console.log(eventHandlersRecord);
console.log(nodeVNodeMap);

// So far so good. Now added event handlers.

// // We'll only know if this is working after event handlers have been added.
// function update() {
//   const patch = diff(vAppOld, vApp);
//   $app = patch($app);
//   vAppOld = JSON.parse(JSON.stringify(vApp));

//   requestAnimationFrame(update);
// }

// requestAnimationFrame(update);

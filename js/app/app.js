import { vApp, app } from "./components/todoapp.js";
import "./routes.js";
import { diff } from "../overreact/diff.js";

let state = {
  total: 0,
  active: 0,
};

let vAppOld = JSON.parse(JSON.stringify(vApp));
let $app = app;

// So far so good. Now added event handlers.

// We'll only know if this is working after event handlers have been added.
function update() {
  const patch = diff(vAppOld, vApp);
  $app = patch($app);
  vAppOld = JSON.parse(JSON.stringify(vApp));

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

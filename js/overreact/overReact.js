import { render } from "./render.js";
import { makeRouter } from "./router.js";
import { updateEventListenersOnRootNode } from "./events.js";
import { diff } from "./diff.js";

export class App {
  constructor(vApp, $target) {
    this.vApp = vApp;
    this.vAppOld = JSON.parse(JSON.stringify(vApp));
    this.$app = render(vApp);
    $target.replaceWith(this.$app);
  }

  setRoutes(routes) {
    const router = makeRouter(routes);
    router();
  }

  setState(state) {
    this.state = state;
  }

  update() {
    const patch = diff(this.vAppOld, this.vApp);
    this.$app = patch(this.$app);
    this.vAppOld = JSON.parse(JSON.stringify(this.vApp));
    updateEventListenersOnRootNode(this.$app);
  }

  getVNodeById(id) {
    let q = [this.vApp];
    while (q.length > 0) {
      let vNode = q.shift();
      if (vNode.attrs.id === id) {
        return vNode;
      }
      if (vNode.children) {
        q = q.concat(vNode.children);
      }
    }
  }
}

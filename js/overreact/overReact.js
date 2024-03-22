import { render } from "./render.js";
import { makeRouter } from "./router.js";
import { updateEventListenersOnRootNode } from "./events.js";
import { diff } from "./diff.js";
import { addAttribute, removeAttribute } from "./attributes.js";
import { listenEvent, unlistenEvent } from "./events.js";
import { addStyle, removeStyle } from "./style.js";
import { nest } from "./nest.js";

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
    console.log("No vNode with id,", id, "found");
    return null;
  }

  addAttribute(vNode, attribute, value) {
    addAttribute(vNode, attribute, value);
  }

  removeAttribute(vNode, attribute) {
    removeAttribute(vNode, attribute);
  }

  listenEvent(vNode, eventType, handler) {
    listenEvent(vNode, eventType, handler);
  }

  unlistenEvent(vNode, eventType) {
    unlistenEvent(vNode, eventType);
  }

  nest(parent, ...children) {
    nest(parent, ...children);
  }

  hide(vNode) {
    addStyle(vNode, display, none);
  }

  show(vNode) {
    removeStyle(vNode, display, none);
  }

  addStyle(vNode, key, value) {
    addStyle(vNode, key, value);
  }

  removeStyle(vNode, key) {
    removeStyle(vNode, key);
  }
}

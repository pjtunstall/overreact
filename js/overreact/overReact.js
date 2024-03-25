import { vNodeToHtml } from "./vNodeToHtml.js";
import { addAttribute, removeAttribute } from "./attributes.js";
import {
  listenEvent,
  unlistenEvent,
  updateEventListenersOnRootNode,
  clearEventHandlers,
  eventHandlersRecord,
} from "./events.js";
import { addStyle, removeStyle } from "./style.js";

import { render, nodeVNodeMap, vNodeNodeMap } from "./render.js";
import { makeRouter } from "./router.js";
import { diff } from "./diff.js";

export class VNode {
  constructor(tagName, { attrs = {}, children = [] } = {}) {
    if (typeof tagName !== "string") {
      throw new Error("tagName must be a string");
    }

    if (typeof attrs !== "object") {
      throw new Error("attrs must be an object");
    }

    if (!Array.isArray(children)) {
      throw new Error("children must be an array");
    }

    this.tagName = tagName;
    this.attrs = attrs;
    this.children = children;
  }

  toHtml() {
    return vNodeToHtml(this);
  }

  append(...children) {
    this.children.push(...children);
    return this;
  }

  prepend(...child) {
    this.children.unshift(...child);
    return this;
  }

  removeChild(childToRemove) {
    if (this.children.indexOf(childToRemove) === -1) {
      throw new Error("Child not found");
    }
    this.children = this.children.filter((child) => child !== childToRemove);
    return this;
  }

  addAttribute(attribute, value) {
    addAttribute(this, attribute, value);
    return this;
  }

  removeAttribute(attribute) {
    removeAttribute(this, attribute);
    return this;
  }

  addClass(className) {
    if (this.attrs.class) {
      this.attrs.class += ` ${className}`;
    } else {
      this.attrs.class = className;
    }
    return this;
  }

  removeClass(className) {
    if (this.attrs.class) {
      this.attrs.class = this.attrs.class.replace(className, "").trim();
    }
    return this;
  }

  hasClass(className) {
    if (this.attrs.class) {
      return this.attrs.class.includes(className);
    }
    return false;
  }

  listenEvent(onevent, handler) {
    listenEvent(this, onevent, handler);
    return this;
  }

  unlistenEvent(onevent) {
    unlistenEvent(this, onevent);
    return this;
  }

  hide() {
    addStyle(this, "display", "none");
    return this;
  }

  show() {
    removeStyle(this, "display", "none");
    return this;
  }

  addStyle(key, value) {
    addStyle(this, key, value);
    return this;
  }

  removeStyle(key) {
    removeStyle(this, key);
    return this;
  }
}

export class App {
  constructor(vApp, $target) {
    this.vApp = vApp;
    this.vAppOld = JSON.parse(JSON.stringify(vApp));
    this.nodeVNodeMap = nodeVNodeMap;
    this.vNodeNodeMap = vNodeNodeMap;
    this.eventHandlersRecord = eventHandlersRecord;
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

  traverse(vNode, callback) {
    callback(vNode);
    if (vNode.children) {
      vNode.children.forEach((child) => this.traverse(child, callback));
    }
  }

  remove(vNodeToRemove) {
    this.traverse(this.vApp, (vCurr) => {
      if (!vCurr.children || vCurr.children.length === 0) {
        return;
      }
      for (let i = 0; i < vCurr.children.length; i++) {
        const child = vCurr.children[i];
        if (!child) {
          console.log("Undefined child", child);
          continue;
        }
        if (
          (typeof vNodeToRemove === "string" &&
            typeof child === "string" &&
            vNodeToRemove === child) ||
          (child.attrs &&
            vNodeToRemove.attrs &&
            child.attrs.id === vNodeToRemove.attrs.id)
        ) {
          vCurr.children = vCurr.children
            .slice(0, i)
            .concat(vCurr.children.slice(i + 1));
          // vNodeNodeMap.delete(child);
          // nodeVNodeMap.delete(this.nodeVNodeMap.get(child));
          const nodeId = vNodeNodeMap.get(child.attrs.id);
          vNodeNodeMap.delete(child.attrs.id);
          nodeVNodeMap.delete(nodeId);
          // console.log("Removed", child);
          break;
        }
      }
    });
  }

  getVNodeById(id) {
    let q = [this.vApp];
    while (q.length > 0) {
      let vNode = q.shift();
      if (typeof vNode === "string") {
        if (vNode === id) {
          return vNode;
        }
        continue;
      }
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
}

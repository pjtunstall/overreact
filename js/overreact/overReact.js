import { VNodeToHtml } from "./VNodeToHtml.js";
import { addAttribute, removeAttribute } from "./attributes.js";
import {
  listenEvent,
  unlistenEvent,
  updateEventListenersOnRootNode,
  eventHandlersRecord,
} from "./events.js";
import { addStyle, removeStyle } from "./style.js";

import { render, $NodeToVNodeMap, VNodeTo$NodeMap } from "./render.js";
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
    return VNodeToHtml(this);
  }

  append(...children) {
    this.children.push(...children);
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
  constructor(vApp, $target, state) {
    this.vApp = vApp;
    this.vAppOld = JSON.parse(JSON.stringify(vApp));
    this.$NodeToVNodeMap = $NodeToVNodeMap;
    this.VNodeTo$NodeMap = VNodeTo$NodeMap;
    this.eventHandlersRecord = eventHandlersRecord;
    this.$app = render(vApp);
    $target.replaceWith(this.$app);

    this.state = new Proxy(state, {
      set: (state, key, value) => {
        if (state[key] === value) {
          console.log("No change");
          return true;
        }
        state[key] = value;
        console.log("Setting", key, "to", value);
        requestAnimationFrame(() => this.update());
        return true;
      },
    });
  }

  setRoutes(routes) {
    const router = makeRouter(routes);
    router();
  }

  update() {
    console.log("Updating");

    let checked = document.querySelectorAll(".toggle");
    let checkedIds = [];
    checked.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedIds.push(checkbox.id);
      }
    });

    document.dispatchEvent(new CustomEvent("changed", { detail: false }));
    const patch = diff(this.vAppOld, this.vApp);
    this.$app = patch(this.$app);
    this.vAppOld = JSON.parse(JSON.stringify(this.vApp));
    updateEventListenersOnRootNode(this.$app);

    checked = document.querySelectorAll(".toggle");
    checked.forEach((checkbox) => {
      if (checkedIds.includes(checkbox.id)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
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
          const nodeId = VNodeTo$NodeMap.get(child.attrs.id);
          VNodeTo$NodeMap.delete(child.attrs.id);
          $NodeToVNodeMap.delete(nodeId);
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

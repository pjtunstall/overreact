import { VNodeToHtml } from "./VNodeToHtml.js";
import { EventRegister } from "./events.js";
import { addStyle, removeStyle } from "./style.js";
import { render } from "./render.js";
import { makeRouter } from "./router.js";
import { diff } from "./diff.js";

export class VNode {
  constructor(tagName, { attrs = {}, children = [] } = {}, app = null) {
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

    this.eventRegister = app ? app.eventRegister : null;
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
    if (attribute.startsWith("on")) {
      if (this.eventRegister.handlers.has(attribute)) {
        this.root.eventRegister.handlers
          .get(attribute)
          .set(this.attrs.id, value);
      } else {
        this.eventRegister.handlers.set(
          attribute,
          new Map([[this.attrs.id, value]])
        );
      }
    } else {
      this.attrs[attribute] = value;
    }
    return this;
  }

  removeAttribute(attribute) {
    if (attribute.startsWith("on")) {
      if (
        this.eventRegister.handlers.has(attribute) &&
        this.eventRegister.handlers.get(attribute).has(this.attrs.id)
      ) {
        this.eventRegister.unlistenEvent(this, attribute);
        return this;
      } else {
        console.log("No event handler found for", attribute, this);
        return this;
      }
    }
    if (this.attrs[attribute] === undefined) {
      console.log("No attribute found for", attribute, this);
      return this;
    }
    delete this.attrs[attribute];
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
    if (!this.eventRegister) {
      throw new Error("Event register not set");
    }
    this.eventRegister.listenEvent(this, onevent, handler);
    return this;
  }

  unlistenEvent(onevent) {
    if (!this.eventRegister) {
      throw new Error("Event register not set");
    }
    this.eventRegister.unlistenEvent(this, onevent);
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
    this.$app = render(vApp);
    $target.replaceWith(this.$app);
    this.eventRegister = new EventRegister(this.$app);

    this.state = new Proxy(state, {
      set: (state, key, value) => {
        if (state[key] === value) {
          console.log("No change");
          return true;
        }
        state[key] = value;
        console.log("Setting", key, "to", value);

        // requstAnimation frame is needed here to make sure `update` is called before the repaint that it triggers. Otherwise it may be called after the repaint and the changes will not be visible until repaint is triggered again by the next update.
        requestAnimationFrame(() => this.update());

        return true;
      },
    });

    this.setEventRegisterOnVNodes();
  }

  setEventRegisterOnVNodes() {
    this.traverse(this.vApp, (vNode) => {
      if (typeof vNode === "string") {
        return;
      }
      vNode.eventRegister = this.eventRegister;
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
    this.eventRegister.updateListenersOnRootNode();

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

export class EventRegister {
  constructor($root) {
    this.$root = $root;
    this.handlers = new Map();
    this.types = new Set();
    this._centralEventHandler = this._centralEventHandler.bind(this);
  }

  listenEvent(vNode, eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map());
    }
    vNode.attrs[eventType] = handler;
    this.handlers.get(eventType).set(vNode.attrs.id, handler);
  }

  unlistenEvent(vNode, eventType) {
    if (!vNode.attrs) {
      console.log("No attributes found for vNode", vNode);
      return;
    }
    delete vNode.attrs[eventType];
    this.handlers.get(eventType).delete(vNode.attrs.id);
    removeEventListenersKeyIfNone(eventType);
  }

  clearEventHandlers(vNode) {
    for (const [k, v] of Object.entries(vNode.attrs)) {
      if (k.startsWith("on")) {
        this.handlers.get(k).delete(vNode.attrs.id);
      }
    }
  }

  updateListenersOnRootNode() {
    // Add new event listeners and update rootEventTypes
    this.handlers.forEach((handlers, eventType) => {
      if (!this.types.has(eventType)) {
        this.$root.addEventListener(
          eventType.slice(2),
          this._centralEventHandler,
          true
        );
        this.types.add(eventType);
      }
    });

    // Remove old event listeners
    this.types.forEach((eventType) => {
      if (!this.handlers.has(eventType)) {
        $root.removeEventListener(
          eventType.slice(2),
          this._centralEventHandler
        );
        this.types.delete(eventType);
      }
    });
  }

  _centralEventHandler(event) {
    const eventType = "on" + event.type;
    const handlersForType = this.handlers.get(eventType);
    if (handlersForType && handlersForType.has(event.target.id)) {
      const handler = handlersForType.get(event.target.id);
      if (typeof handler === "function") {
        handler(event);
      }
    }
  }

  _removeEventListenersKeyIfNone(eventType) {
    if (
      this.handlers.has(eventType) &&
      this.handlers.get(eventType).size === 0
    ) {
      this.handlers.delete(eventType);
    }
  }
}

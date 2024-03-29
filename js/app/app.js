import { app } from "./init.js";
import "./routes.js";
import { addTodo } from "./events.js";

const newTodo = app.getVNodeById("newTodo");
newTodo.listenEvent("onkeypress", addTodo);

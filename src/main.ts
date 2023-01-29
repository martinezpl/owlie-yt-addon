import App from "./App.svelte";
import "./global.css";

const app = new App({
  // target content as it always exists on the youtube ui
  target: document.getElementById("content"),
});

export default app;

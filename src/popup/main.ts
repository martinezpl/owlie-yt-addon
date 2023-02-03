import Popup from "./Popup.svelte";
import "../global.css";

const popup = new Popup({
  // target content as it always exists on the youtube ui
  target: document.getElementById("content"),
});

export default popup;

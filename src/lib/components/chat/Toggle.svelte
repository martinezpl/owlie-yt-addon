<script lang="ts">
  import { isChatVisible } from "../../stores/chatStore";
  import { owlyCurrentState } from "../../stores/toggleStore";

  const imgSrcBase = "icons/icon-1-";

  const polifillImg = (img: string) => {
    // At build time this will be replaced by chrome.runtime.getURL(imgSrcBase + img)
    // nasty hack
    return (
      "__REPLACE_WITH_CHROME__" + imgSrcBase + img + "__CLOSING_PARENTESIS__"
    );
  };

  const owlyStateImgs = {
    error: polifillImg("error.png"),
    ready: polifillImg("ready.png"),
    steady: polifillImg("steady.png"),
    loading: polifillImg("loading.gif"),
  };
</script>

<button on:click={() => ($isChatVisible = !$isChatVisible)}>
  <img
    src={owlyStateImgs[$owlyCurrentState]}
    alt={owlyStateImgs[$owlyCurrentState]}
  />
</button>

<style>
  img {
    position: fixed;
    right: 0.5%;
    bottom: 1%;
    border-radius: 50%;
    background-color: rgb(var(--background), 0.5);
    width: 50px;
    height: 50px;
    padding: 5px;
    z-index: 2302;
    cursor: pointer;
    box-shadow: 0 2px 14px -10px rgba(0, 0, 0, 0.5);
    object-fit: scale-down;
  }
</style>

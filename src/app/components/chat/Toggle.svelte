<script lang="ts">
  import { isChatVisible } from "../../stores/chatStore";
  import { owlyCurrentState, isToggleVisible } from "../../stores/toggleStore";
  import browser from "webextension-polyfill";

  const imgSrcBase = "icons/icon-1-";

  const owlyStateImgs = {
    error: browser.runtime.getURL(imgSrcBase + "error.png"),
    ready: browser.runtime.getURL(imgSrcBase + "ready.png"),
    steady: browser.runtime.getURL(imgSrcBase + "steady.png"),
    loading: browser.runtime.getURL(imgSrcBase + "loading.gif"),
  };

  const observer = new MutationObserver(() => {
    if (document.fullscreenElement) {
      $isChatVisible = false;
      $isToggleVisible = false;
    } else {
      $isToggleVisible = true;
    }
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });
</script>

{#if $isToggleVisible}
  <button on:click={() => ($isChatVisible = !$isChatVisible)}>
    <img
      src={owlyStateImgs[$owlyCurrentState]}
      alt={owlyStateImgs[$owlyCurrentState]}
    />
  </button>
{/if}

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
    object-fit: contain;
  }
</style>

<script lang="ts">
  import { isChatVisible } from "../../stores/chatStore";
  import { owlyCurrentState } from "../../stores/toggleStore";

  const imgSrcBase = "icons/icon-1-";

  const owlyStateImgs = {
    error: imgSrcBase + "error.png",
    ready: imgSrcBase + "ready.png",
    steady: imgSrcBase + "steady.png",
    loading: imgSrcBase + "loading.gif",
  };
</script>

<button on:click={() => ($isChatVisible = !$isChatVisible)}>
  <img src={owlyStateImgs[$owlyCurrentState]} alt="owly img" />
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

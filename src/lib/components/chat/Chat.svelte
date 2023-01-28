<script lang="ts">
  import { fly } from "svelte/transition";
  import { backIn, backOut } from "svelte/easing";

  import Input from "./Input.svelte";
  import Messages from "./Messages.svelte";
  import Toggle from "./Toggle.svelte";

  import { isChatVisible } from "../../stores/chatStore";
</script>

<Toggle />

{#if $isChatVisible}
  <div
    class="chat-container"
    in:fly={{ x: 200, duration: 400, easing: backOut }}
    out:fly={{ x: 200, duration: 400, easing: backIn }}
  >
    <Messages />
    <Input />
  </div>
{/if}

<style>
  .chat-container {
    position: fixed;
    width: 20%;
    min-width: 300px;
    max-width: 100%;
    height: 45%;
    right: 4%;
    bottom: 1%;
    z-index: 2301;
    background-color: rgb(var(--background), 0.7);
    color: rgb(var(--body));
    border: none;
    border-radius: 1em 1em 1em 1em;
    resize: none;
  }
</style>

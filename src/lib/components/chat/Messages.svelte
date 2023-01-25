<script lang="ts">
  import { fly } from "svelte/transition";
  import { backIn, backOut } from "svelte/easing";

  import { conversationHistory } from "../../stores/chatStore";
</script>

<div
  class="container"
  in:fly={{ x: 200, duration: 400, easing: backOut }}
  out:fly={{ x: 200, duration: 400, easing: backIn }}
>
  {#each $conversationHistory as { text, type, speaker }}
    {#if type === "text"}
      <div class="msg {speaker}">{text}</div>
    {:else if type === "transcript"}
      <!-- TODO: parse message, create Transcription component -->
      <div class="msg {speaker}">{text}</div>
    {/if}
  {/each}
</div>

<style>
  .container {
    position: fixed;
    width: 20%;
    height: 45%;
    right: 4%;
    bottom: 1%;
    z-index: 2301;
    background-color: rgb(var(--background), 0.7);
    color: rgb(var(--body));
    border: none;
    border-radius: 1em;
    border-bottom-right-radius: 2.4em;
    padding-bottom: 1em;
    resize: none;
  }

  .msg {
    color: whitesmoke;
    padding: 5px;
    margin: 5%;
  }

  .msg.user {
    background-color: rgba(119, 122, 193, 0.8);
    margin-left: 10%;
  }

  .msg.backend {
    background-color: rgba(54, 60, 248, 0.8);
    margin-right: 10%;
  }
</style>

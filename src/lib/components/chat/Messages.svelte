<script lang="ts">
  import { afterUpdate } from "svelte";

  import Transcript from "./Transcript.svelte";

  import { conversationHistory } from "../../stores/chatStore";

  let msgsContainer: HTMLDivElement;

  afterUpdate(() => {
    // Will scroll chat after a new message is added
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  });
</script>

<div class="msgs-container" bind:this={msgsContainer}>
  {#each $conversationHistory as msg}
    <div class="msg {msg.speaker}">
      {#if msg.type === "text"}
        {msg.text}
      {:else if msg.type === "html"}
        {@html msg.text}
      {:else if msg.type === "transcript"}
        <Transcript transcript={msg.transcript} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .msgs-container {
    width: 100%;
    height: 80%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    background-color: rgb(var(--background), 0.2);
    color: rgb(var(--body));
    font-size: 125%;
    margin-top: 2%;
    resize: none;
  }

  .msg {
    color: whitesmoke;
    padding: 0.3em 0.8em;
    margin: 5%;
  }

  .msg.user {
    background-color: rgba(119, 122, 193, 0.8);
    margin-left: 10%;
    border-radius: 1em 1em 0 1em;
  }

  .msg.backend {
    background-color: rgba(54, 60, 248, 0.8);
    margin-right: 10%;
    border-radius: 1em 1em 1em 0;
  }
</style>

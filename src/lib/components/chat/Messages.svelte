<script lang="ts">
  import { afterUpdate } from "svelte";
  import { conversationHistory } from "../../stores/chatStore";

  let msgsContainer: HTMLDivElement;

  afterUpdate(() => {
    // Will scroll chat after a new message is added
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  });
</script>

<div class="msgs-container" bind:this={msgsContainer}>
  {#each $conversationHistory as { text, type, speaker }}
    <div class="msg {speaker}">
      {#if type === "text"}
        {text}
      {:else if type === "html"}
        {@html text}
      {:else if type === "transcript"}
        <!-- 
        TODO: parse message, create Transcription component. 
        May need some backend refactor 
        -->
        {text}
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

<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import * as DOMPurify from "dompurify";

  import Transcript from "./Transcript.svelte";

  import { conversationHistory } from "../../stores/chatStore";

  let msgsContainer: HTMLDivElement;

  onMount(() => {
    /* Add a small timeut so everytime we load the component, the content is scrolled 
    down to the bottom before seing the smooth scrolling */
    setTimeout(() => (msgsContainer.style.scrollBehavior = "smooth"), 50);
  });

  afterUpdate(() => {
    // Will scroll chat after a new message is added
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  });
</script>

<div class="msgs-container" bind:this={msgsContainer}>
  {#each $conversationHistory as msg}
    <div class="msg {msg.speaker} {msg.type}">
      {#if msg.type === "text" || msg.type === "error"}
        {DOMPurify.sanitize(
          msg.text.replace(/&amp;#39;/g, "'").replace(/&amp;quot;/g, '"')
        )}
      {:else if msg.type === "html"}
        {@html DOMPurify.sanitize(
          msg.text.replace(/&amp;#39;/g, "'").replace(/&amp;quot;/g, '"')
        )}
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
    scroll-behavior: auto;
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

  .msg.backend {
    background-color: rgba(54, 60, 248, 0.8);
    margin-left: 10%;
    border-radius: 1em 1em 0 1em;
  }

  .msg.user {
    background-color: rgba(119, 122, 193, 0.8);
    margin-right: 10%;
    border-radius: 1em 1em 1em 0;
  }

  .msg.backend.error {
    background-color: rgba(202, 71, 71, 0.8);
  }
</style>

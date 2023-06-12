<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  import Transcript from "./Transcript.svelte";

  import { conversationHistory } from "../../stores/chatStore";

  let msgsContainer: HTMLDivElement;
  let autoscrollEnabled = true;

  onMount(() => {
    setTimeout(() => {
      msgsContainer.addEventListener("scroll", handleScroll);
    }, 1000);
  });

  function handleScroll() {
    if (
      msgsContainer.scrollTop + msgsContainer.clientHeight + 10 >=
      msgsContainer.scrollHeight
    ) {
      // User scrolled to the bottom
      autoscrollEnabled = true;
    } else {
      // User scrolled up
      autoscrollEnabled = false;
    }
  }

  afterUpdate(() => {
    const lastMsg = $conversationHistory[$conversationHistory.length - 1];

    if (autoscrollEnabled || (lastMsg && lastMsg.speaker === "user")) {
      if (lastMsg && lastMsg.type === "transcript") {
        msgsContainer.scrollTop += 150;
      } else {
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
      }
    }
  });
</script>

<div class="msgs-container" bind:this={msgsContainer}>
  {#each $conversationHistory as msg}
    <div class="msg {msg.speaker} {msg.type}">
      {#if msg.type === "text" || msg.type === "error"}
        {msg.text
          .replace(/<.+?>/g, " ")
          .replace(/&amp;#39;/g, "'")
          .replace(/\/\/n/g, "'")
          .replace(/&amp;quot;/g, '"')
          .replace(/&amp;gt;/g, ">")
          .replace(/&amp;lt;/g, "<")
          .replace(/\n/g, "\r\n")
          .replace(/  /g, " ")
          .replace(/&amp;nbsp/g, " ")
          .replace(/&amp;amp;/g, "&")}
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
    white-space: pre-line;
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

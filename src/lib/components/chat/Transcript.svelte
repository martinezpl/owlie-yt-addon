<script lang="ts">
  import type { TranscriptNode } from "../../types/chat";

  import { updateVideoTime } from "../../utils/updateVideoTime";

  export let transcript: Array<TranscriptNode>;
</script>

{#each transcript as { text, dataStart }}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span on:click={() => updateVideoTime(dataStart)}>
    {text}
  </span>
{/each}

<style>
  span:hover,
  span:focus {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

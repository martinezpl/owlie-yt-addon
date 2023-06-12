<script lang="ts">
  import type { TranscriptNode } from "../../types/chatTypes";

  import { updateVideoTime } from "../../utils/updateVideoTime";

  export let transcript: Array<TranscriptNode>;
</script>

{#each transcript as { text, dataStart }, i}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span on:click={() => updateVideoTime(dataStart)}>
    {text
      .replace(/<.+?>/g, " ")
      .replace(/&amp;#39;/g, "'")
      .replace(/\/\/n/g, "'")
      .replace(/&amp;quot;/g, '"')
      .replace(/  /g, " ")
      .replace(/&amp;gt/g, ">")
      .replace(/&amp;lt/g, "<")
      .replace(/&amp;nbsp/g, " ")
      .replace(/&amp;amp;/g, "&")}
  </span>
  {#if i % 40 === 0}
    <br /><br />
  {/if}
{/each}

<style>
  span:hover,
  span:focus {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

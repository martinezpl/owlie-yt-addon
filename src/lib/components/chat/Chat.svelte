<script lang="ts">
  import Messages from "./Messages.svelte";
  import Toggle from "./Toggle.svelte";

  import { isChatVisible } from "../../stores/chatStore";
</script>

<Toggle />

{#if $isChatVisible}
  <Messages />
{/if}

<script lang="ts">
  import Chat from "./lib/components/chat/Chat.svelte";
  import GlobalStyles from "./lib/GlobalStyles.svelte";

  import { isChatVisible } from "./lib/stores/chatStore";
</script>

<GlobalStyles />

<main>
  <div>{$isChatVisible ? "true" : "false"}</div>
  <button on:click={() => ($isChatVisible = !$isChatVisible)}>toggle</button>
  <Chat />
</main>

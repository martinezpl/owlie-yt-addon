<script lang="ts">
  import { isChatVisible } from "../../stores/chatStore";
</script>

<button on:click={() => ($isChatVisible = !$isChatVisible)}>
  {#if $isChatVisible}
    visible
  {:else}
    invisible
  {/if}
</button>

<style>
  button {
    position: fixed;
    right: 0.5%;
    bottom: 1%;
    border-radius: 50%;
    background-color: rgb(var(--background), 0.5);
    width: 50px;
    height: 50px;
    padding: 5px;
    object-fit: scale-down;
    z-index: 2302;
    cursor: pointer;
    box-shadow: 0 2px 14px -10px rgba(0, 0, 0, 0.5);
    border: none;
  }
</style>

<script lang="ts">
  import { userInput } from "../../stores/chatStore";
  import { owlyCurrentState } from "../../stores/toggleStore";

  import { askQuestion } from "../../utils/api";

  const placeholder =
    "Ask a question within video's context or write /help to see available commands";

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      // send to the server
      $owlyCurrentState = "loading";
      void askQuestion($userInput)
        .then(() => ($owlyCurrentState = "ready"))
        .catch(() => ($owlyCurrentState = "error"));
      $userInput = "";
    }
  };

  $: $userInput === "\n" && ($userInput = "");
</script>

<textarea {placeholder} bind:value={$userInput} on:keypress={handleKeypress} />

<style>
  textarea {
    position: absolute;
    bottom: 1%;
    margin-left: 5%;
    width: 85%;
    height: 50px;
    resize: none;
  }
</style>

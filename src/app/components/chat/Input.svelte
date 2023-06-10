<script lang="ts">
  import { userInput, traverseInputHistory } from "../../stores/chatStore";
  import { owlieCurrentState, setOwlieState } from "../../stores/toggleStore";

  import { sendToServer } from "../../utils/api";

  const placeholder =
    "Ask a question within video's context or write /help to see available commands";

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter" && $userInput !== "") {
      if ($owlieCurrentState === "loading") {
        return;
      }
      setOwlieState("loading");
      void sendToServer($userInput);
      $userInput = "";
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code === "ArrowUp") {
      $userInput = traverseInputHistory("previous");
    } else if (e.code === "ArrowDown") {
      $userInput = traverseInputHistory("next");
    }
  };

  $: $userInput === "\n" && ($userInput = "");
</script>

<textarea
  {placeholder}
  bind:value={$userInput}
  on:keypress={handleKeypress}
  on:keydown={handleKeydown}
/>

<style>
  textarea {
    font-size: small;
    background-color: white;
    border-radius: 5px;
    border: none;
    margin-left: 5%;
    height: 15%;
    width: 89%;
    resize: none;
  }
</style>

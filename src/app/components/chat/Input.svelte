<script lang="ts">
  import { userInput, traverseInputHistory } from "../../stores/chatStore";
  import { owlyCurrentState } from "../../stores/toggleStore";
  import { initSocket } from "../../stores/socketStore";

  import { sendToServer } from "../../utils/api";

  const placeholder =
    "Ask a question within video's context or write /help to see available commands";

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      // send to the server
      $owlyCurrentState = "loading";
      initSocket().then(
        void sendToServer($userInput)
          .then(() => ($owlyCurrentState = "ready"))
          .catch((err) => {
            console.log(err);
            $owlyCurrentState = "error";
          })
      );
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

<script lang="ts">
  import { onMount } from "svelte";

  import { getFromStorage, setToStorage } from "../shared/storage";
  import { callAPI } from "../shared/api";

  let id = "";
  let isLocked = true;
  let isLoading = false;

  const regenerateCode = async () => {
    isLoading = true;
    let response = await callAPI("/regenerate", id);
    let body = await response.json();
    if (body.code) {
      setToStorage({ "owlie-id": body.code });
      id = body.code;
    }
    isLoading = false;
  };

  const loadId = async () => {
    id = await getFromStorage("owlie-id");
  };

  const toggleLock = () => {
    if (!isLocked) {
      setToStorage({ "owlie-id": id });
    }
    isLocked = !isLocked;
  };

  onMount(() => {
    loadId();
  });
</script>

<main>
  <link
    href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
    rel="stylesheet"
  />

  <div class="body">
    <button on:click={toggleLock}>
      <img
        alt="lock"
        class="lock-icon"
        src={isLocked ? "icons/locked.png" : "icons/unlocked.png"}
      />
    </button>
    <b>Your code</b>
    <input type="text" bind:value={id} readonly={isLocked} />
    <small>
      <button class="regen" on:click={regenerateCode}>Regenerate code</button>
    </small>
    <img
      class="itsy-bitsy-spinner"
      src="icons/loading.gif"
      alt=""
      hidden={!isLoading}
      height="10px"
    />
    <br />
    <br />
    <p>
      In order to receive question allowance, paste your code into the donation
      message. <br />This way you're contributing to running expenses so the
      received allowance will be proportional to the donation.<br />
      In such case make sure the donation is set as <b>private</b> =)
    </p>
    <a href="https://ko-fi.com/N4N4I82JJ" target="_blank" rel="noreferrer"
      ><img
        class="support-button"
        src="icons/owlie-support.png"
        alt="Support Owlie"
      /></a
    >
  </div>
</main>

<style>
  .body {
    width: 390px;
    margin: 0px;
    padding: 4px;
    border: 2px;
    border-color: rgb(0, 0, 0);
    background-color: rgb(249, 249, 249);
    font-family: "Lato";
    font-size: 0.8em;
  }

  #kofiframe {
    border: none;
    width: 100%;
    padding: 4px;
    background: #f9f9f9;
  }

  .support-button {
    border: 0px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
  }

  .lock-icon {
    cursor: pointer;
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  button {
    all: unset;
    color: rgb(0, 0, 0);
    cursor: pointer;
  }

  .regen {
    color: rgb(167, 165, 165);
    position: absolute;
    top: 52px;
    right: 15px;
  }

  .regen:hover {
    text-decoration: underline;
  }

  input[type="text"] {
    font-size: 1em;
    width: 380px;
  }
</style>

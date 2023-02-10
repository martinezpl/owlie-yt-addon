<script lang="ts">
  import { onMount } from "svelte";

  import { getFromStorage, setToStorage } from "../shared/storage";
  import { callAPI } from "../shared/api";

  let id = null;
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
      alt="lock"
      class="lock-icon"
      on:click={toggleLock}
      src={isLocked ? "icons/locked.png" : "icons/unlocked.png"}
    />
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
      In order to receive gifts, paste your code into the donation message.<br
      />
      Make sure it's set as <b>private</b> =)
    </p>
    <iframe
      id="kofiframe"
      src="https://ko-fi.com/owliext/?hidefeed=true&widget=true&embed=true&preview=true"
      height="400"
      title="owliext"
    />
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

  .lock-icon {
    cursor: pointer;
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  .regen {
    all: unset;
    color: rgb(0, 0, 0);
  }

  .regen:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  input[type="text"] {
    font-size: 1em;
    width: 380px;
  }
</style>

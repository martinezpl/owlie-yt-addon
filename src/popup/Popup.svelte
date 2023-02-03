<script lang="ts">
    import {getId, setId} from "../app/stores/idStore"
    let id = null;
    let isLocked = true;
  
    function regenerateCode() {
      fetch("http://localhost/")
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error("Error regenerating code:", error);
        });
      }
  
    async function loadId() {
      id = await getId()
    }
    
    function toggleLock() {
      if (!isLocked) {
        setId(id)
      }
      isLocked = !isLocked
    }
    loadId();
  </script>
  
  <main>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
      .body {
        width: 390px;
        margin: 0px;
        padding: 4px;
        border: 2px;
        border-color: rgb(0,0,0);
        background-color: rgb(249, 249, 249);
        font-family: 'Lato';
        font-size: 0.8em;
      }
  
      .lock-icon {
        cursor: pointer;
        display: inline-block;
        width: 1em;
        height: 1em;
      }
  
      .regen {
        color: rgb(0, 0, 0);
      }
  
      input[type="text"] {
        font-size: 1em;
        width: 380px;
      }
    </style>
    <div class="body">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <img alt="lock" class="lock-icon" on:click={toggleLock} src={isLocked ? "icons/locked.png" : "icons/unlocked.png"} />
      <b>Your code</b>
      <input type="text" bind:value={id} readonly={isLocked} />
      <small>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class='regen' href="#" on:click={regenerateCode}>Regenerate code</a>
      </small>
      <br />
      <br />
      <p>You can copy paste your code into the donation message.<br/> Make sure it's set as <b>private</b> =)</p>
      <iframe id='kofiframe' src='https://ko-fi.com/owliext/?hidefeed=true&widget=true&embed=true&preview=true' style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='400' title='owliext'></iframe>
    </div>
  </main>

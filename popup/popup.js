const apiKeyField = document.getElementById('openAiApiKey');

// apiKey show/hide button
document.getElementById('showKey').onclick = function () {
  if (apiKeyField.type === 'password') {
    apiKeyField.type = 'text';
    document.getElementById('showKey').text = '🔓';
  } else {
    apiKeyField.type = 'password';
    document.getElementById('showKey').text = '🔒';
  }
};

// update slider's value displays on slider change
sliders = document.getElementsByClassName('shortSlider');
for (let i = 0; i < sliders.length; i++) {
  sliders[i].addEventListener('input', function () {
    document.getElementById(`${sliders[i].id}DisplayedValue`).innerText =
      sliders[i].value;
  });
}

// Load saved settings
browser.storage.local.get('gpt3-settings').then((obj) => {
  for (const [key, value] of Object.entries(obj['gpt3-settings'])) {
    document.getElementById(key).value = value;
    console.log(key, value);
    if (key == 'model') {
      let options = document.getElementById(key).children;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          options[i].selected = true;
        }
      }
    } else if (key.includes('Prompt')) {
      continue;
    } else {
      document.getElementById(`${key}DisplayedValue`).innerText = value;
    }
  }
});
browser.storage.local.get('openAiApiKey').then((obj) => {
  console.log(obj);
  apiKeyField.value = obj.openAiApiKey;
  apiKeyField.type = 'password';
  document.getElementById('showKey').text = '🔒';
});

// Save settings on closing the popup
window.addEventListener('unload', function () {
  let settingObj = {};
  let settings = document.getElementsByClassName('setting');
  for (let i = 0; i < settings.length; i++) {
    let inputField = settings[i].firstElementChild;
    settingObj[inputField.id] = inputField.value;
  }
  browser.storage.local.set({
    'gpt3-settings': settingObj,
    openAiApiKey: apiKeyField.value,
  });
});

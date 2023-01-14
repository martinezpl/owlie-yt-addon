// Load saved settings
browser.storage.local.get('gpt3-settings').then((obj) => {
  Logger.debug('loaded settings', obj);
  if (!obj['gpt3-settings']) {
    return;
  }
  for (const [key, value] of Object.entries(obj['gpt3-settings'])) {
    Logger.log(key, value);
    document.getElementById(key).value = value;
    if (key.includes('model')) {
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
  Logger.debug('key', obj);
  if (!obj.openAiApiKey) {
    return;
  }
  apiKeyField.value = obj.openAiApiKey;
  apiKeyField.type = 'password';
  document.getElementById('showKey').text = '🔒';
});

// Save settings on closing the popup
window.addEventListener('unload', function () {
  Logger.debug('popup unload!');
  let settingsObj = {};
  let settings = document.getElementsByClassName('setting');
  Logger.log('setting elements', settings);
  for (let i = 0; i < settings.length; i++) {
    let inputField = settings[i].firstElementChild;
    settingsObj[inputField.id] = inputField.value;
  }
  Logger.log('settings to save:', settingsObj);
  browser.storage.local.set({
    'gpt3-settings': settingsObj,
    openAiApiKey: apiKeyField.value,
  });
  Logger.debug('Settings saved!');
});

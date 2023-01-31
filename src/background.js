import browser from 'webextension-polyfill';

async function installHook(info) {
  console.log(info);
  let response = await fetch(
    'https://g9163tkhmf.execute-api.eu-west-1.amazonaws.com/production/generate',
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
    }
  );
  let json = await response.json();

  await browser.storage.local.set({ 'owlie-id': json.code });
  await browser.storage.sync.set({ 'owlie-id': json.code });

  browser.runtime.setUninstallURL(
    // OPENS IN NEW TAB ...
    'https://g9163tkhmf.execute-api.eu-west-1.amazonaws.com/production/out?code=' +
      json.code
  );
}

browser.management.onInstalled.addListener(installHook);

//browser.management.onUninstalled.addListener(uninstallHook); NOT WORKING 4 SUM RIZON

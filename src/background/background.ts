import browser from 'webextension-polyfill';
import { callAPI } from '../shared/api';

async function installHook(info: any) {
  console.log(info);
  let response = await callAPI('/generate');
  let json = await response.json();

  await browser.storage.local.set({ 'owlie-id': json.code });
  await browser.storage.sync.set({ 'owlie-id': json.code });
  console.log(json);
  browser.runtime.setUninstallURL(
    // OPENS IN NEW TAB ...
    '__API_BASE__' + '/out?code=' + json.code
  );
}

browser.runtime.onInstalled.addListener(installHook);

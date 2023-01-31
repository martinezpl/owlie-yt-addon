import browser from "webextension-polyfill";

export const owlieId: Promise<Record<string, any>> = (browser.storage.local.get("owlie-id") || browser.storage.sync.get("owlie-id"));
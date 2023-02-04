import browser from "webextension-polyfill";

export async function getFromStorage(key: string): Promise<string> {
    return (await (browser.storage.local.get(key) || browser.storage.sync.get(key)))[key]
}

export async function setToStorage(items: Record<string, any>): Promise<void> {
    browser.storage.local.set(items);
    browser.storage.sync.set(items);
}
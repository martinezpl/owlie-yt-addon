import browser from "webextension-polyfill";

export async function getFromStorage(key: string): Promise<string> {
    return (await (browser.storage.local.get(key) || browser.storage.sync.get(key)))[key]
}

export async function setToStorage(records: Record<string, any>[]): Promise<void> {
    for (let record of records) {
        browser.storage.local.set(record);
        browser.storage.sync.set(record);
    }
}
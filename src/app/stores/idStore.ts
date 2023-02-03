import browser from "webextension-polyfill";

export async function getId(): Promise<string> {
    return (await (browser.storage.local.get("owlie-id") || browser.storage.sync.get("owlie-id")))["owlie-id"]
}

export async function setId(id: string): Promise<void> {
    browser.storage.local.set({"owlie-id": id});
    browser.storage.sync.set({"owlie-id": id});
}
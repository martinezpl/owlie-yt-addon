# ![icon-1](https://user-images.githubusercontent.com/64603095/206002183-b4b6a676-9fe2-4bf0-8d43-fe23082b2d63.png) Owlie - smart Youtube assistant


Owlie is a browser extension that generates video summaries and descriptive works in general, e.g. comments, counter-arguments, poetry etc.

## Local installation

1. Clone this repository.
2. run `./build.sh BROWSER MANIFEST_VERSION` 

If we do not have the specific manifest, feel free to create it and send a PR.

### Firefox

1. Go to this address: `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on...`
3. Select `manifest.json` in the `dist/v2/firefox` directory

### Chrome

1. Go to this address: `chrome://extensions/`
2. Drag `dist/v3/chrome` directory into Chrome's window

## How to use

When visiting a Youtube's page you'll see Owlie's icon in the bottom right corner of the page. Click it to open the chat. Write `/help` to see available commands or simply ask a question about the video or tell it to do something fun.

Keep in mind that the answers accord to the video's content.


## Local development

1. npm install --global web-ext
2. copy your desired manifest from the `manifest` directory into `app`. Example: `cp manifest/v2/firefox.json app/manifest.json`
3. cd `app`
4. web-ext run --target chromium / firefox-desktop

This will open a browser window with the plugin loaded and any changes will be dynamically reloaded.

## Known issues, things to improve

### GPT3's context limit of 4097 tokens

This limit makes it impossible to summarize videos that contain more than ~3000 words (from my observations, videos longer than ~15-20 minutes).

A workaround I have in mind is splitting the transcript, generating multiple summaries from the splits and then summarising the summaries at the end.

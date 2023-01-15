# ![icon-1](https://user-images.githubusercontent.com/64603095/206002183-b4b6a676-9fe2-4bf0-8d43-fe23082b2d63.png) Owlie - smart Youtube assistant


Owlie is a browser extension that generates video summaries and descriptive works in general, e.g. comments, counter-arguments, poetry etc.

## Local installation

Clone this repository.

### Firefox

1. Go to this address: `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on...`
3. Select `manifest.json` in the `firefox` directory

### Chrome

1. Go to this address: `chrome://extensions/`
2. Drag `chromium` directory into Chrome's window

## How to use

When visiting a Youtube's page you'll see Owlie's icon in the bottom right corner of the page. Clicking the icon will trigger summarization. Once ready, a chat will appear, where you can ask further questions about the content of the video. 

Keep in mind that the answers accord to the video's content.

https://user-images.githubusercontent.com/64603095/212501604-ba455897-977a-40f3-9b55-e46f355bcad0.mp4


## Local development

1. npm install --global web-ext
2. cd firefox / cd chromium
3. web-ext run --target chromium / firefox-desktop

This will open a browser window with the plugin loaded and any changes will be dynamically reloaded.

## Known issues, things to improve

### GPT3's context limit of 4097 tokens

This limit makes it impossible to summarize videos that contain more than ~3000 words (from my observations, videos longer than ~15-20 minutes).

A workaround I have in mind is splitting the transcript, generating multiple summaries from the splits and then summarising the summaries at the end.

### Multilingual support

Currently Owlie fetches only English subtitles. It could look for other available subtitles.

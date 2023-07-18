# ![icon-1](https://user-images.githubusercontent.com/64603095/216782866-7c19a5bc-ade7-41ee-ab51-f8399684c8b9.png) Owlie - smart Youtube assistant


Owlie is an AI-powered browser extension that serves as a knowledge extraction tool for Youtube videos. It allows the user to interact with the content of videos through following features:
- asking questions / giving instructions in relation to the video
- summarizing videos
- extracting transcript, where clicking a sentence jumps to the timestamp it's spoken
- finding keywords / phrases within video's content

[Chrome Installation
](https://chrome.google.com/webstore/detail/owlie-youtube-assistant/bfgonahdcbgiamjgenobcjbngblgidjg)

[Firefox Installation](https://addons.mozilla.org/es/firefox/addon/owlie-youtube-assistant/)

## Local installation

1. Clone this repository.
2. `cd owlie-yt-addon`
3. install dependencies `npm i`
4. Export following env variables:

```
export VITE_OWLIE_API_BASE="https://owlie.essa.lol"
export VITE_OWLIE_SOCKET_ADDRESS='"wss://qdfxsg29c0.execute-api.eu-west-1.amazonaws.com/production"'
```

5. build the extension `npm run build:all`. The `dist` directory will contain the extension's bundle.
6. Copy manifest to the `dist` directory. v3 for chrome-based browsers, v2 for everything else (e.g. firefox)
7. Load up the extension in the browser.

### Firefox

1. Go to this address: `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on...`
3. Select `manifest.json` in the `dist` directory

### Chrome

1. Go to this address: `chrome://extensions/`
2. Drag `dist/` directory into Chrome's window

## How to use

https://www.youtube.com/watch?v=q16GOxwqvVY

When visiting a Youtube's page you'll see Owlie's icon in the bottom right corner of the page. Click it to open the chat. Write `/help` to see available commands or simply ask a question about the video or tell it to do something fun.

Keep in mind that the answers accord to the video's content.

## Local development

1. npm install --global web-ext
2. copy your desired manifest from the `manifest` directory into `dist`. Example: `cp manifest/v2/manifest.json dist/`
3. `npm run dev`. 

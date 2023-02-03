# ![icon-1](https://user-images.githubusercontent.com/64603095/206002183-b4b6a676-9fe2-4bf0-8d43-fe23082b2d63.png) Owlie - smart Youtube assistant


Owlie is a browser extension that generates video summaries and descriptive works in general, e.g. comments, counter-arguments, poetry etc.

## Local installation

1. Clone this repository.
2. `cd owlie-yt-addon`
3. install dependencies `pnpm install`
4. build the extension `pnpm build:all`. The `dist` directory will contain the extension's bundle.
5. Add your desired manifest to the `dist` directory. For example `cp manifest/v2/manifest.json dist/manifest.json`


### Firefox

1. Go to this address: `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on...`
3. Select `manifest.json` in the `dist` directory

### Chrome

1. Go to this address: `chrome://extensions/`
2. Drag `dist/` directory into Chrome's window

## How to use

When visiting a Youtube's page you'll see Owlie's icon in the bottom right corner of the page. Click it to open the chat. Write `/help` to see available commands or simply ask a question about the video or tell it to do something fun.

Keep in mind that the answers accord to the video's content.


https://user-images.githubusercontent.com/64603095/213948302-bef8d776-051c-4879-9dc3-dd989e8c11eb.mov


## Local development

1. npm install --global web-ext
2. copy your desired manifest from the `manifest` directory into `dist`. Example: `cp manifest/v2/manifest.json dist/`
3. `pnpm run dev`. 

## Known issues, things to improve

### GPT3's context limit of 4097 tokens

This limit makes it impossible to summarize videos that contain more than ~3000 words (from my observations, videos longer than ~15-20 minutes).

A workaround I have in mind is splitting the transcript, generating multiple summaries from the splits and then summarising the summaries at the end.

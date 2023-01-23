//** Fetches HTML from Youtube video's URL and parses out available transcripts. */
export async function getAvailableTranscripts(url) {
  let html = await (await fetch(url)).text();
  const splitHtml = html.split('"captions":');
  if (splitHtml.length <= 1) {
    if (html.includes('class="g-recaptcha"')) {
      throw Error('Too many requests!');
    } else if (!html.includes('"playabilityStatus":')) {
      throw Error('Video unavailable!');
    }
    throw Error('Transcription unavailable!');
  }

  const captionsJson = JSON.parse(
    splitHtml[1].split(',"videoDetails')[0].replace('\n', '')
  ).playerCaptionsTracklistRenderer;

  if (!captionsJson) {
    throw Error('Transcription disabled!');
  }
  if (!captionsJson.captionTracks) {
    throw Error('Transcription unavailable!');
  }

  return captionsJson;
}

//** Selects main transcript (prioritizing manually written over automatic), GETs transcript's XML, returns parsed text */
export async function fetchTranscript(captionsJson, languageCode = null) {
  let captions = captionsJson.captionTracks;
  let manualCaptions = [];
  let autoCaptions = [];
  let englishCaption = null;

  for (let i = 0; i < captions.length; i++) {
    if (captions[i].kind != 'asr') {
      manualCaptions.push(captions[i]);
    } else {
      autoCaptions.push(captions[i]);
    }
  }

  for (let i = 0; i < manualCaptions.length; i++) {
    if (manualCaptions[i].languageCode.startsWith(languageCode)) {
      return await (await fetch(manualCaptions[i].baseUrl)).text();
    }
    if (manualCaptions[i].languageCode.startsWith('en')) {
      englishCaption = manualCaptions[i];
    }
  }
  if (englishCaption) {
    return await (await fetch(englishCaption.baseUrl)).text();
  }
  if (manualCaptions.length) {
    return await (await fetch(manualCaptions[0].baseUrl)).text();
  }
  for (let i = 0; i < autoCaptions.length; i++) {
    if (autoCaptions[i].languageCode.startsWith(languageCode)) {
      return await (await fetch(autoCaptions[i].baseUrl)).text();
    }
    if (autoCaptions[i].languageCode.startsWith('en')) {
      englishCaption = autoCaptions[i];
    }
  }
  if (englishCaption) {
    return await (await fetch(englishCaption.baseUrl)).text();
  }
  return await (await fetch(autoCaptions[0].baseUrl)).text();
}

//** Turn XML subtitles into a long paragraph */
export function xmlToText(xml) {
  return xml
    .replace(/<.+?>/g, ' ')
    .replace(/&amp;#39;/g, "'")
    .replace(/\/\/n/g, "'")
    .replace(/&amp;quot;/g, '"')
    .replace('  ', ' ');
}

//** Turn XML subtitles into a timestamp: paragraph object */
export function xmlToSpanTags(xml) {
  let textTags = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/g);

  let html = '';
  let count = 0;
  textTags.forEach((tag) => {
    let startValue = tag.match(/start="([^"]*)"/)[1];
    let text = tag.match(/>([\s\S]*?)</)[1];
    count += text.split(' ').length;
    html +=
      ' ' +
      `<span class="timestampText" data-start="${startValue}">${text}</span>`;
    if (count > 100) {
      html += '<br><br>';
      count = 0;
    }
  });
  return html;
}

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
export async function fetchEnglishTranscript(captionsJson) {
  let captions = captionsJson.captionTracks;
  let selectedCaption = captions[0];

  for (let i = 0; i < captions.length; i++) {
    if (captions[i].kind != 'asr') {
      // Instantly return transcript that's been written manually
      selectedCaption = captions[i];
      break;
    }
  }

  let xml = await (await fetch(selectedCaption.baseUrl)).text();

  // Turn XML subtitles into a long paragraph
  return xml
    .replace(/<.+?>/g, ' ')
    .replace(/&amp;#39;/g, "'")
    .replace('  ', ' ');
}

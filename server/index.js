import { callGPT3 } from './modules/openai.mjs';
import {
  getAvailableTranscripts,
  fetchTranscript,
  xmlToText,
  constructTranscriptNodes,
} from './modules/transcript.mjs';

import settings from './modules/settings.json' assert { type: 'json' };
import languageCodes from './modules/languageCodes.json' assert { type: 'json' };

const examples = [
  'Write me a poem about it.',
  'Disagree with the speaker.',
  'Resúmelo en español.',
  "Explain it to me like I'm 5 years old.",
  'Turn it into a funny story.',
];

function getHelpMessage() {
  return `Commands:<br>- <b>/s</b> : summarize the video's content<br>- <b>/t</b> : extract transcription; click on a sentence to jump to the moment it's spoken<br>- <b>/lang</b> : see available language codes for the video<br>- <b>/help</b> : see this message<br><br>You can optionally add a language code to target a specific language, e.g. "/t es", "/s pl", etc..<br>If the transcript for the language is not available I will default to English or the only existing transcript.<br><br>You can also simply ask a question or tell me what to do with the video's content. For example: "${
    examples[Math.floor(Math.random() * 5)]
  }"`;
}

const transcriptCache = {};

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  console.log(body);
  let mode = body.settings || 'interactive-default';
  let lang = 'default';
  if (!transcriptCache[body.url]) {
    transcriptCache[body.url] = {};
  }

  if (body.question == '/help') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 'html',
        text: getHelpMessage(),
        speaker: 'backend',
      }),
    };
  }

  if (body.question.startsWith('/')) {
    let split = body.question.split(' ');
    if (split.length > 1 && split[1]) {
      lang = split[1];
    }
    body.question = split[0];
  }

  try {
    let availableTranscript = await getAvailableTranscripts(body.url);
    transcriptCache[body.url][lang] =
      transcriptCache[body.url][lang] ||
      (await fetchTranscript(availableTranscript, lang));

    if (body.question == '/t') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: 'transcript',
          transcript: constructTranscriptNodes(transcriptCache[body.url][lang]),
          speaker: 'backend',
        }),
      };
    } else if (body.question == '/s') {
      mode = 'summary-default';
      body.question = '';
    } else if (body.question == '/lang') {
      let captions = availableTranscript.captionTracks;
      let html = 'Available languages:<br>';
      for (let i = 0; i < captions.length; i++) {
        html += `<b>${captions[i].languageCode.split('-')[0]}</b>: ${
          languageCodes[captions[i].languageCode.split('-')[0]]
        }<br>`;
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 'html', text: html, speaker: 'backend' }),
      };
    } else if (body.question.startsWith('/')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          type: 'html',
          text: "I don't recognize this command.\n" + getHelpMessage(),
          speaker: 'backend',
        }),
      };
    }

    const gptResponse = await callGPT3(
      xmlToText(transcriptCache[body.url][lang]),
      settings[mode],
      body.question || ''
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 'text',
        text: gptResponse,
        speaker: 'backend',
      }),
    };
  } catch (err) {
    let msg = err.message;
    if (err.message.includes('maximum context length')) {
      // there's no separate status code AFAIK
      msg =
        'Sorry, the video has too much content for me to process. However, my creators are working hard to improve this.';
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ type: 'text', text: msg, speaker: 'backend' }),
    };
  }
}

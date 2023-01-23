import { callGPT3 } from './modules/openai.mjs';
import {
  getAvailableTranscripts,
  fetchTranscript,
  xmlToText,
  xmlToSpanTags,
} from './modules/transcript.mjs';

import settings from './modules/settings.json' assert { type: 'json' };
import languageCodes from './modules/languageCodes.json' assert { type: 'json' };

function getHelpMessage() {
  let example = [
    'Write me a poem about it.',
    'Disagree with the speaker.',
    'Resúmelo en español.',
    "Explain it to me like I'm 5 years old.",
    'Turn it into a funny story.',
  ][Math.floor(Math.random() * 5)];
  return `Commands:<br>- <b>/s</b> : summarize the video's content<br>- <b>/t</b> : extract transcription; click on a sentence to jump to the moment it's spoken<br>- <b>/lang</b> : see supported language codes<br>- <b>/help</b> : see this message<br><br>You can optionally add a language code to target a specific language, e.g. "/t es", "/s pl", etc..<br>If the transcript for the language is not available I will default to English or the only existing transcript.<br><br>You can also simply ask a question or tell me what to do with the video's content. For example: "${example}"`;
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
      body: JSON.stringify({ text: getHelpMessage() }),
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
    transcriptCache[body.url][lang] =
      transcriptCache[body.url][lang] ||
      (await fetchTranscript(await getAvailableTranscripts(body.url), lang));

    if (body.question == '/t') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          text: xmlToSpanTags(transcriptCache[body.url][lang]),
        }),
      };
    } else if (body.question == '/s') {
      mode = 'summary-default';
      body.question = '';
    } else if (body.question == '/lang') {
      let html = '';
      for (const [key, value] of Object.entries(languageCodes)) {
        html += `${key}: ${value}<br>`;
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ text: html }),
      };
    } else if (body.question.startsWith('/')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          text: "I don't recognize this command.\n" + getHelpMessage(),
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
      body: JSON.stringify({ text: gptResponse }),
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
      body: JSON.stringify({ text: msg }),
    };
  }
}

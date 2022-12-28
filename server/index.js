import { callGPT3 } from './modules/openai.mjs';
import {
  getAvailableTranscripts,
  fetchEnglishTranscript,
} from './modules/transcript.mjs';

import settings from './modules/settings.json' assert { type: 'json' };

const transcriptCache = {};

export async function handler(event, context) {
  const body = JSON.parse(event.body);

  transcriptCache[body.url] =
    transcriptCache[body.url] ||
    (await fetchEnglishTranscript(await getAvailableTranscripts(body.url)));

  const gptResponse = await callGPT3(
    transcriptCache[body.url],
    settings[body.settings],
    body.question || ''
  );

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ text: gptResponse }),
  };
}

// let e = {
//   body: '{"url": "https://www.youtube.com/watch?v=6Our9gkWG08", "settings": "summary-default"}',
// };
// console.log(await handler(e));

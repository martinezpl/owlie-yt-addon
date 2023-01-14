import { callGPT3 } from './modules/openai.mjs';
import {
  getAvailableTranscripts,
  fetchEnglishTranscript,
} from './modules/transcript.mjs';

import settings from './modules/settings.json' assert { type: 'json' };

const transcriptCache = {};

export async function handler(event, context) {
  const body = JSON.parse(event.body);

  try {
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
      body: JSON.stringify({ text: gptResponse }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ text: err.message }),
    };
  }
}

async function getGPT3Summary(transcript) {
  Logger.debug('getGPT3Summary');
  const apiKey = (await browser.storage.local.get('openAiApiKey')).openAiApiKey;
  const settings = (await browser.storage.local.get('gpt3-settings'))[
    'gpt3-settings'
  ];
  Logger.debug(settings);
  Logger.info(transcript);
  let js = await (
    await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        prompt:
          settings.prePrompt + '\n' + transcript + '\n' + settings.postPrompt,
        max_tokens: parseInt(settings.maxTokens),
        temperature: parseFloat(settings.temperature),
        presence_penalty: parseFloat(settings.presencePenalty),
        frequency_penalty: parseFloat(settings.frequencyPenalty),
      }),
    })
  ).json();
  Logger.info(js);
  if (js.error) {
    throw Error(js.error.message);
  }
  let summary = js.choices[0].text;
  return summary;
}

async function getGPT3Answer(transcript, question) {
  Logger.debug('getGPT3Answer');
  const apiKey = (await browser.storage.local.get('openAiApiKey')).openAiApiKey;
  const settings = (await browser.storage.local.get('gpt3-settings'))[
    'gpt3-settings'
  ];
  Logger.debug(settings);
  Logger.info(transcript);

  let js = await (
    await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        prompt:
          transcript +
          '\n' +
          'Based on the above, answer this question: ' +
          question,
        max_tokens: parseInt(settings.maxTokens),
        temperature: 0.25,
        presence_penalty: -0.5,
        frequency_penalty: 1,
      }),
    })
  ).json();
  Logger.info(js);
  if (js.error) {
    throw Error(js.error.message);
  }
  let answer = js.choices[0].text;
  return answer;
}

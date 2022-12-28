async function callGPT3(transcript, question = '') {
  Logger.debug('GPT3 moshi moshi');
  const apiKey = (await browser.storage.local.get('openAiApiKey')).openAiApiKey;
  const settings = (await browser.storage.local.get('gpt3-settings'))[
    'gpt3-settings'
  ];
  Logger.debug('GPT3 receives settings:', settings);
  Logger.log(transcript);
  let body = {};
  if (question) {
    body = {
      model: settings.Imodel,
      prompt:
        settings.IprePrompt +
        transcript +
        '\n' +
        settings.IpostPrompt +
        ' ' +
        question,
      max_tokens: parseInt(settings.ImaxTokens),
      temperature: parseFloat(settings.Itemperature),
      presence_penalty: parseFloat(settings.IpresencePenalty),
      frequency_penalty: parseFloat(settings.IfrequencyPenalty),
    };
  } else {
    body = {
      model: settings.model,
      prompt:
        settings.prePrompt + '\n' + transcript + '\n' + settings.postPrompt,
      max_tokens: parseInt(settings.maxTokens),
      temperature: parseFloat(settings.temperature),
      presence_penalty: parseFloat(settings.presencePenalty),
      frequency_penalty: parseFloat(settings.frequencyPenalty),
    };
  }
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
      body: JSON.stringify(body),
    })
  ).json();
  Logger.log('GPT3 response:', js);
  if (js.error) {
    throw Error(js.error.message);
  }
  return js.choices[0].text;
}

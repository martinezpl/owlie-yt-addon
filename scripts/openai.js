async function getGPT3Summary(transcript) {
  console.log('getGPT3Summary');
  console.log(transcript);
  const apiKey = (await browser.storage.local.get('openAiApiKey')).openAiApiKey;
  const settings = (await browser.storage.local.get('gpt3-settings'))[
    'gpt3-settings'
  ];
  console.log(settings);
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
          'Prepare a few summary keypoints based on the following excerpt from a video:\n' +
          transcript +
          '\n summary keypoints:',
        max_tokens: parseInt(settings.maxTokens),
        temperature: parseFloat(settings.temperature),
        presence_penalty: parseFloat(settings.presencePenalty),
        frequency_penalty: parseFloat(settings.frequencyPenalty),
      }),
    })
  ).json();
  if (js.error) {
    return 'Error: ' + js.error.message;
  }
  let summary = js.choices[0].text;
  return summary;
}

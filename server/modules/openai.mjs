export async function callGPT3(transcript, settings, question = '') {
  let js = await (
    await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: settings.model,
        prompt:
          settings.prePrompt +
          '\n' +
          transcript +
          '\n' +
          settings.postPrompt +
          ' ' +
          question,
        max_tokens: parseInt(settings.maxTokens),
        temperature: parseFloat(settings.temperature),
        presence_penalty: parseFloat(settings.presencePenalty),
        frequency_penalty: parseFloat(settings.frequencyPenalty),
      }),
    })
  ).json();
  console.log(js);
  if (js.error) {
    throw Error(js.error.message);
  }
  if (js.choices[0].text.startsWith('\n')) {
    js.choices[0].text = js.choices[0].text.substring(1);
  }
  return js.choices[0].text;
}

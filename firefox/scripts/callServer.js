async function callServer(url, settingsMode, question = '') {
  Logger.debug('Server moshi moshi');
  let js = await (
    await fetch(
      'https://qklzaxu7sazzq4xxw7qggrye7y0lxyhs.lambda-url.eu-west-1.on.aws/',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          settings: settingsMode, // hardcode 'test-default' here when testing
          question: question,
        }),
      }
    )
  ).json();
  Logger.log('Server response:', js);
  if (js.error) {
    throw Error(js.error.message);
  }
  return js.text;
}

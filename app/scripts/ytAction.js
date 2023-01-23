try {
  class Chat {
    constructor(parent) {
      this.parent = parent;

      this.div = document.createElement('div');
      this.div.id = 'owlie-chatbox';
      this.div.classList.add('chat-container');

      this.messageSection = document.createElement('div');
      this.messageSection.id = 'owlie-chatbox-msg-space';
      this.messageSection.classList.add('msg-space');
      this.div.appendChild(this.messageSection);

      this.div.classList.add('hidden');
      this.isToggled = false;

      this.questionField = document.createElement('textarea');
      this.questionField.classList.add('input-field');
      this.questionField.placeholder =
        "Ask a question within video's context or write /help to see available commands";

      document.addEventListener('click', function (event) {
        Logger.debug(event);
        if (event.target.classList.contains('timestampText')) {
          try {
            let ytPlayer = document.querySelector(
              '#movie_player > div.html5-video-container > video'
            );
            ytPlayer.currentTime = event.target.dataset.start;
            ytPlayer.play();
          } catch (err) {
            Logger.debug(err);
          }
        }
      });

      this.questionField.addEventListener('keyup', async (e) => {
        if (e.code == 'Enter') {
          if (this.questionField.value.replace(' ', '').replace('\n', '')) {
            this.appendQuestion(this.questionField.value);
            this.parent.setLoadingIcon();
            callServer(location.href, this.questionField.value).then(
              (answer) => {
                this.parent.setReadyIcon();
                this.appendAnswer(answer);
              }
            );
            this.questionField.value = '';
            this.messageSection.scrollTop = this.messageSection.scrollHeight;
          } else {
            this.questionField.value = '';
          }
        }
      });
      this.div.appendChild(this.questionField);
    }

    toggleOff() {
      this.div.classList.add('hidden');
      this.isToggled = false;
    }

    toggleOn() {
      this.div.classList.remove('hidden');
      this.isToggled = true;
    }

    appendQuestion(txt) {
      // Create a question element, push it
      let question = document.createElement('div');
      question.classList.add('question-box');
      question.innerHTML = txt;
      this.messageSection.appendChild(question);
      this.messageSection.scrollTop = this.messageSection.scrollHeight;
    }

    appendAnswer(txt) {
      // Create an answer element, push it
      let answer = document.createElement('div');
      answer.classList.add('answer-box');
      answer.innerHTML = txt;
      this.messageSection.appendChild(answer);
      this.messageSection.scrollTop = this.messageSection.scrollHeight;
    }
  }
  class Owlie {
    constructor() {
      Logger.debug('Owlie constructor');

      this.icon = document.createElement('img');
      this.icon.classList.add('chat-toggle');
      this.icon.src = chrome.runtime.getURL('../icons/icon-1-steady.png');
      this.icon.id = 'owlie-toggle';

      this.chat = new Chat(this);
      document.body.appendChild(this.icon);
      document.body.appendChild(this.chat.div);

      this.icon.addEventListener('click', async (e) => {
        Logger.log('click');
        if (this.chat.isToggled) {
          Logger.log('this.chat.isToggled');
          this.chat.toggleOff();
          return;
        }
        this.chat.toggleOn();
      });
    }

    /** */
    async setLoadingIcon() {
      this.icon.src = chrome.runtime.getURL('../icons/icon-1-loading.gif');
    }

    /** */
    async setReadyIcon() {
      this.icon.src = chrome.runtime.getURL('../icons/icon-1-ready.png');
    }

    /** */
    async setErrorIcon() {
      this.icon.src = chrome.runtime.getURL('../icons/icon-1-error.png');
    }

    reset() {
      this.icon.src = chrome.runtime.getURL('../icons/icon-1-steady.png');
      this.chat.messageSection.replaceChildren([]);
      this.chat.toggleOff();
    }
  }

  let lastUrl = location.href;
  let session = new Owlie();

  const observer = new MutationObserver((mutations) => {
    // executed on any dynamic change in the page
    if (document.fullscreenElement) {
      session.icon.classList.add('hidden');
    } else {
      session.icon.classList.remove('hidden');
    }
    if (location.href == lastUrl) {
      return;
    }
    Logger.debug(lastUrl, ' -> ', location.href);
    lastUrl = location.href;
    session.reset();
  });
  observer.observe(document.body, { childList: true, subtree: true });
} catch (e) {
  console.log(e);
}

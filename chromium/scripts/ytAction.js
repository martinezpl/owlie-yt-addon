try {
  class Chat {
    constructor(parentIcon) {
      this.parentIcon = parentIcon;

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
      this.questionField.placeholder = "Ask a question within video's context";

      this.questionField.addEventListener('keyup', async (e) => {
        if (e.code == 'Enter') {
          if (this.questionField.value) {
            this.appendQuestion(this.questionField.value);
            this.parentIcon.setLoadingIcon();
            callServer(
              location.href,
              'interactive-default',
              this.questionField.value
            ).then((answer) => {
              this.parentIcon.setReadyIcon();
              this.appendAnswer(answer);
            });
            this.questionField.value = '';
            this.messageSection.scrollTop = this.messageSection.scrollHeight;
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
      question.innerText = txt;
      this.messageSection.appendChild(question);
      this.messageSection.scrollTop = this.messageSection.scrollHeight;
    }

    appendAnswer(txt) {
      // Create an answer element, push it
      let answer = document.createElement('div');
      answer.classList.add('answer-box');
      answer.innerText = txt;
      this.messageSection.appendChild(answer);
      this.messageSection.scrollTop = this.messageSection.scrollHeight;
    }
  }
  class Owlie {
    constructor() {
      Logger.debug('Owlie constructor');

      this.icon = document.createElement('img');
      this.icon.classList.add('chat-toggle');
      this.icon.classList.add('icon-steady');
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

        if (this.chat.messageSection.children.length > 0) {
          Logger.log('Messages exist, no call');
          this.chat.toggleOn();
          return;
        }
        this.summarize(
          (summary) => {
            Logger.log('Appending summary');
            this.chat.appendAnswer(summary);
            this.setReadyIcon();
            this.chat.toggleOn();
          },
          (err) => {
            Logger.log('Got error:', err);
            this.chat.appendAnswer(err);
            this.setErrorIcon();
            this.chat.toggleOn();
          }
        );
      });
    }

    /** */
    async setLoadingIcon() {
      this.icon.classList.remove('icon-ready', 'icon-steady');
      this.icon.classList.add('icon-loading');
    }

    /** */
    async setReadyIcon() {
      this.icon.classList.remove('icon-loading');
      this.icon.classList.add('icon-ready');
    }

    /** */
    async setErrorIcon() {
      this.icon.classList.remove('icon-loading');
      this.icon.classList.add('icon-error');
    }

    summarize(successCallback, errCallback) {
      this.setLoadingIcon();
      callServer(location.href, 'summary-default').then(
        successCallback,
        errCallback
      );
    }

    reset() {
      this.icon.classList.remove('icon-ready', 'icon-error', 'icon-loading');
      this.icon.classList.add('icon-steady');
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

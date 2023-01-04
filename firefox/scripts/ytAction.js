try {
  class Chat {
    constructor(parentIcon) {
      this.parentIcon = parentIcon;
      this.messages = [];

      this.div = document.createElement('div');
      this.div.id = 'owlie-chatbox';
      this.div.classList.add('chat-container');

      this.div.classList.add('hidden');
      this.isToggled = false;

      this.questionField = document.createElement('input');
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
          }
        }
      });
    }
    toggle() {
      if (this.isToggled) {
        this.div.classList.add('hidden');
        this.isToggled = false;
      } else {
        this.div.classList.remove('hidden');
        this.isToggled = true;
      }
    }

    appendQuestion(txt) {
      // Create a question element, push it
      this.messages.push(txt);
    }

    appendAnswer(txt) {
      // Create an answer element, push it
      this.messages.push(txt);
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
          this.chat.toggle();
          return;
        }

        if (this.chat.messages.length > 0) {
          Logger.log('Messages exist, no call');
          this.chat.toggle();
          return;
        }
        this.summarize(
          (summary) => {
            Logger.log('Appending summary');
            this.chat.appendAnswer(summary);
            this.setReadyIcon();
            this.chat.toggle();
          },
          (err) => {
            Logger.log('Got error');
            this.chat.appendAnswer(err);
            this.setErrorIcon();
            this.chat.toggle();
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
  }

  let lastUrl = location.href;
  let session = new Owlie();

  const observer = new MutationObserver((mutations) => {
    // executed on any dynamic change in the page
    if (location.href == lastUrl) {
      return;
    }
    Logger.debug(lastUrl, ' -> ', location.href);
    lastUrl = location.href;
    delete session;
    session = new Owlie();
  });
  observer.observe(document.body, { childList: true, subtree: true });
} catch (e) {
  console.log(e);
}

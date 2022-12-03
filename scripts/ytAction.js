// Import statements don't work with content scripts, but they share the scope.
// Therefore imagine lines below are not commented out ^^'

// import {getGPT3Summary, getGPT3Answer} from './openai.js'
// import {getAvailableTranscripts, fetchEnglishTranscript} from './transcript.js'

// html contains old transcrptions??

try {
  /** Extension's overlay over Youtube' video container */
  class VideoOverlay {
    /** */
    constructor() {
      Logger.debug('VideoOverlay constructor');
      this.#init();
      this.isToggled = false;
      this.isFilled = false;
    }

    /** Grab video container element, prepare summary field */
    #init() {
      Logger.debug('VideoOverlay init');
      this.mainContainer = document.getElementsByClassName(
        'html5-video-container'
      )[0];
      this.overlay = document.createElement('div');
      this.summaryField = document.createElement('textarea');
      this.summaryField.readOnly = true;
    }

    /** Fill overlay with text, set state
     * @param {string} text - GPT-3 output
     */
    setSummary(text) {
      this.isFilled = true;
      this.summaryField.textContent = 'summary:\n\n' + text;
    }

    appendQ(question) {
      this.summaryField.textContent += '\n\n===========\n';
      this.summaryField.textContent += '> ' + question;
      this.summaryField.scrollTop = this.summaryField.scrollHeight;
    }

    appendA(answer) {
      this.summaryField.textContent += '\n' + answer;
      this.summaryField.scrollTop = this.summaryField.scrollHeight;
    }

    /** Reinitialise on page change */
    reset() {
      Logger.debug('VideoOverlay reset');
      if (this.isToggled) {
        this.mainContainer.removeChild(this.mainContainer.lastChild);
        this.isToggled = false;
      }

      if (this.isFilled) {
        this.summaryField.textContent = '';
        this.isFilled = false;
      }
      this.#init();
    }

    /** Turn the video overlay on/off */
    toggle() {
      Logger.debug('VideoOverlay toggle');
      if (this.isToggled) {
        this.mainContainer.removeChild(this.mainContainer.lastChild);
        this.isToggled = false;
      } else {
        this.adjustOverlay();
        this.mainContainer.appendChild(this.summaryField);
        this.isToggled = true;
      }
    }

    /** */
    adjustOverlay() {
      Logger.debug('VideoOverlay adjustOverlay');
      const videoFrame = document.getElementsByClassName(
        'video-stream html5-main-video'
      )[0];
      this.summaryField.style = `
      position: relative; 
      width: ${videoFrame.style.width}; 
      height: ${parseInt(videoFrame.style.height.replace('px', '')) - 55}px; 
      left: ${videoFrame.style.left}; 
      overflow-y: scroll; 
      background-color: rgba(0, 0, 0, 0.5); 
      color: rgba(255, 255, 255, 1); 
      font-size: 150%; 
      resize: none;
      `;
    }
  }

  /** That's my guy */
  class Owlie {
    /** Creates Owlie's clickable icon in the video container's controls bar
     * and prepares video overlay
     */
    constructor() {
      Logger.debug('Owlie constructor');
      this.icon = Object.assign(document.createElement('img'), {
        id: 'owlie-in-container',
        src: browser.runtime.getURL('icons/icon-1-steady.png'),
        style: 'position: relative; scale: 0.6; left: 0px; opacity: 0.7;',
      });

      document
        .getElementsByClassName('ytp-left-controls')[0]
        .appendChild(this.icon);

      this.overlay = new VideoOverlay();
      this.questionField = document.createElement('input');
      this.questionField.placeholder = "Ask a question within video's context";

      this.questionField.addEventListener('keyup', async (e) => {
        if (e.code == 'Enter') {
          if (this.questionField.value) {
            this.overlay.appendQ(this.questionField.value);
            getGPT3Answer(this.summary, this.questionField.value).then(
              (answer) => {
                this.overlay.appendA(answer);
              }
            );
          }
        }
      });

      this.icon.addEventListener('click', async (e) => {
        Logger.info('click');
        if (this.overlay.isFilled) {
          Logger.info('this.overlay.isFilled');
          this.toggleQuestionField();
          this.reset();
          return;
        }

        this.setLoadingIcon();
        getAvailableTranscripts(document.documentElement.outerHTML).then(
          (availableTranscripts) => {
            fetchEnglishTranscript(availableTranscripts).then(
              (transcript) => {
                getGPT3Summary(transcript).then(
                  (summary) => {
                    this.summary = summary;
                    this.overlay.setSummary(summary);
                    this.setReadyIcon();
                    this.toggleQuestionField();
                    this.overlay.toggle();
                  },
                  (err) => {
                    this.overlay.setSummary(err);
                    this.setErrorIcon();
                    this.overlay.toggle();
                  }
                );
              },
              (err) => {
                this.overlay.setSummary(err);
                this.setErrorIcon();
                this.overlay.toggle();
              }
            );
          },
          (err) => {
            this.overlay.setSummary(err);
            this.setErrorIcon();
            this.overlay.toggle();
          }
        );
      });
    }

    /** */
    async setLoadingIcon() {
      this.icon.src = browser.runtime.getURL('icons/icon-1-loading.gif');
    }

    /** */
    async setReadyIcon() {
      this.icon.src = browser.runtime.getURL('icons/icon-1-ready.png');
    }

    /** */
    async setErrorIcon() {
      this.icon.src = browser.runtime.getURL('icons/icon-1-error.png');
    }

    /** Feels wrong to have this here */
    toggleQuestionField() {
      Logger.debug('toggleQuestionField');
      const ir = this.icon.getBoundingClientRect();
      let placement =
        document.getElementsByClassName(
          'ytp-chapter-hover-container ytp-exp-chapter-hover-container'
        ).length > 0
          ? `left: ${ir.left - 360}px;`
          : `left: ${ir.left + 60}px;`;
      this.questionField.style = `
      position: absolute; 
      width: 300px; 
      height: 15px; 
      ${placement};
      top: ${ir.top + 5}px;
      background-color: rgba(0, 0, 0, 0.5);
      border-color: rgba(0, 0, 0, 0.5);
      color: rgba(255, 255, 255, 1);
      z-index: 999;
      border-radius: 2px;
      `;
      if (this.overlay.isToggled) {
        try {
          document.body.removeChild(this.questionField);
        } catch {}
      } else {
        document.body.insertBefore(
          this.questionField,
          document.body.firstChild
        );
      }
    }

    /** */
    reset() {
      Logger.debug('Owlie reset');
      try {
        document.body.removeChild(this.questionField);
      } catch {}
      this.questionField.value = '';
      this.overlay.reset();
      this.icon.src = browser.runtime.getURL('icons/icon-1-steady.png');
    }
  }

  let lastUrl;
  let session = new Owlie();

  const observer = new MutationObserver((mutations) => {
    // executed on any dynamic change in the page
    if (location.href == lastUrl) {
      return;
    }
    Logger.debug(lastUrl, ' -> ', location.href);
    lastUrl = location.href;
    session.reset();
  });
  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, config);
} catch (e) {
  console.log(e);
}

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

      /**
       * Add a ResizeObserver and bind it to the video element so
       * we trigger the adjustOverley function every time the video
       * player changes size (eg: adjusting window, setting/unsetting
       * theater or full screen mode).
       *  */
      const dimensionsChangeObserver = new ResizeObserver(() => {
        this.adjustOverlay();
      });
      dimensionsChangeObserver.observe(this.mainContainer);

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

    appendSummary(text) {
      this.summaryField.textContent += '\n\n===========\n' + text;
      this.summaryField.scrollTop = this.summaryField.scrollHeight;
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

  class Owlie {
    /** Bloated class containing pretty much the whole logic
     * Creates Owlie's clickable icon in the video container's controls bar
     * Creates & toggles question field and refresh button
     *
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
            this.setLoadingIcon();
            callServer(
              location.href,
              'interactive-default',
              this.questionField.value
            ).then((answer) => {
              this.setReadyIcon();
              this.overlay.appendA(answer);
            });
          }
        }
      });

      this.refreshButton = document.createElement('img');
      this.refreshButton.src = browser.runtime.getURL('icons/refresh.png');
      this.refreshButton.addEventListener('click', (e) => {
        this.summarize(
          (summary) => {
            this.summary = summary;
            this.overlay.appendSummary(summary);
            this.setReadyIcon();
          },
          (err) => {
            this.overlay.setSummary(err);
            this.setErrorIcon();
            this.overlay.toggle();
          }
        );
      });

      this.icon.addEventListener('click', async (e) => {
        Logger.log('click');
        if (this.overlay.isFilled) {
          Logger.log('this.overlay.isFilled');
          this.togglePanelExtras();
          this.overlay.toggle();
          return;
        }

        this.summarize(
          (summary) => {
            this.summary = summary;
            this.overlay.setSummary(summary);
            this.setReadyIcon();
            this.togglePanelExtras();
            this.overlay.toggle();
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

    /** Feels wrong to have this here,
     * displays/hides the question input field and refresh button
     * */
    togglePanelExtras() {
      Logger.debug('togglePanelExtras');
      const ir = this.icon.getBoundingClientRect();
      let leftAllignment =
        document.getElementsByClassName(
          'ytp-chapter-hover-container ytp-exp-chapter-hover-container'
        ).length > 0
          ? ir.left - 360
          : ir.left + 60;
      this.questionField.style = `
      position: absolute; 
      width: 300px; 
      height: 15px; 
      left: ${leftAllignment}px;
      top: ${ir.top + 5}px;
      background-color: rgba(0, 0, 0, 0.5);
      border-color: rgba(0, 0, 0, 0.5);
      color: rgba(255, 255, 255, 1);
      z-index: 999;
      border-radius: 2px;
      `;
      this.refreshButton.style = `
      position: absolute;
      left: ${leftAllignment - 30}px;
      top: ${ir.top}px;
      z-index: 999;
      scale: 0.5;
      `;
      if (this.overlay.isToggled) {
        try {
          document.body.removeChild(this.questionField);
          document.body.removeChild(this.refreshButton);
        } catch {}
      } else {
        document.body.insertBefore(
          this.questionField,
          document.body.firstChild
        );
        document.body.insertBefore(this.refreshButton, this.questionField);
      }
    }

    summarize(successCallback, errCallback) {
      this.setLoadingIcon();
      callServer(location.href, 'summary-default').then(
        successCallback,
        errCallback
      );
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

  let lastUrl = location.href;
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
  observer.observe(document.body, { childList: true, subtree: true });
} catch (e) {
  console.log(e);
}

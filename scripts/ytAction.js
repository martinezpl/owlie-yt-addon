// Import statements don't work with content scripts, but they share the scope.
// Therefore imagine these lines are not commented out ^^'

// import {getGPT3Summary} from './openai.js'
// import {getAvailableTranscripts, fetchEnglishTranscript} from './transcript.js'

try {
  console.log('albo sie nie ma');

  /** Extension's overlay over Youtube' video container */
  class VideoOverlay {
    /** */
    constructor() {
      this.#init();
      this.isToggled = false;
      this.isFilled = false;
    }

    /** Grab video container element, prepare summary field */
    #init() {
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

    /** Reinitialise on page change */
    reset() {
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
      this.icon = Object.assign(document.createElement('img'), {
        id: 'owlie-in-container',
        src: browser.runtime.getURL('icons/icon-1-steady.png'),
        style: 'position: relative; scale: 0.6; left: 0px; opacity: 0.7;',
      });
      document
        .getElementsByClassName('ytp-left-controls')[0]
        .appendChild(this.icon);

      this.overlay = new VideoOverlay();

      this.icon.addEventListener('click', async (e) => {
        console.log('click');
        if (this.overlay.isFilled) {
          this.reset();
          return;
        }

        this.setLoadingIcon();
        getAvailableTranscripts(document.documentElement.innerHTML).then(
          (availableTranscripts) => {
            fetchEnglishTranscript(availableTranscripts).then((transcript) => {
              getGPT3Summary(transcript).then((summary) => {
                this.overlay.setSummary(summary);
                this.setReadyIcon();
                this.overlay.toggle();
              });
            });
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
    reset() {
      this.overlay.reset();
      this.icon.src = browser.runtime.getURL('icons/icon-1-steady.png');
    }
  }

  let lastUrl;
  const session = new Owlie();

  const observer = new MutationObserver((mutations) => {
    // executed on any dynamic change in the page, listening for URL change
    if (location.href == lastUrl) {
      return;
    }
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

`<div style="position: relative; width: 1419px; height: 743px; left: 251px;  background-color: rgba(0, 0, 0, 0.5); color: rgb(255, 255, 255);">
      <div style="float: left; width: 50%;">
      <textarea readonly="" style="resize: none; height: 743px; width:710px; overflow-y: scroll; font-size: 150%;background-color: rgba(0, 0, 0, 0.0); color: rgb(255, 255, 255); float: left;">summary:
      
      -Anonymous is a decentralized organization that is interested in developing headless technology
        -An Anonymous organization was formed in 2010, and Kayla and Sabu were theackers of the group.
        -HP Federal was hacked by Anonymous in 2012, taking over their Twitter account and took out some FBI Affiliated sites. 
        -FBI Fridays are whenAnonymous releases leaks from corporations).</textarea>
       </div>
      <div style="float: left; width: 50%;">
      <p>Ask a question. The answer will be within the context of the video.</p>
      <input style="width: 400px; background-color: rgba(0, 0, 0, 0); border-color: rgba(255, 255, 255, 1);"></input>
      <textarea readonly="" style="resize: none; height: 743px; width:710px; overflow-y: scroll; font-size: 150%;background-color: rgba(0, 0, 0, 0.0); color: rgb(255, 255, 255); float: left;">
      
      -Anonymous is a decentralized organization that is interested in developing headless technology
        -An Anonymous organization was formed in 2010, and Kayla and Sabu were theackers of the group.
        -HP Federal was hacked by Anonymous in 2012, taking over their Twitter account and took out some FBI Affiliated sites. 
        -FBI Fridays are whenAnonymous releases leaks from corporations).</textarea>
       </div>
      </div>`;

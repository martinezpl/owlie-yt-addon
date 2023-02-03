export const updateVideoTime = (startTime: number) => {
  try {
    const ytPlayer: HTMLVideoElement = document.querySelector(
      "#movie_player > div.html5-video-container > video"
    );
    ytPlayer.currentTime = startTime;
    ytPlayer.play();
  } catch (err) {
    console.debug(err.message);
  }
};

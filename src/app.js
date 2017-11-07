import gfycat from './services/gfycat';
import param from './utils/params';

console.log('gfycat', gfycat);

if (window.location.search) {
  init(window.location.search);
}

function init (paramsString) {
  console.log('Location', paramsString);

  const body = document.querySelector('body');

  // var videoContainer = document.createElement('div');
  const videoContainer = document.querySelector('#videoContainer');
  videoContainer.setAttribute('class', 'visual-container')

  // var audioContainerElement = document.createElement('div');
const audioContainerElement = document.querySelector('#audioContainer');
  audioContainerElement.setAttribute('class', 'audible-container')
  // audioContainerElement.setAttribute('id', 'audioContainer')

  let audioId = param('v'),
      audioStartTime = parseFloat(param('s')),
      audioEndTime = parseFloat(param('e'));

  console.log('audioEndTime', audioEndTime);

  let canonicalVideoUrl = '', videoId, webmUrl, mp4Url, fallbackUrl;

  var videoPlayer = document.createElement('video');
  videoPlayer.setAttribute('muted', '')
  videoPlayer.setAttribute('loop', '');

  if (param("gfycat")) {
    let videoElement      = gfycat.getVideoElement(),
        thumbUrl          = gfycat.getThumbnailUrl(),
        canonicalVideoUrl = gfycat.getCanonicalVideoUrl();

    appendFallbackImage(videoElement, thumbUrl);
    setVideoEventListeners(videoElement);
    setVideoSourceUrl(canonicalVideoUrl);
    appendVideo(videoElement);
  } else if (param('yt')) {
    // ****** YouTube Visual Method ******

  }


  setAudioSourceUrl(makeYtUrlFromId);

  function appendFallbackImage (videoPlayer, fallbackUrl) {
    var fallbackImage;

    fallbackImage = document.createElement('img')
    fallbackImage.setAttribute('title', "Sorry, your browser doesn't support HTML5 video.");
    fallbackImage.setAttribute('src', fallbackUrl);
    videoPlayer.appendChild(fallbackImage);

    return fallbackImage;
  }

  var videoReady = false,
      audioReady = false;

  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
  var audioPlayer;
  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady () {
    audioPlayer = new YT.Player('audioContainer', {
      height: '320',
      width: '460',
      videoId: audioId,
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'loop': 1,
        'start': audioStartTime,
        'end': audioEndTime,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0,

      },
      events: {
        'onReady': onAudioPlayerReady,
        'onStateChange': onAudioPlayerStateChange
      }
    });

    if (param('yt')) {
      videoPlayer = new YT.Player('videoContainer', {
        height: '320',
        width: '460',
        videoId: param('yt'),
        playerVars: {
          'autoplay': 0,
          'controls': 1,
          'loop': 1,
          'start': videoStartTime,
          'end': videoEndTime,
          'modestbranding': 1,
          'rel': 0,
          'showinfo': 0,

        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  }

  // 4. The API will call this function when the video player is ready.
  function onAudioPlayerReady (event) {
      // audioPlayer.seekTo(audioStartTime);
    playAudio()
      // audioPlayer.pauseVideo();
      // audioPlayer.playVideo();
      // audioReady = true;
    attemptToPlayBoth();
  }

  // 5. The API calls this function when the player's state changes.    The function indicates that when playing a video (state=1),    the player should play for six seconds and then stop.
  function onAudioPlayerStateChange (event) {
    console.log('event.data', event.data, 'YT.PlayerState', YT.PlayerState)
    if (event.data === YT.PlayerState.CUED) {
      audioReady = true;
      attemptToPlayBoth();
    }
    if (event.data === YT.PlayerState.BUFFERING) {
      // audioReady = true;
      playAudio();
    }

    if (event.data === YT.PlayerState.PLAYING) {
      audioReady = true;
      attemptToPlayBoth();
      console.timeEnd('audioPlayer')
    }

    if (event.data === YT.PlayerState.ENDED || (event.data === YT.PlayerState.PAUSED && audioPlayer.getCurrentTime() >= audioEndTime)) {
      audioPlayer.seekTo(audioStartTime);
    } else if (event.data === YT.PlayerState.PAUSED) {
      pauseBoth();
    }
  }

  function appendVideo (element) {
    videoContainer.appendChild(element);

    // body.insertBefore(audioContainerElement, body.firstChild);
    // body.insertBefore(videoContainer, body.firstChild);
  }

  function setVideoEventListeners (videoPlayer) {
    videoPlayer.addEventListener('loadeddata', function () {

      if (videoPlayer.readyState >= 2) {
        videoReady = true;
        // playVideo();
        attemptToPlayBoth();
      }

    });
    videoPlayer.addEventListener('pause', pauseBoth);
    videoPlayer.addEventListener('play', attemptToPlayBoth);
  }

  function playVideo () {
    if (param('yt')) {
      videoPlayer.playVideo();
    } else {
      videoPlayer.play();
    }
  }

  function playAudio () {
    audioPlayer.playVideo();
  }

  function pauseVideo () {
    if (param('yt')) {
      videoPlayer.pauseVideo();
    } else {
      videoPlayer.pause();
    }
  }

  function pauseAudio () {
    audioPlayer.pauseVideo();
  }

  function pauseBoth () {
    pauseVideo();
    pauseAudio();
  }

  function playBoth () {
    playVideo();
    playAudio();
  }

  function attemptToPlayBoth () {
    console.log('videoReady', videoReady, 'audioReady', audioReady)
    if (videoReady && audioReady) {
      console.log('playing both video and audio');
      playBoth();
    // } else {
    //   if (audioReady) {
    //     console.log('audio ready, pausing until video ready');
    //     // pauseAudio();
    //   }
    //   if (videoReady) {
    //     console.log('video ready, pausing until audio ready');
    //     // pauseVideo();
    //   }
    }
  }

  function makeYtUrlFromId (ytId) {
    return `${window.location.protocol}//www.youtube.com/watch?v=${ytId}`
  }

  function getYtIdFromUrl (ytUrl) {
    return /.*youtu(?:\.)*be(?:.com)*\/(?:watch\?)*(?:v=)*([^\&\?]*?)(?:$|[&?])/.exec(ytUrl);
  }
}
function setAudioSourceUrl(makeYtUrlFromId) {
  document.querySelector('[name="audio-source"]').value = `${makeYtUrlFromId(param('v'))}`;
}

function setVideoSourceUrl(canonicalVideoUrl) {
  document.querySelector('[name="video-source"]').value = `${window.location.protocol}${canonicalVideoUrl}`;
}


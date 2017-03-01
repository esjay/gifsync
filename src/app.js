'use strict';

import SuperGif from "./lib/libgif";

console.log(SuperGif);

if (!window.location.search) {
  window.location.href = '?gfycat=AnotherGrandAntarcticfurseal&v=BmPFioq1l6o&s=37&e=89';
} else {
  init(window.location.search);
}

function init(paramsString) {
  console.log('Location', paramsString);
  var searchParams = new URLSearchParams(paramsString),
      param = searchParams.get.bind(searchParams);

  var body = document.querySelector('body');

  // var videoContainer = document.createElement('div');
  var videoContainer = document.querySelector('#videoContainer');
  videoContainer.setAttribute('class', 'visual-container')
  
  // var audioContainerElement = document.createElement('div');
  var audioContainerElement = document.querySelector('#audioContainer');
  audioContainerElement.setAttribute('class', 'audible-container')
  // audioContainerElement.setAttribute('id', 'audioContainer')

  var audioId = param('v'),
      audioStartTime = parseFloat(param('s')),
      audioEndTime = parseFloat(param('e'));

  console.log('audioEndTime', audioEndTime);

  var videoId, thumbUrl, webmUrl, mp4Url, fallbackUrl;

  var videoPlayer = document.createElement('video');
  videoPlayer.setAttribute('muted', '')
  videoPlayer.setAttribute('loop', '');

  if (param('gif')) {
    // ****** Any GIF Method ******

    appendChildren();
    appendFallbackImage(videoPlayer, param('gif'));

    videoPlayer = new SuperGif({
      gif: videoPlayer,
      show_progress_bar: false,
      auto_play: 0
    } );
    videoPlayer.load_url(param('gif'), attemptToPlayBoth);

    // <a href="javascript:;" onmousedown="sup1.pause(); return false;">Pause</a> |
    // <a href="javascript:;" onmousedown="sup1.play(); return false;">Play</a> |
    // <a href="javascript:;" onmousedown="sup1.move_to(0); return false;">Restart</a> |

  } else if (param("gfycat")) {
    // ****** GfyCat Method ******

    var subdomains = ['zippy', 'fat', 'giant'],
    extensions = ['webm', 'mp4'];
    videoId = param("gfycat");

    thumbUrl = '//thumbs.gfycat.com/' + videoId + '-poster.jpg';

    extensions.forEach(function (ext) {
      subdomains.forEach(function (sd) {
        var sourceUrl = '//' + sd + '.gfycat.com/' + videoId + '.' + ext;
        var sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', sourceUrl);
        sourceElement.setAttribute('type', 'video/' + ext);

        videoPlayer.appendChild(sourceElement);
      })
    });

    videoPlayer.setAttribute('poster', thumbUrl);
  
    appendChildren();
    appendFallbackImage(videoPlayer, thumbUrl);
    setVideoEventListeners(videoPlayer);
  } else if (param('yt')) {
    // ****** YouTube Visual Method ******

  }

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
  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    audioPlayer = new YT.Player('audioContainer', {
      height: '320',
      width: '460',
      videoId: audioId,
      // startSeconds: 6,
      //endSeconds: 12,
      // loop: true,
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
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    console.log('audioPlayer', audioPlayer, 'audioPlayer.seekTo', audioPlayer.seekTo)
      // audioPlayer.seekTo(6);
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
      // audioPlayer.seekTo(audioStartTime);
    playAudio()
      // audioPlayer.pauseVideo();
      // audioPlayer.playVideo();
      // audioReady = true;
    attemptToPlayBoth();
  }

  // 5. The API calls this function when the player's state changes.    The function indicates that when playing a video (state=1),    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
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

  function appendChildren () {
    videoContainer.appendChild(videoPlayer);

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
    videoPlayer.play();
  }

  function playAudio () {
    audioPlayer.playVideo();
  }

  function stopVideo() {
    audioPlayer.stopVideo();
  }

  function pauseVideo () {
    videoPlayer.pause();
  }

  function pauseAudio () {
    audioPlayer.pauseVideo();
  }

  function pauseBoth () {
    pauseVideo();
    pauseAudio();
  }

  function playBoth() {
    playVideo();
    playAudio();
  }

  function attemptToPlayBoth() {
    console.log('videoReady', videoReady, 'audioReady', audioReady)
    if (videoReady && audioReady) {
      playBoth();
      console.time('audioPlayer');
    } else {
      if (audioReady) {
        pauseAudio();
      }
      if (videoReady) {
        pauseVideo();
      }
    }
  }
}
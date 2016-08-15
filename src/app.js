'use strict';

var paramsString = location.search || '?gfycat=AnotherGrandAntarcticfurseal&v=BmPFioq1l6o&s=37&e=89';
console.log('Location', location.search)
var searchParams = new URLSearchParams(paramsString);

//Iterate the search parameters.
for (let p of searchParams) {
  console.log(p);
}

var audioId = searchParams.get('v'),
    audioStartTime = parseFloat(searchParams.get('s')),
    audioEndTime = parseFloat(searchParams.get('e'));

console.log('audioEndTime', audioEndTime);

var videoId, thumbUrl, webmUrl, mp4Url;

var videoPlayer = document.createElement('video');
videoPlayer.setAttribute('muted', '')
videoPlayer.setAttribute('loop', '');

if(searchParams.get("gfycat")) {
  var subdomains = ['zippy', 'fat', 'giant'],
      extensions = ['webm', 'mp4'];
  videoId = searchParams.get("gfycat");

  thumbUrl = '//thumbs.gfycat.com/'+videoId+'-poster.jpg';

  extensions.forEach(function(ext) {
    subdomains.forEach(function(sd) {
      var sourceUrl = '//' + sd + '.gfycat.com/' + videoId + '.' + ext;
      var sourceElement = document.createElement('source');
      sourceElement.setAttribute('src', sourceUrl);
      sourceElement.setAttribute('type', 'video/' + ext);

      videoPlayer.appendChild(sourceElement);
    })
  });
}

var fallbackImage = document.createElement('img')
fallbackImage.setAttribute('title', "Sorry, your browser doesn't support HTML5 video.");
fallbackImage.setAttribute('src', '//thumbs.gfycat.com/'+ videoId +'-poster.jpg');

videoPlayer.setAttribute('poster', thumbUrl);
videoPlayer.appendChild(fallbackImage);

var body = document.querySelector('body');

var videoContainer = document.createElement('div');
videoContainer.setAttribute('class', 'visual-container')
videoContainer.appendChild(videoPlayer);

var audioContainerElement = document.createElement('div');
audioContainerElement.setAttribute('class', 'audible-container')
audioContainerElement.setAttribute('id', 'audioContainer')

body.insertBefore(audioContainerElement, body.firstChild);
body.insertBefore(videoContainer, body.firstChild);

var videoReady = false,
    audioReady = false;

videoPlayer.addEventListener('loadeddata', function() {

  if(videoPlayer.readyState >= 2) {
    videoReady = true;
    // videoPlayer.play();
    attemptToPlayBoth();
  }

});
videoPlayer.addEventListener('pause', pauseBoth);
videoPlayer.addEventListener('play', attemptToPlayBoth);

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
    audioPlayer.playVideo()
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
        audioPlayer.playVideo();
    }

    if(event.data === YT.PlayerState.PLAYING) {
        audioReady = true;
        attemptToPlayBoth();
        console.timeEnd('audioPlayer')
    }

    if(event.data === YT.PlayerState.ENDED || (event.data === YT.PlayerState.PAUSED && audioPlayer.getCurrentTime() >= audioEndTime)) {
      audioPlayer.seekTo(audioStartTime);
    } else if(event.data === YT.PlayerState.PAUSED) {
      pauseBoth();
    }
}
function stopVideo() {
    audioPlayer.stopVideo();
}
function pauseBoth() {
  videoPlayer.pause();
  audioPlayer.pauseVideo();
}

function attemptToPlayBoth() {
  console.log('videoReady', videoReady, 'audioReady', audioReady)
  if(videoReady && audioReady) {
    videoPlayer.play();
    audioPlayer.playVideo();
    console.time('audioPlayer');
  } else {
    if(audioReady) {
      audioPlayer.pauseVideo();
    }
    if(videoReady) {
      videoPlayer.pause();
    }
  }
}

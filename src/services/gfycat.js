import param from '../utils/params';

let gfycat = {
  getVideoElement,
  getCanonicalVideoUrl,
  getThumbnailUrl
};

function getThumbnailUrl () {
  return `//thumbs.gfycat.com/${param("gfycat")}-poster.jpg`;
}

function getVideoElement () {
  let videoElement = document.createElement('video');
  let subdomains = ['zippy', 'fat', 'giant'],
      extensions = ['webm', 'mp4'],
      videoId = param("gfycat");

  extensions.forEach(function (ext) {
    subdomains.forEach(function (sd) {
      var sourceUrl = `//${sd}.gfycat.com/${videoId}.${ext}`;
      var sourceElement = document.createElement('source');
      sourceElement.setAttribute('src', sourceUrl);
      sourceElement.setAttribute('type', 'video/' + ext);

      videoElement.appendChild(sourceElement);
    })
  });

  videoElement.setAttribute('poster', getThumbnailUrl());

  return videoElement;
}

function getCanonicalVideoUrl () {
  return `//gfycat.com/${param('gfycat')}`;
}

export default gfycat;

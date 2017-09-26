
module.exports.getVisualUrl = function (params) {
  if (params.get('gif')) {
    // ****** Any GIF Method ******
    return param('gif');
  } else if (params.get("gfycat")) {
    // ****** GfyCat Method ******

    return `//gfycat.com/${params.get('gfycat')}`;
  } else if (params.get('yt')) {
    // ****** YouTube Visual Method ******

  }
};
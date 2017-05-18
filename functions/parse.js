
module.exports.getVisualUrl = function (params) {
  if (params['gif']) {
    // ****** Any GIF Method ******
    return params['gif'];
  } else if (params['gfycat']) {
    // ****** GfyCat Method ******

    return `//gfycat.com/${params['gfycat']}`;
  } else if (params['yt']) {
    // ****** YouTube Visual Method ******

  }
};
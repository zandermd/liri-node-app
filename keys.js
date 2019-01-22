console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
exports.ombd = {
  key: process.env.OMBD_KEY
}

exports.bands = {
  key: process.env.BANDS_KEY
}
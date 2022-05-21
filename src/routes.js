const actions = require('./actions');

// Index router is actually a static file (index.html, and other assets), and set at index.js

module.exports = (router, app) => {
  // AJAX endpoint to fetch the songs data using a headless browser
  router.post('/get-playlist', async (req, res) => {
    const response = await actions.getSpotifySongs(req, app);

    if (response.success === true) {
      res.status(200).json({ message: 'success!', songs: response.data });
    } else {
      res.status(response.status || 403).json({ message: response.message });
    }
  });
};

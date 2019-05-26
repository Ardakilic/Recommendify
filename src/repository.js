const puppeteer = require('puppeteer');
const os = require('os');

// The last.fm playlist paths
const paths = {
  recommendation: 'http://www.last.fm/player/station/user/[INPUT]/recommended?ajax=1',
  mix: 'http://www.last.fm/player/station/user/[INPUT]/mix?ajax=1',
  library: 'http://www.last.fm/player/station/user/[INPUT]/library?ajax=1',
  artist: 'http://www.last.fm/player/station/music/[INPUT]?ajax=1',
  tag: 'http://www.last.fm/player/station/tag/[INPUT]?ajax=1',
};

// The last.fm login form resources
const lastFmResources = {
  loginFormURL: 'https://secure.last.fm/login',
  usernameField: '#id_username',
  passwordField: '#id_password',
  submitButton: 'button[name="submit"]',
};

// The method to fetch playlist raw data
const fetchPlaylist = async (username, password, playlistLink) => {
  // These parameters will initialize the browser properly.
  let browserParameters = {};
  // root user cannot be used in sandbox mode.
  // This is a workaround to make it work even with root user
  if (os.userInfo().username === 'root') {
    browserParameters = { args: ['--no-sandbox'] };
  }
  // If the app is running on Heroku, puppeteer needs additional parameters
  if (process.env.HEROKU !== undefined && process.env.HEROKU === 'true') {
    browserParameters = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  }

  const browser = await puppeteer.launch(browserParameters);
  const page = await browser.newPage();
  await page.goto(lastFmResources.loginFormURL, { waitUntil: 'load', timeout: 0 });
  await page.type(lastFmResources.usernameField, username);
  await page.type(lastFmResources.passwordField, password);
  await page.click(lastFmResources.submitButton);
  // await page.waitForNavigation();
  const playlist = await page.goto(playlistLink, { waitUntil: 'load', timeout: 0 });
  const playlistData = await playlist.text();
  await browser.close();
  // console.log(playlistData);
  return playlistData;
};

// The method to parse playlist data fetched from last.fm and get Spotify song IDs
const parsePlaylist = (rawPlaylistString) => {
  const rawPlaylistData = JSON.parse(rawPlaylistString);
  const links = rawPlaylistData.playlist.map(
    playlist => playlist.playlinks.filter(
      song => song.affiliate === 'spotify'
    ).map(
      song => song.id
    )
  );
  return [].concat(...links);
};

// The method to serve data back to actions
const getSpotifySongs = async (user, password, playlistUser, playlistType) => {
  try {
    const playlistLink = paths[playlistType].replace('[INPUT]', playlistUser);
    const rawPlaylistData = await fetchPlaylist(user, password, playlistLink);
    // console.log(rawPlaylistData);
    const playlistData = parsePlaylist(rawPlaylistData);
    return {
      success: true,
      data: playlistData,
    };
  } catch (error) {
    return {
      success: false,
      message: String(error),
    };
  }
};

module.exports = {
  getSpotifySongs,
};

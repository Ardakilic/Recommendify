const { chromium } = require('playwright');
const os = require('os');

const dbg = false;

// TODO: Enable playwright's adblocker plugin for faster login times
// const { PlaywrightBlocker } = require('@cliqz/adblocker-playwright');
// const fetch = require('cross-fetch'); // required 'fetch'

// The last.fm paths
const paths = {
  playlists: {
    recommendation: 'http://www.last.fm/player/station/user/[INPUT]/recommended',
    mix: 'http://www.last.fm/player/station/user/[INPUT]/mix',
    library: 'http://www.last.fm/player/station/user/[INPUT]/library',
    obsessions: 'http://www.last.fm/player/station/user/[INPUT]/obsessions',
    artist: 'http://www.last.fm/player/station/music/[INPUT]',
    tag: 'http://www.last.fm/player/station/tag/[INPUT]',
  },
  // The home path of Last.fm after successful login, we need to dynamically generate this string in the fetchPlaylist function
  loggedIn: '',
};

// The last.fm login form resources
const lastFmResources = {
  loginFormURL: 'https://www.last.fm/login',
  usernameField: '#id_username_or_email',
  passwordField: '#id_password',
  submitButton: 'button.btn-primary',
};

// The method to fetch playlist raw data
// eslint-disable-next-line max-statements
const fetchPlaylist = async (username, password, playlistLink) => {
  // Generate the 'loggedIn' string
  paths.loggedIn = `https://www.last.fm/user/${username}`;
  if (dbg) {
    console.log(paths);
  }
  // These parameters will initialize the browser properly.
  let browserParameters = {};

  // root user cannot be used in sandbox mode.
  // This is a workaround to make it work even with root user
  if (os.userInfo().username === 'root') {
    browserParameters = { args: ['--no-sandbox'] };
  }

  // Playwright debugging
  if (dbg) {
    browserParameters = { headless: false, slowMo: 300 };
  }

  // Heroku specific environment to set browser parameters properly.
  // Simply add HEROKU=true to your heroku environment
  if (process.env.HEROKU !== undefined && process.env.HEROKU === 'true') {
    browserParameters = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  }

  const browser = await chromium.launch(browserParameters);
  const context = await browser.newContext();
  const page = await context.newPage();

  // TODO: Enable adblock on page (for some reason this makes playwright hang on the login screen)
  // PlaywrightBlocker.fromLists(fetch, ['https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts']).then((blocker) => {
  //   blocker.enableBlockingInPage(page);
  // });

  await page.goto(lastFmResources.loginFormURL);
  await page.type(lastFmResources.usernameField, username);
  await page.type(lastFmResources.passwordField, password);
  await page.click(lastFmResources.submitButton);

  // Ensure user is logged in. Check if the current url does not include their profile name or if no "alert box" has appeared
  await page.waitForLoadState('domcontentloaded');

  const errorBoxCount = await page.$('.alert');
  if (page.url() !== paths.loggedIn || errorBoxCount !== null) {
    throw new Error('Could not log into last.fm');
  }

  const playlistData = await page.goto(playlistLink).text();

  await browser.close();

  return playlistData;
};

// The method to parse playlist data fetched from last.fm and get Spotify song IDs
const parsePlaylist = (rawPlaylistString) => {
  const rawPlaylistData = JSON.parse(rawPlaylistString);
  const links = rawPlaylistData.playlist.map(
    (playlist) => playlist.playlinks.filter(
      (song) => song.affiliate === 'spotify',
    ).map(
      (song) => song.id,
    ),
  );

  return [].concat(...links);
};

// The method to serve data back to actions
const getSpotifySongs = async (user, password, playlistUser, playlistType) => {
  try {
    const playlistLink = paths.playlists[playlistType].replace('[INPUT]', playlistUser);
    const rawPlaylistData = await fetchPlaylist(user, password, playlistLink);
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

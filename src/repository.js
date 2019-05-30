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
        browserParameters = { args: [ '--no-sandbox' ] };
    }

    // Heroku specific environment to set browser parameters properly.
    // Simply add HEROKU=true to your heroku environment
    if (process.env.HEROKU !== undefined && process.env.HEROKU === 'true') {
        browserParameters = { args: [ '--no-sandbox', '--disable-setuid-sandbox' ] };
    }

    const browser = await puppeteer.launch(browserParameters);
    const page = await browser.newPage();

    await page.goto(lastFmResources.loginFormURL, { waitUntil: 'load', timeout: 0 });
    await page.type(lastFmResources.usernameField, username);
    await page.type(lastFmResources.passwordField, password);

    // page.click does not work on this case on Heroku,
    // that's why we evaluate on browser page directly instead.
    // Also, the waitForNavigation was having a race condition with click event, so we use Promise.all
    // Old version start
    // const waitUntilSubmission = page.waitForNavigation();
    // await page.click(lastFmResources.submitButton);
    // await waitUntilSubmission;
    // Old version end
    await Promise.all([
        // eslint-disable-next-line no-undef
        page.evaluate(() => document.querySelector(lastFmResources.submitButton).click()),
        page.waitForNavigation(),
    ]);

    const playlist = await page.goto(playlistLink, { waitUntil: 'load', timeout: 0 });
    const playlistData = await playlist.text();
    // console.log(playlistData);

    await browser.close();

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
    }
    catch (error) {
        return {
            success: false,
            message: String(error),
        };
    }
};

module.exports = {
    getSpotifySongs,
};

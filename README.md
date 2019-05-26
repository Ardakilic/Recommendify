Recommendify²
--------

A service that makes Spotify playlists from Last.fm user recommendations.

With this tool, you can generate

* Your Last.fm Recommendation
* Your Last.fm Library
* Your Last.fm mix
* Band (Artist)
* Tag (Genre)

playlists from Last.fm from Spotify.

Why ?
--------
I'm a last.fm fan, and I have been scrobbling every song I've listened to last.fm for almost 10 years. The service has made me discover tons of new bands and discover new songs.

Up until a while ago, because last.fm closed their radio streaming service even for premium users, you couldn't listen to the recommended songs, and this resulted users cannot benefit from last.fm recommendations.

Recently, last.fm brought listening music from Youtube and Spofiy. So this way, you can keep on listening last.fm radios using these two.

But there's a little issue here:

To keep on listenng, you have to keep the webpage open. **This doesn't work well in mobile devices**.

Also, in my opinion, Spotify radios are not yet close to last.fm.

Why the rewrite?
--------
last.fm blocked providing the playlist with Spotify songs on client side over a proxy. So, unless you're logged in and connected a premium Spotify account, so, for the time being, this used to make the v1 version obsolete. The rewrite includes a headless browser and a server-side fetching.

Screenshots
--------

![Recommendify](https://i.imgur.com/G5V33ad.png)

![Mobile](https://i.imgur.com/8zsZNMo.png)

*Works great on Mobile, too!*

Building yourself
--------

It's quite easy to build the application yourself. You need to have `npm` and `gulp` installed.

```bash
npm install
npm run build #or gulp
npm start #or PORT=1234 npm start or PORT=1234 node src/index.js
```

Then simply navigate to http://localhost:3000

FAQ
--------

### Why does the website ask my last.fm credentials?
Sadly, Last.fm now does not provide Spotify songs on playlists unless you're a Spotify premium subscriber and logged in. To achieve the Spotify songs, we need credentials of a Last.fm user who's connected a Spotify Premium account to fetch the playlists. These credentials are never stored!

### There was an embed widget and click link on v1, where are they?
Because [Spotify killed the trackset feature](https://developer.spotify.com/documentation/widgets/guides/adding-a-spotify-play-button/#play-button-in-playlists), last.fm does not provide Spotify embed links anymore. For dynamic playlists, you need to use their API, this is not in my current plans. Also, for a single playlist, getting both last.fm and Spotify authentication would be quite frustrating for the users.


Contribution
--------

* Fork the project
* Do your magic
* Make a pull request

License
--------
MIT

Buy me a coffee or beer!
--------

Donations are kindly accepted to help develop my projects further.

BTC: 1QFHeSrhWWVhmneDBkArKvpmPohRjpf7p6

ETH / ERC20 Tokens: 0x3C2b0AC49257300DaB96dF8b49d254Bb696B3458

NEO / Nep5 Tokens: AYbHEah5Y4J6BV8Y9wkWJY7cCyHQameaHc

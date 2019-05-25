# Recommendify
A service that makes Spotify playlists from Last.fm user recommendations.

With this tool, you can generate

* Your Last.fm Recommendation
* Your Last.fm Library
* Your Last.fm mix
* Band (Artist)
* Tag (Genre)

playlists from Last.fm from Spotify.

## Why ?
I'm a last.fm fan, and I have been scrobbling every song I've listened to last.fm for almost 10 years. The service has made me discover tons of new bands and discover new songs.

Up until a while ago, because last.fm closed their radio streaming service even for premium users, you couldn't listen to the recommended songs, and this resulted users cannot benefit from last.fm recommendations.

Recently, last.fm brought listening music from Youtube and Spofiy. So this way, you can keep on listening last.fm radios using these two.

But there's a little issue here:

To keep on listenng, you have to keep the webpage open. **This doesn't work well in mobile devices**.

There's a service called [Spotibot](http://www.spotibot.com) which generates the playlist for Artist, genre etc just like this script, however User recommendation for it doesn't work. I've tried to contact with them over Twitter, and got no response, so I've created my own version.

**The new version should do everything Spotibot Offers from official Last.fm api. The tracklist is fetched directly from Last.fm along with Spotify URLs**

## Screenshots 

![Recommendify](https://i.imgur.com/G5V33ad.png)

![Mobile](https://i.imgur.com/8zsZNMo.png)

*Works great on Mobile, too!*

## I Want to Try

Just head over to [https://ardakilic.github.io/Recommendify](https://ardakilic.github.io/Recommendify) to try and make your playlist

## Building yourself

It's quite easy to build the assets yourself. You need to have `npm` and `gulp` installed.

```bash
npm install
gulp
```

## Contribution
* Fork the project
* Do your magic
* Make a pull request (to the `master`, not to the `gh-pages` branch)

## Thanks
* [CrossOrigin](https://crossorigin.me/) to prevent CORS on the client side
* [And all other contributors](https://github.com/Ardakilic/Recommendify/graphs/contributors)


## License
MIT
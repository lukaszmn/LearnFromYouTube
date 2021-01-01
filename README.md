# Learn from YouTube

Play and bookmark your YouTube videos

# Installation

Create `yt-key.js` file in the root with content:

```js
const YT_CLIENT_ID = '<your value>';
const YT_REDIRECT_URI = 'https://<your value>';
```

See [Google guide](https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps) for details on creating your API key.

Execute `npm run build` and serve the `dist` folder to a web browser.

# References

* [YouTube player API](https://developers.google.com/youtube/iframe_api_reference#Playback_controls)
* [YouTube profile API](https://developers.google.com/youtube/v3/docs/playlists/list)



# TODO
- refactor
- use https://developer.mozilla.org/en-US/docs/Web/API/History_API
- option to mark as seen
- show bookmarks aside movies. On small screen - tabs
- adding bookmark adds it to the list
- click bookmark => play it
- buttons for easy rewind/ff: 2 sec, 5 sec, 10 sec
- play/pause button?
- verify in mobile
- sync bookmarks to AWS or GDrive

// docs: https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady() {
	Player.playerReady();
}

class Player {

	static #player;
	static #playVideoId;

	static playerReady() {
		Player.#player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: Player.#playVideoId,
			events: {
				// 'onReady': onPlayerReady,
				// 'onStateChange': onPlayerStateChange
			}
		});
	}

	play(videoId) {
		Player.#playVideoId = videoId;
		try {
			if (Player.#player)
				Player.#player.loadVideoById(videoId);
		} catch {}
	}

	getTime() {
		return Math.round(Player.#player.playerInfo.currentTime);
	}

	setTime(seconds) {
		Player.#player.seekTo(seconds, true);
	}

	// function onPlayerReady(event) {
	// 	event.target.playVideo();
	// }

	// let done = false;
	// function onPlayerStateChange(event) {
	// 	if (event.data == YT.PlayerState.PLAYING && !done) {
	// 		setTimeout(stopVideo, 6000);
	// 		done = true;
	// 	}
	// }
	// function stopVideo() {
	// 	player.stopVideo();
	// }

}

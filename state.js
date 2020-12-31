class State {

	static URL_PARAM_PLAYLIST = 'playlist-id';
	static URL_PARAM_PLAYLIST_TITLE = 'playlist-title';
	static URL_PARAM_VIDEO = 'video';

	#callback;
	constructor(callback) {
		this.#callback = callback;
	}

	async init() {
		const params = getUrlParams();

		if (params[State.URL_PARAM_PLAYLIST]) {
			await this.#callback('videos', {
				id: params[State.URL_PARAM_PLAYLIST],
				title: params[State.URL_PARAM_PLAYLIST_TITLE]
			});
		} else {
			await this.#callback('playlists');
		}
	}

}

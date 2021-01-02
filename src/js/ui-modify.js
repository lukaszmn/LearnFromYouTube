class UiModify {

	#auth;
	#api
	#player;

	constructor(auth, player) {
		this.#auth = auth;
		this.#player = player;
		this.#api = new Api(this.#auth);
	}

	static #CSS_PLAYLISTS = Object.freeze({
		OUTER: '#playlists',
		LIST: '#playlists__list',
	});

	static #CSS_VIDEOS = Object.freeze({
		OUTER: '#videos',
		LIST: '#videos__list',
		TITLE: '#videos__playlist_title',
	});

	async showPlaylists() {
		const ui = UiModify.#CSS_PLAYLISTS;
		show(ui.OUTER);
		hide(UiModify.#CSS_VIDEOS.OUTER);

		clear(ui.LIST);
		const root = $(ui.LIST);

		const playlists = await this.#api.getPlaylists();
		for (const item of playlists) {
			const url = `#${State.URL_PARAM_PLAYLIST}=${item.id}&` +
				`${State.URL_PARAM_PLAYLIST_TITLE}=${item.title}`;

			const el = document.createElement('li');
			el.innerHTML = `<a href="${url}">${item.title} (${item.count})</a>`;
			root.appendChild(el);
		}
	}

	async showVideos(playlistId, playlistTitle) {
		const ui = UiModify.#CSS_VIDEOS;
		hide(UiModify.#CSS_PLAYLISTS.OUTER);
		show(ui.OUTER);

		$(ui.TITLE).innerText = playlistTitle;

		clear(ui.LIST);
		const root = $(ui.LIST);

		const videos = await this.#api.getVideos(playlistId);
		let index = 1;
		for (const item of videos) {
			const url = `#${State.URL_PARAM_PLAYLIST}=${playlistId}&` +
				`${State.URL_PARAM_PLAYLIST_TITLE}=${playlistTitle}&` +
				`${State.URL_PARAM_VIDEO}=${item.videoId}`;

			const el = document.createElement('li');
			el.innerHTML = `<a href="${url}" class="videos__item" data-videoid="${item.videoId}">
				<div class="videos__item__index">${index++}</div>
				<img src="${item.thumbnail.url}" style="width: ${item.thumbnail.width}px; height: ${item.thumbnail.height}px" class="videos__item__image" loading="lazy" />
				<div class="videos__item__title">${item.title}</div>
			</a>`;
			root.appendChild(el);
		}
	}

	loadVideo(id) {
		this.#player.play(id);

		// select video
		const CLASS_SELECTED = 'videos__item--selected';
		const prevSelected = $(`.videos__item.${CLASS_SELECTED}`);
		if (prevSelected)
			prevSelected.classList.remove(CLASS_SELECTED);

		$$('.videos__item')
			.filter(item => item.dataset.videoid === id)
			.forEach(item => item.classList.add(CLASS_SELECTED));
	}

}

class Controller {

	#status;
	#auth = new Auth();
	#state = new State((name, params) => this.#stateChanged(name, params));
	#player = new Player();
	#ui = new UiModify(this.#auth, this.#player);

	async init() {
		this.#status = new Status($('#status'));

		click('#play', () => this.#play());
		click('#addBookmark', () => this.#addBookmark());
		click('#darken', darken);
		click('#login', () => this.#login());
		click('#logout', () => this.#logout());

		await this.#auth.init();
		await this.#auth.login();

		try {
			await this.#state.init();
			hide('#login');
		} catch (UnauthorizedException) {
			hide('#logout');
		}

		window.addEventListener('hashchange', () => this.#state.init());
	}

	#play() {
		// TODO
	}

	async #login() {
		await this.#auth.login();
		document.location.reload();
	}

	async #logout() {
		await this.#auth.logout();
		document.location.reload();
	}

	#addBookmark() {
		const time = this.#player.getTime();
		const userTime = TimeToUser(time);

		this.#status.show(`The bookmark has been added at ${userTime} / ${time} s`);
		this.#player.setTime(400);
	}

	async #stateChanged(name, params) {
		switch (name) {
			case 'playlists': await this.#ui.showPlaylists(); break;
			case 'videos': await this.#ui.showVideos(params.id, params.title); break;
			case 'video': this.#ui.loadVideo(params.id); break;
		}
	}

}

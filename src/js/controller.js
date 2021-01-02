class Controller {

	#status;
	#auth = new Auth();
	#state = new State((name, params) => this.#stateChanged(name, params));
	#player = new Player();
	#ui = new UiModify(this.#auth, this.#player);
	#speed = new Speed(this.#player);
	#positionElement;

	async init() {
		this.#status = new Status($('#status'));
		this.#positionElement = $('#position');

		click('#play', () => this.#play());
		click('#addBookmark', () => this.#addBookmark());
		click('#darken', darken);

		click('#speedDown', () => this.#speed.decrease());
		click('#speedUp', () => this.#speed.increase());

		click('#fast-backward', () => this.#pan(-30));
		click('#backward', () => this.#pan(-5));
		click('#forward', () => this.#pan(5));
		click('#fast-forward', () => this.#pan(30));

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

		this.#updatePosition();
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
		this.#speed.reset();
		switch (name) {
			case 'playlists': await this.#ui.showPlaylists(); break;
			case 'videos': await this.#ui.showVideos(params.id, params.title); break;
			case 'video': this.#ui.loadVideo(params.id); break;
		}
	}

	#updatePosition() {
		setInterval(() => this.#updatePositionNow(), 1000);
	}

	#updatePositionNow() {
		try {
			const time = this.#player.getTime();
			const duration = this.#player.getDuration();
			this.#positionElement.innerText = `${TimeToUser(time)} / ${TimeToUser(duration)}`;
		} catch {}
	}

	#pan(deltaSeconds) {
		const prevTime = this.#player.getTime();
		const newTime = prevTime + deltaSeconds;
		this.#player.setTime(newTime);
		this.#updatePositionNow();
	}

}

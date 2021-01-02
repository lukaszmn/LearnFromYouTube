class Speed {

	static #MIN = 0.25;
	static #MAX = 2;
	static #STEP = 0.25;
	#speed = 1;
	#player;

	constructor(player) {
		this.#player = player;
	}

	reset() {
		this.#speed = 1;
		this.#show();
	}

	increase() {
		this.#update(true);
	}

	decrease() {
		this.#update(false);
	}

	#update(add) {
		this.#speed += add ? Speed.#STEP : -Speed.#STEP;

		if (this.#speed > Speed.#MAX)
			this.#speed = Speed.#MAX;
		else if (this.#speed < Speed.#MIN)
			this.#speed = Speed.#MIN;

		this.#show();
	}

	#show() {
		const display = this.#speed === 1 ? '' : this.#speed;

		$('#speed .details').innerText = display;

		if (display === '')
			$('#speed').classList.remove('with-value');
		else
			$('#speed').classList.add('with-value');

		try {
			this.#player.setSpeed(this.#speed);
		} catch {}
	}
}

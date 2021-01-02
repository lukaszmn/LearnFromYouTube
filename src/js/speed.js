class Speed {

	static #MIN = 0.25;
	static #MAX = 2;
	static #STEP = 0.25;
	static #CSS = Object.freeze({
		ICON: '#speed',
		DETAILS: '#speed .details',
		BTN_DEC: '#speedDown',
		BTN_INC: '#speedUp',
	});

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

		$(Speed.#CSS.DETAILS).innerText = display;

		if (display === '')
			$(Speed.#CSS.ICON).classList.remove('with-value');
		else
			$(Speed.#CSS.ICON).classList.add('with-value');

		try {
			this.#player.setSpeed(this.#speed);
		} catch {}

		$(Speed.#CSS.BTN_DEC).disabled = this.#speed === Speed.#MIN;
		$(Speed.#CSS.BTN_INC).disabled = this.#speed === Speed.#MAX;
	}
}

/** Shows disappearing status */
class Status {

	#statusElement;
	#delay;
	#statusTimeout;

	constructor(statusElement, delay) {
		this.#statusElement = statusElement;
		this.#delay = delay || 3000;
	}

	show(msg) {
		clearTimeout(this.#statusTimeout);
		this.#statusElement.innerText = msg;
		this.#statusTimeout = setTimeout(() => this.#statusElement.innerText = '', this.#delay);
	}

}

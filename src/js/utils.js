
/* DOM utils */
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return [...document.querySelectorAll(selector)]; }
function click(selector, fn) { $(selector).addEventListener('click', fn); }
function hide(selector) { $(selector).style.display = 'none'; }
function show(selector) { $(selector).style.display = 'block'; }
function clear(selector) { $(selector).innerHTML = ''; }

function getUrlParams() {
	const fragmentString = location.hash.substring(1);

	const params = {};
	const regex = /([^&=]+)=([^&]*)/g;
	let m;
	while (m = regex.exec(fragmentString)) {
		params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return params;
}

function TimeToUser(time) {
	const hrs = Math.floor(time / 3600);
	time -= hrs * 3600;
	const mins = Math.floor(time / 60);
	time -= mins * 60;
	const secs = time;

	const pad = s => ('0' + s).substr(-2);

	if (hrs > 0)
		return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
	else
		return `${pad(mins)}:${pad(secs)}`;
}

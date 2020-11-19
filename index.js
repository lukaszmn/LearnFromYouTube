let player;
// docs: https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		// videoId: 'M7lc1UVf-VE',
		events: {
			// 'onReady': onPlayerReady,
			// 'onStateChange': onPlayerStateChange
		}
	});
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

/* DOM utils */
function $(selector) { return document.querySelector(selector); }
function click(selector, fn) { $(selector).addEventListener('click', fn); }
function hide(selector) { $(selector).style.display = 'none'; }
function show(selector) { $(selector).style.display = 'block'; }

/* status */
let status;
let statusTimeout;
function setDisappearingStatus(msg) {
	clearTimeout(statusTimeout);
	status.innerText = msg;
	statusTimeout = setTimeout(() => status.innerText = '', 3000);
}

/* business utils */

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

/* init */

window.addEventListener('DOMContentLoaded', () => {
	status = $('#status');

	click('#play', play);
	click('#addBookmark', addBookmark);
	click('#darken', darken);
	click('#login', login);

	if (isLoggedIn()) {
		hide('#login');
		showPlaylists();
	} else {
		hide('#playlists');
	}
});

/* business logic */

function play() {
	player.loadVideoById('M7lc1UVf-VE');
}

function addBookmark() {
	const time = Math.round(player.playerInfo.currentTime);

	const userTime = TimeToUser(time);

	setDisappearingStatus(`The bookmark has been added at ${userTime} / ${time} s`);
	player.seekTo(400, true)
}

let darkenOpacity = 0;
function darken() {
	const rect = $('#player').getBoundingClientRect();
	const style = $('#dark-cover').style;
	style.left = rect.left + 'px';
	style.top = rect.top + 'px';
	style.width = rect.width + 'px';
	style.height = rect.height + 'px';

	let display;
	switch (darkenOpacity) {
		case 0: darkenOpacity = 0.3; display = 1; break;
		case 0.3: darkenOpacity = 0.5; display = 2; break;
		case 0.5: darkenOpacity = 0.7; display = 3; break;
		case 0.7: darkenOpacity = 0; display = ''; break;
	}
	style.opacity = darkenOpacity;

	style.display = darkenOpacity === 0 ? 'none' : 'block';

	$('#darken .details').innerText = display;
}

async function showPlaylists() {
	const root = $('#playlists__list');
	const playlists = await getPlaylists();
	for (const item of playlists) {
		const el = document.createElement('li');
		el.innerText = `${item.title} (${item.count})`;
		root.appendChild(el);
	}
}

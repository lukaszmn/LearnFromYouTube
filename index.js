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

const auth = new Auth();
const api = new Api(auth);
const state = new State(stateChanged);

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
function clear(selector) { $(selector).innerHTML = ''; }

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

window.addEventListener('DOMContentLoaded', async () => {
	status = $('#status');

	click('#play', play);
	click('#addBookmark', addBookmark);
	click('#darken', darken);
	click('#login', login);
	click('#logout', logout);

	await auth.init();
	await auth.login();

	try {
		await state.init();
		hide('#login');
	} catch (UnauthorizedException) {
		hide('#logout');
	}

	window.addEventListener('hashchange', () => state.init());
});

/* business logic */

async function login() {
	await auth.login();
	document.location.reload();
}

async function logout() {
	await auth.logout();
	document.location.reload();
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

const CSS_PLAYLISTS = {
	OUTER: '#playlists',
	LIST: '#playlists__list',
};
const CSS_VIDEOS = {
	OUTER: '#videos',
	LIST: '#videos__list',
	TITLE: '#videos__playlist_title',
};

async function showPlaylists() {
	show(CSS_PLAYLISTS.OUTER);
	hide(CSS_VIDEOS.OUTER);

	clear(CSS_PLAYLISTS.LIST);
	const root = $(CSS_PLAYLISTS.LIST);

	const playlists = await api.getPlaylists();
	for (const item of playlists) {
		const url = `#${State.URL_PARAM_PLAYLIST}=${item.id}&` +
			`${State.URL_PARAM_PLAYLIST_TITLE}=${item.title}`;

		const el = document.createElement('li');
		el.innerHTML = `<a href="${url}">${item.title} (${item.count})</a>`;
		root.appendChild(el);
	}
}

async function showVideos(playlistId, playlistTitle) {
	hide(CSS_PLAYLISTS.OUTER);
	show(CSS_VIDEOS.OUTER);

	$(CSS_VIDEOS.TITLE).innerText = playlistTitle;

	clear(CSS_VIDEOS.LIST);
	const root = $(CSS_VIDEOS.LIST);

	const videos = await api.getVideos(playlistId);
	let index = 1;
	for (const item of videos) {
		const url = `#${State.URL_PARAM_PLAYLIST}=${playlistId}&` +
			`${State.URL_PARAM_PLAYLIST_TITLE}=${playlistTitle}&` +
			`${State.URL_PARAM_VIDEO}=${item.id}`;

		const el = document.createElement('li');
		el.innerHTML = `<a href="${url}" class="videos__item">
			<div class="videos__item__index">${index++}</div>
			<img src="${item.thumbnail.url}" style="width: ${item.thumbnail.width}px; height: ${item.thumbnail.height}px" class="videos__item__image" loading="lazy" />
			<div class="videos__item__title">${item.title}</div>
		</a>`;
		root.appendChild(el);
	}
}

async function stateChanged(name, params) {
	switch (name) {
		case 'playlists': await showPlaylists(); break;
		case 'videos': await showVideos(params.id, params.title); break;
	}
}

// docs: https://developers.google.com/youtube/v3/docs/

function getApiUrl(url) {
	const suffix = url.includes('?') ? '&' : '?';
	url = 'https://www.googleapis.com/youtube/v3/' + url + suffix;
	return url + 'access_token=' + getAccessToken();
}

async function getPlaylists() {
	const res = await fetch(getApiUrl('playlists?mine=true&maxResults=50&part=snippet,contentDetails'));
	const playlists = await res.json();
	return playlists.items.map(item => ({
		id: item.id,
		title: item.snippet.title,
		count: item.contentDetails.itemCount,
	}));
}

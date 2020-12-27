// docs: https://developers.google.com/youtube/v3/docs/
class Api {

	#auth;
	constructor(auth) { this.auth = auth; }

	#getApiUrl(url) {
		const suffix = url.includes('?') ? '&' : '?';
		return 'https://www.googleapis.com/youtube/v3/' + url + suffix + 'access_token=' + this.auth.getAccessToken();
	}

	async getPlaylists() {
		const url = this.#getApiUrl('playlists?mine=true&maxResults=50&part=snippet,contentDetails');
		const res = await fetch(url);
		if (!res.ok && (res.status === 401 || res.status === 403))
			throw new UnauthorizedException();

		const playlists = await res.json();
		return playlists.items.map(item => ({
			id: item.id,
			title: item.snippet.title,
			count: item.contentDetails.itemCount,
		}));
	}

}

class UnauthorizedException {}

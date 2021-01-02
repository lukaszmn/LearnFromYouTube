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
		const playlists = await Api.#retrieveAll(url);

		return playlists.map(item => ({
			id: item.id,
			title: item.snippet.title,
			count: item.contentDetails.itemCount,
		}));
	}

	async getVideos(playlistId) {
		const url = this.#getApiUrl(`playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}`);
		const videos = await Api.#retrieveAll(url);

		return videos.map(item => ({
			...item,
			thumb: item.snippet.thumbnails.default || {
				url: null,
				width: 0,
				height: 0,
			}
		})).map(item => ({
			id: item.id,
			title: item.snippet.title,
			description: item.snippet.description,
			thumbnail: {
				url: item.thumb.url,
				width: item.thumb.width,
				height: item.thumb.height,
			},
			position: item.snippet.position,
			videoId: item.snippet.resourceId.videoId,
		}));
	}

	static async #retrieveAll(url) {
		const data = [];

		let pageToken = null;
		do {
			const pageUrl = pageToken ? `${url}&pageToken=${pageToken}` : url;
			const res = await fetch(pageUrl);
			if (res.status === 401 || res.status === 403)
				throw new UnauthorizedException();

			const json = await res.json();
			data.push(...json.items);
			pageToken = json.nextPageToken;
		} while (pageToken);

		return data;
	}

}

class UnauthorizedException {}

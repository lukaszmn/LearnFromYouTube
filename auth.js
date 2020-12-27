// manage: https://console.developers.google.com/apis/

// (C) https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#oauth-2.0-endpoints_4
// with my changes
class Auth {

	static #OAUTH_STATE_KEY = 'state';
	static #OAUTH_STATE_VALUE = 'authorized';
	static #OAUTH_TOKEN_KEY = 'access_token';
	static #STORAGE_TOKEN_KEY = 'access_token';

	init() {
		const fragmentString = location.hash.substring(1);

		// Parse query string to see if page request is coming from OAuth 2.0 server.
		const params = {};
		const regex = /([^&=]+)=([^&]*)/g;
		let m;
		while (m = regex.exec(fragmentString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		if (Object.keys(params).length > 0) {
			if (params[Auth.#OAUTH_STATE_KEY] === Auth.#OAUTH_STATE_VALUE) {
				localStorage.setItem(Auth.#STORAGE_TOKEN_KEY, params[Auth.#OAUTH_TOKEN_KEY] );
				this.login();
			}
		}
	}

	// If there's an access token, try an API request.
	// Otherwise, start OAuth 2.0 flow.
	login() {
		const accessToken = this.getAccessToken();
		if (accessToken) {
			const xhr = new XMLHttpRequest();
			xhr.open('GET',
					'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&' +
					`${Auth.#OAUTH_TOKEN_KEY}=${accessToken}`);
			xhr.onreadystatechange = function (e) {
				if (xhr.readyState === 4 && xhr.status === 200) {
					console.log(xhr.response);
				} else if (xhr.readyState === 4 && xhr.status === 401) {
					// Token invalid, so prompt for user permission.
					this.#oauth2SignIn();
				}
			};
			xhr.send(null);
		} else {
			this.#oauth2SignIn();
		}
	}

	getAccessToken() {
		return localStorage.getItem(Auth.#STORAGE_TOKEN_KEY);
	}

	/* Create form to request access token from Google's OAuth 2.0 server. */
	#oauth2SignIn() {
		// Google's OAuth 2.0 endpoint for requesting an access token
		var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

		// Create element to open OAuth 2.0 endpoint in new window.
		var form = document.createElement('form');
		form.setAttribute('method', 'GET'); // Send as a GET request.
		form.setAttribute('action', oauth2Endpoint);

		// Parameters to pass to OAuth 2.0 endpoint.
		var params = {
			'client_id': YT_CLIENT_ID,
			'redirect_uri': YT_REDIRECT_URI,
			'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
			'include_granted_scopes': 'true',
			'response_type': 'token'
		};
		params[Auth.#OAUTH_STATE_KEY] = Auth.#OAUTH_STATE_VALUE;

		// Add form parameters as hidden input values.
		for (var p in params) {
			var input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', p);
			input.setAttribute('value', params[p]);
			form.appendChild(input);
		}

		// Add form to page and submit it to open the OAuth 2.0 endpoint.
		document.body.appendChild(form);
		form.submit();
	}
}

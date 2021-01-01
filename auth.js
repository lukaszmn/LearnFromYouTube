// manage: https://console.developers.google.com/apis/

// (C) https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#oauth-2.0-endpoints_4
// with my changes
class Auth {

	static #OAUTH_STATE_KEY = 'state';
	static #OAUTH_STATE_VALUE = 'authorized';
	static #OAUTH_TOKEN_KEY = 'access_token';
	static #STORAGE_TOKEN_KEY = 'access_token';
	static #STORAGE_EMAIL_KEY = 'email';
	static #AUTH_SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl email';

	async init() {
		// Parse query string to see if page request is coming from OAuth 2.0 server.
		const params = getUrlParams();
		if (params[Auth.#OAUTH_STATE_KEY] === Auth.#OAUTH_STATE_VALUE) {
			localStorage.setItem(Auth.#STORAGE_TOKEN_KEY, params[Auth.#OAUTH_TOKEN_KEY] );
			await this.login();
			await this.#storeEmail();
		}
	}

	async login() {
		const accessToken = this.getAccessToken();
		if (!accessToken) {
			this.#oauth2SignIn();
			return;
		}

		const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&${Auth.#OAUTH_TOKEN_KEY}=${accessToken}`;
		const res = await fetch(url);
		if (res.status === 401) {
			// Token invalid, so prompt for user permission.
			this.#oauth2SignIn();
		}
	}

	getAccessToken() {
		return localStorage.getItem(Auth.#STORAGE_TOKEN_KEY);
	}

	/* Create form to request access token from Google's OAuth 2.0 server. */
	#oauth2SignIn() {
		const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

		const form = document.createElement('form');
		form.setAttribute('method', 'GET');
		form.setAttribute('action', oauth2Endpoint);

		// https://developers.google.com/identity/protocols/oauth2/openid-connect#response-type
		const params = {
			'client_id': YT_CLIENT_ID,
			'redirect_uri': YT_REDIRECT_URI,
			'scope': Auth.#AUTH_SCOPE,
			'include_granted_scopes': 'true',
			'response_type': 'token',
			// 'access_type': 'offline', - only for response_type=code
			// 'immediate': 'true',
			// 'prompt': 'consent',
		};
		params[Auth.#OAUTH_STATE_KEY] = Auth.#OAUTH_STATE_VALUE;

		const email = localStorage.getItem(Auth.#STORAGE_EMAIL_KEY);
		if (email)
			params['login_hint'] = email;


		for (let p in params) {
			const input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', p);
			input.setAttribute('value', params[p]);
			form.appendChild(input);
		}

		document.body.appendChild(form);
		form.submit();
	}

	async logout() {
		const accessToken = this.getAccessToken();
		const url = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;
		await fetch(url);
	}

	async #storeEmail() {
		localStorage.removeItem(Auth.#STORAGE_EMAIL_KEY);

		const url = `https://openidconnect.googleapis.com/v1/userinfo?${Auth.#OAUTH_TOKEN_KEY}=${this.getAccessToken()}`;
		const res = await fetch(url);
		if (!res.ok)
			return;

		const json = await res.json();
		const email = json.email;
		localStorage.setItem(Auth.#STORAGE_EMAIL_KEY, email);
	}

}

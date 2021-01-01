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

const build = require('simple-build-kit');

const DIST = 'dist/';

build.copy('src/index.html', DIST);
build.copy('src/style.css', DIST);

const jsFiles = [
	'yt-key.js',
	'src/js/utils.js',
	'src/js/auth.js',
	'src/js/api.js',
	'src/js/state.js',
	'src/js/index.js',
];

const jsContent = build.concat(jsFiles);
build.save(DIST + '/index.js', jsContent);

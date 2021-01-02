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

	if (display === '')
		$('#darken').classList.remove('initial-font');
	else
		$('#darken').classList.add('initial-font');
}

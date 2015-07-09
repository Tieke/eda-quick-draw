function getShitOuttaHere() {
	$('body').addClass('animated').addClass('fadeOutUp');
}

$('body').on('click', '.button_to', function (e) {
	getShitOuttaHere();
	
})
$.mobile.defaultPageTransition = 'slide';

$(document).ready(function(){

	$('#J_welcomecarousel').find('.item').height($(window).height());
	$('#J_welcomecarousel').owlCarousel({
		items : 3,
		navigation : false,
		singleItem : true
	});

	CTRL.init();
});
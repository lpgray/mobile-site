$.mobile.defaultPageTransition = 'slide';

$(document).ready(function(){
	//welcome carousel
	$('#J_welcomecarousel').find('.item').height($(window).height());
	$('#J_welcomecarousel').owlCarousel({
		items : 3,
		navigation : false,
		singleItem : true
	});

	//carousel init
	// $('#J_owl').owlCarousel({
	// 	navigation : false,
	// 	slideSpeed : 300,
	// 	pageinationSpeed : 3000,
	// 	singleItem : true,
	// 	autoPlay : true
	// });

	//baidu map init
	// var map = new BMap.Map("J_mapctn");  
	// map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);

	CTRL.init();
});
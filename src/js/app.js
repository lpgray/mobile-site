$.mobile.defaultPageTransition = 'none';

$(document).ready(function(){

	$('#J_welcomecarousel').find('.item').height($(window).height());
	$('#J_welcomecarousel').owlCarousel({
		items : 3,
		navigation : false,
		singleItem : true
	});

	// Init Search Autocomplete
	$( document ).on( "pagecreate", "#J_pagehome", function() {
	    $( "#J_searchAutoListView" ).on( "filterablebeforefilter", function ( e, data ) {
	        var $ul = $( this ),
	            $input = $( data.input ),
	            value = $input.val(),
	            html = "";
	        $ul.html( "" );
	        if ( value && value.length > 2 ) {
	            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
	            $ul.listview( "refresh" );
	            $.ajax({
	                url: "http://gd.geobytes.com/AutoCompleteCity",
	                dataType: "jsonp",
	                crossDomain: true,
	                data: {
	                    q: $input.val()
	                }
	            })
	            .then( function ( response ) {
	                $.each( response, function ( i, val ) {
	                    html += "<li>" + val + "</li>";
	                });
	                $ul.html( html );
	                $ul.listview( "refresh" );
	                $ul.trigger( "updatelayout");
	            });
	        }
	    });
	});

	// Init ms-touch-nav
	$('.ms-touch-nav').each(function() {
		var $self = $(this);
		var number = $self.data('items-number') || 5;
		$self.owlCarousel({
			items: number,
			itemsTablet: [600, number],
			itemsMobile: false,
			pagination: false
		});
		$self.find('.item').bind('click tap', function(){
			var $this = $(this);
			$self.find('.item').removeClass('active');
			$this.addClass('active');
			$self.trigger('ms-nav-selected', [$this.data('rel')]);
		});
	});

	// Init Page Controller
	CTRL.init();

	// Init Event Center
	EVENT.init();

});
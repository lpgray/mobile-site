(function(global){
	function errorHandler(data){

	}

	function query(url, callback){
		$.get(url, function(data){
			if(!data.r){
				errorHandler(data);
				return;
			}

			callback(data);
		}, 'json');
	}

	var PAGE_LOAD_CALLBACKS = {
		'J_pagehome' : function(){
			query('assets/moke/home.json', function(data){
				// if owl has inited then return.
				if($('#J_owl').data('owl-init') === true){
					return;
				}
				// fill carousel
				$('#J_owl').html($('#J_tmplCarousel').tmpl(data.b.carousel));
				// refresh carousel
				$('#J_owl').owlCarousel({
					navigation : false,
					slideSpeed : 300,
					pageinationSpeed : 3000,
					singleItem : true,
					autoPlay : true
				});
				// fill topnews
				$('#J_pageHomeTopnews').html($('#J_tmplTopNews').tmpl(data.b.topnews));
				// refresh listview
				$('#J_pageHomeTopnews').listview('refresh');
			});
		}
	}

	var ctrl = {
		init : function(){
			$('body').on('pagechange', function(e, o){
				PAGE_LOAD_CALLBACKS[o.toPage[0].id] && PAGE_LOAD_CALLBACKS[o.toPage[0].id].call();
			});
		}
	}

	global.CTRL = ctrl;
}(window));
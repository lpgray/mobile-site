(function(global){
	var URL_PREFIX = 'assets/moke/';

	function errorHandler(data){

	}

	function query(url, callback){
		$.get(URL_PREFIX + url, function(data){
			if(!data.r){
				errorHandler(data);
				return;
			}

			callback(data);
		}, 'json');
	}

	var PAGE_LOAD_CALLBACKS = {
		'J_pagehome' : function(){
			query('home.json', function(data){
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
		},
		'J_pagearticle' : function(pageTitle){
			query('article.json', function(data){
				// console.info(data);
				// fill page title
				$('#J_articlePageTitle').html('阅读文章');
				// fill article
				$('#J_article').html($('#J_tmplArticle').tmpl(data.b));
			});
		}
	}

	var ctrl = {
		init : function(){
			$('body').on('pagechange', function(e, o){
				// console.info(o);
				PAGE_LOAD_CALLBACKS[o.toPage[0].id] && PAGE_LOAD_CALLBACKS[o.toPage[0].id].call();
			});
		}
	}

	global.CTRL = ctrl;
}(window));
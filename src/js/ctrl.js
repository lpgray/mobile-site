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

	function getUrlParam(paramName, url) {
		var target = url || this.location.search;
		var paramValue = "";
		var isFound = false;
		if (target.indexOf("?") == 0 && target.indexOf("=") > 1) {
			arrSource = unescape(target).substring(1, target.length).split("&");
			i = 0;
			while (i < arrSource.length && !isFound) {
				if (arrSource[i].indexOf("=") > 0) {
					if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
						paramValue = arrSource[i].split("=")[1];
						isFound = true;
					}
				}
				i++;
			}
		}
		return paramValue;
	};

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
				// fill page title
				$('#J_articlePageTitle').html('阅读文章');
				// fill article
				$('#J_article').html($('#J_tmplArticle').tmpl(data.b));
			});
		},
		'J_pagenews' : function(){
			// load enterprise news
			query('article-list-1.json', function(data){
				$('#J_enterpriseNews').html($('#J_tmplArticleList').tmpl(data.b));
				$('#J_enterpriseNews').listview('refresh');
			});
			// load biz news
			query('article-list-2.json', function(data){
				$('#J_bizNews').html($('#J_tmplArticleList').tmpl(data.b));
				$('#J_bizNews').listview('refresh');
			});
		},
		'J_pageproduct' : function(){
			// product list
			query('product-list.json', function(data){
				for(var i = 0, l = data.b.length; i < l ; i++){
					if((i + 1)%2 === 0){
						data.b[i].sub = 'b';
					}else{
						data.b[i].sub = 'a';
					}
				}
				$('#J_productList').html($('#J_tmplProductList').tmpl(data.b));
			});
		},
		'J_pageProductDetail' : function(){
			query('product.json', function(data){
				for(var i = 0, l = data.b.imgs.length; i < l ; i++){
					if((i + 1)%2 === 0){
						data.b.imgs[i].sub = 'b';
					}else if((i+1)%3 === 0){
						data.b.imgs[i].sub = 'c';
					}else{
						data.b.imgs[i].sub = 'a';
					}
				}
				// thumnails & popups
				$('#J_productDetailList').html($('#J_tmplProductDetailList').tmpl(data.b));
				$('#J_productPopupCtn').html($('#J_tmplProductPopupList').tmpl(data.b));
				$('#J_productPopupCtn').children().popup();
				// article
				$('#J_productDetailTitle').html(data.b.title);
				$('#J_productDetailSummary').html('发布者:' + data.b.author + '  ' + '发布于:' + data.b.timestamp);
				$('#J_productArticle').html(data.b.content);
			});
		}
	}

	var ctrl = {
		init : function(){
			$(window).on('pagechange', function(e, o){
				console.info(o);
				PAGE_LOAD_CALLBACKS[o.toPage[0].id] && PAGE_LOAD_CALLBACKS[o.toPage[0].id].call();
			});
		}
	}

	global.CTRL = ctrl;
}(window));
(function(global){
	var URL_PREFIX = 'assets/moke/';
	var PARAMS_HISTORY_LOCALSTORAGE = 'param_history';

	function errorHandler(data){
		$.mobile.loading('hide');
	}

	function query(url, callback, params){
		$.mobile.loading('show', {
			text: '',
			textVisible: true,
	        theme: 'a',
	        textonly: true,
	        html : '<div class="ms-loading"></div>加载中...'
		});

		$.get(URL_PREFIX + url + '?d=' + new Date, params, function(data){
			if(!data.r){
				errorHandler(data);
				return;
			}

			callback(data);
			$.mobile.loading('hide');
		}, 'json');
	}

	function insert(url, callback, params){
		$.mobile.loading('show', {
			text: '',
			textVisible: true,
	        theme: 'a',
	        textonly: true,
	        html : '<div class="ms-loading"></div>正在提交...'
		});

		$.post(URL_PREFIX + url, params, function(data){
			if(!data.r){
				errorHandler(data);
				return;
			}
			
			callback(data);
			$.mobile.loading('hide');
		}, 'json');
	}

	function getUrlParams(url){
		var target = url;
		var back = null;
		if (target.indexOf("?") > -1 && target.indexOf("=") > -1) {
			var arrSource = unescape(target).substring(target.indexOf("?") + 1, target.length).split("&");
			var i = 0;
			if(arrSource.length){
				back = {};
			}
			while (i < arrSource.length) {
				if (arrSource[i].indexOf("=") > 0) {
					var srcMap = arrSource[i].split('=');
					back[srcMap[0]] = srcMap[1];
				}
				i++;
			}
		}
		return back;
	}

	var validation = {
		username : function(val){
			if($.trim(val)){
				return {r : 1};
			}else{
				return {r : 0, m : '请输入您的昵称'};
			}
		},
		content : function(val){
			if($.trim(val)){
				return {r : 1};
			}else{
				return {r : 0, m : '请输入评论内容'};
			}
		},
		phone : function(val){
			var regexp = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
			if(regexp.test(val)){
				return {r : 1};
			}else{
				return {r : 0, m : '手机号格式输入错误'};
			}
		}
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
				//baidu map init
				if($('#J_mapctn').data('bmap-inited') == 1){
					return;
				}
				$('#J_mapctn').data('bmap-inited', 1);
				var map = new BMap.Map("J_mapctn");
				map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
				// bind telphone call
				$('#J_linkCall').click(function(){
					return confirm('现在转到播电话的界面吗？');
				});
			});
		},
		// 'J_pagecontact' : function(){
			
		// },
		'J_pagearticle' : function(params){
			query('article.json', function(data){
				// fill page title
				$('#J_articlePageTitle').html('阅读文章');
				// fill article
				$('#J_article').html($('#J_tmplArticle').tmpl(data.b));
			}, params);
		},
		'J_pagenews' : function(){
			// load enterprise news
			query('article-list-1.json', function(data){
				$('#J_enterpriseNews').html($('#J_tmplArticleList').tmpl(data.b.list));
				$('#J_enterpriseNews').listview('refresh');
			}, {type : 1});

			// load biz news
			query('article-list-2.json', function(data){
				$('#J_bizNews').html($('#J_tmplArticleList').tmpl(data.b.list));
				$('#J_bizNews').listview('refresh');
			}, {type : 2});
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
			// clear the detail page
			$('#J_pageProductDetail').find('.j_data_content').html('');
		},
		'J_pageProductDetail' : function(params){
			// query the product introduction
			query('product'+params.id+'.json', function(data){
				// article
				$('#J_productDetailTitle').html(data.b.title);
				$('#J_productDetailSummary').html('发布者:' + data.b.author + '  ' + '发布于:' + data.b.timestamp);
				$('#J_productArticle').html(data.b.content);

				// add index & sub to images
				for(var i = 0, l = data.b.imgs.length; i < l ; i++){
					data.b.imgs[i].index = i;
					if((i + 1)%2 === 0){
						data.b.imgs[i].sub = 'b';
					}else if((i+1)%3 === 0){
						data.b.imgs[i].sub = 'c';
					}else{
						data.b.imgs[i].sub = 'a';
					}
				}
				// thumnails
				$('#J_productDetailList').html($('#J_tmplProductDetailList').tmpl(data.b));
				// image preview page render
				var $imagePreviewOwl = $('#J_imagePreviewOwl');
				if($imagePreviewOwl.data('owl-init') && $imagePreviewOwl.data('pid') == params.id){
					$imagePreviewOwl.css('opacity','0');
					return;
				}
				$imagePreviewOwl.data('owl-init', false);
				$imagePreviewOwl.data('pid', params.id);
				$imagePreviewOwl.html($('#J_tmplImageCarousel').tmpl(data.b.imgs));
				$imagePreviewOwl.owlCarousel({
					navigation : false,
					singleItem : true,
					lazyFollow : false
				});

				$imagePreviewOwl.css('opacity','0');
			}, params);
		},
		'J_pageboard' : function(params){
			query('feed-list.json', function(data){
				$('#J_feedList').html($('#J_tmplFeedList').tmpl(data.b));
				$('#J_feedList').listview('refresh');
			}, params);
		},
		'J_pagefeed' : function(){
			// clear form
			var $form = $('#J_feedForm');
			$form.find('textarea').val('');
			// form validate & errorTip
			var $username = $form.find('input[name=user]');
			var $phone = $form.find('input[name=phone]');
			var $genderWrap = $form.find('div[name=gender]');
			var $content = $form.find('textarea[name=content]');
			
			var inputs = [];
			inputs[0] = $username;
			inputs[1] = $phone;
			inputs[2] = $content;

			function validate(){
				for (var i = 0; i < 3; i++) {
					var $self = inputs[i];
					var result = validation[$self.data('validate')].call($self, $self.val());
					if (!result.r) {
						alert(result.m);
						return false;
					}
				}
				return true;
			}

			// bind submit
			var $trigger = $('#J_btnPostFeed');
			if($trigger.data('submitBinded')){
				return;
			}

			$trigger.data('submitBinded', 1);
			$trigger.click(function(){
				if(!validate()){
					return;
				}

				// make params
				var params = {
					username : $username.val(),
					phone : $phone.val(),
					content : $content.val()
				}

				insert('feed-insert.json', function(data){
					// go back to the previous page
					history.back();
					// save username gender phoneNumber to the localstorage
				}, params);
			});
		},
		'J_pagepartners' : function(){
			query('partners-list.json', function(data){
				for(var i = 0, l = data.b.length; i < l ; i++){
					if((i + 1)%2 === 0){
						data.b[i].sub = 'b';
					}else{
						data.b[i].sub = 'a';
					}
				}
				$('#J_partnersList').html($('#J_tmplPartnersList').tmpl(data.b));
			});
		},
		'J_pageenterprice' : function(){
			// query timeline
			query('enterprise-timeline.json', function(data){
				var tmpl = '<div class="spine"></div>';

				for(var year in data.b){
					tmpl += '<div class="separator">';
					tmpl += '	<div class="separator-inner">';
					tmpl += '		<p>'+ year +'</p>';
					tmpl += '	</div>';
					tmpl += '</div>';
					
					for(var i = 0, l = data.b[year].length; i < l ; i++){
						var item = data.b[year][i];
						
						if(i % 2 === 0){
							var klass = 'column-left';
						}else{
							var klass = 'column-right';
						}
						
						tmpl += '<div class="column '+klass+'">';
						tmpl += '	<div class="column-inner">';
						if(item.time){
							tmpl += '	<time class="ms-theme-color-red">'+item.time+'</time>';
						}
						tmpl += item.content;
						tmpl += '	</div>';
						tmpl += '</div>';
					}
				}

				$('#J_enterpriseTimeline').html(tmpl);
			});
			// query article1
			query('enterprise-biz.json', function(data){
				$('#J_biz').html(data.b.content);
			}, {id : 'enterprisebiz'});

			// query article2
			query('enterprise-art.json', function(data){
				$('#J_art').html(data.b.content);
			}, {id : 'enterpriseart'});
		},
		'J_pageImagePreview' : function(params){
			var $imagePreviewOwl = $('#J_imagePreviewOwl');
			var owl = $imagePreviewOwl.data('owlCarousel');
			owl.jumpTo(params.index);
			var top = -parseInt($imagePreviewOwl.height()/2);
			$imagePreviewOwl.css({'margin-top':top});
			$imagePreviewOwl.css({'opacity':1});
		}
	}

	function pageChange(pageId, params){
		// if params is null
		// then get the latest successful excuted params
		// else save the params in the localStorage for next time
		if(!params){
			params = getParams(pageId);
		}else{
			saveParams(pageId, params);
		}

		PAGE_LOAD_CALLBACKS[pageId] && PAGE_LOAD_CALLBACKS[pageId].call(params, params);
	}

	var ctrl = {
		init : function(){
			$(window).on('pagechange', function(e, o){
				var params = getUrlParams(o.absUrl);
				var pageId = o.toPage[0].id;
				pageChange(pageId, params);
			});

			// $('[data-swipe-left=history]').bind('swiperight', function(e){
			// 	alert('swipe left');
			// 	history.back();
			// });
		}
	}

	global.CTRL = ctrl;

	/**
	 * Page Change Parameters History in LocalStorage
	 */
	var paramsHistory = localStorage.getItem(PARAMS_HISTORY_LOCALSTORAGE);
	if(!paramsHistory){
		localStorage.setItem(PARAMS_HISTORY_LOCALSTORAGE, JSON.stringify({}));
		paramsHistory = JSON.parse(localStorage.getItem(PARAMS_HISTORY_LOCALSTORAGE));
	}else{
		paramsHistory = JSON.parse(paramsHistory);
	}
	function saveParams(pageKey, params){
		paramsHistory[pageKey] = params;
		localStorage.setItem(PARAMS_HISTORY_LOCALSTORAGE, JSON.stringify(paramsHistory));
	}
	function getParams(pageKey){
		return paramsHistory[pageKey];
	}

}(window));
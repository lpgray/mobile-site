(function(global){
	var URL_PREFIX = 'assets/moke/';

	function errorHandler(data){
		$.mobile.loading('hide');
	}

	function query(url, callback, params){
		$.mobile.loading('show', {
			text: '正在努力加载...',
			textVisible: true,
	        theme: 'a',
	        textonly: false,
		});

		params && (params['_reqTime'] = new Date)

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
			text: '正在提交...',
			textVisible: true,
	        theme: 'a',
	        textonly: false,
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

	function getUrlParamMap(url){
		var target = url;
		var back = {};
		if (target.indexOf("?") > -1 && target.indexOf("=") > -1) {
			var arrSource = unescape(target).substring(target.indexOf("?") + 1, target.length).split("&");
			var i = 0;
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
			});
		},
		'J_pagecontact' : function(){
			//baidu map init
			if($('#J_mapctn').data('bmap-inited') == 1){
				return;
			}
			$('#J_mapctn').data('bmap-inited', 1);
			var map = new BMap.Map("J_mapctn");
			map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
		},
		'J_pagearticle' : function(paramMap){
			query('article.json', function(data){
				// fill page title
				$('#J_articlePageTitle').html('阅读文章');
				// fill article
				$('#J_article').html($('#J_tmplArticle').tmpl(data.b));
			}, paramMap);
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
		'J_pageProductDetail' : function(params){
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
			});

			// query article2
			query('enterprise-art.json', function(data){
				$('#J_art').html(data.b.content);
			});
		}
	}

	var ctrl = {
		init : function(){
			$(window).on('pagechange', function(e, o){
				// console.info(o);
				var paramMap = getUrlParamMap(o.absUrl);
				PAGE_LOAD_CALLBACKS[o.toPage[0].id] && PAGE_LOAD_CALLBACKS[o.toPage[0].id].call(o, paramMap);
			});
		}
	}

	global.CTRL = ctrl;
}(window));
var EVENT = (function() {
	var topics = {},
        subUid = -1;

	return {
		init: function() {
			var $window = $(window);

			window.onscroll = function() {
				var wH = $window.height();
				var outerHeight = $(document).height();
				var wScroll = $window.scrollTop();

				if (wScroll <= 0) {
					return;
				}

				if (wH + wScroll >= outerHeight) {
					EVENT.publish('towindowbottom');
					console.info('towindowbottom!!!');
				}
			}
		},
		publish: function(topic, args) {
			if (!topics[topic]) {
				return false
			}

			var subscribers = topics[topic],
				len = subscribers ? subscribers.length : 0;
			while (len--) {
				subscribers[len].func(topic, args);
			}
		},
		subscribe: function(topic, func) {
			if (!topics[topic]) {
				topics[topic] = [];
			}

			var token = (++subUid).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},
		unsubscribe: function(token) {
			for (var i in topics) {
				if (topics[i]) {
					for (var j = 0, len = topics[i].length; j < len; j++) {
						if (topics[i][j].token == token) {
							topics[i].splice(j, 1);
							return token;
						}
					}
				}
			}
		}
	}
}());
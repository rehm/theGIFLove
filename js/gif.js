jQuery.fn.extend({
	initGif: function(options) {
		// settings
		var settings;
		settings = {
			blogName: "thecodinglove.tumblr.com",
			appKey: "KEY",
			timeout: 15
		};
		settings = $.extend(settings, options);

		// Handles the countdown and triggers the loading of new gif
		function countdown(_this){
			$(_this).find('*[data-countdown]').each(function(key, val){
				var timeLeft = $(val).attr('data-countdown');
				if (timeLeft > 1) {
					// update timer
					timeLeft--;
					$(val).attr('data-countdown', timeLeft);
					$(_this).find('.countdown').html(timeLeft);

					setTimeout(function(){
						countdown(_this);
					}, 1000);
				} else {
					// fetch new animation
					timeLeft--;
					$(_this).find('.countdown').html(timeLeft);
					fetchGif(_this);
				}
			});
		}

		function fetchGif(_this){
			// show spinner
			$(_this).find('.spinner-wrapper').removeClass('active');

			// fetch posts
			// originated from http://www.jqueryscript.net/social-media/Displaying-A-Random-Tumblr-Blog-Post-Using-jQuery-Tumblr-Random-Posts-Plugin.html
			$.ajax("http://api.tumblr.com/v2/blog/" + settings.blogName + "/posts?api_key=" + settings.appKey, {
				type: 'GET',
				dataType: 'jsonp',
				data: {
					get_param: 'value',
					type: 'text'
				},
				success: function(data, textStatus, jqXHR) {
					var random_number = Math.floor(Math.random() * data.response.total_posts);
					return $.ajax("http://api.tumblr.com/v2/blog/" + settings.blogName + "/posts?api_key=" + settings.appKey, {
						type: 'GET',
						dataType: 'jsonp',
						data: {
							get_param: 'value',
							offset: random_number,
							limit: '1',
							type: 'text'
						},
						success: function(data2, textStatus, jqXHR) {
							// grab the image from the post
							var content = $(data2.response.posts[0].body).find('img')[0];


							// check if file is gif
							var fileType = $(content).attr('src').split('.').pop();
							if (fileType != 'gif') {
								fetchGif(_this);
								return;
							}

							// update and set new countdown
							$(_this).find('.countdown').html(settings.timeout);
							$(content).attr('data-countdown', settings.timeout).load(function(){
								$(_this).find('.spinner-wrapper').addClass('active');
								setTimeout(function(){
									countdown(_this);
								}, 1000);
							});
							if ($(_this).find('.img-container img').length > 0) {
								$(_this).find('.img-container img')[0].remove();
							}
							$(_this).find('.img-container').append(content);
						}
					});
				}
			});
		}

		return this.each(function(){
			var _this = this;

			// create elements
			var spinner_wrapper = $('<div class="spinner-wrapper"></div>');
			var spinner = $('<div class="spinner"></div>');
			for(var i=1; i<=5; i++){
				$(spinner).append('<div class="rect'+i+'"></div>');
			}
			$(spinner_wrapper).append(spinner);
			$(_this).append(spinner_wrapper);
			$(_this).append('<div class="countdown"></div>');
			$(_this).append('<div class="img-container"></div>');

			// fetch first gif
			fetchGif(_this);
		});
	}
});
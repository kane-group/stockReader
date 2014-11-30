var storage = sessionStorage;

var items = $("#items ul");
var body = $("#body");

(function($) {
	var userId = localStorage.userId;
	if(userId == null) {
		var modal = $( "#div-modal" )
    	$(modal).modal("show");
    	$("#submitUserId").on('click', '', function(event) {
    		userId = $('[name=userId]').val();
    		localStorage.setItem('userId', userId);
    		fetchStock(userId, 10);
    		$(modal).modal("hide");
    	});
    	return;
	}
	fetchStock(userId, 10);
})(jQuery);

function fetchStock(userId, count) {
	$.ajax({
		url:"http://qiita.com/api/v2/users/" + userId + "/stocks?page=1&per_page=" + count, 
		type:"get",
		success: function(data){
			var indexes = [];
			for (var i = 0; i < 5; i++) {
				while (true) {
					var rand = Math.floor(Math.random() * count);
					if(indexes.indexOf(rand) == -1) {
						indexes.push(rand);
						break;
					}
				}

				var item = data[rand];
				$(items).append("<li>" + item.title + "</li>");
				if(i === 0) {
					$(items).find('li').attr('class', 'active');
					$(body).html(marked(item.body));
				}
				storage.setItem('body-' + i, marked(item.body));
			}
		}
	});
	$(document).on('click', '#items ul li', function() {
		$(items).children('li').removeClass('active');
		$(this).attr('class', 'active');
		$(body).html(storage.getItem('body-' + $("#items ul li").index(this)));
		window.scroll(0,0);
	});
}

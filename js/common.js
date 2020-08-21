function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
var data = new Object();
$(document).ready( function() {
	data["mobile"] = ($('.menu-ico').is(':visible')) ? true : false;

	$('.menu-ico').click(function(){
		$(this).toggleClass('open');
		if ($(this).hasClass('open')) {
			$('.menu-nav').show();
			$('body').addClass('fixed');
		} else {
			$('.menu-nav').hide();
			$('body').removeClass('fixed');
		}
	});

	$(window).scroll(function(){
		var cur = $(window).scrollTop();
		if (!data["cur"]) data["cur"] = 0;
		if (!data["start"]) {
			data["start"] = $(window).height();
			if (data.mobile) data["start"] *= 1.5;
		}

		if (cur >= data["start"]) {
			/*if (data.cur > cur || 1) {*/
				if (!$('.top').hasClass('fix')) $('.top').addClass('fix').css('height', 0).animate({'height':80}, 120, function(){
					if (!$('.top').hasClass('fix')) $('.top').css('height', '');
				});
			/*} else {
				if ($('.top').hasClass('fix')) $('.top').removeClass('fix').css('height', '');
			}*/
		} else {
			if ($('.top').hasClass('fix')) $('.top').removeClass('fix').css('height', '');
		}
		data.cur = cur;
		if (!data.mobile) {
			var num = $('nav li').index($('li.active'));
			var j = num;
			for (i=0; i<$('.screen').length; i++) {
				if ((cur + 50) > $('.screen:eq('+i+')').offset().top) j = i;
			}
			if (j != num) {
				if (j != -1) $('nav li').removeClass('active');
				$('nav li:eq('+j+')').addClass('active');
			}
		}
	});
	if (!data.mobile) {
		$('.top .logo').click(function() {
			$('html, body').animate({scrollTop:0}, 200, "easeInOutQuad");
			return false;
		});
	}
	$('nav li a').click(function(){
		var loc = $(this).attr('href').replace('#', '');
		if (data.mobile) {
			$('.menu-ico').removeClass('open');
			$('.menu-nav').hide();
			$('body').removeClass('fixed');
		}
		$('html, body').animate({scrollTop:$('.screen.'+loc).offset().top}, 400);
		return false;
	});

	data['success'] = new Array('У тебя все хорошо получается! :)', 'Так держать!', 'Ты молодец!', 'Продолжай', 'Правильно!', 'Ответ верный!', 'Отлично!');
	data['fail'] = new Array('Неправильно', 'Попробуй еще раз :(', 'Нет', 'Ответ неверный');
	data['el'] = new Array('plastic-1', 'plastic-2', 'glass-1', 'glass-2', 'paper-1', 'paper-2');
	
	var el = "";

	function drop_target(i) {
		var obj = $('.garbage .box .item:eq('+i+')');
    	var x = $(obj).position().left;
    	var m = Math.floor(Math.random() * 10);
    	var n = Math.floor(Math.random() * 10);
    	var type = $('.game .el').data('box');
    	var cl = 'box-'+type;
    	var status = (obj.hasClass(cl)) ? 'success' : 'fail';
    	var rand = Math.floor(Math.random() * data[status].length);

    	data.y = obj.position().top-50-m;
    	$('.game .el').fadeOut(50);
    	$('.hint').html(data[status][rand]).show().css({'opacity':0,'left':x+n,'top':data.y}).animate({'opacity':1,'top':data.y-10}, 360, "easeOutCubic", function(){
    		$('.game .el').remove();
    		insert_el();
    		data.timer = setTimeout(function(){
    			$('.hint').animate({'opacity':0,'top':data.y-20}, 360, "easeOutCubic");
    		}, 2000);
    	});
    	if (!data[type+"_all"]) data[type+"_all"] = 0;
    	if (!data[type+"_correct"]) data[type+"_correct"] = 0;
    	if (!data.correct) data.correct = 0;
    	if (status == 'success') {
    		data.correct++;
    		data[type+"_correct"]++;
    	}
    	data[type+"_all"]++;
    	var per = parseInt(data[type+"_correct"] * 100/data[type+"_all"]);
    	if (per != $('.save .'+type).find('span').html()) {
	    	$('.save .'+type).find('span').html(per).spincrement({
				thousandSeparator: "",
				duration: 280
			});
		}
		if (status == 'success') {
			var num = parseInt($('.prod span').html()) + 10;
			$('.prod span').html(num).spincrement({
				thousandSeparator: "",
				duration: 280
			});
		}
		if (!data.num) data.num = 0;
		data.num++;
		per = parseInt(data.correct * 100/data.num);
		if ((data.num > 5) && (per > 90)) {
			$('.status div').removeClass().addClass('expert').html('Знаток упаковки');
		} else if ((data.num > 3) && (per > 70)) {
			$('.status div').removeClass().addClass('skilled').html('Страж чистоты');
		} else if (data.num > 1) {
			$('.status div').removeClass().addClass('rookie').html('Новичок');
			$('.status').fadeIn(120);
		}
		if (data.num > 5) $('.share').fadeIn(120);
	}
	$('.share a').click(function(){
		var str = 'Экологическое движение «РазДельный Сбор». ';
		str += ' ' + $('.game .title span').html() + ' Мой уровень ' + $('.status div').html();
		var url = 'http://xn--80acieionqlljj2km.xn--p1ai';
		var img = url + '/images/logo-mail.png';
		window.open('https://vk.com/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(str) + '&image=' + encodeURIComponent(img) + '&noparse=true', '', '');
		return false;
	});
	function insert_el() {
		el = Math.floor(Math.random() * data['el'].length);
		ar = data['el'][el].split('-');
		data['kolvo'] = Math.floor(Math.random() * 10) + 1;
		$('.game').append('<div class="el small ' + ar[0] + ar[1] + '" data-box="' + ar[0] + '"></div>');
		setTimeout(function(){
			if ($('.hint').is(':visible')) {
				$('.hint').fadeOut(220, function(){
					$('.game .el').fadeIn(50);
					$('.game .el').draggable({
			          revert: false,
			          placeholder: true,
			          droptarget: '.garbage .box .item',
			          drop: function(evt, droptarget) {
			          	var i = $('.garbage .box .item').index(droptarget);
			          	drop_target(i);
			            //$(this).draggable('destroy');
			          }
			        });
				});
			} else {
				$('.game .el').fadeIn(50);
				 $('.game .el').draggable({
		          revert: false,
		          placeholder: true,
		          droptarget: '.garbage .box .item',
		          drop: function(evt, droptarget) {
		          	var i = $('.garbage .box .item').index(droptarget);
		          	drop_target(i);
		            //$(this).draggable('destroy');
		          }
		        });
			}
		}, 500);
	}
	insert_el();

    var img = new Image();
	img.src = $('.game .im').data('src');
	img.onload = function() {
		$('.game .im').append('<img src="' + this.src + '" alt="">');
	}

    $('.slider .im img').each(function() {
    	var slider_im = new Image();
    	var obj = $(this);
    	var src = obj.data('lazy');
    	if (data.mobile) src = src.replace('_', 'mobile_');
    	slider_im.src = src;
    	slider_im.onload = function(){
    		obj.attr('src', this.src);
    	} 
	});
	data.tek = 0;
	$('.slider .item:eq(0)').show();
	$('.svg-quote div').addClass('animation0').find('span').html($('.quote:eq(0)').html());
    function change_slide(i){
    	if (data.slideBusy) return;
    	data.slideBusy = true;
    	var num = $('.slider .item:eq('+i+')').data('num');
    	var p = '';
    	if (data.mobile) p = '_mobile';
    	var color = $('.slider .item:eq('+i+')').data('color');
    	$('.svg-quote div').fadeOut(40, function(){
    		if ($('.slider .item:eq('+data.tek+')').data('color') != color) document.getElementById("animation-"+color+p).beginElement();
    		if ($('.slider .item:eq('+data.tek+')').data('num') != num) document.getElementById("animation"+num+p).beginElement();

    		$('.slider .item:eq('+data.tek+')').fadeOut(620, "easeInOutQuad");
	    	$('.slider .item:eq('+i+')').fadeIn(620, "easeInOutQuad", function(){
	    		data.tek = i;
	    		$('.preview .sm.active').removeClass('active');
	       		$('.preview .sm:eq('+i+')').addClass('active');

	       		$('.svg-quote div').removeClass().addClass('animation'+num).addClass(color).find('span').html($('.quote:eq('+i+')').html());
	       		$('.svg-quote div').fadeIn(40);
	       		data.slideBusy = false;
	    	});
    	});
    }
	 $('.preview .sm').click(function(){
	 	if (!$(this).hasClass('active')) {
	 		var i = $('.preview .sm').index($(this));
	 		change_slide(i);
	 	}
	 });

	var img = new Image();
	img.src = $('.test .im').data('src');
	img.onload = function() {
		$('.test .im').attr('src', img.src).css('left', ($(window).width() - 1440)/2).hide().fadeIn(240);
	}
	$('.radio div, .radio label').click(function(){
		var obj = $(this).closest('.radio');
		if (obj.hasClass('disabled')) return;
		if (obj.hasClass('active')) return;
		obj.closest('.radio-block').find('input[type=hidden]').val(obj.data('id'));
		obj.closest('.radio-block').find('.radio').removeClass('err').removeClass('active');
		obj.addClass('active');
		if ($('.test .form .button').hasClass('disabled')) $('.test .form .button').removeClass('disabled').attr('disabled', false);
	});
	$('.test-txt .button').click(function(){
		$('.test-txt').hide();
		$('.test form').css('display', 'table-cell');
		return false;
	});
	$('.test .main form').submit(function(){
		if ($('.radio').hasClass('active')) {
			var status = ($('.radio.active').hasClass('correct')) ? 'success' : 'fail';
			$('.final .title').html($('.final .title').data(status));
			$('.final').removeClass().addClass('final ' + status);
			$('.final').css('right', -$('.final').width()).show().animate({'right': 0}, 360, "easeInOutQuad", function(){
				$('.final .inp').focus(function(){
					$(this).addClass('active');
				}).blur(function(){
					$(this).removeClass('active');
				});
				$('.final form').submit(function(){
					var err = false;
					var obj = $(this);
					obj.find('.err').removeClass('err');
					obj.find('.req').each(function() {
						if (($(this).val() == '') || (($(this).hasClass('email')) && (!validateEmail($(this).val())))) {
							$(this).parent().addClass('err');
							err = true;
						}
					});
					if (!err) {
						$.ajax({
						  type: "POST",
						  url: "/includes/action.php",
						  data: obj.serialize(),
						  contentType: "application/x-www-form-urlencoded"
						}).done(function( msg ) {
							if (msg.length > 0) {
								obj.hide();
								obj.next().show();
							} else {
								alert('Произошла ошибка. Попробуйте еще раз');
							}
						}).fail(function(){
							alert('Произошла ошибка. Попробуйте еще раз');
						});
					}
					return false;
				});
			});
		} else {
			$('.radio').addClass('err');
		}
		return false;
	});
	$('.again a').click(function(){
		$('.radio-block').find('input[type=hidden]').val('');
		$('.radio').removeClass('active');
		$('.final').animate({'right':-$('.final').width()}, 360, "easeInOutQuad", function(){
			$('.final').hide();
		});
		return false;
	})
	
	// When the user clicks on <span> (x), close the final
		$('.final .close-final').click(function(){
			$('.final').hide();
		});

	if (data.mobile) {
		$('.b-slider').not('.done').each(function() {
			var obj = $(this);
			obj.find('.items').slick({
				draggable: true,
				centerMode: false,
				infinite: true,
				dots: false,
				arrows: false,
				fade: true,
				swipe: true,
				slidesToShow: 1,
				slidesToScroll: 1
			});
			obj.find('.arr').fadeIn(80);
			obj.find('.arr.next').click(function(){
				obj.find('.items').slick('slickNext');
			});
			obj.find('.arr.prev').click(function(){
				obj.find('.items').slick('slickPrev');
			});
		});
	}

	 $('.numonly').keydown(function(event){
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 16 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
		 return;
		} else {
			if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) && (event.keyCode != 188) && (event.keyCode != 190) && (event.keyCode != 191)) {
				event.preventDefault();
			}  
		}
	});
	 $('.inp.phone').mask("+7 (999) 999-9999");

	 $('.donate .inp.numonly').keyup(function(){
	 	var val = parseInt($(this).val());
	 	//$('.donate li').removeClass();
	 	if (val > 0) {
	 		$('.donate li').each(function() {
				if ($(this).html() == val) {
					$(this).addClass('active');
				}
			});
	 	} else {
	 		$('.donate li:eq(0)').addClass('active');
	 	}
	 });
	 $('.donate .req').bind('focus', function(){
	 	if ($(this).parent().hasClass('err')) $(this).parent().removeClass('err');
	 });
	 $('.donate li').click(function(){
	 	if (!$(this).hasClass('active')) {
	 		$('.donate li').removeClass();
	 		$(this).addClass('active');
	 		$('.donate .inp.numonly').val('');
	 	}
	 });

	 
	 $('.donate input[name="pay-type-radio"]').change(function(){
		$(".donate form input[name='rebillingOn']").val("once"==this.value?0:1);			
		$(".donate form input[name='pay-type']").val(this.value);	 
	});

	 $('.donate form').submit(function(){
		var err = false;
		var obj = $(this);
		obj.find('.err').removeClass('err');
		obj.find('.req').each(function() {
			if (($(this).hasClass('email') && !validateEmail($(this).val())) || $(this).val() == '')
			{
				$(this).addClass('err');
				err = true;
			}
		});
		
		if (!err) {
			//take active item
			let active = $('.donate li.active');
			var sum;
			if(active.attr("other")=="true"){
				sum = parseInt($('input[name=otherSum]').val());
			}
			else{
				sum = $('.donate li.active').html();
			}
		
			$('input[name=sum]').val( sum );
			return true;
		}
		return false;
	});

	$('a[href=#feedback]').click(function(){
		if (data.mobile) {
			if ($('.menu-ico').hasClass('open')) {
				$('.menu-ico').removeClass('open');
				$('.menu-nav').hide();
				$('body').removeClass('fixed');
			}
			$('body').addClass('fixed');
		}
		$('.lay-data').removeClass().addClass('lay lay-data lay-feedback').fadeIn(180, "easeInOutQuad");
		$('.laybg').fadeIn(180, "easeOutCubic");
		$('.inp.phone').mask("+7 (999) 999-9999");
		$('.lay .inp').focus(function(){
			$(this).removeClass('err');
		});
		$('.lay form').submit(function(){
			var err = false;
			var obj = $(this);
			obj.find('.err').removeClass('err');
			obj.find('.req').each(function() {
				if ($(this).val() == '') {
					$(this).addClass('err');
					err = true;
				}
			});
			if (!err) {
				$.ajax({
				  type: "POST",
				  url: "/includes/action.php",
				  data: obj.serialize(),
				  contentType: "application/x-www-form-urlencoded"
				}).done(function( msg ) {
					if (msg.length > 0) {
						obj.hide();
						$('.lay .success').show();
						setTimeout(function(){
							$('.lay, .laybg').fadeOut(180, "easeInOutQuad");
						}, 2000);
					}
				});
			}
			return false;
		});
		return false;
	});
	$('.lay .close, .laybg').click(function(){
		if ($('.lay').is(':visible')) {
			$('.lay, .laybg').fadeOut(180, "easeInOutQuad");
			if (data.mobile) $('body').removeClass('fixed');
		}
	});
	$(document).keyup(function(e) {
		 if (e.keyCode == 27) {
			if ($('.lay').is(':visible')) $('.lay, .laybg').fadeOut(180, "easeInOutQuad");
		}
	});

});
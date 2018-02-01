$(document).ready(function (){
	var $activeLi, lineWidth, liPos, navPos, winPos,
		$header = $('header'),
		$title = $('h1'),
		$hidden = $('.products .hidden'),
		$nav = $('.menu .nav'),
    	$line = $('<div class="slide-line">').appendTo($nav),    	
		$sections = $('section'),
		navHeight = $('.menu .nav').outerHeight(),
		$field = $('form#mainfrm div > .field'),
		$input = $('form#mainfrm div > .input');

	function setHeightHeader(){
		wheight = $(window).height();
		title = wheight/3;
		$header.css('height', wheight);
		$title.css('margin-top', title);
		navPos = $('.menu').offset().top;
	}

    setHeightHeader();

    setEqualHeight($('.identity'));

    $('.products .col2').each(function(){
    	if ($(this).find($hidden).length != 0) {
    		$(this).find('p').append('<span class="arrow"></span>');
    		$(this).find('p').css('cursor', 'pointer').click(function(){
    	   		$(this).find('.arrow').toggleClass('toup');
		    	$(this).parent('.col2').find($hidden).toggleClass('visible').slideToggle();
    		})
        }
    })

    $('<div class="clone-menu"></div>').insertBefore('.menu').css('height', navHeight).hide();

    $field.hide();
	
	$($input).each(function(){
		var text = $.trim($(this).prev($field).text());
		$(this).find('input, textarea').attr('placeholder', text);
	});

    function setLine(){
    	$activeLi = $nav.find('li.active');
    	lineWidth = $activeLi.outerWidth();
    	liPos = $activeLi.position().left;
    	$line.animate({
    		'left': liPos,
    		'width': lineWidth
    	}, 200);
		/*$line.css({
    		'left': liPos,
    		'width': lineWidth
    	});*/
    }
    setLine();

    $(window).on('scroll', debounce(function(){
    	var winPos = $(this).scrollTop();
    	if (winPos >= navPos){
    		$('.menu').addClass('fixed');
    		$('.clone-menu').show();
    	}
    	else{
    		$('.menu').removeClass('fixed');
    		$('.clone-menu').hide();
    	}
	  
		$sections.each(function(){
			var top = $(this).offset().top - navHeight,
			    bottom = top + $(this).outerHeight();

			if (winPos >= top && winPos <= bottom) {
				$nav.find('li').removeClass('active');
				$sections.removeClass('active');


				$(this).addClass('active');
				$nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
				setLine();
			}
		});		
    }, 100))

    $nav.find('a').on('click', function(e){
		e.preventDefault;
		var $el = $(this),
		    id = $el.attr('href');
		
		$('html, body').animate({
			scrollTop: $(id).offset().top - navHeight + 2
		}, 500);
	});
    
    $(window).resize(setHeightHeader());

    $('.open-form').click(function(e){
    	e.preventDefault();
		$('.overlay').fadeIn(400, function(){
			$('.popup').css('display', 'block').animate({
					opacity: 1,
					top: '15%'
				}, 200);
			});
	});
	$('.overlay').click(function(){
		$('.popup').animate({
			opacity: 0,
			top: '45%'
		}, 200,	function(){
			$(this).css('display', 'none');
			$('.overlay').fadeOut(400);
		});
	});
})

function setEqualHeight(columns){
	var tallestcolumn = 0;
	columns.each(
	function(){
		var currentHeight = $(this).height();
		if(currentHeight > tallestcolumn){
			tallestcolumn = currentHeight;
		}
	});
	columns.height(tallestcolumn);
}

function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
        var last = new Date().getTime() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
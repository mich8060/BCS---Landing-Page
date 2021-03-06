$(document).ready(function(){
	
	var defaults = {
		device: null,
		touch: 	!!('ontouchstart' in window),
		animationTime: 300,
		easing: "none",
		cycle: null
	}
	
	$.fn.cycleFeatures = function(obj){
		// Reverse DOM arrangement
		$(obj).each(function(){$(this).parent().prepend($(this));});

		defaults.cycle = window.setInterval(function(){
			console.log('here');
			$el = $(obj);
			$item = $el.last();
			$item.animate({
				opacity: 0
			},500, function(){
				$el.parent().prepend($item);
				$item.css('opacity','1');
			});
		},5000);

	}
	
	if(window.location.hash == "#ipad"){
		defaults.device = "iPad";
	}
	
	
	// Detect iPhone & iPad Specifically
	if(navigator.userAgent.match(/iPad/i)) {
		defaults.device = "iPad";
	}else if(navigator.userAgent.match(/iPhone/i)){
		defaults.device = "iPhone";
	}
	
	// Device Specific Actions
	if(defaults.device == "iPad"){
		$('.iphone-only').hide();
		$('.ipad-only').show();
		$(this).cycleFeatures('.ipad-slideshow');
		$(".bcs-app-features").css("background-image","url('img/backcountry-app-pad-basics.jpg')");
		$('.bcs-app-tabs a').removeClass();
		$('.bcs-app-tabs a').eq(1).addClass('selected');
		$(".bcs-preview").hide();
		$(".bcs-app-ipad-preview").show();
	}else{
		$(this).cycleFeatures('.iphone-slideshow');
	}
		
	$.fn.validatePhone = function(phone){
		var stripped = phone.replace(/[\s\(\)\-\ ]/g, '');
	    var regex = /^\d{10,11}$/;
		if(stripped.length == 11){
			if(stripped.substring(0,1) == 1){
				return regex.test(stripped);
			}else{
				return false;
			}		
		}else{
			return regex.test(stripped);
		}
		
	}
	
	$.fn.validateEmail = function(email){
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	}
	
	// Transform Translate3D Helper
	$.fn.transformPage = function(pos) {
    	$(this).css({
        	"-webkit-transform": "translate3d(0, " + pos + "px, 0)", 
        	"-webkit-transition": "all " + defaults.animationTime + "ms " + defaults.easing,
        	"-moz-transform": "translate3d(0, " + pos + "px, 0)", 
        	"-moz-transition": "all " + defaults.animationTime + "ms " + defaults.easing,
        	"-ms-transform": "translate3d(0, " + pos + "px, 0)", 
        	"-ms-transition": "all " + defaults.animationTime + "ms " + defaults.easing,
        	"transform": "translate3d(0, " + pos + "px, 0)", 
        	"transition": "all " + defaults.animationTime + "ms " + defaults.easing
      	});
	}
	
	if($(window).width() <= 600){
		$(this).cycleFeatures('.bcs-app-featured-card');	
	}
	
	
	// Event That Creates Parallax Effect
	$(window).scroll(function(){
		if(!defaults.touch){
			var settings = {
				distance: 	($(window).scrollTop() * .15)
			}
			$('.bcs-app-bg-container').transformPage("-" + settings.distance / 1.5);
			$('.bcs-app-form').transformPage(settings.distance / 2);
			$('.bcs-app-form').css('opacity', 1- (settings.distance / 100));
		}
	});
	
	// Checks to see if the information entered is either an email, phone, or neither
	$('.app-input').blur(function(){
		$el = $(this);
		$parent = $el.parent();
		$val = $el.val();
		if($el.validatePhone($val)){
			$phone = $val.replace(/[\s\(\)\-\ ]/g, '');
			if($phone.length == 11){
				$phone = $phone.substring(1,11);
			}
			$(".Field2").val($phone.substring(0,3));
			$(".Field2-1").val($phone.substring(3,6));
			$(".Field2-2").val($phone.substring(6,$phone.length));
			$(".bcs-app-form-error").fadeOut(300);
		}else if($el.validateEmail($val)){	
			$(".Field1").val($val);
			$(".bcs-app-form-error").fadeOut(300);
		}else if($val == ""){
			// Do Nothing
		}else{
			$el.showError();
		}
	}).keydown(function(){		
		$(".bcs-app-form-error").fadeOut(300);
	});
	
	$.fn.submitForm = function() {
		$el = $(this);
		$val = $el.find('.app-input').val();
		if($val != ""){
			if($el.validatePhone($val) || $el.validateEmail($val)){
				var popup = window.open('','','width=700,height=320,resizable=no,scrollbars=no,top=200,left=200,toolbar=no,menubar=no,status=no');
				var element = popup.document.body;
				$(element).html($(this).clone());
				$(element).find('form').css('opacity','0').submit();
			}else{
				$el.showError();
			}
		}else{	
			$el.showError();
		}
	}
	
	$.fn.showError = function() {
		$(".bcs-app-form-error").fadeIn(300);
		window.setTimeout(function(){
			$(".bcs-app-form-error").fadeOut(300);
		},4000);
	}
	
	$("form.bcs-app-form-entry").submit(function(e){
		$(this).submitForm();
		e.preventDefault();
	});
	
	// Change which device thumbnails are being shown in the gallery.
	$('.bcs-app-tabs a').click(function(e){
		$('.bcs-app-tabs a').removeClass();
		$(this).addClass('selected');
		$data = $(this).attr("data");
		$(".bcs-preview").hide();
		$("."+$data).show();
		e.preventDefault();
	});	
	
	
});



$(document).ready(function(){
	var isrunning = true;
	var volume = 100;
	var timerEventHandle = null;
	var timerVolumeHandle = null;
	var template = null;
	
	//Ouverture de la documentation en appuyant sur F1
	document.addEventListener("keydown",function(){
		if(event.keyCode === 112) {
			window.open(document.URL+"_documentation").focus();
			return false;
		}
	},false);
	
	var triggerEvent = function(eventName, element){
		$(element).toggleClass("app-active");
		if($(element).hasClass("app-active")){
			$(".app-events").html("Event : "+eventName+" triggered");
			$(".app-events").css("visibility","visible");
			$(document).trigger(eventName);
			if(timerEventHandle != null){
				window.clearTimeout(timerEventHandle);
			}
			timerEventHandle = setTimeout(function(eventName){
				$(".app-events").css("visibility","hidden");
				timerEventHandle = null;
			},2000);
		}
	};

	$(document).on("click",".app-help-button",function(){
		window.open(document.URL+"_documentation").focus();
	});
	$(document).on("click",".app-rotate-button",function(){
		$(".app-device").toggleClass("horizontal");
		if($(".app-device").hasClass("horizontal")){
			$(this).find(".fa").removeClass("fa-rotate-left");
			$(this).find(".fa").addClass("fa-rotate-right");
		}else{
			$(this).find(".fa").removeClass("fa-rotate-right");
			$(this).find(".fa").addClass("fa-rotate-left");
		}
	});
	$(document).on("click",".app-connexion-on-button",function(){
		triggerEvent("online",this);
		$(".app-connexion-off-button").removeClass("app-active");
	});
	$(document).on("click",".app-connexion-off-button",function(){
		triggerEvent("offline",this);
		$(".app-connexion-on-button").removeClass("app-active");
	});
	$(document).on("click",".app-start-call-button",function(){
		triggerEvent("startcallbutton",this);
		$(".app-end-call-button").removeClass("app-active");
	});
	$(document).on("click",".app-end-call-button",function(){
		triggerEvent("endcallbutton",this);
		$(".app-start-call-button").removeClass("app-active");
	});
	$(document).on("click",".app-search-button",function(){
		triggerEvent("searchbutton",this);
	});
	$(document).on("click",".app-device-sound-up-button",function(){
		$(".app-sound-icon .fa").removeClass("fa-volume-off").addClass("fa-volume-down");
		if(volume<100){
			volume += 10;
		}
		if(volume===100){
			$(".app-sound-icon .fa").removeClass("fa-volume-down");
			$(".app-sound-icon .fa").addClass("fa-volume-up");
		}
		$(".app-sound-bar-value").css("width",volume+"%");
		$(".app-sound").css("visibility","visible");
		if(timerVolumeHandle != null){
				window.clearTimeout(timerVolumeHandle);
		}
		timerVolumeHandle = setTimeout(function(eventName){
			$(".app-sound").css("visibility","hidden");
			timerVolumeHandle = null;
		},2000);
		triggerEvent("volumeupbutton",this);
	});
	$(document).on("click",".app-device-sound-down-button",function(){
		$(".app-sound-icon .fa").removeClass("fa-volume-up").addClass("fa-volume-down");
		if(volume>0){
			volume -= 10;
		}
		if(volume===0){
			$(".app-sound-icon .fa").removeClass("fa-volume-down");
			$(".app-sound-icon .fa").addClass("fa-volume-off");
		}
		$(".app-sound-bar-value").css("width",volume+"%");
		$(".app-sound").css("visibility","visible");
		if(timerVolumeHandle != null){
				window.clearTimeout(timerVolumeHandle);
		}
		timerVolumeHandle = setTimeout(function(eventName){
			$(".app-sound").css("visibility","hidden");
			timerVolumeHandle = null;
		},2000);
		triggerEvent("volumedownbutton",this);
	});
	$(document).on("click",".app-device-back-button",function(){
		$(this).removeClass("app-active");
		triggerEvent("backbutton",this);
	});
	$(document).on("click",".app-device-home-button",function(){
		$(this).removeClass("app-active");
		if(isrunning){
			triggerEvent("pause",this);
			$(".app-device-screen").css("visibility","hidden");
		}else{
			triggerEvent("resume",this);
			$(".app-device-screen").css("visibility","visible");
		}
		isrunning = !isrunning;
	});
	$(document).on("click",".app-device-menu-button",function(){
		$(this).removeClass("app-active");
		triggerEvent("menubutton",this);
	});
	$(document).on("change",".app-battery-level input",function(){
		 if($(this).val() <= 5){
			triggerEvent("batterycritical",this);
			$(".app-battery-icon").removeClass("app-battery-low");
			$(".app-battery-icon").addClass("app-battery-critical");
		}else if($(this).val() <= 20){
			triggerEvent("batterylow",this);
			$(".app-battery-icon").removeClass("app-battery-critical");
			$(".app-battery-icon").addClass("app-battery-low");
		}else{
			triggerEvent("batterystatus",this);
			$(".app-battery-icon").removeClass("app-battery-low");
			$(".app-battery-icon").removeClass("app-battery-critical");
		}
	});
	
	Application.ready(function(){
		template = Application.debugTemplate;
		$(".app-phone-button").addClass("app-active");
		
		$(document).on("click", ".app-screen-button", function(){
			if(!$(this).hasClass("app-active")){
				$("body").removeClass('app-device-screen').html($(".app-device-screen").html()).append('<div class="app-view-switch"><div class="app-button app-screen-button"><i class="fa fa-desktop"></i></div><div class="app-button app-phone-button"><i class="fa fa-mobile-phone"></i></div></div>');		
				$("body").addClass("app-device-screen");
				$(".app-screen-button").addClass("app-active");
			}
		});
		$(document).on("click",".app-phone-button", function(){
			if(!$(this).hasClass("app-active")){
				$(".app-view-switch").remove();
				$("body").remove(".app-view-switch");
				$("body").removeClass('app-device-screen');
				var content = $("body").html();
				$("body").html(template);
				$(".app-device-screen").html(content);
				$(".app-phone-button").addClass("app-active");
			}
		});
	});
	
	
	triggerEvent("deviceready","body");	
});
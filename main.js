$(document).ready(function(){
	Application.ready(function(){
		//$("body").html("<h1>Ready</h1>");
		for(var i in Application.Model.getModel()){
			Application.DataBase.getModelData(i);
		}
	});
	
	$("body").bind('DOMNodeInserted DOMNodeRemoved', function(event) {fitToScreen();});
	$(window).resize(function(){fitToScreen();});
	fitToScreen();
});

function fitToScreen(){
	var height = $(document).height();
	$("header,.header").each(function(){
		height -= $(this).outerHeight();
	});
	$("footer,.footer").each(function(){
		height -= $(this).outerHeight();
	});
	$("#content").height(height);
}
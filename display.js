$(document).ready(function(){

	/*MANAGE PARAMETERS DRAGGING*/
	var isDragging=false;
	var mousePosition = 0;
	var offset = 50;

	$("body").mousedown(function(event){
		var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
		mousePosition= event.pageX;
		if(mousePosition > position-offset && mousePosition< position+offset ){
			isDragging=true;
		}
	});
	$("body").mouseup(function(event){
		var snappingMargin = $("#parameters").width()/3;
		var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
		
		/* TEST FOR SNAPPING TO BEGIN/END */
		if(position - $("#parameters").width() + snappingMargin > 0){
			$("#parameters").css("left","0px");
		}else if(position < snappingMargin){
			$("#parameters").css("left","-"+$("#parameters").width()+"px");
		}

		isDragging=false;
	});
	$("body").mousemove(function(event){
		if(isDragging){
			move = event.pageX - mousePosition;
			mousePosition= event.pageX;
			var lastPosition = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2));
			var newPosition = lastPosition*1 + move;
			if(newPosition < 0 && newPosition < $("#parameters").width()){
				$("#parameters").css("left",newPosition+"px");
			}
		}
	});
});
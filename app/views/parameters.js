Application.View.define("parameters",{
	isDragging : false,
	mousePosition : 0,
	offset : 50,

	template : [
		{
			parentSelector : "body",
			name : "parameters",
		}
	],
	events:{
		"body" : {
			"mousedown" : function(event){
				var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
				_self.mousePosition= event.pageX;
				if(_self.mousePosition > position-_self.offset && _self.mousePosition< position+_self.offset ){
					_self.isDragging=true;
				}
			},
			"mouseup" : function(event){
				var snappingMargin = $("#parameters").width()/3;
				var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
				
				if(position - $("#parameters").width() + snappingMargin > 0){
					$("#parameters").css("left","0px");
				}else if(position < snappingMargin){
					$("#parameters").css("left","-"+$("#parameters").width()+"px");
				}
				_self.isDragging=false;
			},
			"mousemove" : function(event){
				if(_self.isDragging){
					move = event.pageX - _self.mousePosition;
					_self.mousePosition= event.pageX;
					var lastPosition = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2));
					var newPosition = lastPosition*1 + move;
					if(newPosition < 0 && newPosition < $("#parameters").width()){
						$("#parameters").css("left",newPosition+"px");
					}
				}
			}
		}
	},
	getData : function(){
		return  {
			rubric : [
				{id : "Parameter1", name : "Parameter 1"},
				{id : "Parameter2", name : "Parameter 2"},
				{id : "Parameter3", name : "Parameter 3"},
				{id : "Parameter4", name : "Parameter 4"},
				{id : "Parameter5", name : "Parameter 5"},
				{id : "Parameter6", name : "Parameter 6"}
			]
		};
	}
});
	
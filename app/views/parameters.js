Application.View.define("parameters",{
	isDragging : false,
	startPosition : 0,
	lastPosition : 0,
	offset : 50,

	template : [
		{
			parentSelector : "body",
			name : "parameters",
		}
	],
	events:{
		"body" : {
			"mousedown" : function(event, _self, _data){
				var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
				_self.startPosition= event.pageX;
				_self.lastPosition=_self.startPosition;
				if(_self.startPosition > position-_self.offset && _self.startPosition< position+_self.offset ){
					_self.isDragging=true;
				}
			},
			"mouseup" : function(event, _self, _data){
				if(_self.isDragging){
					var snappingMargin = 50;
					var position = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1 + $("#parameters").width();
					
					if(event.pageX - _self.startPosition > snappingMargin){
						$("#parameters").css("left","0px");
					}else if(event.pageX - _self.startPosition < -snappingMargin){
						$("#parameters").css("left","-"+$("#parameters").width()+"px");
					}
					_self.isDragging=false;
				}
			},
			"mousemove" : function(event, _self, _data){
				if(_self.isDragging){
					var lastPosition = $("#parameters").css("left").substr(0,($("#parameters").css("left").length - 2))*1;
					move = event.pageX - _self.lastPosition;
					_self.lastPosition = event.pageX ;
					var newPosition = lastPosition + move;
					if(newPosition < 0  && newPosition > -1 * $("#parameters").width()){
						$("#parameters").css("left",newPosition+"px");
					}
				}
			}
		},
		"#parameters li" : {
			"click" : function(event, _self, _data){
				$(event.target).toggleClass("selected");
				$("#parameters .lists li" ).not(event.target).removeClass("selected");
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
	
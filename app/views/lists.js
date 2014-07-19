Application.View.define("lists",{
	template : [
		{
			parentSelector : "body",
			name : "lists",
		}
	],
	events : {
		"#content .lists li" : {
			"click" : function(event, _self, _data){
				$(event.target).toggleClass("selected");
				$("#content .lists li" ).not(event.target).removeClass("selected");
			}
		},
		"#content .lists li .name" : {
			"click" : function(event, _self, _data){
				if(_data){
					_data.name += " (Clicked)";
				}
			}
		},
	},
	
	getData : function(){
		return  {
				lists : Application.getStore("lists").getData()
		};
	}
});
	
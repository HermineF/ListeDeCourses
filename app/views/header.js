Application.View.define("header",{
	template : [
		{
			parentSelector : "body",
			name : "header",
		}
	],
	
	init : function(){
		
	},
	
	data : {
		pageName : "unset",
		actions : {
			 "add" : {name : "add", isActive : true},
			"edit" : {name : "edit", isActive : false},
			"remove" : {name : "remove", isActive : false}
		}
	}
});
	
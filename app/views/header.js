Application.View.define("header",{
	template : [
		{
			parentSelector : "body",
			name : "header",
		}
	],
	
	init : function(){
		
	},
	
	getData : function(){
		return  {
			pageName : "Listes",
			actions : [
				{name : "add"},
				{name : "edit"},
				{name : "remove"}
			]
		};
	}
});
	
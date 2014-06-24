Application.View.define("lists",{
	template : [
		{
			parentSelector : "body",
			name : "lists",
		}
	],
	events : {
		".lists li" : {
			"click" : function(event){
				$(event.target).toggleClass("selected");
				$(".lists li" ).not(event.target).removeClass("selected");
			}
		},
	},
	
	getData : function(){
		return  {
				lists : Application.getStore("lists").getData()
		};
	}
});
	
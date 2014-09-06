Application.View.define("listsPage",{
	controller : "lists",

	template : [
		{
			view : "header",
		},
		{
			view : "lists",
		},
		{
			view : "footer",
		},
		{
			view : "parameters",
		}
	],
	
	onLoad : function(){
		Application.Data.getData("header").pageName = "Listes";
	},

});
	
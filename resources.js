var loader=new function(){
	var baseUrl="";
	var scripts=[
		"config",
	
		/* enums */
		"app/enums/unite",
		"app/enums/list_state",
		
		/* initialisation de l'application*/
		"app/core/logger",
		"app/core/application",
		"app/core/webSql",
		"app/core/indexedDB",
		"app/core/database",
		"app/core/parameters",
		
		/* déclaration des models*/
		"app/models/product",
		"app/models/list",
		"app/models/category",
		
		/* déclaration des stores*/
		
		
		/* déclaration des views*/
		
		
		/* déclaration des controllers*/

		/* main */
		"main"
	];
	this.init=function(){
		for(var i in scripts){
			$("head").append("<script src='"+baseUrl+"/"+scripts[i]+".js'></script>");
		};
	};
};
loader.init();
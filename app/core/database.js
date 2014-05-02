Application.DataBase = new function(){
	/**
	* permet d'initialiser la base de données en fonction des technos supportées
	*/
	this.init = function(callback){
		document.addEventListener("DOMContentLoaded", function(){
			if("indexedDB" in window) {
				console.log("Using indexedDB");
				Application.DataBase = Application.indexedDB;
			} else if ("openDatabase" in window) {
				console.log("Using webSql");
				Application.DataBase = Application.webSql;
			}else{
				throw "Votre navigateur est un mammouth mettez le à jour!";
			}
			Application.DataBase.init(callback);
		});
	};
	
	/**
	*	Chaque base de données doit implémenter les méthodes suivantes:
	*	
	*	select(modelName,options,callback);
	*	
	*	insert(modelName,data,callback);
	*	
	*	update(modelName,data,callback);
	*	
	*	delete(modelName,data,callback);	
	*/
};
Application.DataBase = new function(){
	/**
	* permet d'initialiser la base de données en fonction des technos supportées
	*/
	this.init = function(callback){
		if("indexedDB" in window) {
			console.info("Using indexedDB");
			Application.DataBase = Application.indexedDB;
		} else if ("openDatabase" in window) {
			console.info("Using webSql");
			Application.DataBase = Application.webSql;
		}else{
			throw "Votre navigateur est un mammouth mettez le à jour!";
		}
		Application.DataBase.init(callback);
	};
	
	/**
	*	Chaque base de données doit implémenter les méthodes suivantes:
	*	
	*	getModelData(modelName,callback);
	*/
};
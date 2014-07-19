/**
* Gestion des stores de l'application
* Un Store permet de gérer les données (récupération depuis la base de données, depuis une url, etc. modification des données, enregistrement et persistance)
*/
Application.Controller = new function(){
	var _controllers={};
	
	this.define =  function(name,config){
		if(typeof(_controllers[name]) === "undefined"){
			_controllers[name] = config;
		}else{
			console.error("Le controlleur "+name+" a déjà été défini",_controllers[name]);
		}
	};
	this.getController = function(name){
		if(typeof(name) === "undefined"){
			return _controllers;
		}else if(typeof(_controllers[name]) !== "undefined"){
			return _controllers[name];
		}else{
			throw "Le controlleur "+name+" n'existe pas";
		}
	};
};

/* Quick accessors*/
Application.getController = function(name){
	return Application.Controller.getController(name);
};
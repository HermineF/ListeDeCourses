/**
* Gestion des Models de l'application
* Un model correspond à la représentation des données
* chaque type de donnée est défini suivant un model contenant l'ensemble des champs/variables de la donnée
* @see Application.Model.define pour la dénition des models
*/
Application.Model = new function(){
	var _models={};
	/**
	*	Enum : Défini les relations entre models
	*/
	this.relationships={
		"BELONGS_TO":"BELONGS_TO",
		"HAS_MANY":"HAS_MANY"
	};
	/**
	* Méthode permettant de définir un nouveau model
	* @param name : nom du model
	* @param config: définition du model
	*	la définition du model correspond à un objet JSON contenant la définition de chaque champ:
	*<example>
	* "fieldName" : { type : "fieldType" [, "relationship" : "Application.Model.relationships" ] [, "defaultValue" : "fieldDefaultValue" ]
	*</example>
	*<example>
	*Application.Model.define("category",{
	*	"name" : {"type" : "string"},
	*	"parent" : {"type" : "category", "relationship" : Application.Model.relationships["BELONGS_TO"]}
	*});
	*</example>
	*/
	this.define =  function(name,config){
		if(typeof(_models[name]) === "undefined"){
			_models[name] = config;
		}else{
			console.error("Le model "+name+" a déjà été défini",_models[name]);
		}
	}
	/**
	* Récupère un model précédement défini à partir de son nom
	* @param name : nom du model recherché
	* @return le model récupéré (undefined si aucun model ne correspond à la recherche)
	*/
	this.getModel = function(name){
		if(typeof(name) === "undefined"){
			return _models;
		}else if(typeof(_models[name]) !== "undefined"){
			return _models[name];
		}else{
			throw "Le model "+name+" n'existe pas";
		}
	}
};

/* Quick accessors*/
this.getModel = function(name){
	return _application.Model.getModel(name);
};
Application.Store =  new function(){	
	var _stores={};
	/**
	* Permet de définir un nouveau store
	*/
	this.define =  function(name,config){
		if(typeof(_stores[name]) === "undefined"){
			_stores[name] = config;
		}else{
			console.error("Le store "+name+" a déjà été défini",_stores[name]);
		}
	}
	
	this.getStore = function(name){
		if(typeof(name) === "undefined"){
			return _stores;
		}else if(typeof(_stores[name]) !== "undefined"){
			return _stores[name];
		}else{
			throw "Le store "+name+" n'existe pas";
		}
	}
};
Application.getStore = function(name){
	return Application.Store.getStore(name);
};
Application.Parameters = new function(){
	this.init = function(callback){
		if(config.isDebug){
			localStorage.clear();
		}
		
		// Initialisation des paramètres
		for(var i in config.parameters){
			var param = config.parameters[i];
			if(param.isTemporary){
				if(! sessionStorage.getItem(i)){
					sessionStorage.setItem(param.name,param.value);
				}
			}else if(localStorage.getItem("_isInstalled") == null && localStorage.getItem(param.name) ==null){
				localStorage.setItem(param.name,param.value);
			}
		}
		localStorage.setItem("_isInstalled",true);

		if(typeof callback === "function"){
			callback();
		}
	}
	
	/**
	* Récupère un paramètre
	* @param key : nom du paramètre à récupérer
	* @return : valeur du paramètre
	*/
	this.get = function(key){
		if(sessionStorage.getItem(key)){
			return sessionStorage.getItem(key);
		}else{
			return localStorage.getItem(key);
		}
	};
	
	/**
	* Enregistre une donnée
	* @param key : nom de la variable
	* @param value : valeur de la variable
	* @param isTemporary : permet de définir si la donnée disparaitra à la fermeture de l'application (boolean optional)
	*/
	this.set = function(key,value,isTemporary){
		if(isTemporary){
			sessionStorage.setItem(key,value);
		}else{
			localStorage.setItem(key,value);
		}
	}
	
	/**
	*	Supprime un paramètre
	*/
	this.unset = function(key){
		if(sessionStorage.getItem(key)){
			sessionStorage.removeItem(key);
		}else{
			localStorage.removeItem(key);
		}
	}
};
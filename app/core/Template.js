Application.Template = new function(){
	var _templates = {};
	
	this.define =  function(name,config){
		if(typeof(_templates[name]) === "undefined"){
			_templates[name] = config;
		}else{
			console.error("Le template "+name+" a déjà été défini");
		}
	};
	
	this.getTemplate = function(name){
		if(typeof(name) === "undefined"){
			return _templates;
		}else if(typeof(_templates[name]) !== "undefined"){
				return _templates[name];
		}else{
			console.error("Le template "+name+" n'existe pas");
		}
	}
};
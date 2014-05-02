var Application = new function(){
	var initialisationState = "TO_START";
	var initSteps=[
		"DataBase",
		"Parameters"
	];
	var onReady = [];

	this.init = function(){
		initialisationState = "LOADING";
		var initializedModules = 0;
		for(var i = 0; i < initSteps.length; i++){
			var step = initSteps[i];
			if(Application[step] && typeof Application[step].init === "function"){
				Application[step].init(function(){
					initializedModules++;
					if(initializedModules === initSteps.length){
						initialisationState = "FINISHED";
						for(var i in onReady){
							var callback = onReady[i];
							if(typeof callback === "function"){
								callback();
							}
						}
					}							
				});
			}
		}
	};
	
	this.ready = function(callback){
		if(initialisationState !== "FINISHED"){
			onReady.push(callback);
			
			if(initialisationState === "TO_START"){
				Application.init();
			}
			
		}else if(typeof callback === "function"){
			callback();
		}
	}
	
	this.Types={
		"string":{
			"toString": function(value){return value+"";},
			"parse": function(value){return value+"";}
		},
		"number":{
			"toString": function(value){return value+"";},
			"parse": function(value){if(typeof(value) !== "number"){value = value * 1;} if(value % 1 == 0){return parseInt(value);}else{return parseFloat(value);}}
		},
		"boolean":{
			"toString": function(value){if(value === "O" || value ==="N"){return value;}else{return value ? "O" : "N";}},
			"parse": function(value){return value === "O" ? true : false;}
		},
		"date":{
			"toString": function(value){return value.toJSON();},
			"parse": function(value){return new Date(value);}
		}
	};
	this.Model = new function(){
		var _models={};
		this.relationships={
			"BELONGS_TO":"BELONGS_TO",
			"HAS_MANY":"HAS_MANY"
		};

		this.define =  function(name,config){
			if(typeof(_models[name]) === "undefined"){
				_models[name] = config;
			}else{
				console.error("Le model "+name+" a déjà été défini",_models[name]);
			}
		}
		this.getModel = function(name){
			if(typeof(name) === "undefined"){
				return _models;
			}else if(typeof(_models[name]) !== "undefined"){
				return _models[name];
			}else{
				throw "Le model "+name+" n'existe pas";
			}
		}
	
		this.createModelDataObject =function(modelName,data){
			
		};
	};
};
var Application = new function(){
	var _application = this;

	var initialisationState = "TO_START";
	var initSteps=[
		"DataBase",
		"Parameters"
	];
	var onReady = [];
	
	this.load = function(callback){
		var baseUrl = "app/core";
		function addJS(resource, callback){
			var script = document.createElement( 'script' );
			script.src = baseUrl+"/"+resource+".js";
			var element = document.getElementsByTagName("body")[0].appendChild(script);
			$(element).load(function(){
				if(typeof callback === "function"){
					callback();
				}
			});
		}
		addJS("resources",function(){
			var counter = 0;
			for(var i in resources){
				addJS(resources[i],function(){
					counter++;
					if(counter == resources.length){
						if(typeof callback === "function"){
							callback();
						}
					}
				});
			}
		});
	};
	this.init = function(){
		$("title").html(config.applicationName);
		var readyFunctionsLauncher= function(){
			for(var i in onReady){
				var callback = onReady[i];
				if(typeof callback === "function"){
					callback();
				}
			}
		};
	
		initialisationState = "LOADING";
		var initializedModules = 0;
		for(var i = 0; i < initSteps.length; i++){
			var step = initSteps[i];
			if(Application[step] && typeof Application[step].init === "function"){
				Application[step].init(function(){
					initializedModules++;
					if(initializedModules === initSteps.length){
						initialisationState = "FINISHED";
						readyFunctionsLauncher();
					}							
				});
			}else{
				initializedModules++;
				if(initializedModules === initSteps.length){
					initialisationState = "FINISHED";
					readyFunctionsLauncher();
				}	
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
	};
	this.Store =  new function(){
		var _stores={};
		
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
	this.Controller = new function(){
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
	this.View = new function(){
		var _views={};
		
		this.define =  function(name,config){
			if(typeof(_views[name]) === "undefined"){
				_views[name] = config;
			}else{
				console.error("La vue "+name+" a déjà été défini");
			}
		};
		
		this.getView = function(name){
			if(typeof(name) === "undefined"){
				return _views;
			}else if(typeof(_views[name]) !== "undefined"){
					return _views[name];
			}else{
				console.error("La vue "+name+" n'existe pas");
			}
		}
		
		this.display = function(viewName){
			for(var itemName in _views[viewName].template){
				var item = _views[viewName].template[itemName];
				if(typeof item === "object"){
					if(item.view && _views[item.view]){
						_application.View.display(item.view);
					}else{
						var tpl = _application.Template.getTemplate(item.name);
						var view = Handlebars.compile(tpl);
						var data = _views[viewName].getData();
						var html = view(data);
						if(typeof item.parentSelector === "undefined"){
							item.parentSelector = "body";
						}
						var element = $(item.parentSelector).append(html).get(0);
					}
				}
			}
			
			//ajout des évenements
			var events = {};
			for(var eventSelector in this.getView(viewName).events){
				for(var eventType in this.getView(viewName).events[eventSelector]){
					events[eventType] = function(event){
						//permet d'accéder aux info de la vue depuis les méthodes des évenements
						_self = this.getView(viewName);
						this.getView(viewName).events[eventSelector][eventType](event, this.getView(viewName));
					};
					Application.EventHandler.add(viewName, eventSelector, eventType, function(event,eventData, viewName){
						//permet d'accéder aux info de la vue depuis les méthodes des évenements
						_self = _application.getView(viewName);
						_application.getView(viewName).events[eventData.selector][eventData.eventType](event);
					});
				}
			}
		}
	};	
	this.Template = new function(){
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
	
	/* Quick accessors*/
	this.getView = function(name){
		return _application.View.getView(name);
	};
	this.getModel = function(name){
		return _application.Model.getModel(name);
	};
	this.getStore = function(name){
		return _application.Store.getStore(name);
	};
	this.getController = function(name){
		return _application.Controller.getController(name);
	};
	
	/**
	* Supprime le contenu de la page courante pour le remplacer par celui de la vue passée en paramètre
	* @viewName : nom de la vue à activer
	*/
	this.Navigate = function(viewName){
		$("body").html("");
		if(this.View.getView(viewName)){
			this.View.display(viewName);
			Application.EventHandler.setActiveView(viewName);
		}
	}
};
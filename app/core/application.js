/**
* Instance de l'application
*/
var Application = new function(){
	var _application = this;
	var initialisationState = "TO_START";
	var initSteps=[
		"DataBase",
		"Parameters"
	];
	var onReady = [];
	
	/**
	* Template du sytème de debug
	*/
	this.debugTemplate = null;
	
	/**
	* Varialbe contenant le nom de la vue active
	*/
	this.currentViewName = "";
	
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
			
				(function(i,resources){
					addJS(resources[i],function(){
						counter++;
						if(counter == resources.length){
							if(typeof callback === "function"){
								callback();
							}
						}
					});
				})(i,resources);
				
			}
		});
	};
	
	this.init = function(){
		$("title").html(config.applicationName);
		
		//si on est en mode débug on ajoute les éléments de controle de debug
		if(config.isDebug && !Application.isMobile){
			$("head").append("<link rel='stylesheet' href='styles/debug.css'>");
			var link = "./app/core/debug/template/debug.html";
			$.ajax( link )
			.done(function(result) {
				Application.debugTemplate = result;
				var html = $("body").html();
				$("body").html(result);
				$(".app-device-screen").html(html);
				
				$("head").append("<script src='app/core/debug/js/debug.js' async></script>");
			})
			.fail(function() {
				// en cas d'échec on ajoute la classe 'app-device-screen' au body pour éviter des problèmes de fonctionnement
				$("body").addClass("app-device-screen");
				throw "Impossible de charger le mode debug";
			});
		}

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
	
	/**
	* Permet de lancer des méthodes dès que l'application est initialisée.
	* @param callback : méthode à appeler
	*<example>
	* Application.ready(function(){
	*	alert("ok");
	* });
	*</example>
	*/
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
	
	/**
	*	Boolean initialisé à la création, il permet de savoir si l'application tourne sur mobile ou non.
	*/
	this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	/**
	* Définition des types
	* pour chaque type 2 méthodes sont créées: toString et parse
	*	_ toString: converti la valeur en paramètre en chaine de caractère et renvoi le résultat
	*	_ parse: converti la valeur en paramètre dans le type défini puis le renvoi
	*<example>
	*	Application.Types.number.parse("10") => 10
	*</example>
	*/
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
};
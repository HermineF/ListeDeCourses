/**
* Objet de gestion des vues de l'application
*/
Application.View = new function(){
	var _views={};
	
	/**
	*	Element html parent par défaut pour l'ajout de vue (si aucun élément parent n'est défini ce sera celui-ci qui sera utilisé)
	*/
	this.defaultParentSelector = config.isDebug && !Application.isMobile ? ".app-device-screen" : "body";
	
	if(config.isDebug && !Application.isMobile){
		this.defaultParentSelector = ".app-device-screen";
	}
	
	/**
	* Défini une nouvelle vue de l'application (gestion automatique par l'application)
	*@param name : nom de la vue
	*@param config : configuration de la vue
	*/
	this.define =  function(name,config){
		if(typeof(_views[name]) === "undefined"){
			_views[name] = config;
			Application.Data.addView(name);
			if(Application.getView(name).init){
				Application.getView(name).init();
			}
		}else{
			console.error("La vue "+name+" a déjà été défini");
		}
	};
	
	/**
	* Permet de récupérer une vue de l'application
	*@param name : nom de la vue à récupérer
	*/
	this.getView = function(name){
		if(typeof(name) === "undefined"){
			return _views;
		}else if(typeof(_views[name]) !== "undefined"){
				return _views[name];
		}else{
			console.error("La vue "+name+" n'existe pas");
		}
	}
	
	/**
	* Affiche le contenu d'une vue de l'application
	*@param viewName : nom de la vue à afficher
	*/
	this.display = function(viewName){
		if(Application.getView(viewName).onLoad){
			Application.getView(viewName).onLoad();
		}
		
		for(var itemName in _views[viewName].template){
			var item = _views[viewName].template[itemName];
			if(typeof item === "object"){
				if(item.view && _views[item.view]){
					Application.View.display(item.view);
				}else{
					var tpl = null;
					if(item.tpl){
						tpl = item.tpl;
					}else{
						tpl = Application.Template.getTemplate(item.name);
					}
					
					if(tpl){
						var view = Handlebars.compile(tpl);
						var data = Application.Data.getData(viewName);
						var html = view(data);
						if(typeof item.parentSelector === "undefined" ||  item.parentSelector === ""){
							item.parentSelector = this.defaultParentSelector;
						}else if(item.parentSelector === "body"){
							item.parentSelector = this.defaultParentSelector
						}
						var element = $(html);
						$(item.parentSelector).append(element);
						element.attr("data-view-name",viewName);
						
						Application.EventHandler.add(viewName, "[data-id]", "change", function(event,eventData, viewName){
							var value = "";
							if($(this).is("input")){
								value = $(this).val();
							}else{
								value = $(this).html();
							}
							var data = Handlebars.getBoundData(event.target);
							console.log("Data Changed : ",value, data);
							data = value;
							// TODO mettre à jour la valeur de la donnée
							
						});
					}
				}
			}
		}
		
		//ajout des évenements
		var view = this.getView(viewName);
		for(var eventSelector in view.events){
			for(var eventType in view.events[eventSelector]){
				(function(view, eventSelector, eventType){
					Application.EventHandler.add(viewName, eventSelector, eventType, function(event,eventData, viewName){
						(function(_self, _data){
							_self.events[eventData.selector][eventData.eventType](event, _self, _data);
						})(view, Handlebars.getBoundData(event.target));
					});
				})(view, eventSelector, eventType);
			}
		}
	};
	
	/**
	* Recompile les données de la vue et met à jour son affichage
	* @param viewName : nom de la vue à raffraichir
	*/
	this.refresh = function(viewName){
		if(typeof viewName === "undefined"){
			viewName = Application.currentViewName;
		}
		if(typeof viewName !== "undefined" && viewName !== ""){
			var element = $("[data-view-name="+viewName+"]");
			var html = "";
			
			for(var itemName in _views[viewName].template){
				var item = _views[viewName].template[itemName];
				if(typeof item === "object"){
					if(item.view && _views[item.view]){
						Application.View.refresh(item.view);
					}else{
						var tpl = Application.Template.getTemplate(item.name);
						if(tpl){
							var view = Handlebars.compile(tpl);
							var data = Application.Data.getData(viewName);
							html += view(data);
						}
					}
				}
			}
			var newElement = $(html);
			newElement.attr("data-view-name",viewName);
			element.replaceWith(newElement);
		}
	}
};

/** 
* Quick accessor to
*@see Application.View.getView
*/
Application.getView = function(name){
	return Application.View.getView(name);
};

/**
* Supprime le contenu de la page courante pour le remplacer par celui de la vue passée en paramètre
* @param viewName : nom de la vue à activer
*/
Application.Navigate = function(viewName){
	$(Application.View.defaultParentSelector).html("");
	if(Application.View.getView(viewName)){
		Application.View.display(viewName);
		Application.EventHandler.setActiveView(viewName);
		Application.currentViewName = viewName;
	}
};

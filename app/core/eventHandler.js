/**
* permet de gérer les évènements liés aux vues en prenant en compte leur activation/désactivation
*/
Application.EventHandler = new function(){
	var _events = {};
	var _currentView = null;
	var _addOrRemoveEnum = {
		"ADD": "ADD",
		"REMOVE": "REMOVE"
	};
	
	/**
	* Récupère les évènements qui ont été lancés et appel les callbacks appropriés
	* @param event : évènement lancés
	* @param eventData : données liées à l'évènement ( type, selecteur )
	*/
	var _handler = function(event,eventData){
		//eventData.eventType = event.type;
		
		var doHandle = function(viewName){
			if(typeof _events[viewName] !== "undefined" 
					&& typeof eventData.eventType !== "undefined" 
					&& typeof _events[viewName][eventData.eventType] !== "undefined" 
					&& typeof eventData.selector !== "undefined" 
					&& typeof _events[viewName][eventData.eventType][eventData.selector] !== "undefined"){	
				for( var i in _events[viewName][eventData.eventType][eventData.selector]){
					var callback = _events[viewName][eventData.eventType][eventData.selector][i].callback;
					if(typeof callback === "function"){
						callback(event,eventData, viewName);
					}
				}
			}
		}
		
		if(_currentView !== null){
			//on exécute les évenements de la vue
			doHandle(_currentView);
			//on exécute les évenemetns des vues filles
			for(var view in Application.getView(_currentView).template){
				var viewName = Application.getView(_currentView).template[view].view;
				doHandle(viewName);
			}
			//on exécute les évenements généraux
			//doHandle("");
		}
	};
	/**
	* ajoute ou supprime l'écoute des vues lorsqu'elles sont activées ou désactivées
	* @param viewName : nom de la vue
	* @param addOrRemoveEnum : activation (ADD) / désactivation (REMOVE) d'une vue
	*/
	var _manageEvents = function(viewName,addOrRemoveEnum){
		//ajout/suppression des évenèments de la vue
		for(var eventType in _events[viewName]){
			for(var selector in _events[viewName][eventType]){
			
				var functionToCall = function(selector, eventType){
					return function(e){
						_handler(e, {selector : selector, eventType : eventType } );
					};
				}(selector, eventType);
			
				//on ajoute le handler sur l'élément
				if($(selector).length > 0){
					if(addOrRemoveEnum === _addOrRemoveEnum.ADD){
						$(document).on(eventType, selector, functionToCall);
					}else{
						$(document).off(eventType, selector, functionToCall);
					}
				}else{
					console.warn("Event handler not referenced : selector not found",selector);
				}
			}
		}
		
		//ajout/suppression des évènement des vues filles
		var view = Application.getView(viewName);
		if(typeof view !== "undefined"){
			for(var itemName in view.template){
				var item = view.template[itemName];
				if(typeof item === "object"){
					if(item.view && Application.getView(item.view)){
						_manageEvents(item.view, addOrRemoveEnum);
					}
				}
			}
		}
		
		//ajout/suppression des évènements généraux
		//_manageEvents("", addOrRemoveEnum);
	};

	/**
	* Défini la vue active et permet d'activer les évènements qui lui sont liés
	*/
	this.setActiveView = function(viewName){
		//on supprime les évènements des vues active
		if(_currentView){
			//_manageEvents(_currentView, _addOrRemoveEnum.REMOVE);
		}
		//on change la vue
		_currentView = viewName;
		//on active les nouveaux évènements
		_manageEvents(viewName, _addOrRemoveEnum.ADD);
	};
	/**
	* Permet d'ajouter un évènement
	*/
	this.add = function(viewName, selector, eventType, callback){
		var event = {selector : selector, eventType : eventType, callback : callback};
		if(typeof _events[viewName] === "undefined"){
			_events[viewName] = {};
		}
		if(typeof _events[viewName][eventType] === "undefined"){
			_events[viewName][eventType] = {};
		}
		if(typeof _events[viewName][eventType][selector] === "undefined"){
			_events[viewName][eventType][selector] = [];
		}
		event.index = _events[viewName][eventType][selector].length;
		_events[viewName][eventType][selector].push(event);
		return event;
	};
	/**
	* Permet de supprimer un évènement
	*/
	this.remove = function(viewName, selector, eventType, callback){
		try{
			for(var i in _events[viewName][eventType][selector]){
				if(_events[viewName][eventType][selector][i].callback === callback){
					_events[viewName][eventType][selector].splice(i,1);
				}
			}
		}catch(error){
			console.error("L'évènement que vous essayez de supprimer n'existe pas", {"viewName" : viewName, "selector" : selector, "eventType" : eventType, "callback" : callback});
		}
	};
};
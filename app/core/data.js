/**
* Gestionnaire des données
*/
Application.Data =new function(){
	var _data = {};
	
	/**
	*	Add a specific data scope to a view
	*/
	this.addView = function(viewName){
		_data[viewName] = null;
	};
	
	/**
	* Get the data scope of a view
	*/
	this.getData = function(viewName){
		if(_data[viewName] === null){
				//la vue n'a pas été initialisée on l'initialise
				var viewData = Application.getView(viewName).data;
				if(viewData instanceof Application.BindableObject){
					_data[viewName] = viewData;
				}else{
					_data[viewName] = new Application.BindableObject(viewData);
				}
		}
		return _data[viewName];
	}
};
/**
* Shortcut for Application.Data.getData
*/
Application.getData = Application.Data.getData;
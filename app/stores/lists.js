Application.Store.define("lists",{
	model : "list",
	getData : function(){
		
		// TODO

		var data = [
			new Application.BindableObject({"name" : "Liste 1", "state" : LISTE_STATE.CREATING, "products" : []}),
			new Application.BindableObject({"name" : "Liste 2", "state" : LISTE_STATE.BUYING, "products" : []}),
			new Application.BindableObject({"name" : "Liste 3", "state" : LISTE_STATE.DONE, "products" : []}),
			new Application.BindableObject({"name" : "Liste 4", "state" : LISTE_STATE.DONE, "products" : []})
		];
		
		return data;
	}
});
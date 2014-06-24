Application.Store.define("lists",{
	model : "list",
	getData : function(){
		var data = [
			{"name" : "Liste 1", "state" : LISTE_STATE.CREATING, "products" : []},
			{"name" : "Liste 2", "state" : LISTE_STATE.BUYING, "products" : []},
			{"name" : "Liste 3", "state" : LISTE_STATE.DONE, "products" : []},
			{"name" : "Liste 4", "state" : LISTE_STATE.DONE, "products" : []}
		];
		return data;
	}
});
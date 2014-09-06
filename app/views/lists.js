Application.View.define("lists",{
	template : [
		{
			parentSelector : "body",
			name : "lists",
		}
	],
	events : {
		"#content .lists li" : {
			"click" : function(event, _self, _data){
				var selected = "selected";
			
				if(_data && Application.getData("lists").lists){
				
					// on parcours le tableau de listes pour gérer l'état de chaque liste
					for(var i in Application.getData("lists").lists){
						var currentElement = Application.getData("lists").lists[i];
						if(currentElement === _data){
							if(typeof _data.selected === "undefined"){
								_data.addProperty(selected,selected);
								Application.View.refresh();
							}else{
								_data.selected = _data.selected === selected ? "" : selected;
							}
						}else if(currentElement.selected === selected){
							currentElement.selected = "";
						}
					}
					
					// on gère les boutons du header
					Application.getData("header").actions.edit.isActive = _data.selected == selected;
					Application.getData("header").actions.remove.isActive = _data.selected == selected;
				}
			}
		},
	},
	
	data : Application.getStore("lists").getData()
});
	
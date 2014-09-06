/**
* Définition d'un objet pouvant être "Bindé"
* @param values : les valeurs et propriètés à mettre à l'objet
* <example>
*	{"name" : "John", "lastname" : "Brown", "age" : 35}
* </example>
*/
Application.BindableObject = function(values){
	this._uid = Math.uid();
	this._attachedViews = [];
	this.parent = null;
	this.isDirty = false;
	
	if(typeof values !== "undefined"){
		for(var key in values){
			var value = values[key];
			if(value instanceof Application.BindableObject){
				this[key] = value;
			}else{
				this.addProperty(key, value);
			}
		}
	}
};

/**
* Ajoute une propriété à l'objet pour que cette propriété soit elle aussi bindée
* @param name : nom de la propriété
* @param defaultValue : valeur par défaut de la propriété
*/
Application.BindableObject.prototype.addProperty = function(name, value){
	
	if(typeof name === "undefined" || ! /^[a-z_$]+[a-z_$0-9]*$/i.test(name)){
		throw "Le nom de la propriété est obligatoire et doit être un nom de variable valide javascript : '"+name+"'";
	}
	
	// on ajoute la variable en rajoutant '_' devant pour ne pas y accéder directement
	if(value && $.isArray(value) || value && $.isPlainObject(value)){
		if($.isArray(value)){
			this["_"+name]=[];
		}else{
			this["_"+name]={};
		}
		
		for(var i in value){
			var tmp = null;
			if(value[i] instanceof Application.BindableObject){
				tmp = value[i];
			}else{
				tmp = new Application.BindableObject(value[i]);
			}
			tmp.parent = this;
			this["_"+name][i] = tmp;
		}
	}else{
		this["_"+name] = typeof value !== "undefined" && value !== null ? value : null;
	}
	// on crée les getters et setters de la variable avec le vrai nom de la propriété
	Object.defineProperty(this, name, {
		get : function () {
			return this["_"+name];
		},
		set : function (val) {
				this["_"+name] = val;
				this.isDirty = true;
				Application.View.refresh();
		}
	});
};
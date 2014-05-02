var config={
	isDebug : true,

	database:{
		name: "ListeDeCourses",
		initializeDataOnCreation: true
	},
	
	/*
	* Les paramètres sont enregistrés automatiquement dans l'application
	* name : nom du param (string)
	* value : valeur du param (string)
	* isTemporary : défini si les données sont supprimées à la fermeture de l'application (boolean optional)
	*
	*	ex: {"name" : "lang", "value" : "fr", "isTemporary" : false},
	*
	*/
	parameters :[
		{"name" : "lang", "value" : "fr"},
		{"name" : "user_name", "value" : "Nicolas", "isTemporary" : true},
	]
	
	initialData:{
		"category":[
			{"ID":1,"name":"Nourriture"},
			{"ID":2,"name":"Fruits & Légumes", "parent":1},
			{"ID":3,"name":"Surgelés", "parent":1},
			{"ID":4,"name":"Epicerie", "parent":1},
			{"ID":5,"name":"Produits frais", "parent":1},
			{"ID":6,"name":"Viande & poisson", "parent":1},
			{"ID":8,"name":"Boissons", "parent":1},
		],
		"product":[
			{"ID":1,"category":4,"name":"Riz","unit":"g","price":2.27,"quantity":500,"uses":125},
			{"ID":3,"category":6,"name":"Jambon","unit":"","price":3.34,"quantity":4,"uses":1},
			{"ID":2,"category":8,"name":"Jus d'orange","unit":"l","price":3.33,"quantity":1,"uses":0.25}
		],
		"list":[
			{"name":"ma 1ere liste de courses","products":[{"ID":1},{"ID":2},{"ID":3}]}
		]
	}	
};
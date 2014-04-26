Application.Query=function(sqlStatement,args){
	this.sqlStatement = sqlStatement;
	if(typeof(args) === "undefined"){
		args = [];
	}
	this.arguments = args;
	this.nested = false;
}

Application.DataBase = new function(){
	var isInitialized = false;

	var currentObject = this;
	var db = openDatabase(config.database.name, config.database.version, "", config.database.size * 1024 * 1024, dbCreationCallBack);
	
	if(config.isDebug){
		dbCreationCallBack();
	}
		
	function errorCallback(){
		Logger.error(arguments);
	}
	
	function exec(queries, callback){
		var previousID = "";
		var transactionResults=[];
		var counter = 0;
		$.each(queries,function(index,query){
			db.transaction(function(tx) {
					counter++;
					if(typeof(query.sqlStatement) != "undefined"){
						if(typeof(query.arguments)==="undefined"){
							query.arguments = [];
						}
						if(query.arguments[0] === null){
							query.arguments[0] = previousID;
						}
						tx.executeSql(query.sqlStatement, query.arguments, function(tx,results){
							transactionResults.push(results);
							if(query.nested && results.rowsAffected>0){
								previousID = results.insertId;
							}
						},function(){
							errorCallback(query,arguments);
						});
					}
			},function(){
				errorCallback(arguments);
			}, function(){
				if(typeof(callback) === "function"){
					if(counter === queries.length){
						if(queries.length === 1){
							callback(transactionResults[0]);
						}else{
							callback(transactionResults);
						}
					}
				}
			});
		});
	}
	
	/**
	*	Méthode permettant la création des tables de la BDD
	*	appelle l'initialisation des données
	*/
	function dbCreationCallBack(){
		var queries = [];
		if(!isInitialized){
			isInitialized = true;
			var intermediateTables ={};
			for(var i in Application.Model.getModel()){
				var sql = "CREATE TABLE IF NOT EXISTS "+i;
				sql+="(ID INTEGER PRIMARY KEY ASC,";
				
				var model = Application.Model.getModel(i);
				for(var j in model){
					var type = model[j].type;
					if(typeof(Application.Types[type]) === "undefined"){
						//on vérifie que le type est un autre model
						var elementTypeModel = Application.Model.getModel(type);
						if(typeof(elementTypeModel) !== "undefined"){
							//on a trouvé la correspondance on regarde la relation
							if(model[j].relationship === Application.Model.relationships["BELONGS_TO"]){
								sql+=" "+j+" TEXT,";					
							}else if(model[j].relationship === Application.Model.relationships["HAS_MANY"]){
								//on a besoin d'une table de correspondances
								var tableName = i+"_"+model[j].type;
								var tmpSql = "CREATE TABLE IF NOT EXISTS "+tableName+"(ID_"+i+" INTEGER, ID_"+model[j].type+" INTEGER, CREATION_DATE TEXT, MODIFICATION_DATE TEXT, DELETION_DATE TEXT, IS_LOCALLY_MODIFIED TEXT);";
								queries.push(new Application.Query(tmpSql));
							}
						}
					}else{
						sql+=" "+j+" TEXT,";
					}
				}
				sql+=" CREATION_DATE TEXT, MODIFICATION_DATE TEXT, DELETION_DATE TEXT, IS_LOCALLY_MODIFIED TEXT";
				sql+=");";
				queries.push(new Application.Query(sql));
			}
			exec(queries);
			//on rajoute d'éventuelles données
			if(config.database.initializeDataOnCreation){
				initializeData();
			}else{
				Application.onInitializationDone();
			}
		}
	};
	
	function initializeData(){
		var queriesList = [];
		//on commence par vider la BDD
		$.each(Application.Model.getModel(),function(index,model){
			queriesList.push(new Application.Query("DELETE FROM "+index));
			$.each(model,function(propertyName,property){
				if(typeof(Application.Types[property.type]) === "undefined"
					&& typeof(Application.Model.getModel(property.type)) !== "undefined"
					&& Application.Model.relationships["HAS_MANY"] === property.relationship
				){
					queriesList.push(new Application.Query("DELETE FROM "+index+"_"+property.type));
				}
			});
		});
		//on insert les données
		for(var i in config.initialData){
			var model = config.initialData[i];
			var modelName = i;
			$.each(model,function(index,value){
				var queries = getInsertQueries(modelName, value,false);
				$.each(queries,function(index,query){
					queriesList.push(query);
				});
			});
		}
		exec(queriesList,function(){
			Application.onInitializationDone();
		});
	};

	function getInsertQueries(modelName, values,isLocallyModified){
		//par défaut on considère qu'on peux avoir besoin de plusieurs requêtes
		var queries=[];
		var model = Application.Model.getModel(modelName);
		var tmp = new Application.Query(query,[]);
		queries.push(tmp);
		
		var query = queries[0];
		var counter = 0;
		
		if(typeof(model) !== "undefined"){
			query.sqlStatement = "INSERT INTO "+modelName+"(";
			
			if(typeof(values["ID"]) !== "undefined"){
				query.sqlStatement += "ID";
				query.arguments.push(values["ID"]);
				counter++;
			}
			for(var property in model){
				if(typeof(values[property])!== "undefined"){
					var type = Application.Types[model[property].type];
					if(typeof(type) !== "undefined"){
						if(counter>0){
							query.sqlStatement += ", ";
						}
						query.sqlStatement += property;
						query.arguments.push(Application.Types[model[property].type].toString(values[property]));
						counter++;
					}else if(typeof(Application.Model.getModel(type))){
						if(Application.Model.relationships["BELONGS_TO"] === model[property].relationship){
							if(counter>0){
								query.sqlStatement += ", ";
							}
							query.sqlStatement += property;
							query.arguments.push(Application.Types["string"].toString(values[property]));
							counter++;
						}else if(Application.Model.relationships["HAS_MANY"] === model[property].relationship){
							query.nested = true;
							$.each(values[property],function(index,relation){
								var nestedQuery = new Application.Query("");
								nestedQuery.sqlStatement = "INSERT INTO "+modelName+"_"+model[property].type;
								nestedQuery.sqlStatement +="(ID_"+modelName+", ID_"+model[property].type;
								nestedQuery.sqlStatement += ", CREATION_DATE, IS_LOCALLY_MODIFIED";
								nestedQuery.sqlStatement +=")";
								nestedQuery.sqlStatement +="VALUES(?,?,?,?);";
								nestedQuery.arguments.push(null);
								nestedQuery.arguments.push(relation.ID);
								nestedQuery.arguments.push(Application.Types["date"].toString(new Date()));
								nestedQuery.arguments.push(Application.Types["boolean"].toString(isLocallyModified));
								queries.push(nestedQuery);
							});
						}
					}
				}else if(typeof(model[property].defaultValue) !== "undefined"){
					var type = Application.Types[model[property].type];
					if(typeof(type) !== "undefined"){
						if(counter>0){
							query.sqlStatement += ", ";
						}
						query.sqlStatement += property;
						query.arguments.push(Application.Types[model[property].type].toString(model[property].defaultValue));
						counter++;
					}
				}
			}
			if(counter>0){
				query.sqlStatement += ", ";
			}
			query.sqlStatement += "CREATION_DATE";
			query.arguments.push(Application.Types["date"].toString(new Date()));
			
			query.sqlStatement += ", IS_LOCALLY_MODIFIED";
			if(isLocallyModified){
				query.arguments.push(Application.Types["boolean"].toString(true));
			}else{
				query.arguments.push(Application.Types["boolean"].toString(false));
			}
			
			query.sqlStatement += ")VALUES(";
			for(var i = 0; i < query.arguments.length; i++){
				if(i!==0){
					query.sqlStatement += ", ";
				}
				query.sqlStatement += "?"
			}
			query.sqlStatement += ");";
		}else{
			Logger.warning("Le model "+modelName+" n'existe pas les données ne seront pas insérées");
		}
		return queries;
	}
	
	this.getModelData = function(modelName,callback){
		var queries = [];
		queries.push(new Application.Query("SELECT * FROM "+modelName));
		exec(queries,function(results){
				Logger.info(results.rows);
		});
	};
	
	/**
	* Permet d'exécuter une liste de requêtes sql sous forme de transaction
	*
	* example:
	* database.transaction([
	*		new Application.Query("INSERT INTO user(firstName,lastName) values(?,?)",["archibald","smith"]),
	*		new Application.Query("INSERT INTO user(firstName,lastName) values(?,?)",["steve","brown"])
	*]);
	*
	* @queries : liste des requêtes sql sous forme d'objets (Application.Query)
	* @callback : fonction exécutée après la requête les résultats sont passés en paramètre sous la forme d'un tableau de résultats (index correspondant à celui des requêtes)
	*/
	this.executeTransaction=function(queries, callback){
		exec(queries,callback);
	}
	
	/**
	* Permet d'exécuter une requête sql
	*
	* example:
	* database.query(
	*	new Application.Query("SELECT * from user WHERE name = ?",["steve"]),
	*	function(results){ 
	*		Logger.info(results);
	*	}
	* );
	*
	* @query : requête sql sous la forme d'un objet (Application.Query)
	* @arguments : arguments de la requête
	* @callback : méthode exécutée après la requête les resultats sont passés en paramètres
	*/
	this.executeQuery = function(query, callback){
		var queries = [];
		queries.push(query);
		this.executeTransaction(queries,callback);
	}

};
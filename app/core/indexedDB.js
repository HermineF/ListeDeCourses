Application.indexedDB = new function(){
	var db = null;
	
	this.init = function(callback){
		 var openRequest = indexedDB.open(config.database.name,2);
	
		openRequest.onupgradeneeded = function(e) {
			console.log("Upgrading");
			var thisDB = e.target.result;
 
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if(!thisDB.objectStoreNames.contains("people")) {
			/*
				thisDb.createObjectStore("test",  { keyPath: "email" });  
				thisDb.createObjectStore("test2", { autoIncrement: true });
			*/
				thisDB.createObjectStore("people",{ autoIncrement: true });
			}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
	 
		openRequest.onsuccess = function(e) {
			console.log("Success");
			db = e.target.result;
			
			if(typeof callback === "function"){
				callback();
			}
		}

		openRequest.onerror = function(e) {
			console.error("Error");
			console.error(e);
		}
	}
	
	this.insert = function(modelName,data){
		var transaction = db.transaction(["people"],"readwrite");
		var store = transaction.objectStore("people");
		//Define a person
		var person = {
			name:"Smith",
			email:"smith@smiths.corp",
			created:new Date()
		}
		//Perform the add
		var request = store.add(person);
		
		request.onerror = function(e) {
			console.error("Error",e.target.error.name);
		}
		 
		request.onsuccess = function(e) {
			console.log("Woot! Did it");
		}
	}
	
	this.select = function(modelName,options){
		var s = "";
 		db.transaction([modelName], "readonly").objectStore(modelName).openCursor().onsuccess = function(e) {
			var cursor = e.target.result;
			if(cursor) {
				s += "<h2>"+cursor.key+"</h2><p>";
				for(var field in cursor.value) {
					s+= field+"="+cursor.value[field]+"<br/>";
				}
				s+="</p>";
				cursor.continue();
			}
			document.querySelector("body").innerHTML = s;
		}
	}
};
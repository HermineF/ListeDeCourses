/**
* filesToLoad : liste les fichiers à récupérer pour générer la documentation
*	si l'extension des fichiers n'est pas indiquée on tentera de récupérer le fichier en ".js"
*
* _ row (array) : liste de fichier à lire directement
* _ resourcesLoader (array of objects) : liste de resources à récupérer
*	link: lien vers le fichier de resources
*	baseDir: racine des fichiers qui seront chargés 
*		# exemple 1 de fichier resource sous forme de liste:
*			var resources = [
*				"resource1",
*				"resource2.js",
*					...
*			];
*		# exemple 2 de fichier resource sous forme d'arborescence:
*			var resources = {
*				"directory1" : [
*					"resource1",
*					"resource2.js",
*						...
*				],
*				"directory2" : [
*					"directory2.1" : [
*							"resource1",
*							"resource2.js",
*								...
*					]
*					"directory2.2" : [
*							"resource1",
*							"resource2.js",
*								...
*					]
*					"resource2.js",
*						...
*				]
*					...
*			};
*/
var filesToLoad = {
	row : ["../config.js"],
	resourcesLoader : [ 
		{link : "../resources.js", baseDir : "../app/"},
		{link : "../app/core/resources.js", baseDir : "../app/core/"}
	]
}

var documentation=new function(){
	var rowfilesContent = {};

	this.init=function(){
		var counter = 0;
		var totalLoaded = 0;

		$(document).ready(function(){
			//on ajoute les fichier des fichiers resources dans les fichiers row
			var prepareFiles = function(){
				console.info("preparing files");
				if(filesToLoad.resourcesLoader){
					var i = 0;
					var next = function(){
						$.ajax({
							url: filesToLoad.resourcesLoader[i].link,
							success : function(result){
								//suppression du nom de la variable et de tous ce qu'il peux y avoir avant (commentaires, etc.)
								result = result.replace( /.*=/g,"");
								//suppression des commentaires
								result = result.replace( /\/\/.*\n/g,"");
								result = result.replace( /\/\*\*[^\/]*\//g,"");
								//suppression des sauts de ligne
								result = result.replace( /\n/g,"");
								//suppression des points virgules
								result = result.replace(";","");
								
								try{
									var addToRow = function(files, baseDir){
										if(Object.prototype.toString.call(files) === "[object Array]" ){
											//si Array
											for(var j in files){
												addToRow(files[j], baseDir);
											}
										}else if(typeof files === "object"){
											//si Objet
											for(var j in files){
												addToRow(files[j], baseDir + j + "/");
											}
										}else if(typeof files === "string"){
											//si String
											var link = baseDir + files;
											var patt = /\.[a-zA-Z]+/g;
											if(!patt.test(link)){
												//on ajoute l'extension .js si nécéssaire
												link = link + ".js";
											}
											filesToLoad.row.push(link);
										}
									}
									var files = JSON.parse(result);
									addToRow(files, filesToLoad.resourcesLoader[i].baseDir);
								}catch(e){
									console.error("Invalid file : "+filesToLoad.resourcesLoader[i].link,e);
								}
							}
						}).done(function() {
							i++;
							if(filesToLoad.resourcesLoader.length === i){
								getFilesContent();
							}else{
								next();
							}
						});
					}
					next();
				}
			}
			//on ajoute les fichiers bruts
			var getFilesContent = function(){
				console.info("retreiving  files content ");
				
				var addFile = function (resource, callback){
					$.ajax({
						url: resource,
						success : function(result){
							rowfilesContent.[resource] = result;
							totalLoaded++;
							callback();
						},
						error : function(){
							console.warn("Le fichier ", resource+" n'a pas pu être récupéré");
							totalLoaded++;
							callback();
						}
					});
				};
				var next = function(){
					totalLoaded++;
					if(totalLoaded ===  counter){
						//on passe à l'étape suivante
						extractMetaData();
					}else{
						//on load le prochain fichier
						addFile(filesToLoad.row[totalLoaded],next);
					}
				};
				
				if(filesToLoad.row && filesToLoad.row.length > 0){
					counter = filesToLoad.row.length;
					addFile(filesToLoad.row[totalLoaded], next );
				}
			}
			
			var extractMetaData = function(){
				console.log("extracting Data");
				var docRegex = /\/\*\*([^/]*)+\*\/([^:=]+)/g // $1 documentation, $2 function/variable name
				
				/*
				var input = "your input string"; 
				if(regex.test(input)) {
					var matches = input.match(regex);
					for(var match in matches) {
						//alert(matches[match]);
					}
				} else {
					//alert("No matches found!");
				}*/
			};
		
			//lance l'initialisation par la 1ere tache
			prepareFiles();
		});
	};
};
documentation.init();


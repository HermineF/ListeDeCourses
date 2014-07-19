/**
* Crée la documentation compléte du projet à partir des commentaires (sous forme de JAVADOC) des fichiers
*	Les mots clés suivants sont disponibles pour améliorer la compréhension de la documentation
* <ul>
* 	<li><b>@param parameterName : explication de la variable </b>=&gt; permet de donner des détails sur un paramètre à passer à la fonction</li>
* 	<li><b>@return explication de la variable </b>=&gt; permet de définir la valeur de donner des détails sur la valeur de retour de la fonction</li>
* 	<li><b>@throws explication de l'erreur </b>=&gt; permet de définir les erreurs (gérées) qui peuvent être lancées par la méthode</li>
* 	<li><b>@author nom de l'auteur</b> =&gt; permet d'indiquer le nom de la personne à la base du développement</li>
* 	<li><b>@version numéro de version </b>=&gt; permet d'indiquer la version du script</li>
* 	<li><b>@see nom de la variable à atteindre</b> =&gt;permet d'ajouter un lien vers une autre partie de la documentation</li>
* 	<li><b>@since numero de version/date </b>=&gt; permet de d'indiquer un changement depuis une version/date</li>
* 	<li><b>@serial </b>=&gt; permet d'indiquer l'architecture des données serialisées</li>
* 	<li><b>@deprecated </b>=&gt; permet d'indiquer qu'une fonction est dépréciée et ne devrait plus être utilisée</li>
*</ul>
*
* Des balises <b>HTML</b> peuvent être utilisées dans la documentation.
* Pour insérer un example il faut ajouter la balise <b>&lt;example&gt;&lt;/example&gt;</b>
*
* <div class="warning">La documentation n'interprètera que les parties documentées des scripts</div>
*
* @author Nicolas DECLERCQ
* @version 0.0.0
* @see documentation.init
*/
var documentation=new function(){
	/**
	* Liste les fichiers à récupérer pour générer la documentation
	*	si l'extension des fichiers n'est pas indiquée on tentera de récupérer le fichier en ".js"
	*
	*
	* les données se présentent sous la forme d'un objet JSON:
	*	@serial {<br>		row : [ ... ],<br>		resourcesLoader : [ {link : "...", baseDir : "..."}, ... ]<br>	}
	*	
	* _ row (array) : liste de fichier à lire directement
	* _ resourcesLoader (array of objects) : liste de resources à récupérer
	*	link: lien vers le fichier de resources
	*	baseDir: racine des fichiers qui seront chargés 
	*
	*# exemple 1 de fichier resource sous forme de liste:
	*<example>
	*			var resources = [
	*				"resource1",
	*				"resource2.js",
	*					...
	*			];
	*</example>
	*# exemple 2 de fichier resource sous forme d'arborescence:
	*<example>
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
	*</example>
	*/
	var filesToLoad = {};
	
	/**
	* liste complète des fichiers avec leur contenu
	*/
	var rowfilesContent = {};
	
	/**
	* arbre de la documentation une fois la documentation initialisée
	*/
	var _docTree = null;
	
	/**
	* Définition des Noeuds de l'arbre
	*/
	var Node = function(){
		var _name = "";
		var _fullName = "";
		var _doc = "";
		var _children = {
		};
		
		/**
		* récupère le nom du noeud
		*/
		this.getName = function(){
			return _name;
		}
		
		/**
		* donne le nom du noeud
		*/
		this.setName = function(name){
			_name = name;
		}
	
		/**
		* récupère le comlet nom du noeud
		*/
		this.getFullName = function(){
			return _fullName;
		}
		
		/**
		* donne le nom complet du noeud
		*/
		this.setFullName = function(name){
			_fullName = name;
		}
		
		/**
		* récupère la documentation du noeud
		*/
		this.getDoc = function(){
			return _doc;
		}
		
		/**
		* ajoute la documentation au noeud
		*/
		this.setDoc = function(doc){
			_doc = doc;
		}
	
		/**
		*	récupère les enfants du noeud
		*/
		this.getChildren = function(){
			return _children;
		}
		
		/**
		* ajoute un enfant au noeud
		*/
		this.addChild = function(child){
			_children[child.getName()] = child;
		}
		
		/**
		* récupère un enfant du noeud
		* @param name : nom du noeud enfant
		*/
		this.getChild = function(name){
			return _children[name];
		}
	}
	
	/**
	* Méthode d'initialisation de la documentation : 
	*	<ul><li>récupération des liens des fichiers à ouvrir</li>
	*	<li>récupération des fichiers</li>
	*	<li>traitement des fichiers</li></ul>
	* @param files : fichiers à charger dans la documentation
	* @see documentation.filesToLoad pour plus d'information sur le format des données à passer en paramètre
	*/
	this.init = function(files){
		filesToLoad = files;
		var counter = 0;
		var totalLoaded = 0;

		$(document).ready(function(){
			//on ajoute les fichier des fichiers resources dans les fichiers row
			var prepareFiles = function(){
				console.info("preparing files");
				if(filesToLoad.resourcesLoader && filesToLoad.resourcesLoader.length > 0){
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
				}else{
					getFilesContent();
				}
			}
			
			//on ajoute les fichiers bruts
			var getFilesContent = function(){
				console.info("retreiving  files content ");
				
				var addFile = function (resource, callback){
					$.ajax({
						url : resource,
						dataType  : "text",
						success : function(result){
							rowfilesContent[resource] = result;
							console.info("File loaded : "+resource);
							callback();
						},
						error : function(xhr, ajaxOptions, thrownError){
							console.warn("Le fichier ", resource+" n'a pas pu être récupéré");
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
			
			//on interprète les données
			var extractMetaData = function(){
				console.info("extracting Data");
				
				var regex = {
						"startDoc" : /\/\*\*/,
						"endDoc" : /\*\//,
						"array" : {
							"start" : /\[|new[\t ]+array[\t ]*\(/i,
							"end" : /\]/i
						},
						"object" : {
							"start" : /\{/i,
							"end" : /\}/i
						},
						"startExample" : /<[\t ]*example[\t ]*>/i,
						"endExample" : /<\/[\t ]*example[\t ]*>/i,
						"example" : {
							"keyword" : {
								values : ["break", "do", "instanceof", "typeof", "case", "else", "new", "var", "catch", "finally", "return", "void", "continue", "for", "switch", "while", "debugger", "function", "this", "with", "default", "if", "throw", "delete", "in", "try"],
								separated : true
							},
							"futureReservedWord" :{
								values : ["class", "enum", "extends", "super", "const", "export", "import"],
								separated : true
							},
							"punctuator" : {
								values : ["\\{", "\\}", "\\[", "\\]", "\\|", "\\(", "\\)", "\\.", ";", ",", "<", ">", "\\+", "-", "\\*", "%", "&", "\\^", "!", "~", "\\?", ":", "="],
								separated : false
							},
							"number" : {
								values : ["[+-]?[0-9]+"],// "[+-]?[0-9]*\.[0-9]+", "[+-]?[0-9]+x[0-9a-f]{2}", "[+-]?[0-9]+e[+-]?[0-9]+"],
								separated : false
							},
							"string" : {
								values : ["'([^']*)+'",'"([^"]*)+"'],
								separated : false
							},
							"boolean" : {
								values : ["true","false"],
								separated : false
							},
							"ex" : {
								values : ["\/\/.*"],
								separated : false
							}
						},
						"exampleExclude" : /<(\/)?[\t ]*([a-z]+)([\t ]+[a-z]+="([a-z]+)")*>/gi,
						"exampleInclude" : /£([^°]*)°([^°]*)°([^°]*)¤/gi
					};
				
				//permet d'ajouter le noeud dans l'arbre
				function getNodeInTree(fullVarName){
					//initialisation de l'arbre si pas créé
					if(_docTree === null){
						_docTree = new Node();
						_docTree.setName("ROOT");
					}
					var leaf = _docTree;
					
					//récupération des données de la branche
					var tree = fullVarName.split(".");
					var currentFullVarName="";
					for(var i in tree){
						if(i > 0){
							currentFullVarName += ".";
						}
						currentFullVarName += tree[ i ];
						if(typeof leaf.getChild !== "function"){
							leaf = new Node();
							leaf.setName("");
						}
						if( !  leaf.getChild(tree[ i ]) ){
							var tmp = new Node();
							tmp.setName(tree[ i ]);
							tmp.setFullName(currentFullVarName);
							leaf.addChild(tmp);
						}
						//on se déplace dans l'arbre vers le prochain noeud
						leaf = leaf.getChild(tree[ i ]);
					}
					return leaf;
				}

				//on parcours chaque document
				for(var fileLink in rowfilesContent){
					var data = rowfilesContent[fileLink];
					
					//on divise les fichiers en lignes
					var tmpLines = data.split(/\n/g);
					var lines = [];
					for(var lineNbr in tmpLines){
						var line = tmpLines[lineNbr];
						//on ne coupe pas les lignes des documentations
						if(! /^[\t ]*\*/.test(line)){
							if(/\{.*\}/.test(line)){
								var split = line.split(/[{}]/);
								for(var i in split){
									lines.push(split[i]);
								}
							}else if(/\[.*\]/.test(line)){
								var split = line.split(/[\[\]]/);
								for(var i in split){
									lines.push(split[i]);
								}
							}else{
								lines.push(line);
							}
						}else{
							lines.push(line);
						}
					}
					
					
					var currentLine = -1;
					
					var isInDocumentation = false;
					var isOnVarData = false;
					var tempDoc = "";
					var isInExample = false;
					
					function getCleanedVarName(varName){
						varName =varName.replace(/var[\t ]+/g,"");	//suppression de la déclaration de variable avec "var"
						varName =varName.replace(/this\./g,"");		//suppression de this
						varName =varName.replace(/[\t ]+/g,"");		//suppression des espaces restants
						varName =varName.replace(/'([^']+)'/g,"$1");//suppression des apostrophes
						varName =varName.replace(/"([^"]+)"/g,"$1");//suppression des guillemets
						varName =varName.replace(/^\{/g,"");//suppression des guillemets
						return varName;		
					}
					
					function createNode(parentName,line){
						var tmp = line.split(/[=:]/g);
						var varName =tmp[0];
	
						var header = "<div class='header'>";
						
							if(parentName !== ""){
								if(/var[\t ]+/g.test(varName)){
									header += "<div class='comment'>Private</div>";
								}else{
									header += "<div class='comment'>Public</div><div class='tab'></div>";
								}
							}else{
								header += "<div class='comment'>Global</div><div class='tab'></div>";
							}
							header +="<div class='tab'></div><div class='varName'>";
							//on ajoute le noeud dans l'arbre
							var node = getNodeInTree(parentName + getCleanedVarName(varName));
							var vars  = node.getFullName().split(".");
							var currentFullName = "";
							for(var i in vars){
								if(i!=0){
									currentFullName+=".";
									header+=".";
								}
								currentFullName += vars[i];
								if(i < vars.length -1){
									header+="<div class='see' link='"+currentFullName+"'>"+vars[i]+"</div>";
								}else{
									header+=vars[i];
								}
							}
							header+= "</div>";
						
						header+= "</div>";
						
						node.setDoc(header+tempDoc);
						tempDoc = "";
					}
					
					function interpretDocumentation(line){
						var doc = line;
						if(!isInExample && regex.startExample.test(doc)){
							doc = doc.replace(regex.startExample,"<div class='example'>");
							isInExample =true;
						}else if(isInExample){
							if(regex.endExample.test(doc)){
								doc = doc.replace(regex.endExample,"</div>");
								isInExample =false;
							}else{
								doc = doc.replace(regex.exampleExclude,"£$1°$2°$4¤");
								//on interprète l'exemple pour mettre la coloration syntaxique
								for(var i in regex.example){
									for(var j in regex.example[i].values){
										var regVal = "("+regex.example[i].values[j]+")";
										var reg;
										if(!regex.example[i].separated){
											reg = new RegExp("("+regex.example[i].values[j]+")","gi");
										}else{
											reg = new RegExp("^("+regex.example[i].values[j]+")|("+regex.example[i].values[j]+")$|[\t ]+("+regex.example[i].values[j]+")[\t ]+","gi");
										}
										doc = doc.replace(reg,"£°span°"+i+"¤$1£/°span°¤");
									}
								}
								doc = doc.replace(regex.exampleInclude,"<$1$2 class='$3'>");
								doc = doc.replace(/class=''/gi,"");
							}
						}
						
						doc = doc.replace(/[\t ]*\*/g,"");
						doc = doc.replace(/\t/g,"<span class='tab'></span>");
						doc = doc.replace(/^[\t ]*@param(.*)/g,"<div class='param'>$1</div>");
						doc = doc.replace(/^[\t ]*@return[\t :]*(.*)/g,"<div class='return'>$1</div>");
						doc = doc.replace(/^[\t ]*@throws[\t :]*(.*)/g,"<div class='throws'>$1</div>");
						doc = doc.replace(/^[\t ]*@author[\t :]*(.*)/g,"<div class='author'>$1</div>");
						doc = doc.replace(/^[\t ]*@version[\t :]*(.*)/g,"<div class='version'>$1</div>");
						doc = doc.replace(/^[\t ]*@since[\t :]*(.*)/g,"<div class='since'>$1</div>");
						doc = doc.replace(/^[\t ]*@serial[\t :]*(.*)/g,"<div class='serial'>$1</div>");
						doc = doc.replace(/^[\t ]*@deprecated[\t :]*(.*)/g,"<div class='deprecated'>$1</div>");
						doc = doc.replace(/^[\t ]*@see[\t :]+([^\t :]+)(.*)/g,"<div class='see' link='$1'><b>$1</b> $2</div>");
						doc += "<br/>";

						return doc;
					}
					
					//on parcours les lignes pour repèrer la doc
					function createTree(parentName, parentType){
						var keepGoing = true;
						
						if(parentName){
							parentName += ".";
						}else{
							parentName="";
						}
						
						
						while(currentLine < lines.length - 1 && keepGoing){
							currentLine++;
						
							//Traitement de la ligne
							if(isOnVarData){
								isOnVarData = false;
								var line = lines [ currentLine ];
								createNode(parentName,line);
							}else if(isInDocumentation){
								if(regex.endDoc.test(lines[currentLine])){
									isOnVarData = true;
									isInDocumentation = false;
								}else{
									tempDoc += interpretDocumentation(lines[currentLine]);
								}
							}
							
							if(!isOnVarData && !isInDocumentation && regex.startDoc.test(lines[currentLine])){
								isInDocumentation = true;
							}

							//Test pour définir si on change de noeud
							var line = lines[currentLine];
							
							if(!isInDocumentation){
								//si pas dans documentation on regarde si on doit changer de noeud
								if(parentType && regex[parentType].end.test(line)){
									//on revient au noeud parent
									keepGoing = false;
								}
								if(regex["array"].start.test(line)){
									//on crée une branche fille
									var varName = line.split(/[=:]/g)[0];
									varName = getCleanedVarName(varName);
									createTree(parentName + varName, "array");
								}else if(regex["object"].start.test(line)){
									//on crée une branche fille
									var varName = line.split(/[=:]/g)[0];
									varName = getCleanedVarName(varName);
									createTree(parentName + varName, "object");
								}
							}
						}
					}
					
					createTree();
				}
				
				// créé l'arbre en html
				function getHtmlTree(root){
					var html = "<li data='"+root.getFullName()+"'>";
					if(Object.keys(root.getChildren()).length >0){
						html += "<input type='checkbox' > "+root.getName()+"<ul>";
						//ajout des enfants
						for(var counter in root.getChildren()){
							var node = root.getChildren()[counter];
							html += getHtmlTree(node);
						}
						
						html+="</ul>";
					}else{
						html += root.getName()+"</li>";
					}
					return html;
				}
				
				//on n'affiche pas la racine on commence directement à ces enfants
				var html = getHtmlTree(_docTree);
				html = html.replace("<li data=''><input type='checkbox' > ROOT","");
				html = html.replace(/<\/ul>$/,"");
				$(".list ul").append(html);
				
				$(".list li").click(function(event){
					var node = getNodeInTree($(this).attr("data"));
					$(".list li").not(this).removeClass("selected");
					$(this).toggleClass("selected");
					$(".content").html(node.getDoc());

					// on ajoute l'évènement de click sur les liens
					$(".see").click(function(event){
						var link = $(this).attr("link");
						if(link && $(".list li[data=\""+ link.replace("\n","") +"\"]").length>0){
							$("input[type=checkbox]").prop("checked", false);
							link = link.replace("\n","");
							$(".list li").removeClass("selected");
							$(".list li[data=\""+link+"\"]").trigger("click").addClass("selected");
							
							function openParent(element){
								if(element.length >0){
									element.parent().parent().children("input[type=checkbox]").prop("checked", true);
									openParent($(element).parent().parent());
								}
							}
							openParent($(".list li[data=\""+link+"\"]"));
						}else{
							console.error("Dead Link : '"+link+"'");
						}
					});

					//on stoppe la propagation pour ne pas sélectionner le noeud parent
					event.stopPropagation();
				});
				
				//on supprime l'overlay
				$(".overlay").css("display","none");
			};
		
			//lance l'initialisation par la 1ere tache
			prepareFiles();
		});
	};
};
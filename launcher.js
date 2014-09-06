(function(){
	"use strict";
	
	var baseUrl="";

	var addJS = function(resource, callback){
		var link = baseUrl + "/" + resource;
		var patt = /\.js/gi;
		if(!patt.test(link)){
			//on ajoute l'extension .js si nécéssaire
			link = link + ".js";
		}
		$.ajax({
			url:link,
			success:function(){
				if(typeof callback === "function"){
					setTimeout(callback,100);
				}
			},
			dataType:'script',
			error: function(xhr, textStatus, errorThrown) {
				console.error("Exception thrown while loading application's resources : ",link,xhr,textStatus,errorThrown);
			}
		});
	};
		
	var addHtml = function(name,resource, callback){
		var link = baseUrl + "/" + resource;
		var patt = /\.html/gi;
		if(!patt.test(link)){
			//on ajoute l'extension .html si nécéssaire
			link = link + ".html";
		}
		$.ajax( link )
		.done(function(result) {
			Application.Template.define(name,result);
			if(typeof callback === "function"){
				callback();
			}
		})
		.fail(function() {
			if(typeof callback === "function"){
				callback();
			}
			throw "La vue "+name+" n'existe pas ("+resource+")";
		});
	}
	
	$(document).ready(function(){
		addJS("config");
		addJS("app/core/application",function(){
			Application.ready(function(){
				addJS("resources",function(){
					//Ajout des données utilisateur
					var resourcesTypes = [];
					for(var i in resources){
						resourcesTypes.push(i);
					}
					var typeIndex = 0;
					var index = 0;
					
					var addNextResource= function(){
						if(typeIndex < resourcesTypes.length){
							var category = resourcesTypes[typeIndex];
							var resourceCategory = resources[category];
							
							if(index >= resourceCategory.length){
								index = 0;
								typeIndex++;
								addNextResource();
							}else{
								var url = "app/"+category+"/"+resourceCategory[index];
								if(category !== "templates"){
									addJS(url, function(){
										index++;
										addNextResource();
									});
								}else{
									var url = "app/"+category+"/"+resourceCategory[index];
									addHtml(resourceCategory[index],url, function(){
										index++;
										addNextResource();
									});
								}
							}
						}else{
							addJS("main");
						}
					};
					
					addNextResource();
					
				});
			});
		});
	});
})();
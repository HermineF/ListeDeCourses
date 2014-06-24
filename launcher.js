var launcher=new function(){
	var baseUrl="";

	this.init=function(){
		function addJS(resource, callback){
			var script = document.createElement( 'script' );
			var link = baseUrl + "/" + resource;
			var patt = /\.js/gi;
			if(!patt.test(link)){
				//on ajoute l'extension .js si nécéssaire
				link = link + ".js";
			}
			script.src = link;
			var element = document.getElementsByTagName("body")[0].appendChild(script);
			$(element).load(function(){
				if(typeof callback === "function"){
					callback();
				}
			});
		}
		function addHtml(name,resource, callback){
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
				throw "La vue "+name+" n'existe pas";
			});
		}
	
		var counter = 0;
		var totalLoaded = 0;
		$(document).ready(function(){
			addJS("config");
			addJS("app/core/application",function(){
				Application.load(function(){
					addJS("resources",function(){
					
						//Ajout des données utilisateur
						for(var type in resources){
							for(var i in resources[type]){
								counter++;
								var url = "app/"+type+"/"+resources[type][i];
								if(type !== "templates"){
									addJS(url,function(){
										totalLoaded++;
										if(counter == totalLoaded){
											Application.init();
										}
									});
								}else{
									var url = "app/"+type+"/"+resources[type][i];
									addHtml(resources[type][i],url,function(){
										totalLoaded++;
										if(counter == totalLoaded){
											Application.init();
										}
									});
								}
							}
						}
						addJS("main");
					});
				});
			});
		});
	};
};
launcher.init();
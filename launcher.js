var launcher=new function(){
	var baseUrl="";

	this.init=function(){
		$(document).ready(function(){
			var i = 0;
			var load = function(){
				if(typeof resources[i] !== "undefined"){
					var script = document.createElement( 'script' );
					script.src = baseUrl+"/"+resources[i]+".js";
					var element = document.getElementsByTagName("body")[0].appendChild(script);
					i++;
					$(element).load(function(){
						load();
					});
				}else{
					//Fin du load on supprime les références au launcher
					launcher = undefined;
				}
			};
			setTimeout(load,20);
		});
	};
};
launcher.init();
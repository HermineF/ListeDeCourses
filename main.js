Application.ready(function(){
	//Ouverture de la documentation en appuyant sur F1
	if(config.isDebug){
		document.addEventListener("keydown",function(){
			if(event.keyCode === 112) {
				window.open(document.URL+"_documentation").focus();
				return false;
			}
		},false);
	}
	
	//Affichage de la page
	Application.Navigate("listsPage");
});

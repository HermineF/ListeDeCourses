var Logger = new function(){
	this.info=function(){
		if(config.isDebug){
			console.log(arguments);
		}
	};
	this.warning = function(){
		if(config.isDebug){
			console.warn(arguments);
		}
	};
	this.error = function(){
		if(config.isDebug){
			console.error(arguments);
		}
	};
}
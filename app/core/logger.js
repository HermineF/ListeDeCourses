(function () {
	var savedConsole = console;
	return function(debugOn,suppressAll){
		var suppress = suppressAll || false;
		if (debugOn === false) {
			console = {};
			console.log = function () { };
			if(suppress) {
				console.info = function () { };
				console.dir = function () { };
				console.warn = function () { };
				console.error = function () { };
			} else {
				console.info = savedConsole.info;
				console.dir = savedConsole.dir;
				console.warn = savedConsole.warn;
				console.error = savedConsole.error;              
			}
		} else {
			console = savedConsole;
		}
	}
})(config.isDebug);
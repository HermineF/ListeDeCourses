/**
*	Ajoute un évènement sur l'état de l'application si l'application n'est pas sur mobile:
* _ deviceready au démarage
* _ pause lorsque l'application passe à l'état inactive
* _ resume lorsque l'application sort de l'état inactive
*/
//deviceready
if(!Application.isMobile){
	(function(){
		function getBrowserPrefix() {
			if ('hidden' in document) {
				return null;
			}
			var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];

			for (var i = 0; i < browserPrefixes.length; i++) {
				var prefix = browserPrefixes[i] + 'Hidden';
				if (prefix in document) {
					return browserPrefixes[i];
				}
			}
			return null;
		}

		function hiddenProperty(prefix) {
			if (prefix) {
				return prefix + 'Hidden';
			} else {
				return 'hidden';
			}
		}

		function visibilityState(prefix) {
			if (prefix) {
				return prefix + 'VisibilityState';
			} else {
				return 'visibilityState';
			}
		}

		function visibilityEvent(prefix) {
			if (prefix) {
				return prefix + 'visibilitychange';
			} else {
				return 'visibilitychange';
			}
		}

		var prefix = getBrowserPrefix();
		var hidden = hiddenProperty(prefix);
		var visibilityState = visibilityState(prefix);
		var visibilityEvent = visibilityEvent(prefix);
		var isReady = false;
		
		document.addEventListener(visibilityEvent, function(event) {
			if (!document[hidden]) {
				if(isReady){
					$(document).trigger("resume");
				}else{
					$(document).trigger("deviceready");
				}
			} else {
				$(document).trigger("pause");
			}
		});
		
		Application.EventHandler.add(null, document, "deviceready", function(event) {
			isReady = true;
		});
	})();
}
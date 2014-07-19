(function() {
    var cache = [];
    Handlebars.registerHelper("bind-attr", function(context){
		var attrs = [];
		for(var prop in context.hash) {
			attrs.push(prop + '="' + context.hash[prop] + '"');
		}
		
		if( typeof this.getUID === "undefined"){
			this.getUID = Math.uid;
		}
        var dataKey = this.getUID();
        cache[dataKey] = this;
		
		attrs.push("data-id" + '="' + dataKey + '"');
		var value = attrs.join(" ");
		
        return  new Handlebars.SafeString(value);
    });

	Handlebars.registerHelper("bind", function(context){
		var attrs = [];
		for(var prop in context.hash) {
			attrs.push(prop + '="' + context.hash[prop] + '"');
		}
	
		if( typeof this.getUID === "undefined"){
			this.getUID = Math.uid;
		}
        var dataKey = this.getUID();
		
        cache[dataKey] = this;
        return new Handlebars.SafeString("<span data-id='" + dataKey+"'>"+context+"</span>");
    });
	
    Handlebars.getBoundData = function(handlebarId) {
        if(handlebarId){
			if (typeof handlebarId !== "string") {
				handlebarId = $(handlebarId).attr("data-id");
			}
			return cache[handlebarId];
		}
    };
})();
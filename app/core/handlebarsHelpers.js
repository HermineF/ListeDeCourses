(function(Handlebars) {

  var Utils = Handlebars.Utils;
  var registerHelper = Handlebars.registerHelper;

  Handlebars.Utils.isString = function(object) {
    return toString.call(object) == '[object String]';
  };

  Handlebars.registerHelper = function(name, fn, inverse) {
    var nestedFn = function() {
      var nestedArguments = [];

      for (var index = 0; index < arguments.length; index++) {
        var argument = arguments[index];

        if (argument && argument.hash) {
          for (key in argument.hash) argument.hash[key] = Handlebars.resolveNested.apply(this, [argument.hash[key]]);
          nestedArguments.push(argument);
        } else {
          nestedArguments.push(Handlebars.resolveNested.apply(this, [argument]));
        }
      }

      return fn.apply(this, nestedArguments);
    };

    registerHelper.apply(this, [name, nestedFn, inverse]);
  };

  Handlebars.resolveNested = function(value) {
    if (Utils.isString(value) && value.indexOf('{{') >= 0) value = Handlebars.compile(value)(this);
    return value;
  };

})(Handlebars);

(function() {
    var cache = [];
    Handlebars.registerHelper("bind-attr", function(context){
		var attrs = [];
		for(var prop in context.hash) {
			if(/.+\?.+:.+/.test(context.hash[prop])){
				console.log(context.hash[prop]);
				attrs.push(prop + '="' + eval(context.hash[prop]) + '"');
			}else{
				attrs.push(prop + '="' + context.hash[prop] + '"');
			}
		}
		
		if( typeof this._uid === "undefined"){
			this._uid = Math.uid;
		}
        var dataKey = this._uid;
        cache[dataKey] = this;
		
		attrs.push("data-id" + '="' + dataKey + '"');
		var value = attrs.join(" ");
		
        return  new Handlebars.SafeString(value);
    });

	Handlebars.registerHelper("bind", function(context){
		if( typeof this._uid === "undefined"){
			this._uid = Math.uid;
		} 
		var dataKey = this._uid;
		
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
Application.Model.define("list",{
	"name" : {"type" : "string","defaultValue": function(){return new Date();}},
	"state" : {"type" : "string","defaultValue":"CREATING"},
	"products" : {"type" : "product", "relationship" : Application.Model.relationships["HAS_MANY"]}
});
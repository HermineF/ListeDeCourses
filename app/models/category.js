Application.Model.define("category",{
	"name" : {"type" : "string"},
	"parent" : {"type" : "category", "relationship" : Application.Model.relationships["BELONGS_TO"]}
});
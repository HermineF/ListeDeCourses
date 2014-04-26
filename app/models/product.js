Application.Model.define("product",{
	"category" : {"type" : "category", "relationship" : Application.Model.relationships["BELONGS_TO"]},
	"name" : {"type" : "string"},
	"unit" : {"type" : "string"},
	"price" : {"type" : "number"},
	"quantity" : {"type" : "number"},
	"statistics" : {"type" : "number", "defaultValue": 0},
	"remains" : {"type" : "number", "defaultValue": 0},
	"uses" : {"type" : "number"}
});
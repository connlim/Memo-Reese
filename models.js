module.exports = function(mongoose){
	var Schema = mongoose.Schema;
	
	var User = mongoose.model("User", {
		username : String,
		description : String, 
		password : String,
		
	});
	var Person = mongoose.model("Person", {
		tag : String,
		
	});
	
	var File = mongoose.model("File", {
		
	});
	
	[{ type: Schema.Types.ObjectId, ref: "User" }]
	
	return {
		User : User,
		Person : Person,
		File : File
	};
}
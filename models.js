module.exports = function(mongoose){
	var Schema = mongoose.Schema;
	
	var User = mongoose.model("User", {
		username : String,
		description : String, 
		password : String,
		files : [{ type: Schema.Types.ObjectId, ref: "File" }],
	});
	var Person = mongoose.model("Person", {
		tag : String,
		
	});
	
	var File = mongoose.model("File", {
		tags : [String],
		type : String,
		url : String
	});
	
	//[{ type: Schema.Types.ObjectId, ref: "User" }]
	
	return {
		User : User,
		Person : Person,
		File : File
	};
}
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
	
	var Event = mongoose.model("Event", {
		name : String,
		id : String,
		location: {
            textual: {type: String, default: ""},
            lat: Number,
            lng: Number
        },
		datetime: String
	});

	var File = mongoose.model("File", {
		name : String,
		tags : [String],
		type : String,
		url : String,
		uploader : String,
		event : { type: Schema.Types.ObjectId, ref: "Event", default: null}
	});

	//[{ type: Schema.Types.ObjectId, ref: "User" }]

	return {
		User : User,
		Person : Person,
		Event : Event,
		File : File
	};
}

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniquevalidator = require('mongoose-unique-validator');


// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
		unique:true

	},
	password: {
		type: String
	},
	email: {
		type: String
		,
		unique:true
	},
	name: {
		type: String
	},
	employee_id :{
        type:Number
    },
    mobile_no :{
        type:Number
    },
    department :{
        type:String
    },
    designation :{
        type:String
    },
    security_ques :{
        type:String
    },
    security_ans :{
        type:String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);
UserSchema.plugin(uniquevalidator, {message: 'is already taken.'});



module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
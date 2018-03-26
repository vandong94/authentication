var mongoose = require('mongoose');

var userSchema = new mongoose.Schema( {
    username: String,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true, 
    },
    phone: String,
    balance: {
        type: Number, default: 100
    },

});

var User = mongoose.model("users", userSchema);

//module.exports = mongoose.model('user', User);
module.exports = User;

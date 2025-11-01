const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    password: { 
        type: String, 
        required: true 
    },
})

let user = mongoose.model("User", userSchema);
module.exports = user;
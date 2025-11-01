const mongoose = require("mongoose");

let taskSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },

    taskName: {
        type: String,
        required: true
    },

    taskDescription: {
        type: String,
        required: false
    },

    Date: {
        type: Date,
        default: Date.now
    }
})

let task = mongoose.model("Task", taskSchema);
module.exports = task;  
const mongoose = require("mongoose");

let taskSchema = mongoose.Schema({
    userId: {
        type: String,
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
    isComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


let task = mongoose.model("Task", taskSchema);
module.exports = task;  
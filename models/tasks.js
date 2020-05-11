const mongoose = require("mongoose");

let taskSchema = new mongoose.Schema({
    projectId:{type: String},
    title:{type: String},
    done:{type: Boolean},
    status:{type: String},
    dateCreated:{type: Date},
    priority:{type: String}
});

const Task = mongoose.model('Task',taskSchema);

module.exports  = Task;

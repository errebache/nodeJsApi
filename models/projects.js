const mongoose = require("mongoose");

let ProjectsSchema =  new mongoose.Schema({
    title:{type: String},
    description: {type: String},
    comments:{type: Array}
});

const Projects = mongoose.model('Projects',ProjectsSchema);

module.exports = Projects;
const express = require("express");
const router = express.Router();
const Projects = require("../../models/projects");
const config = require("../../config/database");


router.post('/add',(req,res) => {
    let projects = new Projects(req.body);

    projects.save((err) => {
        if(err) res.status(500).send(err);
        else res.send(projects);
    })
});


router.get('/list',(req,res) => {

    Projects.find((err,projects) => {
        if(err) res.status(500).send(err);
        else res.send(projects);
    })
});

router.put('/update/:id',(req,res) => {

    if(!req.body) {
        return res.status(400).send({
            message: "Projects content can not be empty"
        });
    }

    Projects.findByIdAndUpdate(req.params.id,req.body)
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: "project not found with id " + req.params.id
            });
        }
        res.send(project);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "project not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating project with id " + req.params.id
        });
    });

});

router.delete('/delete/:id',(req,res) => {
  
    Projects.findByIdAndRemove(req.params.id)
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: "Project not found with id " + req.params.id
            });
        }
        res.send({message: "Project deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Porject not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });

})
module.exports = router;
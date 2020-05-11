const  express = require("express");
const router = express.Router();
const Task = require("../../models/tasks");
const config = require("../../config/database");

router.post('/add',(req,res) => {

    let tasks = new Task(req.body);
    
    tasks.save(err => {
        if(err) res.status(500).send(err);
        else res.send(tasks);
    });
   
});


router.get('/list',(req,res) => {
    Task.find((err,tasks) => {
        if(err) res.status(500).send(err);
        else res.send(tasks);
    })
})

router.put('/update/:id',(req,res) => {

    if(!req.body) {
        return res.status(400).send({
            message: "Tasks content can not be empty"
        });
    }

    Task.findByIdAndUpdate(req.params.id,req.body)
    .then(task => {
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.id
            });
        }
        res.send(task);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "project not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating task with id " + req.params.id
        });
    });

});


router.get('/:projectId',(req,res) => { 

        var search_key = req.param('projectId');
            Task.find({projectId: search_key})
               .then(task => res.json(task))
               .catch(err => res.status(404).json({ success: false }));
            
});

router.delete('/delete/:id',(req,res) => {

    Task.findByIdAndRemove(req.params.id)
    .then(task => {
        if(task) {
            return res.status(404).send({
                message: "Task not Found with id " + req.params.id
            })
        }
        res.send({message: "Task deleted succefully !"})
    }).catch(err => {
        if(err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({
                message: "Task not found with id " + req.params.id
            })
        }
        return res.status(500).send({
            message: "Could not delete with id " + req.params.id
        })
    })
})




module.exports = router;
const express = require('express');

const server = express();

server.use(express.json());

let count = 1;
server.use((req, res, next) => {
    console.log(`Number of requests: ${count++}`);

    return next();
});

function checkProjectExists(req, res, next) {
    let { id } = req.params;
    if (id){
        let project = projects.find(f => f.id == id);
        if (project) req.project = project;

        return next();
    }
    
    return res.status(404).json({ error: 'Project not found.'});
}

const projects = [{
    id: '1',
    title: 'First project',
    tasks: []
}];

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    let { id, title } = req.body;

    projects.push({
        id,
        title,
        tasks: []
    });

    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
    let title = req.body.title;

    req.project.title = title;

    return res.json(req.project);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    let { title } = req.body;

    req.project.tasks.push(title);

    return res.json(req.project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    projects.pop(req.project);

    return res.send();
});

server.listen(3000);
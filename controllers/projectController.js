const Project = require('../models/projectModel');

exports.getAllProjects = async (req, res, next) => {
    try {
        const allProjects = await Project.find();

        res.status(201).json({
            status: 'success',
            numResults: allProjects.length,
            data: allProjects
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    };
};

exports.createProject = async (req, res, next) => {
    try {
        const newProject = await Project.create(req.body);

        console.log(newProject);

        res.status(201).json({
            status: 'success',
            data: newProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            data: err.message
        });
    };
};

exports.updateProject = async (req, res, next) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(201).json({
            status: 'success',
            data: updatedProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    };
};

exports.getSingleProject = async (req, res, next) => {
    try {
        const singleProject = await Project.findById(req.params.id);

        res.status(201).json({
            status: 'success',
            data: singleProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    };
};
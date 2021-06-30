const User = require('../models/userModel');
const Project = require('../models/projectModel');

// Retrieve all projects linked to current user
exports.getAllProjects = async (req, res, next) => {
    try {
        const allProjects = await Project.find({ user: req.user.id });

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

// Create project linked to current user
exports.createProject = async (req, res, next) => {
    try {
        // Assures that the project will be linked to the currently logged in user
        if (req.body.user) req.body.user = undefined;
        req.body.user = req.user.id;

        const newProject = await Project.create(req.body);

        res.status(201).json({
            status: 'success',
            data: newProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            data: err
        });
    };
};

// Update project linked to current user
exports.updateProject = async (req, res, next) => {
    try {
        const updatedProject = await Project.findOneAndUpdate({ user: req.user.id, _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProject) throw "Project does not exist or is not linked to your user account."

        res.status(201).json({
            status: 'success',
            data: updatedProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    };
};

// Retrieve singe project linked to current user
exports.getSingleProject = async (req, res, next) => {
    try {
        const singleProject = await Project.findOne({ user: req.user.id, _id: req.params.id });

        if (!singleProject) throw "Project does not exist or is not linked to your user account."

        res.status(201).json({
            status: 'success',
            data: singleProject
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    };
};
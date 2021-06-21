const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    concept_heading: {
        type: String,
        required: true
    },
    purpose_list: {
        type: [String]
    },
    learned_list: {
        type: [String]
    },
    feature_text_list: {
        type: [String]
    },
    feature_checklist: {
        type: [Number]
    },
    needed_text_list: {
        type: [String]
    },
    needed_checklist: {
        type: [Boolean]
    },
    updates: {
        type: [Object]
    }
    ,
    final_note_text: {
        type: String
    },
    progress_bar: {
    type: [[Number]]
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
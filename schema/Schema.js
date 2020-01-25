const mongoose = require('mongoose');

const issueTrackerSchema = new mongoose.Schema({
    open: Boolean,
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: {
        type: String,
        default: '',
    },
    status_text: {
        type: String,
        default: '',
    },
    created_on: {
        type: Date,
        default: Date.now(),
    },
    updated_on: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = issueTrackerSchema;

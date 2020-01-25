'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const issueTrackerSchema = require('../schema/Schema.js');

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log(mongoose.connection.readyState);

const IssueTrackerModel = mongoose.model('IssueTracker', issueTrackerSchema);

module.exports = function(app) {
    app.route('/api/issues/:project')

        .get(function(req, res) {
            let project = req.params.project;
            console.log(req.query);

            IssueTrackerModel.find(req.query).exec((err, data) => {
                console.log(data);
                res.json(data);
                res.end();
            });
        })

        .post(function(req, res) {
            let project = req.params.project;
            console.log(project);

            let {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
            } = req.body;

            let issue = new IssueTrackerModel({
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                open: true,
                created_on: Date.now(),
                updated_on: Date.now(),
            });

            issue.save((err, data) => {
                if (err) console.error(err);
                console.log(data);
                res.json(data);
                res.end();
            });
        })

        .put(function(req, res) {
            let project = req.params.project;
            let {
                _id,
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
            } = req.body;
            if (
                issue_title === '' &&
                issue_text === '' &&
                created_by === '' &&
                assigned_to === '' &&
                status_text === ''
            ) {
                res.json('no updated field sent');
                res.end();
            }

            let updateData = {};
            for (let keys in req.body) {
                if (req.body[keys]) updateData[keys] = req.body[keys];
            }
            updateData.updated_on = Date.now();

            IssueTrackerModel.findByIdAndUpdate(
                _id,
                updateData,
                (err, data) => {
                    if (err) {
                        res.json('could not update');
                        res.end();
                    }
                    console.log('put find', data);
                    res.json('successfully updated');
                    res.end();
                }
            );
        })

        .delete(function(req, res) {
            let project = req.params.project;
            let { _id } = req.body;
            if (_id === '') {
                res.json('_id error');
                res.end();
            }
            IssueTrackerModel.findByIdAndDelete(_id, (err, data) => {
                if (err || data === null) {
                    res.json(`could not delete ${_id}`);
                    res.end();
                } else {
                    console.log(data);
                    res.json(`deleted ${_id}`);
                    res.end();
                }
            });
        });
};

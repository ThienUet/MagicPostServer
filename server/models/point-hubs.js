const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const moment = require('moment');

const PointHubsSchema = new Schema({
    name: {type: String, require: true},
    address: {type: String, require: true},
    pointTrans: {type: Object, require: true},
    pointType: {type: String, require: true},
    lat: {type: String, require: true},
    lng: {type: String, require: true},
    pointManager: {type: String, require: true},
    createBy: {type: String, require: true, default: 'admin'},
    createDate: {type: Date, default: moment().format()},
    updatedBy: {type: String, require: true, default: 'admin'},
    updatedDate: {type: Date, default: moment().format()},
})

module.exports = Mongoose.model('point-hubs', PointHubsSchema, 'point-hubs');
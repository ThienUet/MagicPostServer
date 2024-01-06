const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const moment = require('moment');

const OrderSchema = new Schema({
    name: {type: String, require: true},
    sentUser: {type: Object, require: true},
    receiveUser: {type: Object, require: true},
    lat: {type: Number, require: true},
    lng: {type: Number, require: true},
    sentCoordinate: {
        lat: {type: Number, require: true},
        lng: {type: Number, require: true}
    },
    receiveCoordinate: {
        lat: {type: Number, require: true},
        lng: {type: Number, require: true}
    },
    status: {type: String, require: true},
    weight: {type: Number, require: true},
    createBy: {type: String, require: true},
    createDate: {type: Date, default: moment().format()},
    updatedBy: {type: String, require: true},
    updatedDate: {type: Date, default: moment().format()},
});

module.exports = Mongoose.model('orders', OrderSchema, 'orders');
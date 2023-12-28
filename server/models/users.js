const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const moment = require('moment');
moment.locale('vi');

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    imageAvatar: {type: String, required: false, default: ''},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'client'},
    gender: {type: String, required: true},
    birthDate: {type: Date, required: false, default: moment().format()},
    isActive: {type: Boolean, required: true, default: true},
    isBanned: {type: Boolean, default: false},
    updatedDate: {type: Date, required: false},
    createDate: {type: Date, required: false, default: moment().format()},
    createBy: {type: String, required: false},
    updateBy: {type: String, required: false},
});

module.exports = Mongoose.model('user', UserSchema, 'user');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const passportLocalMongoose = require('passport-local-mongoose');

let ProductSchema = new mongoose.Schema({
    title: { type: String },
    created: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

module.exports = mongoose.model('Product', ProductSchema);
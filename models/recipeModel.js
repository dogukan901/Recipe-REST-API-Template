const mongoose = require('mongoose');
const User = require('../models/userModel');
const passportLocalMongoose = require('passport-local-mongoose');

let RecipeSchema = new mongoose.Schema({
    title: { type: String },
    created: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ingredients: [{
        title: { type: String },
        recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }]
});



module.exports = mongoose.model('Recipe', RecipeSchema);
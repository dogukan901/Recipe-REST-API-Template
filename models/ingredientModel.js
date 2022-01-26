const mongoose = require('mongoose');
const User = require('../models/userModel');
const passportLocalMongoose = require('passport-local-mongoose');
const recipeModel = require('./recipeModel');

let IngredientSchema = new mongoose.Schema({
    title: { type: String },
    created: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Ingredient', IngredientSchema);
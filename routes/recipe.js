var express = require('express');
var router = express.Router();
const loginMiddleware = require('../middleware/auth-middleware');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

//@route  GET /api/recipe
//@desc   Get Recipes
//@access Private
router.get('/', loginMiddleware.isLoggedIn, async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ owner: req.user._id });
        return res.json(recipes);
        // res.send('Welcome To Recipe Route (This is a private access route)')
    } catch (error) {
        res.status(400).send('Sth went wrong');
    }

});

router.post('/', loginMiddleware.isLoggedIn, async (req, res, next) => {
    try {
        // const user = await User.findById(req.user._id).select('-password');
        const recipes = await Recipe.find({ owner: req.user.id });

        const newRecipe = new Recipe({
            title: req.body.title,
            owner: req.user.id
        });

        if (recipes.some(recipe => recipe.title === newRecipe.title)) {
            return res.status(400).send('A recipe with same name has already been created on this account')
        } else {
            const recipe = await newRecipe.save();
            // console.log('geldim')
            return res.json(recipe);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error :(');
    }
    // res.send('Welcome to ingredients route');

});


module.exports = router;

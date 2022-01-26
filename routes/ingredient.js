var express = require('express');
const passport = require('passport');
const loginMiddleware = require('../middleware/auth-middleware');
var router = express.Router();
const Ingredient = require('../models/ingredientModel');
const authentication = require('../middleware/auth-middleware');
const { axios_get } = require('../axios_api_calls');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

/* var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
)); */


//@route  GET api/ingredient/:ingredientName
//@desc   Get the ingredients
//@access Private
router.get('/:ingredientName', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const ingredientName = req.params.ingredientName
            const IngredientsQuery = `?query=${ingredientName}`;
            // const ingredients = await Ingredient.find().sort({ created: -1 });
            const ingredientsFromExternalApi = await axios_get(`/food/ingredients/search${IngredientsQuery}`);
            const ingredientresults = ingredientsFromExternalApi.data.results.map((ingredient) => ({
                ingredient: ingredient
            }))
            return res.json(ingredientresults);
        } else {
            res.status(401).send('You are unauthenticated for this route')
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    // return res.send('hello you are in an authenticated route made by dogukan');



    // if (!req.isAuthenticated) {
    //     res.send('you are not authenticated for this route');

    // }


});


router.get('/', loginMiddleware.isLoggedIn, async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find({ owner: req.user._id }).sort({ created: -1 });
        return res.json(ingredients);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error :(');
    }
    // res.send('Welcome to ingredients route');

});

router.post('/:recipeTitle', loginMiddleware.isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        const recipe = await Recipe.findOne({ title: req.params.recipeTitle, owner: user._id });

        const newIngredient = new Ingredient({
            title: req.body.title,
            owner: user._id
        })

        if (recipe.ingredients.every((ingredient) => ingredient.title !== newIngredient.title)) {

            const ingredientSavedToDb = await newIngredient.save();
            recipe.ingredients.unshift(ingredientSavedToDb);
            await recipe.save();
            return res.json(ingredientSavedToDb);
        } else {
            res.status(400).send('This ingredient already been added to this recipe');
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error :(');
    }
    // res.send('Welcome to ingredients route');

});

module.exports = router;

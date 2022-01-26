var express = require('express');
var router = express.Router();
const passport = require('passport'),
  User = require('../models/userModel');

/* register */
router.post('/register', (req, res) => {
  try {
    let newUser = new User({
      username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        return res.json({
          success: false, message: "Your account could not be saved due to this Error: ", err
        });
      }
      passport.authenticate('local')
        (req, res, () => {
          User.findOne(newUser, (err, person) => {
            res.statusCode = 200;
            return res.json({
              success: true,
              status: 'Success registered and logged in, use authenticated routes for other operations',
            });
          });
        });
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Sth went wrong while signing');
  }

});

// login

/* router.post('/login', passport.authenticate('local'), (req, res) => {
  if (!req.body.username) {
    return res.json({ success: false, message: "Username was not given" })
  } else {
    if (!req.body.password) {
      return res.json({ success: false, message: "Password was not given" })
    } else {
      try {
        User.findOne({
          username: req.body.username
        },
          (err, person) => {
            if (req.session.username) {
              res.status(400).send('User already logged in');
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: `You are successfully logged in!, Welcome ${person.username} you can use token below in order to make operation with user token query parameters`,
                token: req.user._id
              });
            }

          })
      } catch (error) {
        console.error(error.message);
        res.status(401).send('Sth went wrong while logging in');
      }
    }
  }

}); */


router.post('/login', function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return res.status(400).send(err); }
    if (!user) { return res.redirect('/login'); }
    if (req.isAuthenticated()) {
      return res.status(400).send('User already logged in');
    }
    req.logIn(user, function (err) {
      if (err) { return res.status(400).send(err); }

      res.statusCode = 200;
      return res.json({
        success: true,
        status: `You are successfully logged in!, Welcome ${user.username} you can use token below in order to make operation with user token query parameters`,
        token: user._id
      });
    });
  })(req, res);
});

// Visiting this route logs the user out
router.post('/logout', (req, res) => {
  try {
    if (req.user) {
      const temp = req.user.username;
      req.logout();
      res.status(200).send(`You are successfully logged out of the system dear user ${temp}`);
    }
    else {
      res.status(404).send('You cant logout hence you are not logged in :( Please log in to the System first');
    }

  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error :(');
  }

});


module.exports = router;
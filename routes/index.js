var express = require('express');
var router = express.Router();


const APIDOCS = {
  info: {
    version: "1.0.0",
    title: "Template For A Recipe API  - Gazi University Distributed Systems Project",
    description: "This is a Public Rest API for Recipes and Food Details for manipulations on that food item",
    author: "Dogukan Okcu 181180761",
    database: "Mongo DB Atlas Cloud Database AWS M0 Sandbox (General) Cluster Tier"
  },
  host: "localhost:3000",
  basePath: "/api",
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  endpoints: [
    {
      "GET /": {
        desc: "Recipe And Food API Documentation",
        requestparams: "-",
        requestbody: "-",
        responsebody: [
          200,
          404,
          500
        ]
      }
    },

    {
      "GET /food": {
        desc: "Food here!",
        requestparams: "-",
        requestbody: "-",
        responsebody: [
          200,
          404,
          500
        ]
      }
    },

  ]

}


/* GET home page. */
router.get('/', function (req, res, next) {
  return res.send(APIDOCS).status(200);
});

module.exports = router;

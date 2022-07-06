const express = require('express');

//controllers
const { create, getItems } = require('../controllers/meals');

//middlewares
const { restaurantExists } = require('../middlewares/restaurants');

//validators
const { mealsValidator } = require('../validators/meals');

//utils
const { verifyToken } = require('../utils/verifyToken');

const mealsRouter = express.Router();

//htttp://localhost:port/api/v1/user GET,POST,DELET,PUT
mealsRouter.post("/:id", verifyToken, restaurantExists, mealsValidator,create)
mealsRouter.get("/",getItems)

module.exports = { mealsRouter };
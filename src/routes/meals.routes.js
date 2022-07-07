const express = require('express');

//controllers
const { create, getItems, getItem, update, deleted } = require('../controllers/meals');

//middlewares
const { restaurantExists } = require('../middlewares/restaurants');
const { mealExists } = require('../middlewares/meals');

//validators
const { mealsValidator } = require('../validators/meals');

//utils
const { verifyToken } = require('../utils/verifyToken');

const mealsRouter = express.Router();

//htttp://localhost:port/api/v1/meals GET,POST,DELET,PUT
mealsRouter.post("/:id", verifyToken, restaurantExists, mealsValidator,create)
mealsRouter.get("/",getItems);
mealsRouter.get("/:id",getItem);
mealsRouter.patch("/:id", verifyToken, mealExists, mealsValidator,update);
mealsRouter.delete("/:id", verifyToken, mealExists,deleted);

module.exports = { mealsRouter };
const express = require('express');

//controllers
const { create, getItems, getItem, update, deleted } = require('../controllers/restaurants');
const { reviews, updateReview, deleteReview } = require('../controllers/reviews');

//validators
const { restaurantValidator } = require('../validators/restaurants');

//utils
const { verifyToken } = require('../utils/verifyToken');
const { restaurantExists } = require('../middlewares/restaurants');
const { reviewsValidator } = require('../validators/reviews');
const { reviewExists } = require('../middlewares/reviews');

//middlewares

const restaurantsRouter = express.Router();

//htttp://localhost:port/api/v1/user GET,POST,DELET,PUT
//restaurant
restaurantsRouter.get("/",getItems);
restaurantsRouter.get("/:id",getItem);
restaurantsRouter.post("/", verifyToken, restaurantValidator,create);
restaurantsRouter.patch("/:id", verifyToken, restaurantExists,update);
restaurantsRouter.delete("/:id", verifyToken, restaurantExists,deleted);

//reviews
restaurantsRouter.post("/reviews/:restaurantId", verifyToken, reviewsValidator,reviews);
restaurantsRouter.patch("/reviews/:id", verifyToken, reviewExists, reviewsValidator,updateReview);
restaurantsRouter.delete("/reviews/:id", verifyToken, reviewExists,deleteReview);

module.exports = { restaurantsRouter };
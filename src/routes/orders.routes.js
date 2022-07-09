const express = require('express');

//controllers
const { create, getItems, completed, deleted, purchases, deletedPetition } = require('../controllers/orders');

//middlewares
const { orderExists } = require('../middlewares/orders');
const { petitionExists } = require('../middlewares/petitons');

//validators

//utils
const { verifyToken } = require('../utils/verifyToken');

const ordersRouter = express.Router();

//htttp://localhost:port/api/v1/orders GET,POST,DELET,PUT
ordersRouter.post("/", verifyToken,create);
ordersRouter.get("/me", verifyToken,getItems);
ordersRouter.get("/me/purchases", verifyToken,purchases);
ordersRouter.patch("/:id",verifyToken, orderExists,completed);
ordersRouter.delete("/:id",verifyToken, orderExists,deleted);
ordersRouter.delete("/petitions/:id",verifyToken, petitionExists,deletedPetition);

module.exports = { ordersRouter };
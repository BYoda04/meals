//models
const { Restaurants } = require("../models/restaurants");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const restaurantExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const restaurant = await Restaurants.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!restaurant) {
        return next(new AppError('Restaurant not found',404));
    };

    req.restaurant = restaurant;

    next();
});

module.exports = { restaurantExists };
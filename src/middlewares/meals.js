//models
const { Meals } = require("../models/meals");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const mealExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const meal = await Meals.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!meal) {
        return next(new AppError('Meal not found',404));
    };

    req.meal = meal;

    next();
});

module.exports = { mealExists };
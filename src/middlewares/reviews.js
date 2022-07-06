//models
const { Reviews } = require("../models/reviews");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const reviewExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const review = await Reviews.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!review) {
        return next(new AppError('Review not found',404));
    };

    req.review = review;

    next();
});

module.exports = { reviewExists };
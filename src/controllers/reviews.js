//models
const { Restaurants } = require('../models/restaurants');
const { Reviews } = require('../models/reviews');

//utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const reviews = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { restaurantId } = req.params;
    const { comment,rating } = req.body;

    const restaurant = await Restaurants.findOne({
        where: {
            id: restaurantId,
            status: 'active'
        }
    })

    if (!restaurant) {
        return next(new AppError('Restaurant not found',404));
    };

    const newReview = await Reviews.create({
        comment,
        rating,
        userId: userSession.id,
        restaurantId
    })

    res.status(200).json({
        status: 'success',
        newReview
    })
});

const updateReview = catchAsync(async (req,res,next)=>{
    const { review, userSession } = req;
    const { comment,rating } = req.body;

    if (review.dataValues.id !== userSession.id) {
        return next(new AppError('You are not the owner of this review'))
    }

    await review.update({
        comment,
        rating
    })

    res.status(201).json({ status: 'success' })
});

const deleteReview = catchAsync(async (req,res,next)=>{
    const { review, userSession } = req;

    if (review.dataValues.id !== userSession.id) {
        return next(new AppError('You are not the owner of this review'))
    }

    await review.update({
        status: 'deleted'
    })

    res.status(201).json({ status: 'success' })
});

module.exports = {
    reviews,
    updateReview,
    deleteReview
}
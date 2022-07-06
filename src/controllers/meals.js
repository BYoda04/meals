//models

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { Meals } = require('../models/meals');
const { Restaurants } = require('../models/restaurants');

const getItems = catchAsync(async (req,res,next)=>{
    const data = await Meals.findAll({
        where: {
            status: 'active'
        },
        include: [
            {
                model:Restaurants,
                attributes: ['name','addres','rating']
            }   
        ]
    });

    res.status(200).json({
        status: 'succes',
        data
    })
})

const create = catchAsync(async (req,res,next)=>{
    const { restaurant, userSession } = req;
    const { name,price } = req.body;

    console.log(restaurant.dataValues);
    if (parseInt(restaurant.dataValues.userId) !== parseInt(userSession.id)) {
        return next(new AppError('You dont have permission',403))
    }

    const newMeal = await Meals.create({
        name,
        price,
        restaurantId: restaurant.id
    })

    res.status(200).json({
        status: 'success',
        newMeal
    })
});

module.exports = { 
    create,
    getItems
};
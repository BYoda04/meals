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
                required: false,
                where: {
                    status: 'active'
                },
                attributes: ['id','name','addres','rating']
            }   
        ],
        attributes: ['id','name','price','createdAt','updatedAt']
    });

    res.status(200).json({
        status: 'succes',
        data
    })
})

const getItem = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const data = await Meals.findAll({
        where: {
            id,
            status: 'active'
        },
        include: [
            {
                model:Restaurants,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: ['id','name','addres','rating']
            }   
        ],
        attributes: ['id','name','price','createdAt','updatedAt']
    });

    if (!data.length) {
        return next(new AppError('Meal not found',404));
    };

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

const update = catchAsync(async (req,res,next)=>{
    const { meal, userSession } = req;
    const { name,price } = req.body;

    const restaurant = await Restaurants.findOne({
        where:{
            id: meal.restaurantId,
            status: 'active'
        }
    });

    if (!restaurant) {
        return next(new AppError('Restaurant not found',404));
    };

    if (parseInt(restaurant.userId) !== parseInt(userSession.id)) {
        return next(new AppError('You dont have permission',403));
    };

    await meal.update({
        name,
        price
    });

    res.status(201).json({
        status: 'success'
    });
});

const deleted = catchAsync(async (req,res,next)=>{
    const { meal, userSession } = req;

    const restaurant = await Restaurants.findOne({
        where:{
            id: meal.restaurantId,
            status: 'active'
        }
    });

    if (!restaurant) {
        return next(new AppError('Restaurant not found',404));
    };

    if (parseInt(restaurant.userId) !== parseInt(userSession.id)) {
        return next(new AppError('You dont have permission',403));
    };

    await meal.update({
        status: 'deleted'
    });

    res.status(201).json({
        status: 'success'
    });
});

module.exports = { 
    create,
    getItems,
    getItem,
    update,
    deleted
};
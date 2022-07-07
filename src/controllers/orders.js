//models

//utils
const { Meals } = require("../models/meals");
const { Orders } = require("../models/orders");
const { Petitions } = require("../models/petitions");
const { Restaurants } = require("../models/restaurants");
const { Users } = require("../models/users");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const create = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { mealId,quantity } = req.body;
    
    let newOrder

    const meal = await Meals.findOne({
        where: {
            id: mealId,
            status: 'active'
        }
    })
    
    if (!meal) {
        return next(new AppError('Meal dont exists',404));
    };

    const orderActive = await Orders.findOne({
        where: {
            userId: userSession.id,
            status: 'active'
        }
    })

    newOrder = orderActive

    if (!orderActive) {
        newOrder = await Orders.create({
            userId: userSession.id
        })
    }

    const petition = await Petitions.findOne({
        where: {
            mealId,
            orderId: newOrder.id
        }
    })

    if (!petition) {
        await Petitions.create({
            total_price: parseInt(meal.price)*parseInt(quantity),
            quantity,
            mealId,
            orderId: newOrder.id
        });
    } else {
        petition.update({
            total_price: parseInt(petition.total_price) + (parseInt(meal.price)*parseInt(quantity)),
            quantity: parseInt(petition.quantity) + parseInt(quantity)
        });
    };

    res.status(200).json({
        status: 'succes',
        newOrder
    })
});

const getItems = catchAsync(async (req,res,next)=>{
    const { userSession } = req;

    const data = await Orders.findOne({
        where: {
            userId: userSession.id,
            status: 'active'
        },
        include: [
            {
                model: Petitions,
                attributes: ['total_price','quantity','status','createdAt','updatedAt'],
                include: {
                    model: Meals,
                    attributes: ['name','price'],
                    include: {
                        model: Restaurants,
                        attributes: ['name','addres','rating']
                    }
                }
            }
        ],
        attributes: ['id','status','createdAt','updatedAt']
    });

    if (!data) {
        return next(new AppError('You dont have active orders',404))
    }

    res.status(200).json({
        status: 'succes',
        data
    })
});

const purchases = catchAsync(async (req,res,next)=>{
    const { userSession } = req;

    const data = await Orders.findOne({
        where: {
            userId: userSession.id,
            status: 'completed'
        },
        include: [
            {
                model: Petitions,
                attributes: ['total_price','quantity','status','createdAt','updatedAt'],
                include: {
                    model: Meals,
                    attributes: ['name','price'],
                    include: {
                        model: Restaurants,
                        attributes: ['name','addres','rating']
                    }
                }
            }
        ],
        attributes: ['id','status','createdAt','updatedAt']
    });

    if (!data) {
        return next(new AppError('You dont have purchases',404))
    }

    res.status(200).json({
        status: 'succes',
        data
    })
});

const completed = catchAsync(async (req,res,next)=>{
    const { order, userSession } = req;

    if (parseInt(order.userId) !== parseInt(userSession.id)) {
        return next(new AppError('You did not make this order',403));
    };

    order.update({
        status: 'completed'
    });

    res.status(201).json({
        status: 'success'
    })
});

const deleted = catchAsync(async (req,res,next)=>{
    const { order, userSession } = req;

    if (parseInt(order.userId) !== parseInt(userSession.id)) {
        return next(new AppError('You did not make this order',403));
    };

    order.update({
        status: 'cancelled'
    });

    res.status(201).json({
        status: 'success'
    })
});

module.exports = {
    create,
    getItems,
    completed,
    deleted,
    purchases
};
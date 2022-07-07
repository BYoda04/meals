//models
const { Meals } = require('../models/meals');
const { Restaurants } = require('../models/restaurants');
const { Reviews } = require('../models/reviews');
const { Users } = require('../models/users');

//utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const getItems = catchAsync(async (req,res,next)=>{
    const data = await Restaurants.findAll({
        where: {
            status: 'active'
        },
        include: [
            {
                model: Users,
                attributes: ['id','name','email']
            },
            {
                model: Reviews,
                attributes: ['id','comment','rating','status']
            },
            {
                model: Meals,
                attributes: ['id','name','price','status']
            }
        ],
        attributes: ['id','name','addres','rating','createdAt','updatedAt']
    });

    res.status(200).json({
        status: 'succes',
        data
    })
});

const getItem = catchAsync(async (req,res,next)=>{
    const { id } = req.params

    const data = await Restaurants.findOne({
        where: {
            id,
            status: 'active'
        },
        include: [
            {
                model: Users,
                attributes: ['id','name','email']
            },
            {
                model: Reviews,
                attributes: ['id','comment','rating','status']
            },
            {
                model: Meals,
                attributes: ['id','name','price','status']
            }
        ],
        attributes: ['id','name','addres','rating','createdAt','updatedAt']
    });

    if (!data) {
        return next(new AppError('Restaurant dont exists',404))
    }

    res.status(200).json({
        status: 'succes',
        data
    })
});

const create = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { name,addres } = req.body;

    const user = await Users.findOne({ 
        where: {
            id: userSession.id,
            status: 'active'
        }
    });

    if (!user) {
        return next(new AppError('User not found',404));
    };

    await user.update({ role: 'admin' });

    const newRestaurant = await Restaurants.create({
        name,
        addres,
        userId: userSession.id
    });

    res.status(201).json({
        status: 'succes',
        newRestaurant
    });
});

const update = catchAsync(async (req,res,next)=>{
    const { restaurant, userSession } = req;
    const { name,addres } = req.body;

    if (userSession.role !== "admin") {
        return next(new AppError('You dont have permission',403));
    };

    if (parseInt(userSession.id) !== parseInt(restaurant.dataValues.userId)) {
        return next(new AppError('You are not the manager of this restaurant',403));
    };

    await restaurant.update({
        name,
        addres
    });

    res.status(201).json({ status: 'success' });
});

const deleted = catchAsync(async (req,res,next)=>{
    const { restaurant, userSession } = req;

    if (userSession.role !== "admin") {
        return next(new AppError('You dont have permission',403));
    };

    if (parseInt(userSession.id) !== parseInt(restaurant.dataValues.userId)) {
        return next(new AppError('You are not the manager of this restaurant',403));
    };

    await restaurant.update({
        status: 'deleted'
    });

    res.status(201).json({ status: 'success' });
});

module.exports = { 
    create,
    getItems,
    getItem,
    update,
    deleted,
}
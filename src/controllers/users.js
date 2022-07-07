const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const { Users } = require('../models/users');
const { Restaurants } = require('../models/restaurants');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const signUp = catchAsync(async (req,res,next)=>{
    const { name,email,password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const encryptPass = await bcrypt.hash(password,salt);

    const newUser = await Users.create({
        name,
        email,
        password: encryptPass
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser
    });
});

const login = catchAsync(async (req,res,next)=>{
    const { email, password } = req.body;

    const user = await Users.findOne({
        where:{
            email,
            status:'active'
        }
    });

    if (!user) {
        return next(new AppError('User not exist',404));
    };

    const validPass = await bcrypt.compare(password,user.password);

    if (!validPass) {
        return next(new AppError('Invalid password',404));
    };

    const token = jwt.sign({ 
        id: user.id,
        role: user.role
    },process.env.JWT_SIGN,{
        expiresIn:'24h',
    });

    res.status(200).json({
        status:'succes',
        token
    })
})

const update = catchAsync(async (req,res,next)=>{
    const { user, userSession } = req;
    const { name,email } = req.body;

    if (parseInt(user.dataValues.id) !== parseInt(userSession.id)) {
        return next(new AppError('You dont have permission',404))
    }

    await user.update({ name,email });

    res.status(201).json({ status: 'success' });
})

const deleted = catchAsync(async (req,res,next)=>{
    const { user, userSession } = req;

    if (parseInt(user.dataValues.id) !== parseInt(userSession.id)) {
        return next(new AppError('You dont have permission',404))
    }

    const restaurants = await Restaurants.findAll({
        where: {
            userId: userSession.id,
            status: 'active'
        }
    })

    if (restaurants) {
        restaurants.map(async restaurant=>{
            await restaurant.update({ status: 'deleted' });
        })
    }

    await user.update({ status: 'deleted' });

    res.status(201).json({ status: 'success' });
});

module.exports = {
    signUp,
    login,
    update,
    deleted
};
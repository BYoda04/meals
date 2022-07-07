//models
const { Orders } = require("../models/orders");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const orderExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const order = await Orders.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!order) {
        return next(new AppError('Order not found',404));
    };

    req.order = order;

    next();
});

module.exports = { orderExists };
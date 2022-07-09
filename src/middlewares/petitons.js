//models
const { Petitions } = require("../models/petitions");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const petitionExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const petition = await Petitions.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!petition) {
        return next(new AppError('Petition not found',404));
    };

    req.petition = petition;

    next();
});

module.exports = { petitionExists };
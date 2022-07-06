const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError');

const checkResult = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// Array has errors
		const errorMsgs = errors.array().map(err => err.msg);

		const message = errorMsgs.join('. ');

		return next(new AppError(message, 400));
	}

	next();
};

const reviewsValidator = [
	body('comment').notEmpty().withMessage('Comment cannot be empty'),
	body('rating').isNumeric().withMessage('Rating must be a value between 0 and 10'),
	checkResult,
];

module.exports = { reviewsValidator };
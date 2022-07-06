const { app } = require('./app');

// Models
const { Restaurants } = require('./models/restaurants');
const { Meals } = require('./models/meals');

// Utils
const { db } = require('./DB/db');
const { Reviews } = require('./models/reviews');
const { Users } = require('./models/users');
const { Orders } = require('./models/orders');
const { Petitions } = require('./models/petitions');

db.authenticate()
	.then(() => console.log('Db authenticated'))
	.catch(err => console.log(err));

// Establish model's relations
// 1 User <----> M Post
//has many
Users.hasMany(Restaurants,{ foreignKey:'userId' });
Users.hasMany(Reviews,{ foreignKey:'userId' });
Users.hasMany(Orders,{ foreignKey:'userId' });
Restaurants.hasMany(Meals,{ foreignKey:'restaurantId' });
Restaurants.hasMany(Reviews,{ foreignKey:'restaurantId' });
Orders.hasMany(Petitions,{ foreignKey:'orderId' });
Meals.hasMany(Petitions,{ foreignKey:'mealId' });

//belongs to
Restaurants.belongsTo(Users);
Meals.belongsTo(Restaurants);
Reviews.belongsTo(Restaurants);
Reviews.belongsTo(Users);
Orders.belongsTo(Users);
Petitions.belongsTo(Orders);
Petitions.belongsTo(Meals);

//belongs to many
Petitions.belongsToMany(Orders,{
	foreignKey: 'petitionsId',
	through: 'petitionsInOrder'
});
Orders.belongsToMany(Petitions,{
	foreignKey: 'orderId',
	through: 'petitionsInOrder'
});

db.sync()
	.then(() => console.log('Db synced'))
	.catch(err => console.log(err));

const port = process.env.PORT || 4001

app.listen(port, () => {
	console.log('Express app running!!');
});
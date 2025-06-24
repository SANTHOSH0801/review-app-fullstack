const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require('./user')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Store = require('./store')(sequelize, DataTypes);
db.Rating = require('./rating')(sequelize, DataTypes);

// Associations
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

db.Store.hasMany(db.Rating, { foreignKey: 'storeId' });
db.Rating.belongsTo(db.Store, { foreignKey: 'storeId' });

db.User.hasMany(db.Rating, { foreignKey: 'userId' });
db.Rating.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Store, { foreignKey: 'ownerId' });
db.Store.belongsTo(db.User, { foreignKey: 'ownerId' });

module.exports = db;

module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                len: [20, 60],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        address: {
            type: DataTypes.STRING(400),
            allowNull: true,
            validate: {
                len: [0, 400],
            },
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
    });

    return Store;
};

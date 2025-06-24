const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Role = db.Role;

exports.addUser = async (req, res) => {
    console.log('AddUser request body:', req.body);
    const errors = validationResult(req);
    console.log('Validation result:', errors);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        // Log detailed validation errors for debugging
        errors.array().forEach(err => {
            console.error(`Validation error - param: ${err.param}, msg: ${err.msg}`);
        });
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role, storeName } = req.body;

    const transaction = await User.sequelize.transaction();

    try {
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Email already registered' });
            }

            const roleRecord = await Role.findOne({ where: { name: role } });
            if (!roleRecord) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Invalid role' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                address,
                roleId: roleRecord.id,
            }, { transaction });

            if (role === 'Store Owner') {
                console.log('Store Owner detected, attempting to create store...');
                if (!storeName || storeName.length < 20 || storeName.length > 60) {
                    console.log('Invalid storeName length:', storeName ? storeName.length : 'undefined');
                    await transaction.rollback();
                    return res.status(400).json({ message: 'Store Name must be between 20 and 60 characters' });
                }
                const Store = require('../models').Store;
                try {
                    console.log('Creating store with:', { name: storeName, email, address, ownerId: user.id });
                    await Store.create({
                        name: storeName,
                        email: email,
                        address: address,
                        ownerId: user.id,
                    }, { transaction });
                    console.log('Store created successfully');
            } catch (storeError) {
                console.error('Store creation error:', storeError);
                if (storeError.errors) {
                    storeError.errors.forEach(e => {
                        console.error(`Store creation validation error - path: ${e.path}, message: ${e.message}`);
                    });
                }
                await transaction.rollback();
                return res.status(400).json({ message: 'Store creation failed', error: storeError.message });
            }
            }

            await transaction.commit();

            return res.status(201).json({ message: 'User added successfully' });
        } catch (innerError) {
            console.error('Inner add user error:', innerError);
            throw innerError;
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Add user error:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUsers = async (req, res) => {
    const { name, email, address, role } = req.query;

    const where = {};
    if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
    if (email) where.email = { [db.Sequelize.Op.iLike]: `%${email}%` };
    if (address) where.address = { [db.Sequelize.Op.iLike]: `%${address}%` };

    try {
        let roleFilter = {};
        if (role) {
            console.log('Role filter received:', role);
            const normalizedRole = role.trim().toLowerCase();
            const roleRecord = await Role.findOne({
                where: db.Sequelize.where(
                    db.Sequelize.fn('lower', db.Sequelize.col('name')),
                    normalizedRole
                ),
            });
            console.log('Role record found:', roleRecord);
            if (roleRecord) {
                roleFilter = { roleId: roleRecord.id };
            }
        }

        // Fetch users with Role and left join Store and Ratings to get average rating for Store Owners
        const users = await User.findAll({
            where: { ...where, ...roleFilter },
            include: [
                { model: Role },
                {
                    model: db.Store,
                    required: false,
                    as: 'Store',
                    include: [
                        {
                            model: db.Rating,
                            attributes: [],
                        },
                    ],
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        db.Sequelize.fn('AVG', db.Sequelize.col('Store.Ratings.rating')),
                        'storeRating',
                    ],
                ],
            },
            group: ['User.id', 'Role.id'],
            order: [['name', 'ASC']],
        });

        const result = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.Role.name,
            storeRating: user.dataValues.storeRating
                ? parseFloat(user.dataValues.storeRating).toFixed(2)
                : null,
        }));

        return res.json(result);
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, { include: [{ model: Role }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.Role.name,
        };

        // If Store Owner, include rating (average rating of their store)
        if (user.Role.name === 'Store Owner') {
            const store = await db.Store.findOne({ where: { ownerId: user.id } });
            if (store) {
                const ratings = await db.Rating.findAll({ where: { storeId: store.id } });
                const avgRating =
                    ratings.length > 0
                        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                        : null;
                userData.storeRating = avgRating;
            }
        }

        return res.json(userData);
    } catch (error) {
        console.error('Get user by id error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

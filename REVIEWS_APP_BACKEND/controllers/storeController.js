
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models');
const Store = db.Store;
const User = db.User;
const Rating = db.Rating;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

exports.addStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { storeName,ownerName, email, address, password } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        // Check if user with email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Find role for Store Owner
        const storeOwnerRole = await db.Role.findOne({ where: { name: 'Store Owner' } });
        if (!storeOwnerRole) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Store Owner role not found' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user as store owner
        const user = await User.create({
            name: storeName,
            email,
            password: hashedPassword,
            address,
            roleId: storeOwnerRole.id,
        }, { transaction });

        // Create store linked to user
        const store = await Store.create({
            name: storeName,
            ownerName,
            email,
            address,
            ownerId: user.id,
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({ message: 'Store and owner user created successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Add store error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.submitRating = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { rating } = req.body;

    try {
        // Check if the store exists
        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if the user has already rated this store
        let userRating = await Rating.findOne({
            where: {
                storeId: id,
                userId: userId,
            },
        });

        if (userRating) {
            // Update existing rating
            userRating.rating = rating;
            await userRating.save();
            return res.json({ message: 'Rating updated successfully' });
        } else {
            // Create new rating
            await Rating.create({
                storeId: id,
                userId: userId,
                rating: rating,
            });
            return res.status(201).json({ message: 'Rating submitted successfully' });
        }
    } catch (error) {
        console.error('Submit rating error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getStores = async (req, res) => {
    const { name, address } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    try {
        const stores = await Store.findAll({
            where,
            include: [
                {
                    model: Rating,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('Ratings.rating')),
                        'averageRating',
                    ],
                ],
            },
            group: ['Store.id'],
            order: [['name', 'ASC']],
        });

        const result = stores.map((store) => ({
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: store.dataValues.averageRating
                ? parseFloat(store.dataValues.averageRating).toFixed(2)
                : null,
        }));

        return res.json(result);
    } catch (error) {
        console.error('Get stores error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// New method: get store details by ID including average rating
exports.getStoreById = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findByPk(id, {
            include: [
                {
                    model: Rating,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('Ratings.rating')),
                        'averageRating',
                    ],
                ],
            },
            group: ['Store.id'],
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const result = {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: store.dataValues.averageRating
                ? parseFloat(store.dataValues.averageRating).toFixed(2)
                : null,
        };

        return res.json(result);
    } catch (error) {
        console.error('Get store by ID error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// New method: get current user's rating for a store
exports.getUserRating = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const rating = await Rating.findOne({
            where: {
                storeId: id,
                userId: userId,
            },
        });

        if (!rating) {
            return res.json({ rating: null });
        }

        return res.json({ rating: rating.rating });
    } catch (error) {
        console.error('Get user rating error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// New method: get store details by ownerId
exports.getStoreByOwner = async (req, res) => {
    const ownerId = req.user.id;
    console.log("Owner id:" ,ownerId);

    try {
        const store = await Store.findOne({
            where: { ownerId },
            include: [
                {
                    model: Rating,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('Ratings.rating')),
                        'averageRating',
                    ],
                ],
            },
            group: ['Store.id'],
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found for owner' });
        }

        const result = {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: store.dataValues.averageRating
                ? parseFloat(store.dataValues.averageRating).toFixed(2)
                : null,
        };

        return res.json(result);
    } catch (error) {
        console.error('Get store by owner error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const { validationResult } = require('express-validator');
const db = require('../models');
const Rating = db.Rating;
const Store = db.Store;
const User = db.User;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

exports.submitOrUpdateRating = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, rating } = req.body;
    const userId = req.user.id;

    try {
        const store = await Store.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        let userRating = await Rating.findOne({ where: { storeId, userId } });
        if (userRating) {
            userRating.rating = rating;
            await userRating.save();
            return res.json({ message: 'Rating updated successfully' });
        } else {
            await Rating.create({ storeId, userId, rating });
            return res.status(201).json({ message: 'Rating submitted successfully' });
        }
    } catch (error) {
        console.error('Submit or update rating error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserRatings = async (req, res) => {
    const userId = req.user.id;

    try {
        const ratings = await Rating.findAll({
            where: { userId },
            include: [{ model: Store }],
        });

        const result = ratings.map((r) => ({
            storeId: r.storeId,
            storeName: r.Store.name,
            rating: r.rating,
        }));

        return res.json(result);
    } catch (error) {
        console.error('Get user ratings error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getStoreRatings = async (req, res) => {
    const userId = req.user.id;

    console.log("UDER ID:",userId)
    try {
        const store = await Store.findOne({ where: { ownerId: userId } });
        if (!store) {
            return res.status(404).json({ message: 'Store not found for this owner' });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ['id', 'name', 'email', 'address'] }],
        });

        const avgRating =
            ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : null;

        const result = {
            storeId: store.id,
            storeName: store.name,
            averageRating: avgRating ? avgRating.toFixed(2) : null,
            userRatings: ratings.map((r) => ({
                userId: r.User.id,
                name: r.User.name,
                email: r.User.email,
                address: r.User.address,
                rating: r.rating,
            })),
        };

        return res.json(result);
    } catch (error) {
        console.error('Get store ratings error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

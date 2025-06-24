const db = require('../models');
const User = db.User;
const Store = db.Store;
const Rating = db.Rating;

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        return res.json({
            totalUsers,
            totalStores,
            totalRatings,
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

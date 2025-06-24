const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Role = db.Role;

exports.signupWithStore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role, storeName } = req.body;

    const transaction = await User.sequelize.transaction();

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign role based on provided role or default to Normal User
        let roleName = 'Normal User';
        if (role && (role === 'Store Owner' || role === 'System Administrator')) {
            roleName = role;
        }

        const roleRecord = await Role.findOne({ where: { name: roleName } });
        if (!roleRecord) {
            await transaction.rollback();
            return res.status(500).json({ message: 'User role not found' });
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            roleId: roleRecord.id,
        }, { transaction });

        if (roleName === 'Store Owner') {
            if (!storeName || storeName.length < 20 || storeName.length > 60) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Store Name must be between 20 and 60 characters' });
            }
            const Store = require('../models').Store;
            try {
                await Store.create({
                    name: storeName,
                    email: email,
                    address: address,
                    ownerId: user.id,
                }, { transaction });
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

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Signup with store error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

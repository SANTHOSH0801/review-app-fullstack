const { sequelize, User, Store } = require('../models');

async function createStoreForOwner() {
  const ownerId = 'bbcda0a8-169d-4cc9-aba7-c591d749aad5';
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const existingStore = await Store.findOne({ where: { ownerId } });
    if (existingStore) {
      console.log('Store already exists for owner:', existingStore.name);
    } else {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        console.log('Owner user not found');
        return;
      }
      const newStore = await Store.create({
        name: 'Owner Store',
        email: 'ownerstore@example.com',
        address: 'Owner Address',
        ownerId,
      });
      console.log('Created new store for owner:', newStore.name);
    }
  } catch (error) {
    console.error('Error creating store for owner:', error);
  } finally {
    await sequelize.close();
  }
}

createStoreForOwner();

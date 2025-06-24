require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the express app
const db = require('../models');

describe('User Endpoints', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    // Seed roles
    await db.Role.bulkCreate([
      { name: 'Normal User' },
      { name: 'Store Owner' },
      { name: 'System Administrator' },
    ]);
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should register a normal user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Normal User1',
        email: 'normaluser1@example.com',
        password: 'Password@123',
        address: '123 Normal St',
        role: 'Normal User',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should register a store owner with store', async () => {
    const res = await request(app)
      .post('/api/users/addUser')
      .send({
        name: 'Store Owner1',
        email: 'storeowner1@example.com',
        password: 'Password@123',
        address: '456 Store St',
        role: 'Store Owner',
        storeName: 'Store Owner1 Store Name With Enough Length',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User added successfully');
  });

  it('should not register user with invalid role', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Invalid Role User',
        email: 'invalidrole@example.com',
        password: 'Password@123',
        address: '789 Invalid St',
        role: 'InvalidRole',
      });
    expect(res.statusCode).toEqual(400);
  });
});

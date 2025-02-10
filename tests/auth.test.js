const request = require('supertest');
const app = require('../server'); // Import your Express app
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10), // Hash the password
      role: 'user',
    });
  });

  afterAll(async () => {
    // Clean up the test database
    await User.destroy({ where: { email: 'testuser@example.com' } });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'newuser@example.com');
  });

  it('should log in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token'); // Expect JWT token to be returned
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});

const request = require('supertest');
const app = require('../server'); // Import your Express app
const { User, Task } = require('../models');
const jwt = require('jsonwebtoken');

describe('Task Management Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user',
    });

    // Generate auth token for the user
    authToken = jwt.sign({ userId: testUser.id, role: testUser.role }, 'secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    // Clean up the test database
    await User.destroy({ where: { email: 'testuser@example.com' } });
    await Task.destroy({ where: {} });
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Task',
        description: 'This is a test task',
        priority: 'high',
        due_date: '2025-02-15T12:00:00Z',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Task');
  });

  it('should update a task', async () => {
    const task = await Task.create({
      title: 'Task to be updated',
      description: 'This task will be updated',
      priority: 'medium',
      due_date: '2025-02-16T12:00:00Z',
      assigned_to: testUser.id,
    });

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Task' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Task');
  });

  it('should get all tasks for a user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete a task', async () => {
    const task = await Task.create({
      title: 'Task to be deleted',
      description: 'This task will be deleted',
      priority: 'low',
      due_date: '2025-02-17T12:00:00Z',
      assigned_to: testUser.id,
    });

    const res = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});

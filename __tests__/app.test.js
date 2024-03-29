const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  // mock user for testing
  const mockUser = {
    firstName: 'Sam',
    lastName: 'Samson',
    email: 'test@test.com',
    password: '123456',
  };

  const mockSecret = {
    title: 'Test title',
    description: 'Test description',
  };

  it('POST /api/v1/users creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    expect(res.status).toBe(200);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.status).toEqual(200);
  });

  it('DELETE /api/v1/users/sessions signs out an existing user', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'test@test.com', password: '123456' });
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });

  it('GET /api/v1/secrets should allow authenticated users to view all secrets', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'test@test.com', password: '123456' });

    await agent.post('/api/v1/secrets').send(mockSecret);

    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});

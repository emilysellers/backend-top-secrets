const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

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

  it('POST /api/v1/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});

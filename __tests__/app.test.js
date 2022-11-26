const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;
//   const agent = request.agent(app);
//   const user = await UserService.create({ ...mockUser, ...userProps });
//   const { email } = user;
//   await (
//     await agent.post('./api/v1/users/sessions')
//   ).setEncoding({ email, password });
//   return [agent, user];
// };

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

  it('POST /api/vi/users creates a new user', async () => {
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

  afterAll(() => {
    pool.end();
  });
});

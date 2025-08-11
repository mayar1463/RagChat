const request = require('supertest');
const app = require('../app'); // your Express app
describe('Sessions API', () => {
  let sessionId;
  let sessionTitle = 'New Title';

  test('creates a new session (POST /api/v1/sessions) - returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId: 1, title: 'Test Session' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Session');
    sessionId = res.body.id;
  });

  test('renames a session (PATCH /api/v1/sessions/:id) - returns 200', async () => {
    const res = await request(app)
      .patch(`/api/v1/sessions/${sessionId}`)
      .set('x-api-key', process.env.API_KEY)
      .send({ title: sessionTitle });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(sessionTitle);
  });

  test('deletes a session (DELETE /api/v1/sessions/:id) - returns 200', async () => {
    const res = await request(app)
      .delete(`/api/v1/sessions/${sessionId}`)
      .set('x-api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(204);
  });
});

describe('Messages API', () => {
  let sessionId;

  beforeAll(async () => {
    // Create a session to add messages to
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId: 1, title: 'Session for messages' });
    sessionId = res.body.id;
  });

  afterAll(async () => {
    // Clean up session after tests
    await request(app)
      .delete(`/api/v1/sessions/${sessionId}`)
      .set('x-api-key', process.env.API_KEY);
  });

  test('adds a message (POST /api/v1/sessions/:id/messages) - returns 201', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/messages`)
      .set('x-api-key', process.env.API_KEY)
      .send({
        sessionId,
        sender: 'user',
        content: 'Hello world'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('Hello world');
  });

  test('gets messages with pagination (GET /api/v1/sessions/:id/messages?limit=5&offset=1) - returns 200', async () => {
    // Assuming messages are already present or you seed them before tests
    const res = await request(app)
      .get(`/api/v1/sessions/${sessionId}/messages?limit=5&offset=1`)
      .set('x-api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);  // Since body is an array
  });

});

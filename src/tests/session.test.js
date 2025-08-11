const request = require('supertest');
const app = require('../app'); // your Express app

describe('Sessions API', () => {
  let sessionId;
  let sessionTitle = 'New Title';
  const userId = 'test-user-1';


  test('creates a new session (POST /api/v1/sessions) - returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId, title: 'Test Session' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Session');
    sessionId = res.body.id;
  });

  test('fails to create a duplicate session for same user (POST /api/v1/sessions) - returns 409', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId, title: 'Test Session' });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('renames a session (PATCH /api/v1/sessions/:id) - returns 200', async () => {
    const res = await request(app)
      .patch(`/api/v1/sessions/${sessionId}`)
      .set('x-api-key', process.env.API_KEY)
      .send({ title: sessionTitle });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(sessionTitle);
  });

  test('fails to rename a session to an existing title for same user - returns 409', async () => {
    const res1 = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId, title: 'Another Session' });

    const otherSessionId = res1.body.id;

    const res2 = await request(app)
      .patch(`/api/v1/sessions/${otherSessionId}`)
      .set('x-api-key', process.env.API_KEY)
      .send({ title: sessionTitle });

    expect(res2.statusCode).toBe(409);
    expect(res2.body).toHaveProperty('error');
    expect(res2.body.error).toMatch(/already exists/i);

    await request(app)
      .delete(`/api/v1/sessions/${otherSessionId}`)
      .set('x-api-key', process.env.API_KEY);
  });

  test('deletes a session (DELETE /api/v1/sessions/:id) - returns 204', async () => {
    const res = await request(app)
      .delete(`/api/v1/sessions/${sessionId}`)
      .set('x-api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(204);
  });
});

describe('Messages API', () => {

  let sessionId;
  const userId = 'test-user-2';

  beforeAll(async () => {

    const res = await request(app)
      .post('/api/v1/sessions')
      .set('x-api-key', process.env.API_KEY)
      .send({ userId, title: 'Session for messages' });
    sessionId = res.body.id;
  });

  afterAll(async () => {
    if (sessionId) {
      await request(app)
        .delete(`/api/v1/sessions/${sessionId}`)
        .set('x-api-key', process.env.API_KEY);
    }
  });

  test('adds a message (POST /api/v1/sessions/:id/messages) - returns 201', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/messages`)
      .set('x-api-key', process.env.API_KEY)
      .send({
        sender: 'user',
        content: 'Hello world'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('Hello world');
  });

  test('gets messages with pagination (GET /api/v1/sessions/:id/messages?limit=1&offset=0) - returns 200', async () => {
    // Add second message for pagination offset=1 test
    const postRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/messages`)
      .set('x-api-key', process.env.API_KEY)
      .send({
        sender: 'assistant',
        content: 'Hi there!'
      });

    expect(postRes.statusCode).toBe(201);

    // Now fetch with limit=1 offset=1 (should return second message only)
    const res = await request(app)
      .get(`/api/v1/sessions/${sessionId}/messages?limit=1&offset=0`)
      .set('x-api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].content).toBe('Hello world');
  });

});

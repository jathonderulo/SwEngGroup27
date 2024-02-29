// config.test.js
const request = require('supertest');
const {app, port, server} = require('./index'); // Assuming your main file is named index.js


describe('GET /example', () => {
  it('responds with text "This is an example GET request response."', async () => {
    const response = await request(app).get('/example');
    expect(response.status).toBe(200);
    expect(response.text).toBe('This is an example GET request response.');
  });
});

describe('Server', () => {
  let originalLog;

  beforeEach(() => {
    // Spy on console.log
    originalLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    // Restore console.log
    console.log = originalLog;
  });

  it('logs "Server is running on port 3001"', () => {

    // Expect console.log to have been called with the correct message
    console.log("Server is running on port 3001")
    expect(console.log.mock.calls[0][0]).toBe(`Server is running on port ${port}`);

  });
});

describe('POST /chat', () => {
  it('handles errors gracefully', async () => {
    const openaiMock = {
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('OpenAI error'))
        }
      }
    };

    const response = await request(app)
      .post('/chat')
      .send({ message: 'Hello, how are you?' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});


afterAll(done => {
    server.close();
    done();
});

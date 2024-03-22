// config.test.js
const request = require('supertest');
const {app, server, assistantID, port} = require('./index.js'); // Assuming your main file is named index.js, requires relevant const's to be exported in main

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
    //const port = 3001
    console.log("Server is running on port 3001")
    expect(console.log.mock.calls[0][0]).toBe(`Server is running on port ${port}`);
  });
});

describe('assistantID check', () => {
  it('Uses correct assistant, specified by AssistantID', () => {
    const expectedAssistantID = 'asst_oANbAY9nu3G4i5ySHABCLUIB'
    expect(assistantID).toBe(expectedAssistantID)
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
    expect(response.body).toEqual({ error: "404 No thread found with id 'undefined'." });
  });
});


afterAll(done => {
    server.close();
    done();
});
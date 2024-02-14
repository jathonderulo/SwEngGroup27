const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const { OPENAI_API_KEY } = require('./config');

const app = express();
const port = 3001;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(cors());

// Store the conversation state
let conversationHistory = [];

// Create a global assistant and thread
let assistant, thread;

// NB This currently throws 401 errors
async function initialiseAssistant() {
  // Create a global assistant
  assistant = await openai.beta.assistants.create({
    name: "Survey Assistant",
    instructions: "You are an assistant that answers questions people ask surrounding the results to a survey",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo"
  });

  // Create a global thread
  thread = await openai.beta.threads.create();
}

async function chatWithOpenAI(text) {
  try {
    // Add the user message to the global thread
    const message = await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: text }
    );

    // Run the updated thread on the global assistant
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistant.id }
    );

    // Wait until the run has completed
    // There is probably a more elegant way of doing this than busy waiting
    while(run.status != 'completed') {
      if(run.status === ('failed' || 'cancelled' || 'expired')) {
        throw("Run "+run.status);
      }
    }

    // Retreive the updated message list
    const messageList = await openai.beta.threads.messages.list(
      thread.id
    );

    return {
      content: messageList.data[0].content[0], // Return the assistant's response
    };
  } catch (error) {
    console.error('Error:', error);
    throw error; // Ensure error handling in the calling function
  }
}

// Initialise the global assistant and thread upon startup
initialiseAssistant();

// In your endpoint:
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body; // Get message from the request body

    const responseFromAI = await chatWithOpenAI(message);
    console.log(responseFromAI.content);
    res.json({ message: responseFromAI.content });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
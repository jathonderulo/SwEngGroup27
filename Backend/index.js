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

// Create a global assistant and thread which will be initialised upon execution
// A consequence of this is that every individual connection to the server still
// uses the same Assistant and thread made on startup of the server
let assistant, thread;

// NB This currently throws 500 (internal server) errors when using our
// API key, but it works when using another API key. I will update this
// comment when this issue is resolved.
async function initialiseAssistant() {
  // Initialise the global assistant
  assistant = await openai.beta.assistants.create({
    name: "Survey assistant",                            // Arbitrary name for the assistant
    instructions: "You are a helpful assistant",         // These instructions define the Assistant's behaviour
    tools: [{ type: "code_interpreter" }],               // Code interpreter tool is used for processing files
    model: "gpt-3.5-turbo"                               // The openAI model the assistant utilises
    });
  console.log(assistant.id);

  // Initialise the global thread, which stores all user and AI messages
  thread = await openai.beta.threads.create();
}

async function chatWithOpenAI(text) {
  try {
    // Add the user message to the global thread
    const message = await openai.beta.threads.messages.create( thread.id,
      { role: "user", content: text }
    );

    // Run the updated thread on the global assistant
    run = await openai.beta.threads.runs.create( thread.id,
      { assistant_id: assistant.id }
    );

    // Wait until the run has completed
    // There is probably a more elegant way of doing this than busy waiting
    // NB This is currently staying "queued" forever
    while(run.status != 'completed') {
      console.log(run.status);
      run = await openai.beta.threads.runs.retrieve( thread.id, run.id );
      if(run.status === ('failed' || 'cancelled' || 'expired')) {
        throw("Run "+run.status); // Throw an error that includes the run status
      }
    }

    // Retreive the updated message list, which includes the latest AI response
    const messageList = await openai.beta.threads.messages.list(
      thread.id
    );

    return { content: messageList.data[0].content[0].text }; // Return the assistant's final response message
  } catch (error) {
    console.error('Error:', error);
    throw error; // Ensure error handling in the calling function
  }
}

// Initialise the global assistant and thread
// This function is called upon program execution
initialiseAssistant();

// In your endpoint:
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body; // Get message from the request body

    const responseFromAI = await chatWithOpenAI(message);
    console.log(responseFromAI.content.value); // Log AI message response
    res.json({ message: responseFromAI.content.value + "\n\n"}); // Return AI message with new line characters
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
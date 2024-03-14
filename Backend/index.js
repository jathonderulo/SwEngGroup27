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

// Assign the ID of the target assistant. This is a hard coded global variable.
// Assistants can be created, deleted etc. from the assistant-editor.js file.
const assistantID = 'asst_oANbAY9nu3G4i5ySHABCLUIB';

// This post request is used to create a new thread. It is called
// whenever a new instance of the frontend is created, so that each
// user can add messages to their own personal thread.
app.post('/new-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();       // Create a new thread and store its ID
    res.json({ threadID: thread.id });                       // Return the new thread's ID as JSON
  } catch (error) {
    console.error('Error: ', error);                         // Catch errors and print them to console
  }
})

// This function handles all chat interaction with the Assistant. 
//   text: stores the message currently being passed to the Assistant
//   threadID: the unique identifier that seperates user conversations
//   return: The Assistant's final response as a string
async function chatWithOpenAI(text, threadID, res) {
  try {
    // Add the user's message on to the current thread. Threads will store all messages
    // created by the user and the Assistant.
    const message = await openai.beta.threads.messages.create( threadID,
      { role: "user", content: text }
    );
    
    // Run the specified thread on the assistant, using streaming. Output is streamed to
    // both the passed "res" stream, and to the console.
    const run = openai.beta.threads.runs.createAndStream( threadID, {
      assistant_id: assistantID
    })// The chunk of code below simply decides what text is streamed to the output.
      // At current basically all possible text is streamed to the ouput. 
      // Each ".write" is executed twice. Once for res and once for process.stdout (the console).
      .on('textCreated', (text) => {res.write('\nassistants > '), process.stdout.write('\nassistant > ')})
      .on('textDelta', (textDelta, snapshot) => {res.write(textDelta.value), process.stdout.write(textDelta.value)})
      .on('toolCallCreated', (toolCall) => {res.write(`\nassistant > ${toolCall.type}\n\n`), process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)})
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            res.write(toolCallDelta.code_interpreter.input);
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            res.write("\noutput >\n");
            process.stdout.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach(output => {
              if (output.type === "logs") {
                res.write(`\n${output.logs}\n`);
                process.stdout.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      });
    res.end();                                               // Close the stream (helps frontend parsing)
    return;                                                  // Return from function
  } catch (error) {
    console.error('Error: ', error);                         // Log the error message
    throw error;                                             // Ensure error handling in the calling function
  }
}

// Handle POST request from frontend to '/chat' endpoint, which is used for
// interacting with the Assistant.
// The request body contains both the user message and the threadID.
app.post('/chat', async (req, res) => {
  try {
    const { message, threadID } = req.body;                              // Extract message and threadID from the request body
    const responseFromAI = await chatWithOpenAI(message, threadID, res); // Interact with the Assistant (Return is through the "res" stream)
    // console.log(responseFromAI.content.value);                        // Log the Assistant's response as a string
    // res.json({ message: responseFromAI.content.value });              // Return the Assistant's response as JSON
  } catch (error) {
    console.error('Error processing chat message:', error);              // Catch and log any errors
    res.status(500).json({ error: error.message });                      // Send JSON error status back to frontend
  }
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);          // Log message stating the port number
});
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
const assistantID = 'asst_hCedfvBY45Br30lWe2izcKHp';

// NB This currently throws 500 (internal server) errors when using our
// API key, but it works when using another API key. I will update this
// comment when this issue is resolved.


// This get request is used to create a new thread. It is called
// whenever a new instance of the frontend is created, so that each
// user can add messages to their own personal thread.
app.get('/new-thread', async (req, res) => {
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
async function chatWithOpenAI(text, threadID) {
  try {
    // Add the user's message on to the current thread. Threads will store all messages
    // created by the user and the Assistant.
    const message = await openai.beta.threads.messages.create( threadID,
      { role: "user", content: text }
    );

    // Run the updated thread on the global assistant
    run = await openai.beta.threads.runs.create( threadID,   // The "run" variable stores info about the progress of the
      { assistant_id: assistantID }                          // current run. It DOES NOT store the Assistants response
    );

    // Extracting this waiting to a function allows "await" to be used. This helps
    // to prevent errors where a new thread is created during a run.
    await waitForRun(run, threadID);

    // Retreive the updated message list, which includes the latest AI response
    const messageList = await openai.beta.threads.messages.list(
      threadID
    );

    return { content: messageList.data[0].content[0].text }; // Return the assistant's final response message
  } catch (error) {
    console.error('Error: ', error);                         // Log the error message
    throw error;                                             // Ensure error handling in the calling function
  }
}

// This function will only return once the run has concluded
//   run: The run to be waited on
//   threadID: the unique identifier that seperates user conversations
// This will occasionally get stuck with run.status == in_progress
// If this happens the run will expire after 10 mins or so
// The only fix is to refresh the tab, which will open a new thread
async function waitForRun(run, threadID) {
  messageList = await openai.beta.threads.messages.list(threadID);
  let prevMessage = messageList.data[0].content[0];                    // Last stored message (for comparison)
  let prevStatus = run.status;                                         // Last stored run status (for comparison)

  while(run.status != 'completed') {                                   // Check if the run has completed yet
    // Log any changes to the run status whenever they occur
    run = await openai.beta.threads.runs.retrieve(threadID, run.id);   // Retrieve run status
    if(prevStatus != run.status) {                                     // If it has changed
      run = await openai.beta.threads.runs.retrieve(threadID, run.id); // Retrieve run status
      prevStatus = run.status;                                         //   Updated the prevStatus
      console.log('Run status: ' + run.status + "\n");               //   Log the status whenever it changes
    }

    // Log any new messages whenever they appear
    // JSON conversions are necessary for the conditions here
    messageList = await openai.beta.threads.messages.list(threadID);   // Retrieve the message list
    if(prevMessage != JSON.stringify(messageList.data[0].content[0])) {// Check for new messages 
      prevMessage = JSON.stringify(messageList.data[0].content[0]);    //   If new message, update prevMessage
      if(typeof(prevMessage) !== 'undefined') {
        console.log(JSON.parse(prevMessage).text.value+"\n");     //   And log the new message
      }
    }

    // Check if the run has failed, and if so throw an error containing the run status
    if(run.status === ('failed' || 'cancelled' || 'expired')) {        // If failed, cancelled or expired
      throw("Run "+run.status);                                        //   Throw an error that includes the run status
    }
  }
}

// Handle POST request from frontend to '/chat' endpoint, which is used for
// interacting with the Assistant.
// The request body contains both the user message and the threadID.
app.post('/chat', async (req, res) => {
  try {
    const { message, threadID } = req.body;                            // Extract message and threadID from the request body
    const responseFromAI = await chatWithOpenAI(message, threadID);    // Interact with the Assistant
    console.log(responseFromAI.content.value);                         // Log the Assistant's response as a string
    res.json({ message: responseFromAI.content.value });               // Return the Assistant's response as JSON
  } catch (error) {
    console.error('Error processing chat message:', error);            // Catch and log any errors
    res.status(500).json({ error: error.message });                    // Send JSON error status back to frontend
  }
});


// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);          // Log message stating the port number
});
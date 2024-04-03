const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

require('dotenv').config();

const corsOptions = {
  origin: 'http://localhost:5173', // or use '*' to allow any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // to allow cookies to be sent with the request
};

const app = express();
app.use(cors(corsOptions)); // Necessary to allow streaming
const port = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const StreamManager = {
  streams: [],

  addStream: function (res) {
    this.streams.push(res);
    res.on('close', () => {
      this.removeStream(res);
    });
  },

  removeStream: function (res) {
    this.streams = this.streams.filter(s => s !== res);
  },

  sendMessage: function (message) {
    this.streams.forEach(res => {
      res.write(`data: ${JSON.stringify(message)}\n\n`); //back slashed ns here needed for SSE handling
    });
  }
};

app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  StreamManager.addStream(res);
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


let globalGender, globalAgeLow, globalAgeHigh, globalCounty;

// This post request is used to store the persona data for the chat bot.
// It gives the chat bot a persona that is more suited to the users
// intrests.
app.post('/persona-data', async (req, res) => {
  try{
    const {gender, ageLow, ageHigh, county} = req.body;
    globalGender = gender;
    globalAgeLow = ageLow;
    globalAgeHigh = ageHigh;
    globalCounty = county;
    return;
  } catch (error) {
    console.error('Error: ', error);
  }
});

// This endpoint handles all chat interaction with the Assistant. 
//   text: stores the message currently being passed to the Assistant
//   threadID: the unique identifier that seperates user conversations
//   return: Nothing directly. All response is returned through the "res" stream
app.post('/chat', async (req, res) => {
  try {
    var responseCount = 0;
    const { message, threadID } = req.body;  
    
    // Add the user's message onto the current thread.
    const openAiMessage = await openai.beta.threads.messages.create(threadID, {
      role: "user",
      content: message
    });
    
    // Run the specified thread on the Assistant, using streaming.
    const run = openai.beta.threads.runs.createAndStream(threadID, {
      assistant_id: assistantID
    })
    .on('textCreated', (text) => {
      process.stdout.write('\nAssistant > ');
      if(responseCount++ <= 0) {    // Closes response, but stream stays open, which turns off dots
        res.send()         
      } else {                      // Carriage returns seperate new responses in the same bubble
        StreamManager.sendMessage({ status: 'open', type: 'textDelta', value: "\n\n" });
      }
    })
    .on('textDelta', (textDelta, snapshot) => {
      process.stdout.write(textDelta.value)
      // Format message in SSE format and send to client
      StreamManager.sendMessage({ status: 'open', type: 'textDelta', value: textDelta.value });
    })

    // When a new tool call is started by the Assistant, print "Assistant > toolCall.type" to the console
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nAssistant > ${toolCall.type}\n\n`))

    // When a new chunk of response from the tool call becomes available, handle it as below
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {                // If the tool is code_interpreter
        if (toolCallDelta.code_interpreter.outputs) {                 //   If chunk is an Assistant generated tool
          process.stdout.write("\nTool output >\n");                  //   OUTPUT, console log it
          toolCallDelta.code_interpreter.outputs.forEach(output => {  //   ForEach tool OUTPUT chunk
            if (output.type === "logs") {                             //     If the output is a log
              process.stdout.write(`\n${output.logs}\n`);             //       Write it to the console
            }
          });
        }
      }
    });

    return ;                                                           // Return from the function
  } catch (error) {
    console.error('Error processing chat message:', error);           // Catch and log any errors
    res.status(500).json({ error: error.message });                   // Send JSON error status back to frontend
  }
});

// Start the server on the specified port
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);                   // Log message stating the port number

});

// necessary for the unit tests
module.exports = {app, assistantID, server, port};
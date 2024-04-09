const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

require('dotenv').config();
const FILE_ID_STORE = require('./file-id-array.js');
const CONSTANTS = require('./constants.js');

const corsOptions = {
  origin: '*', // or use '*' to allow any origin
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

// Assign the ID of the target assistant for unit tests. This is a hard coded global variable.
// Assistants can be created, deleted etc. from the assistant-editor.js file.
const assistantID = 'asst_oANbAY9nu3G4i5ySHABCLUIB';

let relevantAssistantID, relevantFileID, relevantFileResponses;


// This post request is used to create a new thread. It is called
// whenever a new instance of the frontend is created, so that each
// user can add messages to their own personal thread. It also initialises
// the frontend assistantID and fileID to default values.
app.post('/new-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();       // Create a new thread and store its ID
    res.json({ threadID: thread.id, assistantID: CONSTANTS.DFLT_ASSISTANT_ID, fileID: CONSTANTS.DFLT_FILE_ID });                       // Return the new thread's ID as JSON
  } catch (error) {
    console.error('Error: ', error);                         // Catch errors and print them to console
  }
})

// This post request is used to store the persona data for the chat bot.
// It gives the chat bot a persona that is more suited to the users
// intrests, by changing the fileID the assistant is instructed to use.
app.post('/persona-data', async (req, res) => {
  try{
    const {gender, ageIndex, county} = req.body;
    console.log("Gender: "+gender+", ageIndex: "+ageIndex+", County: "+county+"\n");
    let i,j,k = 0;

    switch(ageIndex) {
      case '0':
        i = ageIndex;
        relevantAssistantID = CONSTANTS.ASSISTANT_ID_18_22;
        break;
      case '1':
        i = ageIndex;
        relevantAssistantID = CONSTANTS.ASSISTANT_ID_23_35;
        break;
      case '2':
        i = ageIndex;
        relevantAssistantID = CONSTANTS.ASSISTANT_ID_36_53;
        break;
      case '3':
        i = ageIndex;
        relevantAssistantID = CONSTANTS.ASSISTANT_ID_56_65;
        break;
      default:
        i = -1;
        break;
    }

    switch(gender) {
      case 'male':
        j = 0;
        break;
      case 'female':
        j = 1;
        break;
      default:
        j = -1;
        break;
    }

    switch(county) {
      case 'D':
        k = 0;
        break;
      case 'L':
        k = 1;
        break;
      case 'M':
        k = 2;
        break;
      case 'C':
        k = 3;
        break;
      case 'U':
        k = 4;
        break;
      case 'A':
        k = 5;
        break;
      default:
        k = -1;
        return;
    }

    if(i != -1 && j != -1 && k != -1) {
      relevantFileID = FILE_ID_STORE.data[i][j][k][0];
      relevantFileResponses = FILE_ID_STORE.data[i][j][k][1];
    } else {
      relevantFileID = CONSTANTS.DFLT_FILE_ID;
      relevantAssistantID = CONSTANTS.DFLT_ASSISTANT_ID;
    }
    console.log("i = "+i+", j = "+j+", k = "+k+",\nFileID = "+relevantFileID+",\nAssistantID = "+relevantAssistantID+"\n");
    res.json({ assistantID: relevantAssistantID, fileID: relevantFileID });
    return;
  } catch (error) {
    relevantFileID = CONSTANTS.DFLT_FILE_ID;
    console.error('An error occurred while handling the persona data: ', error);
  }
});


// This endpoint handles all chat interaction with the Assistant. 
//   text: stores the message currently being passed to the Assistant
//   threadID: the unique identifier that seperates user conversations
//   return: Nothing directly. All response is returned through the "res" stream
app.post('/chat', async (req, res) => {
  try {
    var responseCount = 0;
    const { message, threadID, assistantID, fileID } = req.body;  
    console.log("Message: "+message+",\nThreadID: "+threadID+",\nAssistantID: "+assistantID+",\nFileID: "+fileID+"\n");
    
    // Add the user's message onto the current thread.
    if(fileID != "no_data") {
      const openAiMessage = await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: "Use the file with ID "+fileID+" to respond to the following prompt: \n"+message,
        // file_ids: [relevantFileID]
      });
      
      // Run the specified thread on the Assistant, using streaming.
      const run = openai.beta.threads.runs.createAndStream(threadID, {
        assistant_id: assistantID
      })
      .on('textCreated', (text) => {
        process.stdout.write('\nAssistant > ');
        if(responseCount++ <= 0) {    // Closes response, but stream stays open, which turns off dots
          res.send();        
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
    }

    return ;                                                           // Return from the function

  } catch (error) {
    console.error('Error processing chat message:', error);           // Catch and log any errors
    res.status(500).json({ error: error.message });                   // Send JSON error status back to frontend
  }
});

// This endpoint resets the filters to their default values
app.post('/reset-filters', (req, res) => {
  relevantAssistantID = CONSTANTS.DFLT_ASSISTANT_ID;
  relevantFileID = CONSTANTS.DFLT_FILE_ID;
  relevantFileResponses = CONSTANTS.SURVEY_SIZE; // Reset this if it's supposed to be reset as well
  res.json({ message: 'Filters reset to default.', assistantID: relevantAssistantID, fileID: relevantFileID });
});

// Start the server on the specified port
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);                   // Log message stating the port number

});

// necessary for the unit tests
module.exports = {app, assistantID, server, port};

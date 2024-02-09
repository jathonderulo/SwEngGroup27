// Import required modules
const express = require('express'); // Node.js framework for building RESTful APIs
const bodyParser = require('body-parser'); // Parses incoming request bodies
const cors = require('cors'); // Enables Cross-Origin Resource Sharing
const OpenAI = require('openai'); // OpenAI API wrapper

const { OPENAI_API_KEY } = require('./config'); // Import API key from config.js

// Initialize Express application
const app = express();
const port = 3001; // Define port number

// Initialize OpenAI client with API ey
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, 
  });


// Setup other bits
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// Function to initiate conversation with OpenAI
// This currently serves as a test to see if we can communicate with the API
// Automatically runs when we run `node index.js`
async function chatWithOpenAI(text, messageFromAPI) { 
    try {
        // Create a conversation with a system message
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: text }],
            model: "gpt-3.5-turbo",
        });
        console.log(completion.choices[0].message.content);
        messageFromAPI = completion.choices[0].message.content;
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    }

// Route to handle GET requests
app.get('/example', (req, res) => {
  res.send('This is an example GET request response.');
  console.log(`Get request received on port ${port}`);
  
});

// Handle incoming chat messages
app.post('/chat', async (req, res) => {
  try {
    // Extract message from request body, and reformat the prompt accordingly
    const message = JSON.stringify(req.body);
    //console.log(message) ;
    // Send the chat response back to the client
    var messageFromAPI;
    chatWithOpenAI(message, messageFromAPI);
    res.json({ message: messageFromAPI });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
// Sample prompt engineering using a hard coded persona
function reformatPrompt(prompt) {
  return "Answer the following question from the point of view of a 36-53 year old male: " + prompt.message;
}*/

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
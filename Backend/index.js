const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const OpenAI = require('openai');

const OPENAI_API_KEY = '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'; // Replace with your actual OpenAI API key

const app = express();
const port = 3001;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, // Add your OpenAI API key here
  });
  

app.use(bodyParser.json());



app.use(cors()); // Enable CORS for all routes

async function chatWithOpenAI() {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
      });
      console.log(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  chatWithOpenAI();


// Handle incoming chat messages
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Send the user's message to the OpenAI API
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: message }],
        model: "gpt-3.5-turbo",
      });

    // Extract the response from the OpenAI API
    const chatResponse = completion.choices[0].message.content;
    
    // Send the chat response back to the client
    res.json({ message: chatResponse });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
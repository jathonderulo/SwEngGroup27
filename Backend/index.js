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

async function chatWithOpenAI(text, sessionHistory) {
  try {
    // Include a system message or user message based on sessionHistory being empty or not
    const messages = sessionHistory.length > 0 ? sessionHistory : [{ role: "system", content: "Start a new conversation" }];
    messages.push({ role: "user", content: text }); // Add the new user message to the conversation history

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });


    // Add the AI's response to the conversation history
    messages.push({ role: "assistant", content: completion.choices[0].message.content });

    return {
      content: completion.choices[0].message.content,
      conversationHistory: messages // Return the updated conversation history
    };
  } catch (error) {
    console.error('Error:', error);
    throw error; // Ensure error handling in the calling function
  }
}

// In your endpoint:
app.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body; // Get conversationHistory from the request body

    // Ensure that conversationHistory is an array
    const validHistory = Array.isArray(conversationHistory) ? conversationHistory : [];

    const responseFromAI = await chatWithOpenAI(message, validHistory);
    console.log(responseFromAI.content);
    res.json({ message: responseFromAI.content, conversationHistory: responseFromAI.conversationHistory });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

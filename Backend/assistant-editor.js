const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('./config');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

//
// DO NOT run the deleteAllAssistants() function using the client provided API key
//

// The main function is run upon execution of this program. Use this function
// to call the other functions conveniently. Be careful with your function calls
// as some of these functions can be damaging if run accidentally
async function main() {
  listAllAssistants();
//   createAssistant("Survey Assistant", "You are an assistant that answers questions people ask surrounding the results to a survey.");
//   deleteAllAssistants();
}

// This function retrieves a list of all assistants stored on OpenAI's servers
// under the organistion tied to the current key
async function listAllAssistants() {
  const list = await openai.beta.assistants.list();
  console.log(list);
}

// This function will create an assistant using the openAI NodeJS library
// It will then log the assistant info to the console
async function createAssistant(name, instructions) {
  const myAssistant = await openai.beta.assistants.create({
    instructions: instructions,                   // Instructions for assistant, from parameter
    name: name,                                   // Arbitrary assistant name
    tools: [{ type: "code_interpreter" }],        // Tools the assistant can use
    model: "gpt-3.5-turbo",                       // OpenAI model the assistant is based on
  });

  console.log(myAssistant);                       // Log the assistant information
}

// This function will delete all assistants stored on openAI's servers
// under the organisation tied to the current key. Use this function
// carefully and ensure you are using the correct key.
async function deleteAllAssistants() {
  list = await openai.beta.assistants.list();     // Retrieve a list of all assistants
  let currId;                                     // Create a variable for the assistant ID
  console.log(list);                              // Log the list before deletions

  for(i=0; i<list.data.length; i++) {             // Loop through all assistants
    currId = list.data[i].id;                     //   Store their ID
    console.log(currId);                          //   Log this ID
    await openai.beta.assistants.del(currId);     //   Then delete the target assistant
  }
  list = await openai.beta.assistants.list();     // Retrieve the updated list
  console.log(list);                              // And log this updated list
}

main();
const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('./config');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// The main function is run upon execution of this program. Use this function
// to call the other functions conveniently. Be careful with your function calls
// as some of these functions can be damaging if run accidentally.
// Uncomment function calls to use them.
async function main() {
  createFile("./data-sets/18MM");


  // listAllAssistants();
  // listFiles();
  // logRecentAssistant();
  // deleteAssistant('asst_LjdET6jzjySOjOpotRKM2GTl');
  // deleteFile('asst_LjdET6jzjySOjOpotRKM2GTl', 'file-XUogDDfyoZBhMcme7RgxqUoq');

  // Uncomment the function below to create a new Assistant. Pass three params:
  //   - assistantName
  //   - assistantInstructions
  //   - pathOfFile

  // initializeAssistant("Survey Assistant", 
  // "You are an assistant that answers questions people ask surrounding the results to a survey."
  //  + " The survey results are contained in a .json file, which you have access to. Please respond 'Sorry I cannot do that for you' to"
  //  + " any questions that are unrelated to the survey data.",
  //  "./data-sets/survey-answers-all.json");
}

// This function creates a thread and logs its ID
async function createThread() {
  const thread = await openai.beta.threads.create();        // Create a new thread
  console.log(thread.id);                                   // Log the thread ID
}

// This function creates an assistant and a file and then connects the two
async function initializeAssistant(name, instructions, filePath) {
  assistantID = await createAssistant(name, instructions);  // Create an assistant using the params
  fileID = await createFile(filePath);                      // Create a file from param path
  await uploadFile(assistantID, fileID);                    // Attach this file and assistant
  console.log(assistantID);                                 // Log the new assistant's ID
}

// This function retrieves a list of all assistants stored on OpenAI's servers
// under the organistion tied to the current key
async function listAllAssistants() {
  const list = await openai.beta.assistants.list();         // Retrieve a list of our assistants from OpenAI
  console.log(list);                                        // Log this list in full
}

// This function logs the info of the most recent assistant
async function logRecentAssistant() {
  const list = await openai.beta.assistants.list();         // Retrieve assistant list
  const assistantID = list.body.first_id;                   // Extract ID of most recent from list
  const assistant = await openai.beta.assistants.retrieve(assistantID); // Retrieve that assistant
  console.log(assistant);                                   // Log its info
  return assistant;                                         // And return its info
}

// This function creates an assistant using the openAI NodeJS library
// This assistant is stored on the openAI servers, under the organisation
// tied to your API key. It will then log the assistant info to the console
async function createAssistant(name, instructions) {
  const myAssistant = await openai.beta.assistants.create({
    instructions: instructions,                   // Instructions for assistant, from parameter
    name: name,                                   // Arbitrary assistant name
    tools: [
      { type: "code_interpreter" },               // Tools the assistant can use
      {type: "retrieval"}],
    model: "gpt-4-turbo-preview",                 // OpenAI model the assistant is based on
  });

  console.log(myAssistant);                       // Log the assistant information
  return myAssistant.id;                          // returns the assistants id
}

// This function creates a file using the openAI NodeJS library
// This file is stored on the openAI servers, under the organisation
// tied to your API key. It will then log the file info to the console
async function createFile(path) {
  const file = await openai.files.create({
    file: fs.createReadStream(path),              // The file found at the path String parameter
    purpose: 'assistants',                        // Purpose is either 'fine-tuning' or 'assistants'
  });
  console.log(file.id);                              // Log the file information
  return file.id;                                 // the file id is returned
}

// This function attaches a file from the openAI servers to an assistant
// that is also on the openAI servers.
async function uploadFile(assistantID, fileID) {
  const assistantFile = await openai.beta.assistants.files.create(
    assistantID, { file_id: fileID }              // assistantID and fileID from parameters
  );
  console.log(assistantFile);                     // Log the assistant.file information
}

async function listFiles() {
  const fileList = await openai.files.list();
  console.log(fileList);
}

// This function deletes the specified assistant
async function deleteAssistant(assistantID) {
  await openai.beta.assistants.del(assistantID);  // Delete assistant with the passed ID parameter
  console.log("Deleted "+assistantID);            // Log the deletion
}

async function deleteFile(assistantID, fileID) {
  await openai.beta.assistants.files.del(assistantID, fileID);
  console.log("Deleted "+fileID+" from "+assistantID);
  await openai.files.del(fileID);
  console.log("Deleted "+fileID);
}

main();
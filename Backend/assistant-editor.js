const OpenAI = require('openai');
require('dotenv').config();
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The main function is run upon execution of this program. Use this function
// to call the other functions conveniently. Be careful with your function calls
// as some of these functions can be damaging if run accidentally.
// Uncomment function calls to use them.
async function main() {
  // logRecentAssistant();

  // const myUpdatedAssistant = await openai.beta.assistants.update(
  //   'asst_P7qpUcXUhoPGn78AWkSeMwUX',
  //   {
  //     instructions:
  //     "You are an assistant that answers questions people ask about refined sections of a large dataset of"
  //     + " survey responses. The survey results are contained in .json lists, which you have access to. The"
  //     + " ID of the only file that you should use will be contained in the beginning of every message. It is"
  //     + " absolutely essential that you do not expect keys to be referenced directly in user prompts, instead"
  //     + " you should always try to find the most relevant key from the data. Please always ensure the keys"
  //     + " are valid before calling any tools, this is crucial to your functionality. If a result seems unlikely,"
  //     + " immediately analyse it again and ensure that you used a valid key. If you are asked a personal question,"
  //     + " then you must answer in the first person with the most common response to this question, as if you are"
  //     + " actually a survey respondant. It is essential that responses to personal questions are in the first"
  //     + " person. You should be acting as a respondant in these situations. Please respond with 'Sorry I"
  //     + " cannot do that for you' to any questions that are completely unrelated to the survey data.",
  //   }
  // );

  // console.log(myUpdatedAssistant);


  // createAssistant("Survey Assistant for 56-65 datasets",
  // "You are an assistant that answers questions people ask surrounding the results to a survey."
  //  + " The survey results are contained in a .json file, which you have access to. Please respond 'Sorry I cannot do that for you' to"
  //  + " any questions that are unrelated to the survey data."
  // );

  // uploadFile('asst_P7qpUcXUhoPGn78AWkSeMwUX', "file-iO1uaKiGDFibbov9wF1Zk8ow");

  // deleteFile('', "file-Z7OlgvKzYp3W8fo3ISTCGLOz");

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
  assistantID = await createAssistant(name, instructions);  // Create an assistant using the parameters
  fileID = await createFile(filePath);                      // Create a file from parameters path
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

  console.log(myAssistant.id);                       // Log the assistant information
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
  // await openai.beta.assistants.files.del(assistantID, fileID);
  // console.log("Deleted "+fileID+" from "+assistantID);
  await openai.files.del(fileID);
  console.log("Deleted "+fileID);
}

main();
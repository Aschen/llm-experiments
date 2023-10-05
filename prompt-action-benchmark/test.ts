import OpenAI from "openai";
import { PromptTemplate } from "langchain/prompts";

import * as func from "./function";

const openai = new OpenAI();

const stacktrace = `TypeError: Cannot read properties of undefined (reading 'id')
at createTask (/home/aschen/projects/stacktrace-explanator/examples/context-understanding/app.js:20:51)
at /home/aschen/projects/stacktrace-explanator/examples/context-understanding/app.js:25:5
at Layer.handle [as handle_request] (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/layer.js:95:5)
at next (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/route.js:144:13)
at Route.dispatch (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/route.js:114:3)
at Layer.handle [as handle_request] (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/layer.js:95:5)
at /home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/index.js:284:15
at Function.process_params (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/index.js:346:12)
at next (/home/aschen/projects/stacktrace-explanator/node_modules/express/lib/router/index.js:280:10)
at /home/aschen/projects/stacktrace-explanator/node_modules/body-parser/lib/read.js:137:5`;

const userFunctions1: string[] = [];
const userFunctions2: string[] = [];

userFunctions1.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/app.js
code:
\`\`\`js
const database = require('/home/aschen/projects/stacktrace-explanator/examples/context-understanding/database.js');
const { verifyTask } = require('/home/aschen/projects/stacktrace-explanator/examples/context-understanding/verify.js');

function createTask (req, res) {
  const newTask = req.body;
  verifyTask(newTask);
  const savedTask = database.addTask(newTask);
  res.status(201).send(\`Task \${savedTask.metadata.id} saved successfully\`);
}
\`\`\``);
userFunctions1.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/verify.js
code:
\`\`\`js
function verifyTask(task) {
  if (typeof task.title !== 'string' || task.title.length > 120) {
    throw new Error('Invalid title');
  }
  if (typeof task.position !== 'number' || task.position < 0) {
    throw new Error('Invalid position');
  }
  return true;
}
\`\`\``);
userFunctions1.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/database.js
code:
\`\`\`js
function addTask(newTask) {
  const tasks = readTasksFromFile();
  tasks.push({ ...newTask, metadata: { id: generateId() } });
  writeTasksToFile(tasks);
  return newTask;
}
\`\`\``);

const promptTemplate = new PromptTemplate({
  template: `You are a developer.

Your goal is to retrieve every user function called from the first function referenced by this stacktrace:
{stacktrace}
    
For each user function, note the name of every function that is called and read the code of these functions. 
Check the require statements in the user functions to know which files you need to read.   
You can ask to read many function at once. 

Since you already have the code of the following user functions:
{userFunctions}

Decide if you need to read the code of more user function or if you need to stop because you have the code of all the user function.

You can use many functions at once.
  `,
  inputVariables: ["stacktrace", "userFunctions"],
});

// Example dummy function hard coded to return the same weather
// In production, this could be your backend API or an external API
function getCurrentWeather(location, unit = "fahrenheit") {
  const weatherInfo = {
    location: location,
    temperature: "72",
    unit: unit,
    forecast: ["sunny", "windy"],
  };
  return JSON.stringify(weatherInfo);
}

function readFunctionCode(filePath: string, functionName: string): string {
  console.log(`Read function ${functionName} from ${filePath}`);

  return `Read function ${functionName} from ${filePath}`;
}

function stop() {
  console.log("stop");
}

async function runConversation(prompt) {
  // Step 1: send the conversation and available functions to GPT
  const messages: any = [{ role: "user", content: prompt }];
  const functions = [
    {
      name: "read_function",
      description: "Read the code of an user function",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Path of the file containing the function",
          },
          functionName: {
            type: "string",
            description: "Name of the file containing the function",
          },
        },
        required: ["filePath", "functionName"],
      },
    },
    {
      name: "stop",
      description: "You have all the information you need",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    functions,
    function_call: "auto", // auto is default, but we'll be explicit
  });
  const responseMessage = response.choices[0].message;
  // Step 2: check if GPT wanted to call a function
  console.log(responseMessage);

  // if (responseMessage.function_call) {
  //   // Step 3: call the function
  //   // Note: the JSON response may not always be valid; be sure to handle errors
  //   const availableFunctions = {
  //     read_function_code: readFunctionCode,
  //   }; // only one function in this example, but you can have multiple

  //   const functionName = responseMessage.function_call.name;
  //   const functionToCall = availableFunctions[functionName];
  //   const functionArgs = JSON.parse(responseMessage.function_call.arguments);
  //   const functionResponse = functionToCall(
  //     functionArgs.location,
  //     functionArgs.unit
  //   );

  //   // Step 4: send the info on the function call and function response to GPT
  //   messages.push(responseMessage); // extend conversation with assistant's reply
  //   messages.push({
  //     role: "function",
  //     name: functionName,
  //     content: functionResponse,
  //   }); // extend conversation with function response
  //   const secondResponse = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: messages,
  //   }); // get a new response from GPT where it can see the function response
  //   return secondResponse;
  // }
}

const prompt = await promptTemplate.format({
  stacktrace,
  userFunctions: userFunctions1.join("\n"),
});

runConversation(prompt).then(console.log).catch(console.error);

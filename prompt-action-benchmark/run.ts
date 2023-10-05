import { writeFileSync } from "node:fs";

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

import * as markdown from "./markdown";
import * as json from "./json";
import * as xml from "./xml";
import * as func from "./function";

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.0,
  maxTokens: -1,
});

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
userFunctions2.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/database.js
code:
\`\`\`js
function readTasksFromFile() {
  let tasksData = '[]';
  try {
      tasksData = fs.readFileSync('./tasks.json');
  } catch (err) {
      if (err.code === 'ENOENT') {
          console.log('tasks.json not found, creating a new one.');
          fs.writeFileSync('./tasks.json', tasksData);
      } else {
          throw err;
      }
  }
  return JSON.parse(tasksData);
}
\`\`\``);
userFunctions2.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/database.js
code:
\`\`\`js
function generateId() {
  return Math.floor(Math.random() * 1000);
}
\`\`\``);
userFunctions2.push(`filePath: /home/aschen/projects/stacktrace-explanator/examples/context-understanding/database.js
code:
\`\`\`js
function writeTasksToFile(tasks) {
  fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
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
Use one of the following actions to continue:
{actionReadFunction}

{actionStop}

{format}
You next actions should be:
  `,
  inputVariables: [
    "stacktrace",
    "userFunctions",
    "actionReadFunction",
    "actionStop",
    "format",
  ],
});

const promptTemplateDelimited = new PromptTemplate({
  template: `You are a developer.

Your goal is to retrieve every user function called from the first function referenced by this stacktrace.
# Stacktrace

{stacktrace}

# end Stacktrace

For each user function, note the name of every function that is called and read the code of these functions. 
Check the require statements in the user functions to know which files you need to read.   
You can ask to read many function at once. 

Since you already have the code of the following user functions:
# User functions

{userFunctions}

# end User functions

Decide if you need to read the code of more user function or if you need to stop because you have the code of all the user function.
Use one of the following actions to continue:
# Actions
{actionReadFunction}

{actionStop}

# end Actions

You next actions should be:
  `,
  inputVariables: [
    "stacktrace",
    "userFunctions",
    "actionReadFunction",
    "actionStop",
  ],
});

function checkParsing(actions: Array<{ action: string; parameters: any }>) {
  let score = 0;

  for (const action of actions) {
    if (action.action === "READ_FUNCTION") {
      if (action.parameters.functionName && action.parameters.filePath) {
        score++;
      }
    } else if (action.action === "STOP") {
      score++;
    } else {
      score--;
    }
  }

  return score;
}

async function evaluate(
  style: string,
  round: number,
  actionStyle: any,
  userFunctions: any
) {
  const prompt = await promptTemplate.format({
    actionReadFunction: actionStyle.actionReadFunction,
    actionStop: actionStyle.actionStop,
    stacktrace,
    userFunctions: userFunctions.join("\n"),
    format: actionStyle.format,
  });

  const answer = await model.call(prompt);

  try {
    const actions = actionStyle.parseResponse(answer);

    return checkParsing(actions);
  } catch (error) {
    console.log(error);
    console.log(answer);

    return -1;
  } finally {
    writeFileSync(
      `./prompts/${style}-${round}.txt`,
      prompt + "\n\n-----------------\n\n" + answer
    );
  }
}

async function runBenchmark(style: string, actionStyle: any, rounds = 20) {
  const scores: number[][] = [];

  const promises: Promise<any>[] = [];

  for (let round = 0; round < rounds; round++) {
    promises.push(
      evaluate(style, round, actionStyle, userFunctions1).then((score) =>
        scores.push([round, score])
      )
    );
  }

  for (let round = rounds; round < rounds + rounds; round++) {
    promises.push(
      evaluate(
        style,
        round,
        actionStyle,
        userFunctions1.concat(userFunctions2)
      ).then((score) => scores.push([round, score]))
    );
  }

  await Promise.all(promises);

  return scores;
}

async function run() {
  // const scoresMarkdown = await runBenchmark("markdown", markdown, 20);
  // const scoresXml = await runBenchmark("xml", xml, 20);
  const scoresJson = await runBenchmark("json", json, 20);

  console.log({
    // scoresMarkdown,
    // scoresXml,
    scoresJson,
  });

  console.log({
    // markdown: scoresMarkdown.reduce((acc, [_, score]) => acc + score, 0),
    // xml: scoresXml.reduce((acc, [_, score]) => acc + score, 0),
    json: scoresJson.reduce((acc, [_, score]) => acc + score, 0),
  });
}

// run();

const prompt = await promptTemplate.format({
  actionReadFunction: func.actionReadFunction,
  actionStop: func.actionStop,
  stacktrace,
  userFunctions: userFunctions1.join("\n"),
  format: func.format,
});

const answer = await model.call(prompt);

console.log(answer);

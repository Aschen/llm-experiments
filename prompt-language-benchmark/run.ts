import { writeFileSync } from 'node:fs';

import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

import { template as frenchTemplate } from './french';
import { template as englishTemplate } from './english';
import * as xmlActions from './xml';

const model = new OpenAI({
  modelName: 'gpt-4-1106-preview',
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

const promptTemplateFrench = new PromptTemplate({
  template: frenchTemplate,
  inputVariables: [
    'stacktrace',
    'userFunctions',
    'actionReadFunction',
    'actionStop',
    'format',
  ],
});

const promptTemplateEnglish = new PromptTemplate({
  template: englishTemplate,
  inputVariables: [
    'stacktrace',
    'userFunctions',
    'actionReadFunction',
    'actionStop',
    'format',
  ],
});

function checkParsing(actions: Array<{ action: string; parameters: any }>) {
  let score = 0;

  for (const action of actions) {
    if (action.action === 'READ_FUNCTION') {
      if (action.parameters.functionName && action.parameters.filePath) {
        score++;
      }
    } else if (action.action === 'STOP') {
      score++;
    } else {
      score--;
    }
  }

  return score;
}

async function evaluate(
  lang: string,
  template: PromptTemplate,
  userFunctions: any
) {
  const prompt = await template.format({
    actionReadFunction: xmlActions.actionReadFunction,
    actionStop: xmlActions.actionStop,
    stacktrace,
    userFunctions: userFunctions.join('\n'),
    format: xmlActions.format,
  });

  const answer = await model.call(prompt);

  try {
    const actions = xmlActions.parseResponse(answer);

    return checkParsing(actions);
  } catch (error) {
    console.log(error);
    console.log(answer);

    return -1;
  } finally {
    writeFileSync(
      `./prompts/${lang}.txt`,
      prompt + '\n\n-----------------\n\n' + answer
    );
  }
}

async function runBenchmark(lang: string, rounds = 20) {
  const scores: number[][] = [];

  const promises: Promise<any>[] = [];

  const template =
    lang === 'french' ? promptTemplateFrench : promptTemplateEnglish;

  for (let round = 0; round < rounds; round++) {
    promises.push(
      evaluate(lang, template, userFunctions1).then((score) =>
        scores.push([round, score])
      )
    );
  }

  await Promise.all(promises);

  return scores;
}

async function run() {
  const scoresFrench = await runBenchmark('french', 10);
  const scoresEnglish = await runBenchmark('english', 10);

  console.log({
    scoresFrench,
    scoresEnglish,
  });

  console.log({
    french: scoresFrench.reduce((acc, [_, score]) => acc + score, 0),
    english: scoresEnglish.reduce((acc, [_, score]) => acc + score, 0),
  });
}

run();

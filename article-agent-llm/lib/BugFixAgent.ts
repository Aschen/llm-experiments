import { writeFileSync } from "fs";

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

import { extractActions } from "./helpers/actions";
import { cleanCode, replaceFunctionCode } from "./helpers/code";

export class BugFixAgent {
  private model = new OpenAI({
    modelName: "gpt-4",
    temperature: 0.0,
    maxTokens: -1,
  });
  private promptTemplate = new PromptTemplate({
    template: `You are an excellent developer trying to solve a bug.

You will need to give a short explanation of the bug.
You will also provide a fix for the bug. 
Try to fix the bug as soon as it occur in the function call flow. 
You don't have the full code of the file, so you will need to make assumptions.
You may have to modify functions in different files to fix the bug.

Here is the stacktrace of the bug:
{stacktrace}

Here are the user functions involved in this bug:
### BEGIN USER FUNCTIONS
{userFunctions}
### END USER FUNCTIONS

You can use those actions to answer:

<Action name="EXPLANATION">
  <Parameter name="explanation">
    // short explanation of the bug
  </Parameter>
</Action>

<Action name="FIX_FUNCTION">
  <Parameter name="filepath">
    // path to the file where the fix is
  </Parameter>

  <Parameter name="functionName">
    // name of the function to fix
  </Parameter>

  <Parameter name="code">
    \`\`\`js
      // entire code of the fixed function here. do not add require statements
    \`\`\`
  </Parameter>
</Action>    
`,
    inputVariables: ["stacktrace", "userFunctions"],
  });
  private stacktrace: string;

  public userFunctions: string[] = [];

  constructor({
    stacktrace,
    userFunctions,
  }: {
    stacktrace: string;
    userFunctions: string[];
  }) {
    this.stacktrace = stacktrace;
    this.userFunctions = userFunctions;
  }

  async run() {
    this.log("start fixing the bug");

    const prompt = await this.promptTemplate.format({
      stacktrace: this.stacktrace,
      userFunctions: this.userFunctions.join("\n"),
    });

    const answer = await this.model.call(prompt);

    writeFileSync("./prompts/bugfix-prompt.txt", prompt + "\n----\n" + answer);

    const actions = extractActions(answer);

    for (const { action, parameters } of actions) {
      await this.executeAction(action, parameters);
    }
  }

  private async executeAction(action: string, parameters: any) {
    switch (action) {
      case "EXPLANATION":
        this.log(parameters.explanation);
        break;

      case "FIX_FUNCTION":
        this.log(
          `Fixing bug in function "${parameters.functionName}" in file "${parameters.filepath}"`
        );

        replaceFunctionCode(
          parameters.filepath,
          parameters.functionName,
          cleanCode(parameters.code)
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  log(text: string) {
    console.log(`BugFixAgent: ${text}`);
  }
}

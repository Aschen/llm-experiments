import { writeFileSync } from "fs";

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

import { extractActions } from "./helpers/actions";
import { getFunctionCodeWithRequire } from "./helpers/code";

export class WalkCallStackAgent {
  private model = new OpenAI({
    modelName: "gpt-4",
    temperature: 0.0,
    maxTokens: -1,
  });
  private promptTemplate = new PromptTemplate({
    template: `Your goal is to retrieve every user function called from the first function referenced by this stacktrace:
{stacktrace}
    
For each user function, note the name of every function that is called and read the code of these functions. 
Check the require statements in the user functions to know which files you need to read.   
You can ask to read many function at once. 

You already have the code of the following user functions:
{userFunctions}

Decide if you need to read the code of more user function or if you are done because you have the code of all the user function.
You can use the following actions:

<Action name="READ_FUNCTION">
  <Parameter name="filePath">
    // path to the file containing the function
  </Parameter>

  <Parameter name="functionName">
    // name of the function
  </Parameter>
</Action>

<Action name="DONE"></Action>

Answer only with your next actions.`,
    inputVariables: ["stacktrace", "userFunctions"],
  });
  private stacktrace: string;

  public userFunctions: string[] = [];

  constructor({ stacktrace }: { stacktrace: string }) {
    this.stacktrace = stacktrace;
  }

  async run() {
    let i = 0;
    let done = false;

    this.log("start retrieving user functions");

    while (!done) {
      this.log(`${this.userFunctions.length} user functions found`);

      const prompt = await this.promptTemplate.format({
        stacktrace: this.stacktrace,
        userFunctions: this.userFunctions.join("\n"),
      });

      const answer = await this.model.call(prompt);

      writeFileSync(
        `./prompts/walkcallstack-prompt-${i++}.txt`,
        prompt + "\n----\n" + answer
      );

      const actions = extractActions(answer);

      for (const { action, parameters } of actions) {
        done = await this.executeAction(action, parameters);
      }
    }
  }

  private async executeAction(action: string, parameters: any) {
    switch (action) {
      case "READ_FUNCTION":
        this.log(
          `Read code of function "${parameters.functionName}" in file "${parameters.filePath}"`
        );

        const functionCode = getFunctionCodeWithRequire(
          parameters.filePath,
          parameters.functionName
        );
        this.userFunctions.push(functionCode);

        return false;

      case "DONE":
        this.log(`finished`);
        return true;

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  log(text: string) {
    console.log(`WalkCallStackAgent: ${text}`);
  }
}

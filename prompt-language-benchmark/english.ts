export const template = `You are a developer.

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
  `;

export const actionReadFunction = `# Action:READ_FUNCTION
filePath: // path to the file containing the function
functionName: // name of the function
# end`;

export const actionStop = `# Action:STOP
# end`;

export const format = "";

export function parseResponse(text: string) {
  const actionPattern = /# Action:(.*?)\n([\s\S]*?)# end/g;
  const parameterPattern = /([^:\n]+):([^\n]*)/g;

  const actions: Array<{ action: string; parameters: any }> = [];

  let match;

  while ((match = actionPattern.exec(text)) !== null) {
    const action = match[1].trim();
    const actionContent = match[2].trim();
    const parameters = {};

    let paramMatch;

    while ((paramMatch = parameterPattern.exec(actionContent)) !== null) {
      const paramName = paramMatch[1].trim();
      const paramValue = paramMatch[2].trim();
      parameters[paramName] = paramValue;
    }

    actions.push({ action, parameters });
  }

  return actions;
}

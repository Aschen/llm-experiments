export const actionReadFunction = `{ "action": "READ_FUNCTION", "parameters": { "filePath": "// path to the file containing the function", "functionName": "// name of the function" } }`;

export const actionStop = `{ "action": "STOP" }`;

export const format = "Answer should be a valid JSON array of actions.";

export function parseResponse(text: string) {
  const actions: Array<{ action: string; parameters: any }> = JSON.parse(text);

  return Array.isArray(actions) ? actions : [actions];
}

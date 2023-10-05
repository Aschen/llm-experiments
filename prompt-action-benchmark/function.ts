export const actionReadFunction = `read_function(filePath: string, functionName: string): string`;

export const actionStop = `stop()`;

export const format = "Answer should be a valid JSON array of actions.";

export function parseResponse(text: string) {
  const actions: Array<{ action: string; parameters: any }> = JSON.parse(text);

  return Array.isArray(actions) ? actions : [actions];
}

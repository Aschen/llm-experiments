export const actionReadFunction = `<Action name="READ_FUNCTION">
  <Parameter name="filePath">
    // path to the file containing the function
  </Parameter>

  <Parameter name="functionName">
    // name of the function
  </Parameter>
</Action>`;

export const actionStop = `<Action name="STOP"></Action>`;

export const format = '';

export function parseResponse(text: string) {
  const actions: Array<{ action: string; parameters: any }> = [];

  // Find all action tags
  const actionRegex = /<Action\s+name="([^"]+)">(.*?)<\/Action>/gs;
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    const actionName = match[1];
    const actionContent = match[2];

    const action: { action: string; parameters: any } = {
      action: actionName,
      parameters: {},
    };

    // Find all Parameter tags within the action
    const parameterRegex = /<Parameter\s+name="([^"]+)">(.*?)<\/Parameter>/gs;
    let parameterMatch;

    while ((parameterMatch = parameterRegex.exec(actionContent)) !== null) {
      const paramName = parameterMatch[1];
      const paramValue = parameterMatch[2];
      action.parameters[paramName] = paramValue.replace(/\r?\n/g, '').trim();
    }

    actions.push(action);
  }

  return actions;
}

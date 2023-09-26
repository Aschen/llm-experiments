export function extractActions(text: string) {
  const actions: Array<{ action: string; parameters: any }> = [];

  const actionRegex = /<Action\s+name="([^"]+)">(.*?)<\/Action>/gs;
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    const actionName = match[1];
    const actionContent = match[2];

    const action: { action: string; parameters: any } = {
      action: actionName,
      parameters: {},
    };

    const parameterRegex = /<Parameter\s+name="([^"]+)">(.*?)<\/Parameter>/gs;
    let parameterMatch;

    while ((parameterMatch = parameterRegex.exec(actionContent)) !== null) {
      const paramName = parameterMatch[1];
      const paramValue = parameterMatch[2];
      action.parameters[paramName] = paramValue.trim();
    }

    actions.push(action);
  }

  return actions;
}

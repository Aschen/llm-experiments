import { existsSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";

import * as acorn from "acorn";
import * as walk from "acorn-walk";
import * as escodegen from "escodegen";

export function getFunctionCodeWithRequire(filePath, functionName) {
  const functionCode = readFunctionCode(filePath, functionName);
  const requireStatements = extractRequiresStatements(filePath);

  const contextualizedCode = `filePath: ${filePath}
functionName: ${functionName}
\`\`\`js
${requireStatements.join("\n")}

${functionCode}
\`\`\``;

  return contextualizedCode;
}

function fixedPath(filePath) {
  if (existsSync(filePath)) {
    return filePath;
  }

  if (existsSync(filePath + ".js")) {
    return filePath + ".js";
  }

  if (existsSync(filePath + ".ts")) {
    return filePath + ".ts";
  }

  throw new Error(`File "${filePath}" not found.`);
}

function readFile(filePath) {
  return readFileSync(fixedPath(filePath), "utf-8");
}

function writeFile(filePath, content) {
  writeFileSync(fixedPath(filePath), content, "utf-8");
}

export function readFunctionCode(filePath, functionName) {
  const sourceCode = readFile(filePath);

  const ast = acorn.parse(sourceCode, { ecmaVersion: "latest" });

  let targetFunctionCode: string | null = null;

  walk.simple(ast, {
    FunctionDeclaration(node: any) {
      if (node.id.name === functionName) {
        // Extract the source code of the target function
        targetFunctionCode = sourceCode.substring(node.start, node.end);
      }
    },
  });

  if (targetFunctionCode) {
    return targetFunctionCode;
  } else {
    throw new Error(`Function "${functionName}" not found in the source code.`);
  }
}

export function extractRequiresStatementsOld(filePath) {
  const jsCode = readFile(filePath);

  const requirePattern =
    /const\s+([\w\s,{}]+)\s+=\s+require\(['"]\.(\/[^'"]+)['"]\);?/g;

  const localRequireStatements: string[] = [];
  let match;

  while ((match = requirePattern.exec(jsCode)) !== null) {
    localRequireStatements.push(match[0]);
  }
  return localRequireStatements;
}
export function extractRequiresStatements(filePath) {
  const jsCode = readFile(filePath);

  const requirePattern =
    /const\s+([\w\s,{}]+)\s+=\s+require\(['"]\.(\/[^'"]+)['"]\);?/g;

  const localRequireStatements: string[] = [];
  let match;

  while ((match = requirePattern.exec(jsCode)) !== null) {
    const variableDeclaration = match[1];
    const relativePath = match[2];

    // Resolve the relative path based on the filePath
    const absolutePath = join(dirname(fixedPath(filePath)), relativePath);

    // Create the updated require statement with the resolved path
    const updatedRequireStatement = `const ${variableDeclaration} = require('./${absolutePath}');`;

    localRequireStatements.push(updatedRequireStatement);
  }

  return localRequireStatements;
}

export function replaceFunctionCode(filePath, functionName, newFunctionCode) {
  const sourceCode = readFile(filePath);

  const ast = acorn.parse(sourceCode, { ecmaVersion: "latest" });

  walk.simple(ast, {
    FunctionDeclaration(node: any) {
      if (node.id.name === functionName) {
        let newNode: any = acorn.parse(newFunctionCode, {
          ecmaVersion: "latest",
        });
        node.body = newNode.body[0].body;
      }
    },
  });

  const updatedCode = escodegen.generate(ast);

  writeFile(filePath, updatedCode);
}

export function cleanCode(functionCode) {
  return functionCode
    .replace(/.*require\(.+\);?/g, "")
    .replace("```js", "")
    .replace("```", "");
}
